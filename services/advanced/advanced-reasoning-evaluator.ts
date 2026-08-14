import type { ReasoningEvaluation, ReasoningStepAttempt, ReasoningStepDefinition } from "@/types/reasoning";
import { evaluateReasoningStep } from "@/services/reasoning/reasoning-engine";

type Verdict = { ok: boolean; feedback?: string; diagnosis?: string };

function compact(raw: string): string {
  return raw
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
