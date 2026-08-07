# Phase 1.4 – Knowledge Foundation

Mục tiêu:
- Tạo kiểu dữ liệu chuẩn cho Knowledge Engine.
- Đăng ký 3 nguồn tài liệu hiện có.
- Tạo dữ liệu mẫu đã chuẩn hóa cho Chương I: Số hữu tỉ.
- Tạo repository để giao diện và AI Engine sau này truy cập dữ liệu qua một lớp trung gian.
- Hiển thị Knowledge Map trực tiếp trên trang chủ.

## File cần chép

Từ ZIP, chép các thư mục/file sau vào project:

types/knowledge.ts
data/knowledge/sources.ts
data/knowledge/chapter-1.ts
services/knowledge/knowledge-repository.ts
app/page.tsx
docs/PHASE-1.4.md

Giữ nguyên:
app/globals.css
app/layout.tsx
và toàn bộ file khác của project.

## Kiểm thử

1. Chạy:
npm run dev

2. Mở:
http://localhost:3000

3. Kiểm tra có:
- Badge Phase 1.4.
- Khối "Bộ não kiến thức đã khởi tạo".
- 1 chương.
- 4 bài học.
- Danh sách Knowledge Map của Chương I.
- 3 nguồn tài liệu.

4. Dừng server:
Ctrl + C

5. Chạy:
npm run build

Phase 1.4 chỉ hoàn thành khi build thành công.
