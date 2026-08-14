import Link from "next/link";

const studentSteps = [
  ["1", "Nhận mã từ giáo viên", "Giáo viên cấp Mã lớp và Mã học sinh riêng cho em."],
  ["2", "Mở đúng hồ sơ", "Nhập hai mã một lần để hệ thống nhận đúng tên và tiến độ của em."],
  ["3", "Học theo gợi ý", "Làm bài học, luyện tập và luyện suy luận theo nhiệm vụ hôm nay."],
  ["4", "Xem tiến bộ", "Theo dõi kết quả và tiếp tục nội dung AI đề xuất."],
];

const teacherSteps = [
  ["1", "Đăng nhập", "Dùng tài khoản giáo viên để vào khu vực quản lý."],
  ["2", "Quản lý học sinh", "Tạo hồ sơ và cấp Mã lớp + Mã học sinh cho từng em."],
  ["3", "Theo dõi và giao bài", "Xem em nào cần hỗ trợ và chọn hoạt động phù hợp."],
  ["4", "Kiểm tra tiến bộ", "Theo dõi mức độ thành thạo, độ chính xác và lỗi cần khắc phục."],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-slate-950 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-600 text-3xl font-black text-white shadow-sm">π</div>
          <div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">AI Math Tutor 7</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Gia sư AI 1:1 · Học đúng nhu cầu · Theo dõi tiến bộ</p>
          </div>
        </header>

        <section className="mt-8 text-center">
          <span className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-indigo-700">Chọn đúng vai trò để bắt đầu</span>
          <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-6xl">Học đơn giản. Quản lý rõ ràng.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">Trang này chỉ là điểm bắt đầu. Học sinh vào bằng mã được giáo viên cấp; giáo viên đăng nhập để quản lý lớp và theo dõi tiến bộ.</p>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <RoleCard
            eyebrow="DÀNH CHO HỌC SINH"
            icon="🎒"
            title="Vào lớp và bắt đầu học"
            description="Em chỉ cần Mã lớp và Mã học sinh do giáo viên cung cấp."
            href="/pilot-onboarding"
            action="Vào học →"
            steps={studentSteps}
            primary
          />
          <RoleCard
            eyebrow="DÀNH CHO GIÁO VIÊN"
            icon="👨‍🏫"
            title="Quản lý lớp học"
            description="Đăng nhập để tạo học sinh, cấp mã, theo dõi và giao hoạt động."
            href="/teacher-login"
            action="Đăng nhập giáo viên →"
            steps={teacherSteps}
          />
        </section>

        <p className="mt-7 text-center text-xs leading-5 text-slate-400">AI Math Tutor 7 · Dữ liệu học tập của mỗi học sinh được quản lý theo hồ sơ riêng.</p>
      </div>
    </main>
  );
}

function RoleCard({ eyebrow, icon, title, description, href, action, steps, primary = false }: {
  eyebrow: string; icon: string; title: string; description: string; href: string; action: string;
  steps: string[][]; primary?: boolean;
}) {
  return (
    <article className={`rounded-[2rem] border bg-white p-6 shadow-sm sm:p-8 ${primary ? "border-indigo-200" : "border-slate-200"}`}>
      <div className="flex items-start gap-4">
        <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl ${primary ? "bg-indigo-600 text-white" : "bg-slate-950 text-white"}`}>{icon}</div>
        <div>
          <p className={`text-xs font-black tracking-[0.14em] ${primary ? "text-indigo-600" : "text-slate-500"}`}>{eyebrow}</p>
          <h3 className="mt-2 text-2xl font-black">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {steps.map(([number, stepTitle, text]) => (
          <div key={number} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black ${primary ? "bg-indigo-600 text-white" : "bg-slate-900 text-white"}`}>{number}</span>
            <div><p className="text-sm font-black">{stepTitle}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div>
          </div>
        ))}
      </div>
      <Link href={href} className={`mt-6 block rounded-2xl px-5 py-4 text-center text-sm font-black text-white shadow-sm ${primary ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-950 hover:bg-slate-800"}`}>{action}</Link>
    </article>
  );
}
