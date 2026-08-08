# AI Math Tutor 1:1 – Toán lớp 7

**Current release:** v1.0.0-beta.1 – AI Teaching Brain

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Current Demo Release
`v0.3.0-alpha.5` adds an Adaptive Exercise Engine after the core lesson. It selects focus skills and difficulty from Student Brain plus current-session performance, then syncs adaptive results back into learner memory.


## Beta 1.2 – Lesson Authoring Studio

- Demo học: `http://localhost:3000`
- Biên soạn bài: `http://localhost:3000/authoring`

Studio hỗ trợ sửa Lesson Definition, kiểm tra cấu trúc, lưu draft trong trình duyệt và xuất JSON để kiểm duyệt/publish.


## Beta 1.3 – Content Repository & Publish Flow

- Demo học: `http://localhost:3000`
- Authoring Studio: `http://localhost:3000/authoring`
- Content Repository: `http://localhost:3000/content`

Workflow: chỉnh Draft → Validate → Publish → tạo version → Demo đọc bản PUBLISHED. Có thể rollback về version cũ trong Content Repository.


## Beta 1.4 – Multi-Lesson Content Library

Trang chủ giờ là thư viện Chương 1 với 4 bài học.

- Library: `http://localhost:3000`
- Learn: `/learn/lesson-player-01` ... `/learn/lesson-player-04`
- Authoring: `/authoring?lesson=lesson-player-02`
- Content Repository: `/content`

Bài 1 giữ Adaptive Practice hiện tại; Bài 2–4 dùng Teaching Flow và có thể author/publish/version độc lập.


## Beta 1.5 – Adaptive Exercise Banks & Learning Path

Bài 1–4 đều có Adaptive Exercise Bank. Sau mỗi buổi học, Learning Path Engine dùng Score, Confidence và reviewSkills để quyết định học tiếp bài kế tiếp hay ôn lại bài hiện tại.


## Beta 1.6 – Chapter 1 Learning Path Dashboard

Mở `http://localhost:3000/progress` để xem bản đồ tiến độ Bài 1–4. Dashboard đọc Student Brain từ localStorage, hiển thị Accuracy / Confidence / Mastery và khóa hoặc mở bài tiếp theo theo dữ liệu học tập.


## Beta 1.8 – AI Personal Tutor Conversation

Mỗi bài có route `/tutor/[lessonId]`. Tutor dùng Lesson Definition và Student Brain để giải thích/gợi ý theo ngữ cảnh. Beta 1.8 chạy bằng Local Teaching Brain, không cần API key; `/api/tutor` là boundary để tích hợp cloud LLM ở release sau.


## Beta 2.1 – Step-by-Step Solution Analyzer

Reasoning Lab được nâng cấp với First Error Detection, Hint Ladder 3 tầng, Step Map và các chỉ số First Attempt Accuracy / Hint Dependency / Error Recovery.

Route chính:
`/reasoning-lab/lesson-player-01` ... `/reasoning-lab/lesson-player-04`


## Beta 2.2 – Teacher Dashboard & Class Analytics

Mở `http://localhost:3000/teacher` để xem Class Analytics. Dashboard hiện dùng một Student Brain LIVE từ localStorage và 5 hồ sơ Demo Class, nhằm kiểm thử trải nghiệm giáo viên trước khi chuyển sang database đa người dùng.

Có CSV Export và In / Lưu PDF bằng trình duyệt, không cần package ngoài.


## Beta 2.3.1 – Knowledge Engine Foundation

Mở `http://localhost:3000/knowledge-engine` để xem Academic Schema v1.0 và foundation Chương II. SGK là nguồn PRIMARY bắt buộc; SBT và tài liệu khác được phân vai rõ ràng.


## Beta 2.3.3 – Full Chapter III

Release này đưa Chương III vào trải nghiệm học sinh với Bài 8–11, Adaptive Practice,
Reasoning Lab và Geometry Concept Lab tại `/geometry-lab`.

Do ZIP baseline được cung cấp vẫn mang version `2.3.1-beta.1`, release này cũng kích hoạt
Bài 5–7 của Chương II trong Lesson Player để thư viện liên tục từ Bài 1 đến Bài 11.


## Beta 2.4.0 – Semester I Mastery & Pilot Analytics

- `/mastery`: kế hoạch ôn cá nhân hóa.
- `/mock-test`: đề mô phỏng học kỳ I.
- `/pilot`: dashboard dữ liệu Pilot localStorage.


## Beta 2.5.0 – Pilot Student Experience

- `/student`: Student Home + Daily Mission + Streak.
- `/reflection`: phản hồi cuối phiên.
- `/pilot-feedback`: phản hồi Pilot.
- `/teacher-pilot`: tín hiệu dành cho giáo viên.


## Beta 2.6.0 – Multi-Student Pilot Foundation

- `/pilot-roster`: roster tối đa 10 hồ sơ Pilot.
- `/teacher-multi`: Class Analytics nhiều học sinh.
- Cloud-ready repository contract; provider hiện tại vẫn là localStorage.


## Beta 2.6.1 – Cloud Pilot Data & Student Identity

- `/cloud-sync`: Student identity bằng Mã lớp + Mã học sinh.
- `/teacher-cloud`: tạo/cập nhật hồ sơ Pilot trên Supabase.
- `/api/pilot-cloud`: server-side gateway, không để Secret key trong browser.
- `docs/cloud/supabase-pilot-schema.sql`: schema tạo bảng Cloud.
- Local mode vẫn hoạt động nếu chưa cấu hình Cloud.
