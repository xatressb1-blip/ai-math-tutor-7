# Phase 1.5 – Student Brain Foundation

## Mục tiêu
Phase này tạo bộ nhớ học tập nền tảng cho từng học sinh, gồm:
- Student Profile
- Student Skill Matrix
- Mistake Memory
- Learning History
- Priority Queue
- Recommendation Engine đơn giản

Dữ liệu hiện tại là DEMO DATA trong bộ nhớ tĩnh. Chưa dùng database.
Mục tiêu của Phase 1.5 là kiểm chứng mô hình dữ liệu và luồng chẩn đoán trước khi kết nối database ở Phase sau.

## File cần chép
Giải nén ZIP và chép toàn bộ nội dung vào thư mục gốc project:

C:\AI_Project\ai-math-tutor-7

Các file mới/thay:
- types/knowledge.ts
- types/student.ts
- data/knowledge/sources.ts
- data/knowledge/chapter-1.ts
- data/student/demo-student.ts
- services/knowledge/knowledge-repository.ts
- services/student/student-brain-service.ts
- app/page.tsx
- docs/phases/PHASE-1.5.md

Không xóa các file khác trong project.

## Kiểm thử DEV
Chạy:
npm run dev

Mở:
http://localhost:3000

Cần thấy:
1. Badge Phase 1.5 / Student Brain.
2. Hồ sơ "Học sinh Demo".
3. Student Skill Matrix với 4 kỹ năng.
4. Mistake Memory có 2 lỗi.
5. Learning History có 2 buổi.
6. Priority Queue sắp kỹ năng yếu nhất lên đầu.
7. Knowledge Engine vẫn còn hoạt động.

## Kiểm thử BUILD
Dừng dev server bằng Ctrl+C rồi chạy:
npm run build

Phase 1.5 chỉ hoàn thành khi build thành công.

## Lưu ý kỹ thuật
- Chưa có đăng nhập.
- Chưa có database.
- Chưa gọi AI API.
- Chưa lưu dữ liệu thật giữa các phiên.
Đây là chủ đích: Phase 1.5 chỉ khóa mô hình Student Brain trước khi nối persistence và AI Tutor.
