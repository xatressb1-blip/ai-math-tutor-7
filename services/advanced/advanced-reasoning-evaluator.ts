import type { ReasoningEvaluation, ReasoningStepAttempt, ReasoningStepDefinition } from "@/types/reasoning";
import { evaluateReasoningStep } from "@/services/reasoning/reasoning-engine";

type Verdict = { ok: boolean; feedback?: string; diagnosis?: string };

function compact(raw: string): string {
  return raw
    .replaceAll("²", "^2")
    .replaceAll("³", "^3")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[−–—]/g, "-")
    .replace(/[×·]/g, "*")
    .replace(/,/g, ".")
    .replace(/\s+/g, "");
}

function hasAll(s: string, xs: string[]) {
  return xs.every((x) => s.includes(compact(x)));
}

function hasAny(s: string, xs: string[]) {
  return xs.some((x) => s.includes(compact(x)));
}

function fail(feedback: string, diagnosis = "Lập luận chưa đủ"): Verdict {
  return { ok: false, feedback, diagnosis };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Exact fraction token matcher.
 * Prevents substring false positives such as matching 3/4 inside 13/40.
 */
function hasExactFraction(raw: string, numerator: number, denominator: number): boolean {
  const normalized = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[−–—]/g, "-")
    .replace(/\s+/g, "");
  const token = `${numerator}/${denominator}`;
  const pattern = new RegExp(`(^|[^0-9])${escapeRegExp(token)}($|[^0-9])`);
  return pattern.test(normalized);
}

function hasExactInteger(raw: string, value: number): boolean {
  const normalized = raw.replace(/[−–—]/g, "-");
  const token = String(value);
  const pattern = new RegExp(`(^|[^0-9])${escapeRegExp(token)}($|[^0-9])`);
  return pattern.test(normalized);
}

function hasExactDecimal(raw: string, value: string): boolean {
  const normalized = raw.replace(/,/g, ".").replace(/\s+/g, "");
  const pattern = new RegExp(`(^|[^0-9])${escapeRegExp(value)}($|[^0-9])`);
  return pattern.test(normalized);
}

function extractFractions(raw: string): Array<{ numerator: number; denominator: number }> {
  const normalized = raw.replace(/[−–—]/g, "-");
  const matches = normalized.matchAll(/(^|[^0-9])(-?\d+)\s*\/\s*(\d+)(?=$|[^0-9])/g);
  const values: Array<{ numerator: number; denominator: number }> = [];
  for (const match of matches) {
    const numerator = Number(match[2]);
    const denominator = Number(match[3]);
    if (Number.isFinite(numerator) && Number.isFinite(denominator) && denominator !== 0) {
      values.push({ numerator, denominator });
    }
  }
  return values;
}

function hasExplicitEquality(raw: string, leftVariants: string[], rightVariants: string[]): boolean {
  const s = compact(raw);
  return leftVariants.some((left) =>
    rightVariants.some((right) => {
      const l = compact(left);
      const r = compact(right);
      return s.includes(`${l}=${r}`) || s.includes(`${r}=${l}`);
    }),
  );
}

function hasNegatedClaim(raw: string, claimTerms: string[]): boolean {
  const s = compact(raw);
  const hasClaim = claimTerms.some((term) => s.includes(compact(term)));
  if (!hasClaim) return false;
  return hasAny(s, [
    "khongdung",
    "khôngđúng",
    "sai",
    "khongnamgiua",
    "khôngnằmgiữa",
    "khongbang",
    "khôngbằng",
  ]);
}

function goldenCheck(stepId: string, raw: string): Verdict | null {
  const s = compact(raw).replace(/[×·]/g, "*");
  switch (stepId) {
    case "l1a1-step1": {
      if (hasNegatedClaim(raw, ["9/20", "0.45"])) {
        return fail("Em đang phủ định chính giá trị vừa nêu. Hãy viết một khẳng định nhất quán rồi chứng minh số đó thật sự nằm giữa 2/5 và 1/2.", "Mâu thuẫn trong câu trả lời");
      }
      if (hasExactFraction(raw, 9, 20) || hasExactDecimal(raw, "0.45")) return { ok: true };

      for (const frac of extractFractions(raw)) {
        const v = frac.numerator / frac.denominator;
        if (v > 0.4 && v < 0.5) return { ok: true };
      }

      const decimals = raw.replace(/,/g, ".").match(/0\.\d+/g) ?? [];
      if (decimals.some((value) => Number(value) > 0.4 && Number(value) < 0.5)) {
        return { ok: true };
      }
      return fail("Số em nêu chưa được AI xác nhận là nằm đúng giữa 2/5 và 1/2. Hãy kiểm tra lại bằng quy đồng hoặc so sánh chính xác.");
    }
    case "l1a1-step2":
      if (hasAny(s, ["(a+b)/2", "(b+a)/2", "trungbinhcong"])) return { ok: true };
      return fail("Em cần nêu một công thức cụ thể dùng được với mọi a < b, không chỉ mô tả chung.");
    case "l1a1-step3": {
      const chain = hasAll(s, ["2a", "a+b", "2b"]) && (s.includes("<") || s.includes(">"));
      const dividePositive = hasAny(s, ["chia2", "/2", "2>0", "2duong", "soduong"]);
      const conclusion = hasAny(s, ["a<(a+b)/2<b", "b>(a+b)/2>a"]);
      if (chain && dividePositive && conclusion) return { ok: true };
      if (conclusion && !chain) return fail("Kết luận của em đúng, nhưng cần chứng minh từ giả thiết a < b; đừng chỉ viết lại điều phải chứng minh.", "Đúng kết luận nhưng thiếu chứng minh");
      return fail("Lập luận cần có hai ý: tạo bất đẳng thức 2a < a+b < 2b và giải thích vì sao chia cho 2 vẫn giữ chiều.");
    }
    case "l1a2-step1":
      return /(^|\D)90(\D|$)/.test(raw) ? { ok: true } : fail("Hãy chọn một mẫu chung chia hết cho 6, 9 và 5. Mẫu thuận tiện nhất ở bước này là BCNN.");
    case "l1a2-step2":
      if (hasAll(s, ["-75/90", "-70/90", "-72/90"])) return { ok: true };
      return fail("Em cần quy đồng đủ cả ba phân số; AI sẽ không cho qua nếu chỉ có một hoặc hai kết quả.");
    case "l1a2-step3": {
      const order = hasAny(s, ["-5/6<-4/5<-7/9", "-75/90<-72/90<-70/90", "-75<-72<-70"]);
      const reason = hasAny(s, ["cungmau", "mau90", "tuso", "-75<-72<-70"]);
      if (order && reason) return { ok: true };
      if (order) return fail("Thứ tự đúng, nhưng em còn thiếu lý do dựa trên các tử số sau khi đã đưa về cùng mẫu dương.", "Đúng đáp số nhưng thiếu lập luận");
      return fail("Hãy dùng ba phân số cùng mẫu 90 rồi so sánh các tử số âm một cách cẩn thận.");
    }
    case "l1a3-step1":
      if (hasAll(s, ["-20/30", "-18/30"])) return { ok: true };
      return fail("Cần đổi đúng cả hai cận về mẫu 30 trước khi xét tử số của q.");
    case "l1a3-step2": {
      const condition = hasAny(s, ["-20<n<-18", "-18>n>-20"]);
      if (condition) return { ok: true };
      if (hasAny(s, ["n=-19", "n=-19"])) return fail("Em đã đoán đúng n, nhưng bước này yêu cầu biến bất đẳng thức của q thành điều kiện tổng quát đối với n trước.", "Nhảy bước suy luận");
      return fail("Vì 30 > 0, hãy chuyển điều kiện của q=n/30 thành một bất đẳng thức chỉ chứa n.");
    }
    case "l1a3-step3": {
      const answer = s.includes("-19/30");
      const unique = hasAny(s, ["duynhat", "chico-19", "chicomotso", "motsoenguyen"]);
      const interval = hasAny(s, ["-20", "-18"]);
      if (answer && unique && interval) return { ok: true };
      if (answer && !unique) return fail("q=-19/30 là đúng, nhưng thử thách còn yêu cầu chứng minh tính duy nhất: tại sao không có tử số nguyên nào khác?", "Đúng đáp số nhưng thiếu chứng minh duy nhất");
      return fail("Em cần vừa kết luận q, vừa giải thích rằng chỉ có một số nguyên nằm giữa hai tử số biên.");
    }
    case "l2a1-step1": {
      const pair1 = hasAll(s, ["-7/12", "7/12"]);
      const pair2 = hasAll(s, ["5/8", "1/8"]);
      if (pair1 && pair2) return { ok: true };
      return fail("Hãy tìm đủ hai nhóm thuận lợi: một cặp số đối và một cặp cùng mẫu. Đừng vội quy đồng cả biểu thức.");
    }
    case "l2a1-step2": {
      const commute = hasAny(s, ["giahoan", "doithutu"]);
      const associate = hasAny(s, ["kethop", "nhom"]);
      if (commute && associate) return { ok: true };
      if (commute || associate) return fail("Em mới nêu một phần. Cần giải thích cả quyền đổi thứ tự và quyền thay cách nhóm các số hạng.", "Thiếu một tính chất phép cộng");
      return fail("Hãy gọi tên hoặc mô tả hai tính chất của phép cộng cho phép đổi thứ tự và nhóm lại.");
    }
    case "l2a1-step3": {
      const answer = hasExactFraction(raw, 1, 2) || hasExactFraction(raw, 4, 8) || hasExactDecimal(raw, "0.5");
      const strategy = hasAny(s, ["triettieu", "sodoi", "cungmau", "itbuoc", "ngan", "nhanh", "giam", "saidal", "saixot"]);
      if (answer && strategy) return { ok: true };
      if (answer) return fail("Kết quả đúng, nhưng em cần nói vì sao cách nhóm này tốt hơn cách quy đồng cả bốn số ngay từ đầu.", "Đúng đáp số nhưng thiếu đánh giá chiến lược");
      return fail("Hãy tính hai nhóm đã chọn rồi kết luận A; sau đó nhận xét lợi ích của cách tính.");
    }
    case "l2a2-step1": {
      const identifies = hasAny(s, ["khongdao", "chuadao", "nghichdao", "giunguyen", "-6/7"]);
      const division = hasAny(s, ["phepchia", "chiathanhnhan", "sochia", "nhan"]);
      if (identifies && division) return { ok: true };
      return fail("Cần chỉ đúng bước biến phép chia thành phép nhân: số chia -6/7 không được giữ nguyên mà phải đổi thành nghịch đảo.");
    }
    case "l2a2-step2": {
      const reciprocal = hasExactFraction(raw, -7, 6);
      const transformed = hasAny(s, ["3/5*(-7/6)", "(3/5)*(-7/6)", "3/5x(-7/6)"]);
      const answer = hasExactFraction(raw, -7, 10) || hasExactFraction(raw, -21, 30);
      if (reciprocal && transformed && answer) return { ok: true };
      if (answer && !transformed) return fail("Kết quả đúng nhưng em chưa thể hiện bước quan trọng: đổi phép chia thành 3/5 × (-7/6).", "Đúng đáp số nhưng thiếu phép biến đổi");
      return fail("Hãy viết rõ 3/5 × (-7/6) rồi rút gọn để có kết quả cuối cùng.");
    }
    case "l2a2-step3": {
      const rule = hasAny(s, ["a:b=a*1/b", "a:b=a.(1/b)", "a:b=a×1/b", "nhanvoinghichdao", "nhannghichdao"]);
      const nonzero = hasAny(s, ["b!=0", "b≠0", "bkhac0", "bkhongbang0"]);
      if (rule && nonzero) return { ok: true };
      if (rule) return fail("Quy tắc đúng nhưng còn thiếu điều kiện b≠0; không tồn tại phép chia cho 0.", "Thiếu điều kiện xác định");
      return fail("Hãy phát biểu: chia cho b khác 0 tương đương nhân với nghịch đảo của b, đồng thời nêu điều kiện b≠0.");
    }
    case "l2a3-step1": {
      const operation = hasAny(s, ["3/4*(-2/5)", "3/4×(-2/5)", "nhan", "nhanhai"]);
      const value = hasAny(s, ["-3/10", "-6/20"]);
      if (operation && value) return { ok: true };
      if (value) return fail("Giá trị đúng, nhưng em cần nêu phép toán ngược đã dùng: nhân hai vế với -2/5.", "Đúng kết quả nhưng thiếu phép toán ngược");
      return fail("Tạm coi x-1/3 là một số y. Từ y:(-2/5)=3/4, hãy dùng phép toán ngược để tìm y.");
    }
    case "l2a3-step2": {
      const equation = hasAny(s, ["-3/10+1/3", "-9/30+10/30", "1/30"]);
      const answer = s.includes("1/30");
      if (equation && answer) return { ok: true };
      return fail("Cộng 1/3 vào hai vế rồi quy đồng mẫu 30 để tìm x.");
    }
    case "l2a3-step3": {
      const substitution = hasAny(s, ["1/30-1/3", "-3/10"]);
      const division = hasAny(s, ["-5/2", ":(-2/5)", "/(-2/5)", "3/4"]);
      const conclusion = s.includes("3/4");
      if (substitution && division && conclusion) return { ok: true };
      if (conclusion && !substitution) return fail("Em đã nêu kết quả cần có nhưng chưa kiểm tra bằng cách thay x=1/30 vào biểu thức ban đầu.", "Kết luận đúng nhưng thiếu kiểm chứng");
      return fail("Hãy thay x=1/30, tính x-1/3 trước rồi chia cho -2/5; kết quả phải trở lại 3/4.");
    }
    case "l3a1-step1": {
      const exponentWork = hasAny(s, ["4+3-5", "4+3−5", "4+3–5"]);
      const resultPower = hasAny(s, ["(3/5)^2", "3/5^2"]);
      const rule = hasAny(s, ["cong", "tru", "nhan", "chia", "cungcoso"]);
      if (exponentWork && resultPower && rule) return { ok: true };
      if (resultPower && !exponentWork) return fail("Em đã có lũy thừa đúng, nhưng cần cho thấy số mũ 2 đến từ 4+3-5 và nêu quy tắc nhân/chia cùng cơ số.", "Đúng kết quả nhưng thiếu quy tắc số mũ");
      return fail("Hãy giữ nguyên cơ số 3/5, cộng số mũ khi nhân và trừ số mũ khi chia.");
    }
    case "l3a1-step2": {
      const answer = hasExactFraction(raw, 9, 25) || hasExactDecimal(raw, "0.36");
      const reduced = hasAny(s, ["(3/5)^2", "3^2/5^2", "binhphuong"]);
      const strategy = hasAny(s, ["itbuoc", "ngan", "giam", "khongkhaitrien", "rutgon", "saidal", "saixot"]);
      if (answer && reduced && strategy) return { ok: true };
      if (answer && !strategy) return fail("Kết quả 9/25 đúng, nhưng em còn phải nhận xét vì sao rút gọn số mũ trước là chiến lược tốt hơn khai triển dài.", "Đúng đáp số nhưng thiếu đánh giá chiến lược");
      return fail("Từ (3/5)^2 hãy tính 9/25, rồi nói lợi ích của việc rút gọn số mũ trước.");
    }
    case "l3a1-step3": {
      const formula = hasAny(s, ["a^(m+n-p)", "a^(m+n−p)", "a^(m+n–p)", "m+n-p"]);
      const nonzero = hasAny(s, ["a!=0", "a≠0", "akhac0", "akhongbang0"]);
      if (formula && nonzero) return { ok: true };
      if (formula) return fail("Công thức đúng nhưng còn thiếu điều kiện a≠0 vì biểu thức có phép chia cho a^p.", "Thiếu điều kiện của phép chia");
      return fail("Hãy viết số mũ mới là m+n-p và nhớ điều kiện cơ số khác 0.");
    }
    case "l3a2-step1": {
      const wrong = hasAny(s, ["2+3", "congsomu"]);
      const correctRule = hasAny(s, ["phainhan", "nhansomu", "luythuacuamluythua", "2*3", "2×3"]);
      const distinction = hasAny(s, ["khongphai", "khac", "nhancungcoso", "tich"]);
      if (wrong && correctRule && (distinction || s.includes("luythuacuamluythua"))) return { ok: true };
      return fail("Cần chỉ rõ: sai ở 2+3. Đây là lũy thừa của một lũy thừa nên phải nhân 2×3, không dùng quy tắc cộng số mũ của tích cùng cơ số.");
    }
    case "l3a2-step2": {
      const exponent = hasAny(s, ["2*3=6", "2x3=6", "2×3=6"]);
      const power = hasAny(s, ["(-2/3)^6"]) || exponent;
      const answer = hasExactFraction(raw, 64, 729);
      const sign = hasAny(s, ["duong", "somuchan", "chan"]);
      if (power && exponent && answer && sign) return { ok: true };
      if (answer && !exponent) return fail("Giá trị đúng nhưng em cần thể hiện số mũ 6 đến từ 2×3 và giải thích dấu dương do số mũ chẵn.", "Đúng đáp số nhưng thiếu lập luận số mũ");
      return fail("Hãy sửa số mũ thành 2×3=6, xác định dấu rồi tính 2^6/3^6.");
    }
    case "l3a2-step3": {
      const product = hasAny(s, ["a^m*a^n=a^(m+n)", "a^m×a^n=a^(m+n)", "m+n"]);
      const powerOfPower = hasAny(s, ["(a^m)^n=a^(mn)", "(a^m)^n=a^(m*n)", "m*n", "m×n", "mn"]);
      if (product && powerOfPower) return { ok: true };
      if (product || powerOfPower) return fail("Em mới nêu một quy tắc. Cần đặt hai quy tắc cạnh nhau để phân biệt: tích cùng cơ số dùng m+n, lũy thừa của lũy thừa dùng mn.", "Thiếu một quy tắc đối chiếu");
      return fail("Hãy viết cả a^m×a^n=a^(m+n) và (a^m)^n=a^(mn).");
    }
    case "l3a3-step1": {
      const work = hasAny(s, ["x+3-2", "x+1"]);
      const power = hasAny(s, ["(2/3)^(x+1)", "2/3^(x+1)"]);
      if (work && power) return { ok: true };
      if (power) return fail("Lũy thừa cuối đúng, nhưng cần cho thấy số mũ x+1 được tạo từ x+3-2.", "Đúng kết quả nhưng thiếu biến đổi số mũ");
      return fail("Giữ cơ số 2/3 và biến số mũ thành x+3-2=x+1.");
    }
    case "l3a3-step2": {
      const equation = hasAny(s, ["x+1=6"]);
      const answer = hasAny(s, ["x=5"]);
      const reason = hasAny(s, ["cungcoso", "coso2/3", "0<2/3<1", "khac1", "luythua"]);
      if (equation && answer && reason) return { ok: true };
      if (equation && answer) return fail("x=5 đúng, nhưng em còn thiếu lý do vì sao từ hai lũy thừa cùng cơ số 2/3 có thể suy ra các số mũ bằng nhau.", "Đúng nghiệm nhưng thiếu căn cứ so sánh số mũ");
      if (answer) return fail("Em đã đoán đúng x=5 nhưng cần lập x+1=6 trước, không được nhảy thẳng tới nghiệm.", "Nhảy bước suy luận");
      return fail("Từ (2/3)^(x+1)=(2/3)^6 hãy lập phương trình số mũ rồi giải.");
    }
    case "l3a3-step3": {
      const substitution = hasAny(s, ["5+3-2=6", "5+3-2", "x=5"]);
      const conclusion = hasAny(s, ["(2/3)^6", "bangvephai", "dung"]);
      if (substitution && conclusion) return { ok: true };
      return fail("Hãy thay x=5 vào biểu thức ban đầu, rút gọn số mũ 5+3-2=6 và đối chiếu với vế phải.");
    }

    case "l4a1-step1": {
      const correctCalculation =
        hasExplicitEquality(raw, ["5/6-1/3", "5/6-2/6"], ["1/2"]) ||
        (hasAny(s, ["5/6-1/3", "5/6-2/6"]) && hasExactFraction(raw, 1, 2));
      const order = hasAny(s, ["ngoactrong", "trongcung", "tutrongrangoai", "trongra"]);
      if (correctCalculation && order) return { ok: true };
      if (correctCalculation) return fail("Kết quả 1/2 đúng, nhưng em cần giải thích vì sao phải xử lí ngoặc trong cùng trước.", "Đúng đáp số nhưng thiếu thứ tự thực hiện");
      return fail("Hãy bắt đầu từ ngoặc trong cùng 5/6-1/3, quy đồng rồi tính.");
    }
    case "l4a1-step2": {
      const zero = hasAny(s, ["1/2-1/2=0", "=0", "bang0"]);
      const replace = hasAny(s, ["thay", "ngoacvuong", "rutgon", "don gian", "dongian"]);
      if (zero && replace) return { ok: true };
      if (zero) return fail("0 là đúng, nhưng em cần nói rằng kết quả của ngoặc trong được thay vào ngoặc vuông để biểu thức đơn giản dần.", "Đúng kết quả nhưng thiếu mô tả bước thay thế");
      return fail("Thay 1/2 vào ngoặc vuông: 1/2-1/2 rồi tính.");
    }
    case "l4a1-step3": {
      const answer =
        hasExplicitEquality(raw, ["a", "3/4-0"], ["3/4"]) ||
        (hasAny(s, ["a="]) && hasExactFraction(raw, 3, 4));
      const reason = hasAny(s, ["ngoactrong", "tutrongrangoai", "dungthutu", "tranhsaudau", "tranhsaidau", "cautruc"]);
      if (answer && reason) return { ok: true };
      if (answer) return fail("A=3/4 đúng, nhưng em cần nhận xét vì sao làm từ ngoặc trong ra ngoài giúp tránh sai cấu trúc và sai dấu.", "Đúng đáp số nhưng thiếu đánh giá chiến lược");
      return fail("Sau khi ngoặc vuông bằng 0, hãy kết luận A và nhận xét về thứ tự thực hiện.");
    }
    case "l4a2-step1": {
      const identifies = hasAny(s, ["-2/3", "chuyen", "chuyển"]);
      const plus = hasAny(s, ["+2/3", "doi dau", "đổi dấu", "thanh+2/3"]);
      if (identifies && plus) return { ok: true };
      return fail("Cần chỉ rõ số hạng -2/3 khi chuyển sang vế phải phải đổi dấu thành +2/3.");
    }
    case "l4a2-step2": {
      const transformed = hasAny(s, ["-5/6+2/3", "-5/6+4/6"]);
      const correctEquality =
        hasExplicitEquality(raw, ["-5/6+2/3", "-5/6+4/6"], ["-1/6"]) ||
        (hasAny(s, ["-5/6+2/3=-5/6+4/6"]) && hasExactFraction(raw, -1, 6));
      const answer = hasExactFraction(raw, -1, 6);
      if (transformed && correctEquality && answer) return { ok: true };
      if (answer) return fail("x=-1/6 đúng, nhưng em cần trình bày một phép tính đúng nối -5/6+2/3 với -1/6; AI không chấp nhận chỉ ghép từ khóa.", "Đúng đáp số nhưng thiếu chuỗi biến đổi đúng");
      return fail("Hãy quy đồng 2/3 thành 4/6 rồi viết rõ -5/6+4/6=-1/6.");
    }
    case "l4a2-step3": {
      const rule = hasAny(s, ["doi dau", "đổi dấu", "chuyenve", "chuyển vế"]);
      const check = hasAny(s, ["-1/6-2/3=-5/6", "-1/6-4/6=-5/6"]);
      if (rule && check) return { ok: true };
      if (check) return fail("Kiểm tra đúng, nhưng em còn phải phát biểu quy tắc: chuyển một số hạng sang vế kia thì đổi dấu.", "Thiếu phát biểu quy tắc");
      return fail("Hãy nêu quy tắc chuyển vế rồi thay x=-1/6 vào phương trình ban đầu để kiểm tra.");
    }
    case "l4a3-step1": {
      const reduce = hasAny(s, ["-3/4+1/2=-1/4", "-3/4+2/4=-1/4"]);
      const equation = hasAny(s, ["x-1/4=-1/3"]);
      if (reduce && equation) return { ok: true };
      if (equation) return fail("Phương trình rút gọn đúng, nhưng em cần cho thấy -3/4+1/2=-1/4.", "Đúng kết quả nhưng thiếu bước rút gọn");
      return fail("Hãy gộp -3/4 và +1/2 trước, rồi viết lại phương trình.");
    }
    case "l4a3-step2": {
      const transpose = hasAny(s, ["x=-1/3+1/4", "-1/3+1/4"]);
      const correctEquality =
        hasExplicitEquality(raw, ["-1/3+1/4", "-4/12+3/12"], ["-1/12"]) ||
        (hasAny(s, ["-1/3+1/4=-4/12+3/12"]) && hasExactFraction(raw, -1, 12));
      const answer = hasExactFraction(raw, -1, 12);
      if (transpose && correctEquality && answer) return { ok: true };
      if (answer && !transpose) return fail("x=-1/12 đúng, nhưng em phải thể hiện việc chuyển -1/4 sang vế phải thành +1/4.", "Đúng nghiệm nhưng thiếu bước chuyển vế");
      if (answer) return fail("Em có nghiệm đúng nhưng chuỗi quy đồng/chuyển vế chưa được chứng minh bằng một đẳng thức đúng.", "Đúng nghiệm nhưng thiếu biến đổi có kiểm chứng");
      return fail("Chuyển -1/4 sang vế phải, rồi quy đồng -1/3+1/4 theo mẫu 12.");
    }
    case "l4a3-step3": {
      const substitute = hasAny(s, ["-1/12-3/4+1/2", "-1/12-9/12+6/12"]);
      const conclusion = hasAny(s, ["-4/12=-1/3", "=-1/3", "bang-1/3"]);
      if (substitute && conclusion) return { ok: true };
      if (conclusion && !substitute) return fail("Em đã nêu kết quả kiểm tra nhưng chưa thể hiện phép thay x=-1/12 vào biểu thức ban đầu.", "Kết luận đúng nhưng thiếu kiểm chứng");
      return fail("Thay x=-1/12 vào vế trái, đưa các số về mẫu 12 rồi kiểm tra có bằng -1/3 hay không.");
    }


    case "l5a1-step1": {
      const expansion = hasAny(s, ["0.58333", "0.583333", "0,58333", "0,583333"]);
      const repeats3 = hasAny(s, ["3lap", "3lặp", "3laplai", "3lặplại", "3tiep", "3tiếp"]);
      if (expansion && repeats3) return { ok: true };
      if (expansion) return fail("Em đã khai triển đúng, nhưng cần chỉ rõ chữ số 3 là phần lặp lại mãi.", "Thiếu nhận diện phần lặp");
      return fail("Hãy viết 0,58(3) thành 0,583333... rồi chỉ ra chữ số nào tiếp tục lặp.");
    }
    case "l5a1-step2": {
      const period3 = hasAny(s, ["chuki3", "chuky3", "chukila3", "chukyla3"]);
      const prefix58 = hasAny(s, ["58dungtruoc", "58truoc", "phan58", "5va8"]);
      const rejects583 = hasAny(s, ["583khonglap", "583khônglặp", "583khongphailachuki", "583khôngphảilàchukì", "583khongphailachuky"]);
      if (period3 && prefix58 && rejects583) return { ok: true };
      if (period3 && prefix58) return fail("Em đã xác định đúng chu kì 3 và phần 58, nhưng cần giải thích vì sao 583 không phải chu kì: nhóm 583 không lặp lại liên tiếp.", "Thiếu bác bỏ chu kì giả");
      return fail("Cần nêu đủ: chu kì là 3, phần 58 đứng trước chu kì, và 583 không lặp lại liên tiếp.");
    }
    case "l5a1-step3": {
      const group = hasAny(s, ["nhomchuso", "nhómchữsố"]);
      const infinite = hasAny(s, ["laplaimai", "lặplạimãi", "lapvohan", "lặpvôhạn", "laplienTuc", "lặpLiênTục", "laplientuc"]);
      const shortest = hasAny(s, ["ngannhat", "ngắnnhất", "codinh", "cốđịnh"]);
      if (group && infinite && shortest) return { ok: true };
      if (group && infinite) return fail("Tiêu chí gần đúng. Hãy bổ sung rằng ta tìm một nhóm chữ số cố định/ngắn nhất lặp lại liên tiếp vô hạn.", "Thiếu tính cố định/tối giản của chu kì");
      return fail("Hãy phát biểu tiêu chí bằng các ý: nhóm chữ số, cố định/ngắn nhất, lặp lại liên tiếp vô hạn.");
    }
    case "l5a2-step1": {
      const period12 = hasAny(s, ["chuki12", "chuky12", "chukila12", "chukyla12"]);
      const blocks = hasAny(s, ["12|12|12", "121212", "12lap", "12lặp"]);
      if (period12 && blocks) return { ok: true };
      if (period12) return fail("Chu kì 12 đúng, nhưng em cần chỉ ra bằng chứng cấu trúc như 12|12|12|... .", "Đúng chu kì nhưng thiếu bằng chứng");
      return fail("Hãy tách A thành các khối 12|12|12|... rồi kết luận chu kì.");
    }
    case "l5a2-step2": {
      const increasing = hasAny(s, ["sodigit2tang", "sochuso2tang", "sốchữsố2tăng", "22,222,2222", "22->222->2222", "22→222→2222"]);
      const noPeriod = hasAny(s, ["khongcochuki", "khôngcóchukì", "khongcochuky", "khonglapcodinh", "khônglặpcốđịnh"]);
      if (increasing && noPeriod) return { ok: true };
      if (noPeriod) return fail("Kết luận đúng, nhưng em cần nêu quy luật: số chữ số 2 giữa các chữ số 1 tăng dần.", "Thiếu phân tích cấu trúc");
      return fail("Quan sát các khối 22, 222, 2222,...: độ dài tăng dần nên không có một khối cố định lặp lại mãi.");
    }
    case "l5a2-step3": {
      const falseClaim = hasAny(s, ["nhanDinhSai", "nhandinhsai", "nhậnđịnhsai", "sai"]);
      const fixedGroup = hasAny(s, ["nhomchusocodinh", "nhómchữsốcốđịnh", "chukicodinh", "chukỳcốđịnh", "chukìcốđịnh"]);
      const repeats = hasAny(s, ["laplaimai", "lặplạimãi", "lapvohan", "lặpvôhạn", "laplientuc"]);
      if (falseClaim && fixedGroup && repeats) return { ok: true };
      if (falseClaim) return fail("Em đã bác bỏ nhận định nhưng cần phát biểu điều kiện đúng: phải có một nhóm chữ số cố định lặp lại liên tiếp vô hạn.", "Thiếu điều kiện tuần hoàn");
      return fail("A và B đều vô hạn nhưng chỉ A tuần hoàn. Hãy kết luận nhận định sai và nêu điều kiện có chu kì cố định.");
    }
    case "l5a3-step1": {
      const tenths = hasAny(s, ["hangphanmuoi", "hàngphầnmười"]);
      const relation = hasAny(s, ["0.05lamotnua0.1", "0.05=0.1/2", "0,05làmộtnửa0,1", "motnua", "mộtnửa"]);
      if (tenths && relation) return { ok: true };
      if (tenths) return fail("Hàng phần mười đúng, nhưng em cần giải thích 0,05 là một nửa của 0,1.", "Đúng hàng làm tròn nhưng thiếu căn cứ");
      return fail("Tìm đơn vị hàng có một nửa bằng 0,05; đó là 0,1.");
    }
    case "l5a3-step2": {
      const rounded = hasExactDecimal(raw, "18.4");
      const error = hasExactDecimal(raw, "0.026");
      const relation = hasAny(s, ["|18.4-18.374|", "18.4-18.374", "18,4-18,374"]);
      const within = hasAny(s, ["<0.05", "<=0.05", "≤0.05", "nhohon0.05", "nhỏhơn0,05"]);
      if (rounded && error && relation && within) return { ok: true };
      if (rounded && error) return fail("Kết quả và sai số đúng, nhưng cần đối chiếu 0,026 với độ chính xác 0,05 để xác nhận đạt yêu cầu.", "Thiếu kiểm tra ngưỡng sai số");
      if (rounded) return fail("18,4 kg đúng, nhưng em phải tính sai số |18,4-18,374|=0,026 kg.", "Thiếu kiểm chứng sai số");
      return fail("Làm tròn đến hàng phần mười được 18,4; sau đó tính sai số tuyệt đối.");
    }
    case "l5a3-step3": {
      const error = hasExactDecimal(raw, "0.074");
      const relation = hasAny(s, [">0.05", ">0,05", "lonhon0.05", "lớnhơn0,05"]);
      const reject = hasAny(s, ["khongdat", "khôngđạt", "vuot", "vượt"]);
      if (error && relation && reject) return { ok: true };
      if (error && relation) return fail("Em đã tính và so sánh đúng; hãy kết luận rõ 18,3 kg không đạt độ chính xác 0,05 kg.", "Thiếu kết luận");
      return fail("Tính |18,3-18,374|=0,074 rồi so sánh với 0,05.");
    }


    case "l6a1-step1": {
      const lowSquare = hasAny(s, ["3.1^2=9.61", "3.1*3.1=9.61"]);
      const highSquare = hasAny(s, ["3.2^2=10.24", "3.2*3.2=10.24"]);
      const bound = hasAny(s, ["3.1<sqrt10<3.2", "3.1<√10<3.2"]);
      if (lowSquare && highSquare && bound) return { ok: true };
      if (bound) return fail("Khoảng đúng, nhưng em phải chứng minh bằng hai bình phương 3,1²=9,61 và 3,2²=10,24.", "Đúng khoảng nhưng thiếu căn cứ");
      return fail("Hãy tính 3,1² và 3,2², so sánh cả hai với 10 rồi mới kẹp √10.");
    }
    case "l6a1-step2": {
      const midpointSquare = hasAny(s, ["3.15^2=9.9225", "3.15*3.15=9.9225"]);
      const comparison = hasAny(s, ["sqrt10>3.15", "√10>3.15", "3.15<sqrt10", "3.15<√10"]);
      if (midpointSquare && comparison) return { ok: true };
      if (comparison) return fail("So sánh đúng, nhưng em cần chứng minh bằng 3,15²=9,9225<10.", "Thiếu kiểm tra mốc giữa");
      return fail("Tính 3,15². Nếu bình phương này nhỏ hơn 10 thì √10 nằm phía nào của 3,15?");
    }
    case "l6a1-step3": {
      const answer = hasExactDecimal(raw, "3.2");
      const midpoint = hasAny(s, ["sqrt10>3.15", "√10>3.15", "lonhon3.15", "lớnhơn3,15"]);
      const rounding = hasAny(s, ["lamtron", "làmtròn", "hangphanmuoi", "hàngphầnmười"]);
      if (answer && midpoint && rounding) return { ok: true };
      if (answer) return fail("3,2 đúng, nhưng em phải dựa vào việc √10>3,15 để giải thích quyết định làm tròn.", "Đúng giá trị nhưng thiếu lập luận làm tròn");
      return fail("Kết luận đến hàng phần mười và giải thích bằng mốc 3,15.");
    }
    case "l6a2-step1": {
      const pos = hasAny(s, ["7^2=49", "7*7=49"]);
      const neg = hasAny(s, ["(-7)^2=49", "(-7)*(-7)=49", "-7va7", "7va-7"]);
      if (pos && neg) return { ok: true };
      return fail("Cần nêu đủ cả 7 và -7 đều có bình phương bằng 49.");
    }
    case "l6a2-step2": {
      const definition = hasAny(s, ["canbachaisohoc", "khongam"]);
      const answer = hasAny(s, ["sqrt49=7", "√49=7"]);
      const wrongPlusMinus = hasAny(s, ["sqrt49=+-7", "sqrt49=±7", "√49=±7"]);
      if (wrongPlusMinus) return fail("Kí hiệu √49 không có hai giá trị. Căn bậc hai số học là giá trị không âm.", "Nhầm căn bậc hai số học với hai nghiệm");
      if (definition && answer) return { ok: true };
      if (answer) return fail("√49=7 đúng, nhưng em cần viện dẫn định nghĩa: căn bậc hai số học luôn không âm.", "Đúng kết quả nhưng thiếu định nghĩa");
      return fail("Hãy dùng điều kiện 'không âm' trong định nghĩa căn bậc hai số học.");
    }
    case "l6a2-step3": {
      const twoSolutions = (hasAny(s, ["x=7"]) && hasAny(s, ["x=-7"])) || hasAny(s, ["x=+-7", "x=±7"]);
      const distinction = hasAny(s, ["hainghiem", "sqrt49=7", "√49=7", "motgiatri"]);
      if (twoSolutions && distinction) return { ok: true };
      if (twoSolutions) return fail("Hai nghiệm đúng, nhưng em còn phải phân biệt: phương trình tìm mọi x, còn √49 chỉ là căn bậc hai số học không âm.", "Thiếu phân biệt khái niệm");
      return fail("Hãy nêu đủ x=7 và x=-7, rồi đối chiếu với √49=7.");
    }
    case "l6a3-step1": {
      const equation = hasAny(s, ["a^2=30", "a*a=30"]);
      const root = hasAny(s, ["a=sqrt30", "a=√30"]);
      const nonnegative = hasAny(s, ["dodaikhongam", "a>=0", "a≥0", "khongam"]);
      if (equation && root && nonnegative) return { ok: true };
      if (equation && root) return fail("Mô hình đúng, nhưng cần giải thích vì a là độ dài nên a≥0; vì vậy lấy √30 chứ không lấy giá trị âm.", "Thiếu điều kiện thực tế");
      return fail("Từ diện tích hình vuông hãy lập a²=30, sau đó dùng điều kiện độ dài không âm.");
    }
    case "l6a3-step2": {
      const low = hasAny(s, ["5.4^2=29.16", "5.4*5.4=29.16"]);
      const high = hasAny(s, ["5.5^2=30.25", "5.5*5.5=30.25"]);
      const midpoint = hasAny(s, ["5.45^2=29.7025", "5.45*5.45=29.7025"]);
      const above = hasAny(s, ["sqrt30>5.45", "√30>5.45", "5.45<sqrt30", "5.45<√30"]);
      const answer = hasExactDecimal(raw, "5.5");
      if (low && high && midpoint && above && answer) return { ok: true };
      if (answer && !(midpoint && above)) return fail("5,5 m là đúng, nhưng em phải kiểm tra mốc 5,45 để chứng minh cách làm tròn.", "Đúng giá trị nhưng thiếu quyết định làm tròn");
      return fail("Cần dùng 5,4², 5,5² và đặc biệt mốc 5,45² để quyết định làm tròn.");
    }
    case "l6a3-step3": {
      const perimeter = hasAny(s, ["4*5.5=22", "4x5.5=22", "4×5.5=22", "p=22", "p≈22"]);
      const unit = hasAny(s, ["22m"]);
      const approximate = hasAny(s, ["gandung", "xapxi", "≈"]);
      const exact = hasAny(s, ["4sqrt30", "4√30"]);
      if (perimeter && unit && approximate && exact) return { ok: true };
      if (perimeter && unit && approximate) return fail("Chu vi gần đúng đúng; hãy bổ sung rằng giá trị chính xác là 4√30 m để phân biệt ≈ với =.", "Thiếu giá trị chính xác");
      if (perimeter) return fail("22 đúng về số, nhưng cần ghi đơn vị và nói rõ đây là giá trị gần đúng.", "Thiếu diễn giải kết quả thực tế");
      return fail("Dùng P=4a với a≈5,5 m, rồi phân biệt chu vi gần đúng với 4√30 m chính xác.");
    }


    case "l7a1-step1": {
      const definition = hasAny(s, ["a+b=0", "b=-a"]);
      if (definition) return { ok: true };
      return fail("Hãy dùng định nghĩa: hai số đối nhau có tổng bằng 0, tức A+B=0.");
    }
    case "l7a1-step2": {
      const transformed = hasAny(s, ["-(3-sqrt2)=-3+sqrt2", "-3+sqrt2=sqrt2-3", "sqrt2-3"]);
      const wrong = hasAny(s, ["-3-sqrt2", "3+sqrt2"]);
      if (wrong) return fail("Dấu trừ trước ngoặc phải đổi dấu cả 3 và -√2.", "Sai quy tắc bỏ ngoặc");
      if (transformed) return { ok: true };
      return fail("Từ B=-(3-√2), hãy đổi dấu từng hạng tử để được -3+√2.");
    }
    case "l7a1-step3": {
      const sum = hasAny(s, ["(3-sqrt2)+(sqrt2-3)=0", "3-sqrt2+sqrt2-3=0"]);
      if (sum) return { ok: true };
      if (hasExactInteger(raw, 0)) return fail("Kết luận tổng bằng 0 là đúng nhưng em phải viết phép cộng và rút gọn để kiểm chứng.", "Thiếu phép kiểm chứng");
      return fail("Hãy cộng (3-√2) với (√2-3) và rút gọn về 0.");
    }
    case "l7a2-step1": {
      const low = hasAny(s, ["1.4^2=1.96", "1.4*1.4=1.96"]);
      const high = hasAny(s, ["1.5^2=2.25", "1.5*1.5=2.25"]);
      const bound = hasAny(s, ["1.4<sqrt2<1.5", "1.4<√2<1.5"]);
      if (low && high && bound) return { ok: true };
      if (bound) return fail("Khoảng đúng nhưng phải chứng minh bằng 1,4²=1,96 và 1,5²=2,25.", "Đúng kết luận nhưng thiếu bình phương");
      return fail("Tính 1,4² và 1,5², so sánh với 2 rồi mới kết luận.");
    }
    case "l7a2-step2": {
      const square = hasAny(s, ["1.42^2=2.0164", "1.42*1.42=2.0164"]);
      const comparison = hasAny(s, ["sqrt2<1.42", "√2<1.42", "1.42>sqrt2", "1.42>√2"]);
      if (square && comparison) return { ok: true };
      if (comparison) return fail("So sánh đúng nhưng em phải chứng minh bằng 1,42²=2,0164>2.", "Thiếu căn cứ bình phương");
      return fail("Tính 1,42² rồi so sánh với 2.");
    }
    case "l7a2-step3": {
      const chain = hasAny(s, ["1.4<sqrt2<1.42<1.5", "1.4<√2<1.42<1.5"]);
      const leftRight = hasAll(s, ["benphai1.4", "bentrai1.42"]);
      if (chain || leftRight) return { ok: true };
      return fail("Hãy ghép kết quả thành 1,4<√2<1,42<1,5 hoặc mô tả đúng vị trí trái/phải.");
    }
    case "l7a3-step1": {
      const model = hasAny(s, ["|x-sqrt2|=1", "|x-√2|=1"]);
      if (model) return { ok: true };
      return fail("Khoảng cách giữa x và √2 phải được viết là |x-√2|, nên phương trình là |x-√2|=1.");
    }
    case "l7a3-step2": {
      const plusCase = hasAny(s, ["x-sqrt2=1", "x-√2=1"]);
      const minusCase = hasAny(s, ["x-sqrt2=-1", "x-√2=-1"]);
      const plusSolution = hasAny(s, ["x=sqrt2+1", "x=√2+1"]);
      const minusSolution = hasAny(s, ["x=sqrt2-1", "x=√2-1"]);
      if (plusCase && minusCase && plusSolution && minusSolution) return { ok: true };
      if (plusSolution && minusSolution) return fail("Hai nghiệm đúng nhưng em phải thể hiện hai trường hợp x-√2=1 và x-√2=-1.", "Đúng nghiệm nhưng thiếu suy luận");
      if (plusSolution || minusSolution) return fail("Em mới có một nghiệm. |u|=1 cho hai trường hợp u=1 và u=-1.", "Thiếu một nghiệm");
      return fail("Từ |x-√2|=1, xét đủ hai trường hợp x-√2=±1.");
    }
    case "l7a3-step3": {
      const left = hasAny(s, ["sqrt2-1", "√2-1"]);
      const right = hasAny(s, ["sqrt2+1", "√2+1"]);
      const geometry = hasAny(s, ["bentrai", "benphai", "haiphia", "doixung"]);
      const distance = hasAny(s, ["cach1donvi", "cachsqrt2dung1", "khoangcach1"]);
      if (left && right && geometry && distance) return { ok: true };
      if (left && right) return fail("Hai điểm đúng nhưng cần giải thích chúng nằm hai phía của √2 và đều cách √2 đúng 1 đơn vị.", "Thiếu diễn giải hình học");
      return fail("Nêu cả √2-1 và √2+1, rồi giải thích vị trí của hai điểm trên trục số.");
    }


    case "l8a1-step1": {
      const supplement = hasAny(s, ["bugoc", "bu nhau", "bùnhau", "haigocbu"]);
      const overclaim = hasAny(s, ["kebu", "kềbù"]) && !hasAny(s, ["chuadu", "chưađủ", "khongtheketluan", "khôngthểkếtluận"]);
      if (overclaim) return fail("Từ tổng 180° chưa thể kết luận kề bù; em mới có thể kết luận hai góc bù nhau.", "Nhầm bù với kề bù");
      if (supplement) return { ok: true };
      return fail("Tổng 180° chỉ cho phép kết luận hai góc bù nhau.");
    }
    case "l8a1-step2": {
      const common = hasAny(s, ["chungcanh", "motcanhchung", "mộtcạnhchung"]);
      const opposite = hasAny(s, ["haitiadoi", "hai cạnh còn lại là hai tia đối", "haicanhconlaidoinhau"]);
      if (common && opposite) return { ok: true };
      if (common || opposite) return fail("Em mới nêu một điều kiện. Kề bù cần cả cạnh chung và hai cạnh còn lại là hai tia đối.", "Thiếu điều kiện cấu trúc");
      return fail("Hãy nêu đủ hai điều kiện vị trí của hai góc kề bù.");
    }
    case "l8a1-step3": {
      const verdict = hasAny(s, ["sai", "khongdung", "khôngđúng"]);
      const example = hasAny(s, ["khongchungcanh", "khôngchungcạnh", "khongke", "khôngkề"]);
      const stillSupplement = hasAny(s, ["vanbu", "vẫnbù", "tong180", "tổng180"]);
      if (verdict && example && stillSupplement) return { ok: true };
      if (verdict) return fail("Kết luận 'sai' đúng, nhưng hãy nêu phản ví dụ khái quát: tổng 180° nhưng không chung cạnh nên bù mà không kề bù.", "Thiếu phản ví dụ");
      return fail("Hãy bác bỏ bằng trường hợp hai góc tổng 180° nhưng không chung cạnh.");
    }

    case "l8a2-step1": {
      const expression = hasAny(s, ["180-alpha", "180°-alpha", "180-α", "180°-α"]);
      const relation = hasAny(s, ["yOz", "∠yOz"]);
      if (expression && relation) return { ok: true };
      if (expression) return fail("Biểu thức đúng nhưng cần gắn rõ với ∠yOz.", "Thiếu đối tượng góc");
      return fail("Vì kề bù: α+∠yOz=180°, nên ∠yOz=180°-α.");
    }
    case "l8a2-step2": {
      const half1 = hasAny(s, ["∠moy=α/2", "moy=α/2", "moy=alpha/2"]);
      const middle = hasAny(s, ["∠yox'=180°-α", "yox'=180°-α", "yox'=180-alpha", "180°-α"]);
      const half2 = hasAny(s, ["∠x'on=α/2", "x'on=α/2", "x'on=alpha/2"]);
      const wrongMiddle = hasAny(s, ["∠yoy'=180°", "yoy'=180"]);
      const wrongHalf = hasAny(s, ["∠y'on=α/2", "y'on=α/2"]);
      if (wrongMiddle || wrongHalf) {
        return fail("Chuỗi góc chưa đúng theo đường đi Om → Oy → Ox' → On. Cần dùng ∠mOy=α/2, ∠yOx'=180°-α, ∠x'On=α/2.", "Sai chuỗi góc");
      }
      if (half1 && middle && half2) return { ok: true };
      return fail("Hãy thiết lập đủ ba góc liên tiếp: ∠mOy=α/2, ∠yOx'=180°-α, ∠x'On=α/2.");
    }
    case "l8a2-step3": {
      const sum = hasAny(s, ["alpha/2+(180-alpha)/2=90", "α/2+(180°-α)/2=90", "90°"]);
      const perpendicular = hasAny(s, ["om⊥on", "vuonggoc", "vuônggóc"]);
      if (sum && perpendicular) return { ok: true };
      if (sum) return fail("Em đã có 90°, hãy kết luận Om vuông góc On.", "Thiếu kết luận hình học");
      if (perpendicular) return fail("Kết luận đúng nhưng phải chứng minh ∠mOn=α/2+(180°-α)/2=90°.", "Thiếu chuỗi tính góc");
      return fail("Cộng ∠mOy và ∠yOn rồi rút gọn.");
    }

    case "l8a3-step1": {
      const equal = hasAny(s, ["x'Oy'=alpha", "x'Oy'=α", "∠x'Oy'=α"]);
      const reason = hasAny(s, ["doidinh", "đốiđỉnh", "bangnhau", "bằngnhau"]);
      if (equal && reason) return { ok: true };
      if (equal) return fail("Số đo đúng nhưng cần nêu tính chất hai góc đối đỉnh bằng nhau.", "Thiếu lý do");
      return fail("Dùng tính chất góc đối đỉnh để suy ra ∠x'Oy'=α.");
    }
    case "l8a3-step2": {
      const firstHalf = hasAny(s, ["mOy=alpha/2", "mOy=α/2", "∠mOy=α/2"]);
      const secondHalf = hasAny(s, ["y'On=alpha/2", "y'On=α/2", "∠y'On=α/2"]);
      const straight = hasAny(s, ["yOy'=180", "∠yOy'=180", "haitiadoi", "hai tia đối"]);
      if (firstHalf && secondHalf && straight) return { ok: true };
      return fail("Cần nêu đủ hai góc nửa α và quan hệ Oy, Oy' là hai tia đối.");
    }
    case "l8a3-step3": {
      const straightAngle = hasAny(s, ["mOn=180", "∠mOn=180", "180°"]);
      const oppositeRays = hasAny(s, ["haitiadoi", "hai tia đối", "omvaondoinghich", "om và on đối"]);
      const reasoning = hasAny(s, ["alpha/2", "α/2"]);
      if (straightAngle && oppositeRays && reasoning) return { ok: true };
      if (straightAngle && oppositeRays) return fail("Kết luận đúng nhưng cần thể hiện chuỗi góc có các nửa α để chứng minh 180°.", "Thiếu chuỗi suy luận");
      if (oppositeRays) return fail("Không được kết luận từ hình vẽ. Hãy chứng minh ∠mOn=180°.", "Suy luận từ hình vẽ");
      return fail("Mục tiêu là chứng minh ∠mOn=180°, rồi mới kết luận Om và On là hai tia đối.");
    }


    case "l9a1-step1": {
      const missingPosition = hasAny(s, ["chuaxacdinhvitri", "chưaxácđịnhvịtrí", "khongphaicapbatky", "khôngphảicặpbấtkỳ"]);
      const transversal = hasAny(s, ["cungduongcat", "cùngđườngcắt"]);
      if (missingPosition && transversal) return { ok: true };
      if (hasAny(s, ["haigocbangnhaunen song song", "hai góc bằng nhau nên song song"])) {
        return fail("Hai góc bằng nhau bất kỳ không đủ để suy ra song song.", "Suy luận thiếu điều kiện vị trí");
      }
      return fail("Cần nói rõ: phải xác định đúng vị trí hai góc và chúng do cùng một đường cắt tạo ra.");
    }
    case "l9a1-step2": {
      const validCriterion = hasAny(s, ["soletrongbangnhau", "so le trong bằng nhau", "dongvibangnhau", "đồng vị bằng nhau", "trongcungphiabu", "trong cùng phía bù nhau"]);
      if (validCriterion) return { ok: true };
      return fail("Hãy nêu một dấu hiệu nhận biết chuẩn: so le trong bằng nhau, đồng vị bằng nhau hoặc trong cùng phía bù nhau.");
    }
    case "l9a1-step3": {
      const transversal = hasAny(s, ["cungduongcat", "cùngđườngcắt"]);
      const angleType = hasAny(s, ["soletrong", "so le trong", "dongvi", "đồng vị"]);
      const equal = hasAny(s, ["bangnhau", "bằngnhau"]);
      const parallel = hasAny(s, ["a//b", "a∥b", "song song"]);
      if (transversal && angleType && equal && parallel) return { ok: true };
      if (parallel) return fail("Kết luận đúng nhưng chuỗi suy luận còn thiếu đường cắt/loại góc/bằng nhau.", "Thiếu giả thiết của dấu hiệu");
      return fail("Viết đủ: cùng một đường cắt → đúng cặp góc → bằng nhau → suy ra a//b.");
    }

    case "l9a2-step1": {
      const parallel = hasAny(s, ["a//b", "a∥b", "song song"]);
      const property = hasAny(s, ["soletrongbangnhau", "so le trong bằng nhau", "dongvibangnhau", "đồng vị bằng nhau"]);
      if (parallel && property) return { ok: true };
      return fail("Chiều thuận phải bắt đầu từ a//b rồi suy ra quan hệ góc.");
    }
    case "l9a2-step2": {
      const angleType = hasAny(s, ["soletrong", "so le trong", "dongvi", "đồng vị"]);
      const transversal = hasAny(s, ["cungduongcat", "cùngđườngcắt"]);
      if (angleType && transversal) return { ok: true };
      return fail("Chiều đảo chỉ hợp lệ khi đó là đúng cặp góc trên cùng một đường cắt.");
    }
    case "l9a2-step3": {
      const missing = hasAny(s, ["thieudieukien", "thiếuđiềukiện", "chưadu", "chưađủ"]);
      const corrected = hasAny(s, ["neulasoletrong", "nếulàsoletrong", "neuladongvi", "nếulàđồngvị"]);
      const parallel = hasAny(s, ["a//b", "a∥b", "song song"]);
      if (missing && corrected && parallel) return { ok: true };
      if (parallel && !missing) return fail("Em chưa chỉ ra chỗ thiếu điều kiện trong lập luận ban đầu.", "Thiếu đánh giá lập luận");
      return fail("Hãy nói rõ lời giải thiếu điều kiện, rồi sửa bằng một dấu hiệu nhận biết hợp lệ.");
    }

    case "l9a3-step1": {
      const calc = hasAny(s, ["180-115=65", "180°-115°=65°"]);
      if (calc) return { ok: true };
      if (hasAny(s, ["65°", "65"])) return fail("65° đúng nhưng cần thể hiện 180°-115°=65° do hai góc kề bù.", "Đúng kết quả nhưng thiếu phép tính");
      return fail("Dùng quan hệ kề bù: 180°-115°.");
    }
    case "l9a3-step2": {
      const equal = hasAny(s, ["bangnhau", "bằngnhau", "65=65"]);
      const corresponding = hasAny(s, ["dongvi", "đồngvị"]);
      const transversal = hasAny(s, ["cungduongcat", "cùngđườngcắt"]);
      if (equal && corresponding && transversal) return { ok: true };
      if (equal) return fail("Không chỉ cần bằng nhau; phải nêu đây là cặp góc đồng vị trên cùng một đường cắt.", "Thiếu quan hệ vị trí");
      return fail("Hãy xác định hai góc 65° là một cặp đồng vị do cùng đường cắt tạo ra.");
    }
    case "l9a3-step3": {
      const criterion = hasAny(s, ["dauhieunhanbiet", "dấuhiệunhậnbiết", "dongvibangnhau", "đồngvịbằngnhau"]);
      const parallel = hasAny(s, ["a//b", "a∥b", "song song"]);
      const chain = hasAny(s, ["180-115", "65", "dongvi", "đồngvị"]);
      if (criterion && parallel && chain) return { ok: true };
      if (parallel) return fail("Kết luận đúng nhưng phải trình bày chuỗi kề bù → 65° → đồng vị bằng nhau → song song.", "Thiếu chuỗi chứng minh");
      return fail("Nêu rõ dấu hiệu nhận biết và kết luận a//b.");
    }


    case "l10a1-step1": {
      const outside = hasAny(s, ["diemnamngoai", "điểmnằmngoài", "quaM", "quam"]);
      const unique = hasAny(s, ["chimot", "chỉmột", "duynhat", "duynhất"]);
      const parallel = hasAny(s, ["song song", "songsong"]);
      if (outside && unique && parallel) return { ok: true };
      if (unique && parallel) return fail("Em đã có ý duy nhất nhưng cần nêu bối cảnh: qua một điểm nằm ngoài đường thẳng đã cho.", "Thiếu giả thiết của tiên đề");
      return fail("Phát biểu tiên đề với ba ý: điểm nằm ngoài, chỉ một đường thẳng, song song với đường đã cho.");
    }
    case "l10a1-step2": {
      const throughM = hasAny(s, ["deudiquam", "đềuđiquaM", "bvacdiquaM", "b và c đi qua M"]);
      const parallelA = hasAny(s, ["deusongsongvoia", "đềusongsongvớia", "b//a", "c//a"]);
      if (throughM && parallelA) return { ok: true };
      return fail("Hãy chỉ ra đồng thời: b,c đều đi qua M và đều song song với a.");
    }
    case "l10a1-step3": {
      const same = hasAny(s, ["b=c", "trungnhau", "trùngnhau"]);
      const uniqueness = hasAny(s, ["duynhat", "duynhất", "chimot", "chỉmột", "mauthuan", "mâuthuẫn"]);
      if (same && uniqueness) return { ok: true };
      if (same) return fail("b=c đúng nhưng em cần viện dẫn tính duy nhất trong tiên đề Euclid.", "Đúng kết luận nhưng thiếu lý do");
      return fail("Nếu b≠c thì qua M sẽ có hai đường cùng song song với a, trái tính duy nhất.");
    }

    case "l10a2-step1": {
      const given = hasAny(s, ["givena//b", "a//bdacho", "a//bđãcho", "giathieta//b", "giảthiếta//b"]);
      const goal = hasAny(s, ["goalgocsoletrongbangnhau", "gócsoletrongbằngnhau", "muctieugoc", "mụctiêugóc"]);
      if (given && goal) return { ok: true };
      return fail("Hãy tách rõ GIVEN: a//b; GOAL: chứng minh cặp góc so le trong bằng nhau.");
    }
    case "l10a2-step2": {
      const wrongDirection = hasAny(s, ["daochieu", "đảochiều", "saidieu", "saihướng", "dungdauhieunhanbiet", "dùngdấuhiệunhậnbiết"]);
      const alreadyGiven = hasAny(s, ["chungminhlai", "chứngminhlại", "a//bdacho", "a//bđãcho"]);
      if (wrongDirection && alreadyGiven) return { ok: true };
      if (wrongDirection) return fail("Đúng là sai chiều; hãy bổ sung rằng a//b đã là giả thiết nên không cần chứng minh lại.", "Thiếu phân tích GIVEN");
      return fail("Bạn đang dùng chiều Bài 9 thay cho tính chất Bài 10.");
    }
    case "l10a2-step3": {
      const parallel = hasAny(s, ["a//b", "a∥b"]);
      const transversal = hasAny(s, ["ccat", "c cắt", "duongcatc", "đườngcắtc"]);
      const property = hasAny(s, ["tinhchathaiduongthangsongsong", "tínhchấthaiđườngthẳngsongsong"]);
      const angles = hasAny(s, ["soletrongbangnhau", "so le trong bằng nhau"]);
      if (parallel && transversal && property && angles) return { ok: true };
      if (parallel && angles) return fail("Chuỗi gần đúng nhưng cần nêu c là đường cắt và viện dẫn tính chất hai đường thẳng song song.", "Thiếu điều kiện áp dụng");
      return fail("Viết đủ: a//b + c là đường cắt → tính chất hai đường thẳng song song → góc so le trong bằng nhau.");
    }

    case "l10a3-step1": {
      const perpendicular = hasAny(s, ["d⊥a", "d vuông góc a", "dvuonggoca"]);
      const right = hasAny(s, ["90°", "90"]);
      if (perpendicular && right) return { ok: true };
      if (right) return fail("90° đúng nhưng cần gắn với giả thiết d⊥a.", "Thiếu nguồn của góc vuông");
      return fail("Từ d⊥a, nêu một góc tạo bởi d và a bằng 90°.");
    }
    case "l10a3-step2": {
      const parallel = hasAny(s, ["a//b", "a∥b"]);
      const angleRelation = hasAny(s, ["dongvi", "đồngvị", "soletrong", "so le trong"]);
      const equal = hasAny(s, ["bangnhau", "bằngnhau"]);
      const right = hasAny(s, ["90°", "90"]);
      if (parallel && angleRelation && equal && right) return { ok: true };
      if (right && !angleRelation) return fail("Kết quả 90° chưa đủ; phải chỉ ra cặp góc đồng vị/so le trong do d cắt hai đường song song.", "Thiếu quan hệ góc");
      return fail("Dùng a//b và d là đường cắt để chuyển góc 90° sang giao điểm với b.");
    }
    case "l10a3-step3": {
      const right = hasAny(s, ["90°", "90"]);
      const conclusion = hasAny(s, ["d⊥b", "d vuông góc b", "dvuonggocb"]);
      if (right && conclusion) return { ok: true };
      if (conclusion) return fail("d⊥b đúng nhưng cần nêu căn cứ: d tạo với b một góc 90°.", "Thiếu bước kết luận từ định nghĩa");
      return fail("Từ góc 90° tại b, kết luận d⊥b.");
    }


    case "l11a1-step1": {
      if(hasAny(s,["given","giathiet","giảthiết"])&&hasAny(s,["doidinh","đốiđỉnh"])&&hasAny(s,["goal","ketluan","kếtluận"])&&hasAny(s,["bangnhau","bằngnhau","∠xOy=∠x'Oy'"]))return {ok:true};
      return fail("Tách rõ GIVEN: hai góc đối đỉnh; GOAL: hai góc bằng nhau.");
    }
    case "l11a1-step2": {
      if(hasAny(s,["doidinhnenbangnhau","đốiđỉnhnênbằngnhau"]))return fail("Đang dùng chính định lí cần chứng minh.","Circular reasoning");
      if(hasAny(s,["kebu","kềbù","180"])&&hasAny(s,["trunggian","cung","chung"]))return {ok:true};
      return fail("Dùng một góc kề bù trung gian và lập hai tổng 180°.");
    }
    case "l11a1-step3": {
      if(hasAny(s,["trucung","trừcùng","cungbang180","cùngbằng180"])&&hasAny(s,["bangnhau","bằngnhau","∠xOy=∠x'Oy'"]))return {ok:true};
      return fail("Từ hai tổng 180°, trừ cùng góc trung gian rồi kết luận GOAL.");
    }
    case "l11a2-step1": {
      if(hasAny(s,["a//b","a∥b"])&&hasAny(s,["ccat","c cắt"])&&hasAny(s,["α=β","alpha=beta"]))return {ok:true};
      return fail("GIVEN: a//b và c là đường cắt; GOAL: α=β.");
    }
    case "l11a2-step2": {
      if(hasAny(s,["vìα=β","dungketluanlamgiathiet","dùngkếtluậnlàmgiảthiết","vongtron","vòngtròn"]))return {ok:true};
      return fail("Câu 'Vì α=β' dùng chính GOAL làm tiền đề: chứng minh vòng tròn.");
    }
    case "l11a2-step3": {
      if(hasAny(s,["a//b","a∥b"])&&hasAny(s,["ccat","c cắt"])&&hasAny(s,["tinhchathaiduongthangsongsong","tínhchấthaiđườngthẳngsongsong"])&&hasAny(s,["α=β","alpha=beta"]))return {ok:true};
      return fail("Chuỗi đúng: GIVEN → tính chất hai đường thẳng song song → α=β.");
    }
    case "l11a3-step1": {
      if(hasAny(s,["sai","khongnhatthiet","khôngnhấtthiết"])&&hasAny(s,["menh de dao","mệnhđềđảo","chieu dao","chiềuđảo"]))return {ok:true};
      return fail("P⇒Q đúng không làm Q⇒P tự động đúng; Q⇒P là mệnh đề đảo.");
    }
    case "l11a3-step2": {
      if(hasAny(s,["chiahetcho4","chiahếtcho4"])&&hasAny(s,["chiahetcho2","chiahếtcho2"])&&hasAny(s,["6"]))return {ok:true};
      return fail("Ví dụ: chia hết cho 4 ⇒ chia hết cho 2; n=6 bác bỏ chiều đảo.");
    }
    case "l11a3-step3": {
      const wrong = hasAny(s, [
        "không cần chứng minh", "khôngcầnchứngminh",
        "không cần định lí", "khôngcầnđịnhlí",
        "chiều thuận đúng nên dùng chiều đảo", "chiềuthuậnđúngnêndùngchiềuđảo"
      ]);
      if (wrong) return fail("Chiều đảo không được dùng chỉ vì chiều thuận đúng.", "Converse error");
      const proven = hasAny(s, ["daduocchungminh","đãđượcchứngminh","chungminhrieng","chứngminhriêng"]);
      const theorem = hasAny(s, ["cóđịnhlí","codinhli","theođịnhlí","theodinhli","địnhlíhợplệ","dinhlihop le"]);
      if (proven || theorem) return { ok: true };
      return fail("Chỉ dùng chiều đảo khi nó đã được chứng minh hoặc có định lí hợp lệ.");
    }


    case "l12a1-step1": {
      const a = hasAny(s, ["a>=90", "a≥90"]);
      const b = hasAny(s, ["b>=90", "b≥90"]);
      const sum = hasAny(s, ["a+b>=180", "a+b≥180"]);
      if (a && b && sum) return { ok: true };
      if (sum) return fail("A+B≥180° đúng, nhưng hãy nêu căn cứ A≥90° và B≥90°.", "Thiếu giả sử");
      return fail("Từ A≥90° và B≥90°, cộng hai bất đẳng thức để được A+B≥180°.");
    }
    case "l12a1-step2": {
      const total = hasAny(s, ["a+b+c=180"]);
      const cNonPositive = hasAny(s, ["c<=0", "c≤0", "ckhongduong", "ckhôngdương"]);
      if (total && cNonPositive) return { ok: true };
      if (cNonPositive) return fail("C≤0° đúng nhưng cần nối với A+B+C=180°.", "Thiếu định lí tổng góc");
      return fail("Dùng C=180°-(A+B) cùng A+B≥180° để suy ra C≤0°.");
    }
    case "l12a1-step3": {
      const verdict = hasAny(s, ["sai", "khongthe", "khôngthể"]);
      const contradiction = hasAny(s, ["c<=0", "c≤0", "gocphaiduong", "gócphảidương", "goctrongtamgiacphaiduong"]);
      if (verdict && contradiction) return { ok: true };
      if (verdict) return fail("Kết luận đúng nhưng phải chỉ ra mâu thuẫn C≤0° với góc tam giác dương.", "Thiếu mâu thuẫn");
      return fail("Kết luận nhận định sai và nêu rõ mâu thuẫn.");
    }

    case "l12a2-step1": {
      const total = hasAny(s, ["a+b+c=180", "∠a+∠b+∠c=180"]);
      if (total) return { ok: true };
      return fail("Viết đúng định lí tổng ba góc: A+B+C=180°.");
    }
    case "l12a2-step2": {
      const supplement = hasAny(s, ["c+∠acd=180", "∠acb+∠acd=180", "acb+acd=180"]);
      const reason = hasAny(s, ["kebu", "kềbù", "haitiadoi", "haitiađối", "cbvacddoi"]);
      if (supplement && reason) return { ok: true };
      if (supplement) return fail("Đẳng thức đúng nhưng cần nêu ∠ACB và ∠ACD kề bù vì CB,CD là hai tia đối.", "Thiếu căn cứ kề bù");
      return fail("Viết ∠ACB+∠ACD=180° và nêu lý do kề bù.");
    }
    case "l12a2-step3": {
      const conclusion = hasAny(s, ["∠acd=a+b", "acd=a+b", "a+b=acd"]);
      const derivation = hasAny(s, ["truc", "trừ", "bot", "bớt", "cungbang180", "cùngbằng180"]);
      const circular = hasAny(s, ["theodinhligocngoai", "theođịnhlígócngoài"]);
      if (circular) return fail("Không được dùng sẵn định lí góc ngoài khi đang chứng minh chính định lí đó.", "Circular reasoning");
      if (conclusion && derivation) return { ok: true };
      if (conclusion) return fail("Kết luận đúng nhưng cần suy ra từ hai tổng cùng bằng 180° rồi bớt C.", "Thiếu chuỗi chứng minh");
      return fail("So sánh A+B+C=180° với C+ACD=180° rồi bớt C.");
    }

    case "l12a3-step1": {
      const exterior = hasAny(s, ["a+b=120"]);
      const relation = hasAny(s, ["a=2b"]);
      const solve = hasAny(s, ["3b=120", "b=40", "a=80"]);
      if (exterior && relation && solve) return { ok: true };
      if (hasAny(s, ["b=40", "a=80"])) return fail("Kết quả đúng nhưng cần thể hiện A+B=120° và A=2B dẫn tới 3B=120°.", "Thiếu chuỗi giải");
      return fail("Dùng góc ngoài: A+B=120°, rồi thay A=2B.");
    }
    case "l12a3-step2": {
      const c = hasAny(s, ["c=60"]);
      const total = hasAny(s, ["180-80-40=60", "80+40+60=180"]);
      const acute = hasAny(s, ["tamgiacnhon", "tamgiácnhọn"]);
      if (c && total && acute) return { ok: true };
      if (c && acute) return fail("Kết luận đúng nhưng cần thể hiện C=180°-80°-40°.", "Thiếu phép tính");
      return fail("Tìm C bằng tổng ba góc rồi phân loại theo 90°.");
    }
    case "l12a3-step3": {
      const interiorCheck = hasAny(s, ["80+40+60=180"]);
      const exteriorCheck = hasAny(s, ["80+40=120"]);
      if (interiorCheck && exteriorCheck) return { ok: true };
      if (interiorCheck || exteriorCheck) return fail("Cần đủ hai kiểm chứng độc lập: tổng ba góc và góc ngoài.", "Thiếu kiểm chứng kép");
      return fail("Kiểm tra cả 80+40+60=180 và 80+40=120.");
    }


    case "l13a1-step1": {
      const map = hasAny(s, ["a↔d","atuongungd","atươngứngd"]);
      const reason = hasAny(s, ["abvaac","abvàac","devadf","devàdf","dinhchung","đỉnhchung","giao"]);
      if (map && reason) return { ok:true };
      if (map) return fail("A↔D đúng nhưng cần nêu căn cứ từ hai cạnh tương ứng cùng đi qua đỉnh.", "Thiếu căn cứ tương ứng");
      return fail("A là đỉnh chung của AB,AC; D là đỉnh chung của DE,DF nên A↔D.");
    }
    case "l13a1-step2": {
      const b=hasAny(s,["b↔e","btuongunge","btươngứnge"]);
      const c=hasAny(s,["c↔f","ctuongungf","ctươngứngf"]);
      const check=hasAny(s,["bc↔ef","bctuongungef","bctươngứngef"]);
      if(b&&c&&check)return {ok:true};
      if(b&&c)return fail("B↔E và C↔F đúng; hãy kiểm tra lại bằng cặp BC↔EF.", "Thiếu kiểm tra");
      return fail("Từ A↔D suy ra B↔E, C↔F và dùng BC↔EF để kiểm tra.");
    }
    case "l13a1-step3": {
      const right=hasAny(s,["δabc=δdef","△abc=△def","abc=def"]);
      const wrongAccepted=hasAny(s,["δabc=δdfe","△abc=△dfe","abc=dfe"]) && !hasAny(s,["sai","khongdung","khôngđúng"]);
      const explain=hasAny(s,["saithutu","saithứtự","b↔f","bbi ghepvoif","bbịghépvớif"]);
      if(wrongAccepted)return fail("ΔABC=ΔDFE ghép sai B với F. Kí hiệu đúng là ΔABC=ΔDEF.", "Sai thứ tự đỉnh");
      if(right&&explain)return {ok:true};
      if(right)return fail("Kí hiệu đúng; hãy giải thích vì sao ΔABC=ΔDFE sai thứ tự.", "Thiếu phản biện");
      return fail("Theo A↔D, B↔E, C↔F phải viết ΔABC=ΔDEF.");
    }

    case "l13a2-step1": {
      const e1=hasAny(s,["ab=mn"]), e2=hasAny(s,["bc=np"]), e3=hasAny(s,["ac=mp"]);
      const map=hasAny(s,["a↔m"])&&hasAny(s,["b↔n"])&&hasAny(s,["c↔p"]);
      if(e1&&e2&&e3&&map)return {ok:true};
      if(e1&&e2&&e3)return fail("Đã đủ ba cặp cạnh; hãy xác định thêm A↔M, B↔N, C↔P.", "Thiếu ánh xạ đỉnh");
      return fail("Phải liệt kê đủ AB=MN, BC=NP, AC=MP và ánh xạ đỉnh.");
    }
    case "l13a2-step2": {
      const tri=hasAny(s,["δabc=δmnp","△abc=△mnp","abc=mnp"]);
      const ccc=hasAny(s,["c.c.c","ccc"]);
      const wrong=hasAny(s,["abc=mpn","δabc=δmpn","△abc=△mpn"]);
      if(wrong)return fail("Thứ tự MPN không khớp B↔N, C↔P.", "Sai thứ tự đỉnh");
      if(tri&&ccc)return {ok:true};
      if(tri)return fail("Kết luận đúng nhưng phải nêu trường hợp c.c.c.", "Thiếu trường hợp bằng nhau");
      return fail("Từ ba cặp cạnh, kết luận ΔABC=ΔMNP theo c.c.c.");
    }
    case "l13a2-step3": {
      const angle=hasAny(s,["∠b=∠n","b=n"]);
      const reason=hasAny(s,["goctuongung","góctươngứng","haitamgiacbangnhau","haitamgiácbằngnhau","δabc=δmnp","△abc=△mnp"]);
      if(angle&&reason)return {ok:true};
      if(angle)return fail("∠B=∠N đúng nhưng cần căn cứ: hai tam giác đã bằng nhau nên góc tương ứng bằng nhau.", "Đáp án không đủ chứng minh");
      return fail("Sau ΔABC=ΔMNP, dùng góc tương ứng B↔N để suy ra ∠B=∠N.");
    }

    case "l13a3-step1": {
      const verdict=hasAny(s,["chuadu","chưađủ","sai"]);
      const two=hasAny(s,["haicapcanh","haicặpcạnh","moicohaicap","mớicóhaicặp"]);
      if(verdict&&two)return {ok:true};
      if(verdict)return fail("Hãy nêu rõ mới có hai cặp cạnh, trong khi c.c.c. cần ba cặp.", "Thiếu lý do");
      return fail("Kết luận theo c.c.c. là chưa đủ vì mới có hai cặp cạnh bằng nhau.");
    }
    case "l13a3-step2": {
      if(hasAny(s,["bc=ef"]))return {ok:true};
      return fail("Theo ABC↔DEF, cặp cạnh thứ ba còn thiếu là BC=EF.");
    }
    case "l13a3-step3": {
      const notCongruent=hasAny(s,["chuachungminhhaitamgiacbangnhau","chưachứngminhhaitamgiácbằngnhau","khongdudulieu","khôngđủdữliệu"]);
      const angles=hasAny(s,["goctuongung","góctươngứng","∠b=∠e","∠c=∠f"]);
      if(notCongruent&&angles)return {ok:true};
      if(notCongruent)return fail("Đúng là chưa chứng minh được hai tam giác bằng nhau; hãy nối điều đó với việc chưa được suy ra góc tương ứng.", "Thiếu hệ quả");
      return fail("Chưa đủ c.c.c. nên chưa có căn cứ suy ra các góc tương ứng bằng nhau.");
    }


    case "l14a1-step1": {
      const a=hasAny(s,["∠a","goca","góca"]);
      const d=hasAny(s,["∠d","gocd","gócd"]);
      const sides=hasAny(s,["abvaac","abvàac"])&&hasAny(s,["devadf","devàdf"]);
      if(a&&d&&sides)return {ok:true};
      if(a&&d)return fail("Đúng là ∠A và ∠D; hãy nêu chúng là góc xen giữa AB,AC và DE,DF.", "Thiếu căn cứ xen giữa");
      return fail("Góc xen giữa AB,AC là ∠A; góc xen giữa DE,DF là ∠D.");
    }
    case "l14a1-step2": {
      const map=hasAny(s,["a↔d"])&&hasAny(s,["b↔e"])&&hasAny(s,["c↔f"]);
      const tri=hasAny(s,["δabc=δdef","△abc=△def","abc=def"]);
      const sas=hasAny(s,["c.g.c","cgc"]);
      if(map&&tri&&sas)return {ok:true};
      if(tri&&sas)return fail("Kết luận đúng nhưng cần khóa A↔D, B↔E, C↔F.", "Thiếu tương ứng đỉnh");
      return fail("Từ hai cạnh và góc xen giữa, kết luận ΔABC=ΔDEF theo c.g.c. với đúng ánh xạ đỉnh.");
    }
    case "l14a1-step3": {
      const invalid=hasAny(s,["khongxengiua","khôngxengiữa","∠bkhongxen","∠bkhôngxen"]);
      const verdict=hasAny(s,["chuadu","chưađủ","khongthe","khôngthể","khongphaic.g.c","khôngphảic.g.c"]);
      if(invalid&&verdict)return {ok:true};
      if(verdict)return fail("Hãy chỉ rõ ∠B không phải góc xen giữa AB và AC.", "Thiếu lỗi vị trí");
      return fail("Hai cạnh + một góc chỉ là c.g.c. khi góc đó xen giữa hai cạnh đã cho.");
    }

    case "l14a2-step1": {
      const bc=hasAny(s,["bcnoibvac","bcnốibvàc"]);
      const ef=hasAny(s,["efnoievaf","efnốievàf"]);
      const included=hasAny(s,["canhxengiua","cạnhxengiữa"]);
      if(bc&&ef&&included)return {ok:true};
      if(included)return fail("Hãy giải thích BC nối B,C và EF nối E,F nên chúng là cạnh xen giữa.", "Thiếu căn cứ vị trí");
      return fail("Cạnh xen giữa hai góc B,C là BC; giữa E,F là EF.");
    }
    case "l14a2-step2": {
      const map=hasAny(s,["b↔e"])&&hasAny(s,["c↔f"])&&hasAny(s,["a↔d"]);
      const tri=hasAny(s,["δabc=δdef","△abc=△def","abc=def"]);
      const asa=hasAny(s,["g.c.g","gcg"]);
      if(map&&tri&&asa)return {ok:true};
      if(tri&&asa)return fail("Kết luận đúng nhưng cần nêu B↔E, C↔F, A↔D.", "Thiếu tương ứng đỉnh");
      return fail("Khóa B↔E, C↔F, A↔D rồi kết luận ΔABC=ΔDEF theo g.c.g.");
    }
    case "l14a2-step3": {
      const side=hasAny(s,["ab=de","ac=df"]);
      const reason=hasAny(s,["canhtuongung","cạnhtươngứng","haitamgiacbangnhau","haitamgiácbằngnhau"]);
      if(side&&reason)return {ok:true};
      if(side)return fail("Cặp cạnh đúng nhưng phải nêu căn cứ từ hai tam giác bằng nhau và cạnh tương ứng.", "Thiếu căn cứ");
      return fail("Sau ΔABC=ΔDEF, suy ra AB=DE hoặc AC=DF vì là cạnh tương ứng.");
    }

    case "l14a3-step1": {
      const verdict=hasAny(s,["khongdu","khôngđủ","aaakhong","aaakhông"]);
      const reason=hasAny(s,["khackichthuoc","kháckíchthước","cunghinhdang","cùnghìnhdạng","phongto","phóngto"]);
      if(verdict&&reason)return {ok:true};
      if(verdict)return fail("AAA không đủ; hãy giải thích ba góc có thể giữ nguyên khi kích thước thay đổi.", "Thiếu phản ví dụ kích thước");
      return fail("Ba góc tương ứng bằng nhau không phải tiêu chuẩn bằng nhau; AAA không khóa kích thước.");
    }
    case "l14a3-step2": {
      const position=hasAny(s,["gockhongxengiua","góckhôngxengiữa","khongxengiua","khôngxengiữa"]);
      const verdict=hasAny(s,["khongphaic.g.c","khôngphảic.g.c","chuadu","chưađủ"]);
      if(position&&verdict)return {ok:true};
      if(verdict)return fail("Cần nêu lỗi quyết định: góc đã cho không xen giữa hai cạnh.", "Thiếu lỗi vị trí");
      return fail("c.g.c. yêu cầu góc xen giữa đúng hai cạnh tương ứng.");
    }
    case "l14a3-step3": {
      const asaFix=hasAny(s,["themcanhxengiua","thêmcạnhxengiữa"])&&hasAny(s,["g.c.g","gcg"]);
      const sasFix=hasAny(s,["doisangocxengiua","đổisangócxengiữa","thaybanggocxengiua","thaybằnggócxengiữa"])&&hasAny(s,["c.g.c","cgc"]);
      if(asaFix&&sasFix)return {ok:true};
      if(asaFix||sasFix)return fail("Cần sửa cả hai: AAA + cạnh xen giữa → g.c.g.; hai cạnh + đổi sang góc xen giữa → c.g.c.", "Thiếu một cách sửa");
      return fail("Hãy đưa từng bộ dữ kiện về đúng cấu trúc g.c.g. và c.g.c.");
    }


    case "l15a1-step1": {
      const legs=hasAny(s,["haicanhgocvuong","haicạnhgócvuông"]);
      const names=hasAny(s,["abvaac","abvàac"])&&hasAny(s,["devadf","devàdf"]);
      if(legs&&names)return {ok:true};
      if(legs)return fail("Đúng trường hợp; hãy chỉ rõ AB,AC và DE,DF là hai cặp cạnh góc vuông.", "Thiếu phân loại cạnh");
      return fail("Vì A,D là góc vuông nên AB,AC và DE,DF là hai cạnh góc vuông tương ứng.");
    }
    case "l15a1-step2": {
      const leg=hasAny(s,["motcanhgocvuong","mộtcạnhgócvuông"]);
      const adjacent=hasAny(s,["gocnhonke","gócnhọnkề","kecanhay","kềcạnhấy"]);
      const named=hasAny(s,["ab"])&&hasAny(s,["de"])&&hasAny(s,["∠b","gocb","gócb"])&&hasAny(s,["∠e","goce","góce"]);
      if(leg&&adjacent&&named)return {ok:true};
      if(leg&&named)return fail("Cần nêu ∠B,∠E là góc nhọn kề cạnh AB,DE.", "Thiếu điều kiện kề");
      return fail("Đây là trường hợp một cạnh góc vuông và góc nhọn kề cạnh ấy.");
    }
    case "l15a1-step3": {
      const hyp=hasAny(s,["bcvaeflacanhhuyen","bcvàeflàcạnhhuyền","bcvaef","bcvàef"])&&hasAny(s,["canhhuyen","cạnhhuyền"]);
      const acute=hasAny(s,["gocnhon","gócnhọn"])&&hasAny(s,["∠b","gocb","gócb"])&&hasAny(s,["∠e","goce","góce"]);
      if(hyp&&acute)return {ok:true};
      if(hasAny(s,["canhhuyen","cạnhhuyền"])&&acute)return fail("Hãy chỉ rõ BC và EF là cạnh huyền vì đối diện góc vuông.", "Thiếu tên cạnh");
      return fail("BC,EF là cạnh huyền; cùng ∠B=∠E tạo trường hợp cạnh huyền và một góc nhọn.");
    }

    case "l15a2-step1": {
      const hyp=hasAny(s,["bcvaeflacanhhuyen","bcvàeflàcạnhhuyền"]);
      const leg=hasAny(s,["abvadelacanhgocvuong","abvàdelàcạnhgócvuông"]);
      if(hyp&&leg)return {ok:true};
      if(hasAny(s,["bc","ef","canhhuyen","cạnhhuyền"])&&hasAny(s,["ab","de","canhgocvuong","cạnhgócvuông"]))return {ok:true};
      return fail("Xác định BC,EF là cạnh huyền và AB,DE là cạnh góc vuông.");
    }
    case "l15a2-step2": {
      const map=hasAny(s,["a↔d"])&&hasAny(s,["b↔e"])&&hasAny(s,["c↔f"]);
      const tri=hasAny(s,["δabc=δdef","△abc=△def","abc=def"]);
      const criterion=hasAny(s,["canhhuyen","cạnhhuyền"])&&hasAny(s,["canhgocvuong","cạnhgócvuông"]);
      if(map&&tri&&criterion)return {ok:true};
      if(tri&&criterion)return fail("Kết luận đúng nhưng cần khóa A↔D, B↔E, C↔F.", "Thiếu tương ứng đỉnh");
      return fail("Dùng đúng trường hợp cạnh huyền–cạnh góc vuông và viết ΔABC=ΔDEF.");
    }
    case "l15a2-step3": {
      const angle=hasAny(s,["∠c=∠f","c=f"]);
      const reason=hasAny(s,["goctuongung","góctươngứng","haitamgiacbangnhau","haitamgiácbằngnhau","δabc=δdef","△abc=△def"]);
      if(angle&&reason)return {ok:true};
      if(angle)return fail("∠C=∠F đúng nhưng cần căn cứ từ hai tam giác bằng nhau.", "Hệ quả quá sớm");
      return fail("Sau ΔABC=ΔDEF, suy ra ∠C=∠F vì là góc tương ứng.");
    }

    case "l15a3-step1": {
      const verdict=hasAny(s,["chuadu","chưađủ","sai"]);
      const missing=hasAny(s,["δdefphaivuong","△defphảivuông","∠d=90","cahaitamgiacvuong","cảhaitamgiácvuông"]);
      if(verdict&&missing)return {ok:true};
      if(verdict)return fail("Hãy nêu giả thiết còn thiếu: ΔDEF phải vuông, chẳng hạn ∠D=90°.", "Thiếu điều kiện tiên quyết");
      return fail("Không thể áp dụng trường hợp tam giác vuông khi chưa biết ΔDEF vuông.");
    }
    case "l15a3-step2": {
      const definition=hasAny(s,["canhhuyendoidiengocvuong","cạnhhuyềnđốidiệngócvuông"]);
      const missing=hasAny(s,["chuacogocvuong","chưacógócvuông","khongthexacdinhcanhhuyen","khôngthểxácđịnhcạnhhuyền"]);
      if(definition&&missing)return {ok:true};
      if(missing)return fail("Hãy nêu định nghĩa: cạnh huyền là cạnh đối diện góc vuông.", "Thiếu định nghĩa");
      return fail("Chưa biết ΔDEF có góc vuông nên chưa thể gọi EF là cạnh huyền.");
    }
    case "l15a3-step3": {
      const addRight=hasAny(s,["∠d=90","defvuongtaid","defvuôngtạid"]);
      const data=hasAny(s,["bc=ef"])&&hasAny(s,["ab=de"]);
      const criterion=hasAny(s,["canhhuyen","cạnhhuyền"])&&hasAny(s,["canhgocvuong","cạnhgócvuông"]);
      const tri=hasAny(s,["δabc=δdef","△abc=△def","abc=def"]);
      if(addRight&&data&&criterion&&tri)return {ok:true};
      if(addRight&&tri)return fail("Cần viết đủ BC=EF, AB=DE và tên trường hợp cạnh huyền–cạnh góc vuông.", "Thiếu chuỗi dữ kiện");
      return fail("Bổ sung ΔDEF vuông tại D rồi mới phân loại cạnh và áp dụng trường hợp đặc biệt.");
    }


    case "l16a1-step1": {
      const bToAC=hasAny(s,["∠bdoidienac","∠bđốidiệnac","gocbdoidienac","gócbđốidiệnac"]);
      const cToAB=hasAny(s,["∠cdoidienab","∠cđốidiệnab","goccdoidienab","góc c đối diện ab","góccđốidiệnab"]);
      if(bToAC&&cToAB)return {ok:true};
      if(hasAny(s,["ac","ab"])&&!bToAC&&!cToAB)return fail("Hãy ghép rõ từng góc với cạnh đối diện: ∠B↔AC, ∠C↔AB.", "Thiếu ánh xạ góc–cạnh");
      return fail("Cạnh đối diện ∠B là AC; cạnh đối diện ∠C là AB.");
    }
    case "l16a1-step2": {
      const equality=hasAny(s,["ab=ac","ac=ab"]);
      const converse=hasAny(s,["dinh li dao","địnhlíđảo","dinhlydao","địnhlýđảo","haigocbangnhau","haigócbằngnhau"]);
      const wrong=hasAny(s,["chuadu","chưađủ","khongthe suy","khôngthểsuy"]);
      if(wrong)return fail("Trong một tam giác, hai góc bằng nhau đủ để suy ra hai cạnh đối diện bằng nhau theo định lí đảo của tam giác cân.", "Sai kiến thức");
      if(equality&&converse)return {ok:true};
      if(equality)return fail("AB=AC đúng nhưng cần nêu định lí đảo của tam giác cân.", "Thiếu căn cứ");
      return fail("Từ ∠B=∠C, theo định lí đảo suy ra AC=AB.");
    }
    case "l16a1-step3": {
      const isos=hasAny(s,["cantai a","cântạia","tamgiaccantai a","tamgiáccântạia"]);
      const equality=hasAny(s,["ab=ac","ac=ab"]);
      const reject=hasAny(s,["phatbieusai","phátbiểusai","nhandinhsai","nhậnđịnhsai","sai"]);
      if(isos&&equality&&reject)return {ok:true};
      if(isos&&equality)return fail("Kết luận tam giác cân đúng; hãy bác bỏ rõ phát biểu ban đầu.", "Thiếu phản biện");
      return fail("AB=AC nên ΔABC cân tại A; phát biểu ban đầu là sai.");
    }

    case "l16a2-step1": {
      const premise=hasAny(s,["mthuocduongtrungtruc","mthuộcđườngtrungtrực"]);
      const eq=hasAny(s,["ma=mb"]);
      const property=hasAny(s,["tinhchatduongtrungtruc","tínhchấtđườngtrungtrực","chieuthuan","chiềuthuận"]);
      if(premise&&eq&&property)return {ok:true};
      if(eq)return fail("MA=MB đúng nhưng cần nêu giả thiết M thuộc đường trung trực và đây là chiều thuận.", "Thiếu chiều suy luận");
      return fail("M thuộc đường trung trực AB ⇒ MA=MB.");
    }
    case "l16a2-step2": {
      const eq=hasAny(s,["ma=mb"]);
      const conclusion=hasAny(s,["mthuocduongtrungtruc","mthuộcđườngtrungtrực"]);
      const converse=hasAny(s,["tinhchatdao","tínhchấtđảo","chieu dao","chiềuđảo"]);
      const wrong=hasAny(s,["chuadu","chưađủ","khongtheketluan","khôngthểkếtluận"]);
      if(wrong)return fail("MA=MB là đủ để suy ra M thuộc đường trung trực của AB theo tính chất đảo.", "Sai chiều đảo");
      if(eq&&conclusion&&converse)return {ok:true};
      if(eq&&conclusion)return fail("Kết luận đúng nhưng cần gọi tên chiều đảo/tính chất đảo.", "Thiếu căn cứ");
      return fail("MA=MB ⇒ M thuộc đường trung trực của AB.");
    }
    case "l16a2-step3": {
      const iff=hasAny(s,["khivachikhi","khivàchỉkhi","⇔"]);
      const both=hasAny(s,["mthuocduongtrungtruc","mthuộcđườngtrungtrực"])&&hasAny(s,["ma=mb"]);
      const set=hasAny(s,["taphopcacdiemcachdeu","tậphợpcácđiểmcáchđều","tap hop tat ca cac diem","tậphợptấtcảcácđiểm"]);
      if(iff&&both)return {ok:true};
      if(set&&both)return {ok:true};
      return fail("Tóm tắt: M thuộc đường trung trực của AB ⇔ MA=MB.");
    }

    case "l16a3-step1": {
      const m=hasAny(s,["mthuocduongtrungtruc","mthuộcđườngtrungtrực"]);
      const n=hasAny(s,["nthuocduongtrungtruc","nthuộcđườngtrungtrực"]);
      const converse=hasAny(s,["tinhchatdao","tínhchấtđảo","ma=mb"])&&hasAny(s,["na=nb"]);
      if(m&&n&&converse)return {ok:true};
      if(m&&n)return fail("Vị trí đúng nhưng cần nêu MA=MB, NA=NB và tính chất đảo.", "Thiếu căn cứ");
      return fail("Từ MA=MB và NA=NB, suy ra M,N cùng thuộc đường trung trực của AB.");
    }
    case "l16a3-step2": {
      const same=hasAny(s,["mntrungvoiduongtrungtruc","mntrùngvớiđườngtrungtrực","mnchinhla duongtrungtruc","mnchínhlàđườngtrungtrực"]);
      const unique=hasAny(s,["quahaidiemphanbiet","quahaiđiểmphânbiệt","motduongthangduynhat","mộtđườngthẳngduynhất"]);
      if(same&&unique)return {ok:true};
      if(same)return fail("Kết luận trùng nhau đúng nhưng cần dùng tính duy nhất của đường thẳng qua hai điểm phân biệt M,N.", "Thiếu tính duy nhất");
      return fail("Cả MN và đường trung trực đi qua M,N phân biệt, nên chúng trùng nhau.");
    }
    case "l16a3-step3": {
      const perp=hasAny(s,["mn⊥ab","mnvuonggocab","mnvuônggócab"]);
      const midpoint=hasAny(s,["quatrungdiemab","quatrungđiểmab","diguatrungdiemab","điquatrungđiểmab"]);
      const definition=hasAny(s,["duongtrungtruc","đườngtrungtrực"]);
      if(perp&&midpoint&&definition)return {ok:true};
      if(perp||midpoint)return fail("Cần đủ hai hệ quả của định nghĩa: MN⊥AB và MN đi qua trung điểm AB.", "Thiếu một điều kiện");
      return fail("Vì MN là đường trung trực của AB nên MN⊥AB và đi qua trung điểm AB.");
    }


    case "l17a1-step1": {
      const numeric=hasAny(s,["dulieuso","dữliệusố","soluong","sốlượng","demduoc","đếmđược"]);
      const meaning=hasAny(s,["0,1,2","0 1 2","anhchiem","anhchịem","pheptinh","phéptính","sosanh","sosánh"]);
      if(numeric&&meaning)return {ok:true};
      if(numeric)return fail("Đúng là dữ liệu số; hãy nêu vì các giá trị biểu thị số lượng/đếm được, không phải mã nhãn.","Thiếu tiêu chí");
      return fail("Số anh/chị/em là dữ liệu số vì biểu thị số lượng đếm được.");
    }
    case "l17a1-step2": {
      const nonnumeric=hasAny(s,["khonglaso","khônglàsố","dulieukhonglaso","dữliệukhônglàsố"]);
      const ordinal=hasAny(s,["cothesapthutu","cóthểsắpthứtự","thubac","thứbậc","thutunhien","thứtựtựnhiên"]);
      if(nonnumeric&&ordinal)return {ok:true};
      if(ordinal)return fail("Cần nêu đây là dữ liệu không là số nhưng có thứ tự tự nhiên từ mức thấp đến cao.","Thiếu loại dữ liệu");
      return fail("Mức hài lòng là dữ liệu không là số có thể sắp thứ tự.");
    }
    case "l17a1-step3": {
      const nominal=hasAny(s,["khongthesapthutu","khôngthểsắpthứtự","khongcothutu","khôngcóthứtự","chilanhan","chỉlànhãn"]);
      const code=hasAny(s,["ma","mã","1,2,3","123"])&&hasAny(s,["khongcoynghiasoluong","khôngcóýnghĩasốlượng","khongbien","khôngbiến"]);
      if(nominal&&code)return {ok:true};
      if(nominal)return fail("Phân loại đúng; hãy phản biện mã 1,2,3 chỉ là nhãn, không có ý nghĩa số lượng.","Thiếu phản biện mã số");
      return fail("Môn yêu thích là dữ liệu không là số không có thứ tự tự nhiên; mã số chỉ là nhãn.");
    }

    case "l17a2-step1": {
      const population=hasAny(s,["900hocsinh","900họcsinh","toantruong","toàntrường"]);
      const sample=hasAny(s,["150"])&&hasAny(s,["caulacbohocthuat","câulạcbộhọcthuật","tunguyen","tựnguyện"]);
      if(population&&sample)return {ok:true};
      if(population)return fail("Quần thể đúng; hãy xác định mẫu Cách 1 là 150 học sinh tự nguyện trong CLB Học thuật.","Thiếu mẫu");
      return fail("Quần thể là 900 học sinh toàn trường; mẫu Cách 1 là 150 học sinh tự nguyện trong CLB Học thuật.");
    }
    case "l17a2-step2": {
      const voluntary=hasAny(s,["tunguyen","tựnguyện","thienlechtunguyen","thiênlệchtựnguyện"]);
      const club=hasAny(s,["caulacbohocthuat","câulạcbộhọcthuật","chiclb","chỉclb"]);
      const largeTrap=hasAny(s,["maulonchuachac","mẫulớnchưachắc","150chuachac","150chưachắc","cachchonmau","cáchchọnmẫu"]);
      if(voluntary&&club&&largeTrap)return {ok:true};
      if(voluntary&&club)return fail("Đã chỉ ra hai thiên lệch; hãy nêu cỡ mẫu lớn không tự bảo đảm tính đại diện nếu cách chọn bị lệch.","Mẫu lớn ≠ đại diện");
      if(hasAny(s,["150lan","150lớn","chacchandai dien","chắcchắnđạidiện"]))return fail("Mẫu lớn không chắc đại diện; cách chọn mẫu mới là yếu tố quyết định.","Large sample fallacy");
      return fail("Cách 1 thiên lệch do tự nguyện và chỉ lấy CLB Học thuật; cỡ 150 không sửa được cơ chế chọn mẫu lệch.");
    }
    case "l17a2-step3": {
      const better=hasAny(s,["daidienhon","đạidiệnhơn"])&&hasAny(s,["ngaunhien","ngẫunhiên"])&&hasAny(s,["moikho i","mỗikhối","cac khoi","cáckhối"]);
      const scope=hasAny(s,["uocluong","ướclượng"])&&hasAny(s,["toantruong","toàntrường"])&&hasAny(s,["khongkhangdinhtuyetdoi","khôngkhẳngđịnhtuyệtđối","vanlama u","vẫnlàmẫu","khongchacchan","khôngchắcchắn"]);
      if(better&&scope)return {ok:true};
      if(better)return fail("Cách 2 đại diện hơn; hãy giới hạn kết luận là ước lượng cho toàn trường, không phải giá trị chắc chắn của mọi học sinh.","Thiếu phạm vi suy rộng");
      return fail("Cách 2 đại diện hơn vì chọn ngẫu nhiên và phủ các khối; kết quả chỉ dùng để ước lượng cho toàn trường.");
    }

    case "l17a3-step1": {
      const convenience=hasAny(s,["mauthuantien","mẫuthuậntiện","thienlech","thiênlệch"]);
      const excluded=hasAny(s,["chihocsinhmuado","chỉhọcsinhmuađồ","hocsinhkhongmua","họcsinhkhôngmua","khongdaidien","khôngđạidiện"]);
      if(convenience&&excluded)return {ok:true};
      if(convenience)return fail("Đúng là mẫu thuận tiện; hãy nêu học sinh không mua/không đến căng tin bị loại khỏi mẫu.","Thiếu cơ chế thiên lệch");
      return fail("Chỉ hỏi người vừa mua đồ là mẫu thuận tiện, không đại diện hợp lí cho toàn trường.");
    }
    case "l17a3-step2": {
      const leading=hasAny(s,["dandat","dẫndắt","thienlechcauhoi","thiênlệchcâuhỏi"]);
      const neutral=hasAny(s,["trunglap","trunglập","mucdohailong","mứcđộhàilòng"])&&hasAny(s,["ratkhonghailong","rấtkhônghàilòng","binhthuong","bìnhthường","rathailong","rấthàilòng"]);
      if(leading&&neutral)return {ok:true};
      if(leading)return fail("Đã phát hiện câu dẫn dắt; hãy viết lại một câu trung lập về mức độ hài lòng.","Thiếu câu hỏi sửa");
      return fail("Câu 'ngon và đa dạng hơn hẳn' dẫn dắt; cần câu hỏi trung lập với thang mức độ hài lòng.");
    }
    case "l17a3-step3": {
      const over=hasAny(s,["khongduocsuyrong","khôngđượcsuyrộng","vuotphamvi","vượtphạmvi","82%nguo iduoc hoi","82%ngườiđượchỏi","khongduketluantoantruong","khôngđủkếtluậntoàntrường"]);
      const fix=hasAny(s,["ngaunhien","ngẫunhiên"])&&hasAny(s,["cac khoi","cáckhối","moikho i","mỗikhối"])&&hasAny(s,["cauhoitrunglap","câuhỏitrunglập"]);
      if(over&&fix)return {ok:true};
      if(over)return fail("Đúng là kết luận vượt mẫu; hãy sửa cả cách chọn mẫu và câu hỏi: mẫu ngẫu nhiên/bao phủ các khối + câu trung lập.","Thiếu phương án sửa");
      return fail("82% của mẫu thiên lệch không thể suy thành 82% toàn trường; cần mẫu đại diện hơn và câu hỏi trung lập.");
    }

    case "l18a1-step1": return hasAny(s,["85%"])&&hasAny(s,["15%"])?{ok:true}:fail("28%+35%+22%=85%, nên còn 15%.");
    case "l18a1-step2": return hasAny(s,["100%"])&&hasAny(s,["hople","hợplệ"])?{ok:true}:fail("Cần kiểm tổng 100% rồi mới kết luận hợp lệ.");
    case "l18a1-step3":
      if(hasAny(s,["25%"])&&!hasAny(s,["sai","khong","không"])) return fail("Bốn nhóm không có nghĩa mỗi nhóm 25%.","Chia đều không có căn cứ");
      return hasAny(s,["sai"])&&hasAny(s,["15%"])?{ok:true}:fail("Phải bác bỏ phép chia đều và kết luận 15%.");
    case "l18a2-step1": return hasAny(s,["n=60"])&&hasAny(s,["0,3n=18","0.3n=18","30%n=18"])?{ok:true}:fail("0,30N=18 nên N=60.");
    case "l18a2-step2": return hasAny(s,["21"])&&hasAny(s,["12"])&&hasAny(s,["9"])?{ok:true}:fail("Bóng đá 21, Cầu lông 12, Khác 9.");
    case "l18a2-step3": return hasAny(s,["100%"])&&hasAny(s,["18+21+12+9=60"])?{ok:true}:fail("Cần kiểm cả tổng tỉ lệ 100% và tổng số lượng 60.");
    case "l18a3-step1":
      if(hasAny(s,["10%"])&&!hasAny(s,["diemphantram","điểmphầntrăm"])) return fail("Đây là 10 điểm phần trăm, không phải cách nói mơ hồ 10%.","Nhầm đơn vị");
      return hasAny(s,["10diemphantram","10điểmphầntrăm"])?{ok:true}:fail("30%−20%=10 điểm phần trăm.");
    case "l18a3-step2": return hasAny(s,["50%","(30-20)/20"])&&hasAny(s,["10diemphantram","10điểmphầntrăm"])?{ok:true}:fail("Mức tăng tương đối là 50%, còn chênh lệch là 10 điểm phần trăm.");
    case "l18a3-step3": return hasAny(s,["40"])&&hasAny(s,["90"])&&hasAny(s,["50"])&&hasAny(s,["quymo","quymô","khactong","kháctổng"])?{ok:true}:fail("40→90, tăng 50 học sinh; phải xét quy mô.");

    case "l19a1-step1": {
      const values=hasAll(s,["120","135","150","145","165"]);
      const changes=hasAny(s,["+15"])&&hasAny(s,["-5"])&&hasAny(s,["+20"]);
      if(values&&changes)return {ok:true};
      if(values)return fail("Đã đọc đúng điểm; hãy tính thêm +15,+15,−5,+20.","Thiếu biến động");
      return fail("Cần đọc đủ 120,135,150,145,165.");
    }
    case "l19a1-step2": {
      const overall=hasAny(s,["tangnhinchung","tăngnhìnchung"]);
      const dip=hasAny(s,["thang3denthang4","tháng3đếntháng4","150xuong145","150xuống145"]);
      const rebound=hasAny(s,["tangtro lai","tăngtrởlại","145len165","145lên165"]);
      if(overall&&dip&&rebound)return {ok:true};
      if(overall&&dip)return fail("Hãy nêu thêm đoạn tăng trở lại 145→165.","Thiếu đoạn phục hồi");
      return fail("Xu hướng nhìn chung tăng, có đoạn giảm 150→145 rồi tăng lại.");
    }
    case "l19a1-step3": {
      const reject=hasAny(s,["khongchacchan","khôngchắcchắn","chuadudulieu","chưađủdữliệu","khongthekhangdinh","khôngthểkhẳngđịnh"]);
      const bound=hasAny(s,["chidenthang5","chỉđếntháng5","thang6chuaco","tháng6chưacó","dudoan","dựđoán"]);
      if(reject&&bound)return {ok:true};
      if(hasAny(s,["chacchantang","chắcchắntăng"]))return fail("Không thể khẳng định chắc chắn Tháng 6 từ dữ liệu chỉ đến Tháng 5.","Suy rộng quá dữ liệu");
      return fail("Phân biệt xu hướng quan sát với dự đoán tương lai.");
    }
    case "l19a2-step1": {
      const axes=hasAny(s,["trucngangtuan","trụcngangtuần"])&&hasAny(s,["trucdungsobai","trụcđứngsốbài"]);
      const scale=hasAny(s,["0-50","0den50","0đến50"])&&hasAny(s,["buoc5","bước5","buoc10","bước10","moi5","mỗi5","moi10","mỗi10"]);
      if(axes&&scale)return {ok:true};
      if(axes)return fail("Trục đúng; cần chọn thang đều, ví dụ 0–50 bước 5 hoặc 10.","Thiếu thang đo");
      return fail("Trục ngang là tuần, trục đứng số bài; chọn thang đều chứa 20–50.");
    }
    case "l19a2-step2": {
      const a=hasAll(s,["7a","20","30","40","50"]);
      const b=hasAll(s,["7b","25","35","45"]);
      const order=hasAny(s,["noitheothututuan","nốitheothứtựtuần","theothututuan","theothứtựtuần"]);
      const legend=hasAny(s,["chugiai","chúgiải","kihieu","kíhiệu"]);
      if(a&&b&&order&&legend)return {ok:true};
      if(a&&b)return fail("Cần nối riêng từng dãy theo thứ tự tuần và có chú giải.","Thiếu cấu trúc vẽ");
      return fail("Liệt kê đủ hai dãy điểm, nối theo tuần và phân biệt bằng chú giải.");
    }
    case "l19a2-step3": {
      const equal=hasAny(s,["ca4tuan","cả4tuần","bontuan","bốntuần","deu5","đều5"]);
      if(hasAny(s,["tuan3lonnhat","tuần3lớnnhất","tuan4lonnhat","tuần4lớnnhất"])&&!equal)
        return fail("Độ lệch cả bốn tuần đều bằng 5; không có tuần duy nhất.","Đọc khoảng cách bằng mắt");
      if(equal&&hasAny(s,["5"]))return {ok:true};
      return fail("Tính |20−25|=|30−35|=|40−35|=|50−45|=5.");
    }
    case "l19a3-step1": {
      const abs=hasAny(s,["85-75=10","tang10","tăng10"]);
      const rel=hasAny(s,["13.3%","13,3%","10/75"]);
      if(hasAny(s,["gapdoi","gấpđôi"])&&!hasAny(s,["khong","không","sai"]))
        return fail("85 không gần gấp đôi 75.","Phóng đại mức tăng");
      if(abs&&rel)return {ok:true};
      if(abs)return fail("Hãy tính thêm 10/75≈13,3%.","Thiếu mức tăng tương đối");
      return fail("85−75=10 và 10/75≈13,3%.");
    }
    case "l19a3-step2": {
      const trunc=hasAny(s,["70-90","batdau70","bắtđầu70","khongbatdautu0","khôngbắtđầutừ0","cattruc","cắttrục"]);
      const effect=hasAny(s,["phongdai","phóngđại","tronglonhon","trônglớnhơn","camgiac","cảmgiác"]);
      const same=hasAny(s,["cungdulieu","cùngdữliệu","dulieukhongdoi","dữliệukhôngđổi"]);
      if(trunc&&effect&&same)return {ok:true};
      if(trunc&&effect)return fail("Hãy nêu dữ liệu không đổi, chỉ cách biểu diễn đổi.","Thiếu đối chiếu dữ liệu");
      return fail("Trục 70–90 làm cùng chênh lệch 10 trông lớn hơn.");
    }
    case "l19a3-step3": {
      const reject=hasAny(s,["sai","khonggan","khônggần","khonggapdoi","khônggấpđôi"]);
      const nums=hasAny(s,["tang10","tăng10"])&&hasAny(s,["13.3%","13,3%"]);
      const scale=hasAny(s,["thangdo","thangđo","70-90","cattruc","cắttrục"]);
      if(reject&&nums&&scale)return {ok:true};
      if(reject&&nums)return fail("Hãy thêm cảnh báo về thang 70–90 bị cắt.","Thiếu graph literacy");
      return fail("Gần gấp đôi là sai; tăng 10≈13,3% và cần lưu ý thang đo.");
    }

    default:
      return null;
  }
}

export function evaluateAdvancedReasoningStep({ step, input, previousAttempts }: { step: ReasoningStepDefinition; input: string; previousAttempts: ReasoningStepAttempt[] }): ReasoningEvaluation {
  if (!input.trim()) return evaluateReasoningStep({ step, input, previousAttempts });
  const verdict = goldenCheck(step.id, input);
  if (!verdict) return evaluateReasoningStep({ step, input, previousAttempts });
  if (verdict.ok) return { isCorrect: true, feedback: `Đúng và đủ ý. ${step.keyIdea}`, hintLevel: 0, shouldRevealExplanation: false };

  const attemptNumber = previousAttempts.length + 1;
  const hintLevel: 1 | 2 | 3 = attemptNumber >= 3 ? 3 : attemptNumber >= 2 ? 2 : 1;
  return {
    isCorrect: false,
    feedback: verdict.feedback ?? "Lập luận của em chưa đủ để kết luận bước này.",
    nextHint: hintLevel === 1 ? step.hint1 : hintLevel === 2 ? step.hint2 : step.explanation,
    hintLevel,
    diagnosis: verdict.diagnosis,
    shouldRevealExplanation: hintLevel === 3,
  };
}
