# CHANGELOG

## v2.4.0-beta.1 – Semester I Mastery & Pilot Analytics
- Thêm `/mastery`: AI Revision Coach dựa trên Student Brain.
- Thêm Readiness Score cho học kỳ I.
- Thêm `/mock-test`: đề mô phỏng học kỳ I từ ngân hàng Adaptive hiện có.
- Lưu lịch sử tối đa 20 Mock Test bằng localStorage.
- Phân tích điểm theo chương và lỗi theo kỹ năng sau khi nộp bài.
- Thêm `/pilot`: Pilot Analytics tổng hợp phiên học, phút học, accuracy, mastery, confidence, active mistakes và Mock Test.
- Bổ sung liên kết Semester Mastery / Mock Test / Pilot Analytics trên thư viện.
- Không thêm package npm mới.
- Giữ nguyên mô hình localStorage; chưa triển khai Multi-Student Cloud trong release này.

## v2.3.3-beta.1 – Full Chapter III: Góc và đường thẳng song song
- Đưa Bài 8–11 của Chương III vào Lesson Library và Lesson Player.
- Bài 8: Góc ở vị trí đặc biệt. Tia phân giác của một góc.
- Bài 9: Hai đường thẳng song song và dấu hiệu nhận biết.
- Bài 10: Tiên đề Euclid. Tính chất của hai đường thẳng song song.
- Bài 11: Định lí và chứng minh định lí.
- Thêm Adaptive Exercise Bank cho Bài 8–11.
- Thêm Reasoning Problem cho Bài 8–11.
- Thêm Academic Chapter III theo Academic Schema v1.0.
- Thêm `/geometry-lab` để trực quan hóa góc đối đỉnh, tia phân giác, góc với hai đường song song và tiên đề Euclid.
- Thư viện được nhóm theo Chương I–III.
- Baseline người dùng gửi thực tế là v2.3.1-beta.1; release này đồng thời đưa foundation Chương II (Bài 5–7) vào Lesson Player, Adaptive Practice và Reasoning để tránh khoảng trống phiên bản.
- Không thêm package npm mới.

## v2.3.1-beta.1 – Knowledge Engine Foundation + Academic Schema
- Thêm Academic Schema v1.0.
- Thêm Academic Source Registry với SGK là PRIMARY, SBT là PRACTICE.
- Thêm Academic Validator bắt buộc nguồn PRIMARY.
- Thêm Academic Repository.
- Thêm foundation học thuật Chương II (Bài 5-7) bám SGK KNTT.
- Thêm Misconception / Hint Ladder / Reasoning / Practice / Assessment / Student Brain / Teacher Tags trong cùng schema.
- Thêm route `/knowledge-engine`.
- Không thay đổi Lesson Player Bài 1-4 ở release foundation này.
- Không thêm package npm mới.

## v2.2.0-beta.1 – Teacher Dashboard & Class Analytics
- Thêm route `/teacher`.
- Thêm Teacher Dashboard với Overview / Students / Skills / Mistakes.
- Thêm Class Analytics Engine tổng hợp Mastery, Confidence, Accuracy và Reasoning.
- Thêm phân loại học sinh: ON_TRACK / WATCH / NEEDS_SUPPORT.
- Thêm Class Mistake Memory và Skill Heatmap.
- Thêm Student Detail Drawer với AI Recommendation.
- Thêm CSV Export không cần package ngoài.
- Thêm nút In / Lưu PDF bằng print dialog của trình duyệt.
- Dữ liệu LIVE lấy Student Brain trên trình duyệt; 5 học sinh còn lại là Demo Class để kiểm thử trước khi có database đa người dùng.
- Không thêm package npm mới.

## v2.1.0-beta.1 – Step-by-Step Solution Analyzer
- Nâng cấp Reasoning Lab thành Step-by-Step Solution Analyzer.
- Thêm First Error Detection.
- Thêm Hint Ladder 3 tầng.
- Thêm Step Map.
- Thêm First Attempt Accuracy, Hint Dependency và Error Recovery.
- Student Brain dùng thêm dữ liệu về mức độc lập và khả năng tự sửa lỗi.
- Thêm route `/reasoning-lab/[lessonId]`, giữ route cũ để tương thích.
- Không thêm package npm mới.

## v2.0.0-beta.1.1 – Hotfix Student Brain Diagnostic Types
- Bổ sung `DiagnosticHistoryEntry` vào `types/student.ts`.
- Bổ sung trường `diagnostics?: DiagnosticHistoryEntry[]` vào `StudentBrainSnapshot`.
- Giữ tương thích ngược với Student Brain đã lưu từ các Beta cũ.
- Chuẩn hóa `diagnostics` về mảng rỗng khi đọc localStorage cũ.
- Sửa 3 lỗi TypeScript chặn `npm run build` trong `diagnostic-student-sync.ts`.
- Không thêm package npm mới.

## v2.0.0-beta.1 – AI Reasoning Engine
- Thêm Reasoning Lab theo từng bài tại `/reasoning/[lessonId]`.
- Thêm Reasoning Problem Bank cho Bài 1–4.
- AI đánh giá từng bước lập luận thay vì chỉ đáp án cuối.
- Hint tăng dần theo số lần thử; sau nhiều lần mới giải thích trực tiếp.
- Phát hiện một số misconception theo pattern: sai dấu, sai quy đồng, sai quy tắc số mũ, chuyển vế không đổi dấu.
- Tính Reasoning Score, Persistence Score và Misconception Count.
- Đồng bộ kết quả Reasoning vào Student Brain, Mistake Memory và Learning History.
- Thêm nút Luyện lập luận trong AI Tutor và màn học.
- Không thêm package npm mới.

## v1.0.0-beta.8 – AI Personal Tutor Conversation
- Thêm route `/tutor/[lessonId]` cho hội thoại gia sư 1:1 theo từng bài.
- Thêm Tutor Conversation Contract và Local Teaching Brain API `/api/tutor`.
- Tutor sử dụng Lesson Definition + Student Brain để cá nhân hóa lời giải thích.
- Lưu lịch sử hội thoại riêng theo từng bài bằng localStorage.
- Thêm Suggested Questions và phản hồi theo intent: giải thích, gợi ý, ví dụ, quy tắc, kiểm tra hiểu bài.
- Thêm nhập giọng nói qua Web Speech API khi trình duyệt hỗ trợ.
- Thêm đọc phản hồi bằng Speech Synthesis.
- Thêm nút `Hỏi AI` tại Library, Lesson Player và Learning Path Dashboard.
- Không thêm package npm mới; không yêu cầu API key trong Beta 1.8.
- API route được tách riêng để Beta sau có thể thay Local Teaching Brain bằng Gemini/OpenAI mà không đổi UI.

## v1.0.0-beta.6 – Chapter 1 Learning Path Dashboard
- Thêm `/progress` với bản đồ tiến độ Chương 1.
- Thêm Chapter Progress Engine.
- Thêm trạng thái LOCKED / AVAILABLE / IN_PROGRESS / NEEDS_REVIEW / COMPLETED.
- Khóa/mở bài theo kết quả Student Brain.
- Hiển thị Accuracy, Confidence, Mastery theo từng bài.
- Thêm AI Recommendation, Review Queue và danh sách kỹ năng yếu.
- Thêm link Tiến độ tại Library và Lesson Player.
- Không thêm package npm mới.

## v1.0.0-beta.5 – Adaptive Exercise Banks & Learning Path
- Thêm Adaptive Exercise Bank cho Bài 2–4.
- AdaptivePractice không còn hard-code bank của Bài 1.
- Thêm Exercise Bank Registry theo lessonId.
- Thêm Learning Path Engine quyết định học tiếp hay ôn lại.
- Thêm nút chuyển trực tiếp sang bài tiếp theo trên màn tổng kết.
- Student Brain ghi nhận kết quả adaptive cho mọi bài trong thư viện.
- Library hiển thị trạng thái Adaptive Ready.
- Không thêm package npm mới.

## v1.0.0-beta.4 – Multi-Lesson Content Library
- Trang chủ chuyển thành thư viện nhiều bài học.
- Thêm Lesson Definition cho Bài 2, Bài 3, Bài 4 của Chương 1.
- Thêm route `/learn/[lessonId]`.
- Authoring Studio hỗ trợ chọn và biên soạn từng bài.
- Draft Authoring được tách riêng theo lessonId.
- Content Repository tiếp tục publish/version/rollback độc lập cho từng bài.
- Bài 2–4 có Teaching Flow hoàn chỉnh; Bài 1 giữ Adaptive Practice.
- Không thêm package npm mới.

## v1.0.0-beta.3 – Content Repository & Publish Flow
- Thêm Content Repository lưu các Lesson version đã publish.
- Thêm Draft → Validate → Publish flow trong Authoring Studio.
- Mỗi lần publish tự tạo version mới và archive version trước.
- Thêm `/content` để quản lý PUBLISHED/ARCHIVED versions.
- Thêm rollback bằng cách kích hoạt lại version cũ.
- Demo học tự đọc phiên bản PUBLISHED từ Content Repository.
- Giữ fallback sang Lesson built-in khi repository chưa có bản publish.
- Không thêm package npm mới.

## v1.0.0-beta.2 – Lesson Authoring Studio
- Thêm `/authoring` để biên soạn Lesson Definition trực tiếp trên trình duyệt.
- Thêm Lesson Validator cho metadata, teaching steps, question structure và thời lượng.
- Thêm JSON Editor + Apply JSON.
- Thêm lưu/khôi phục draft bằng localStorage.
- Thêm xuất lesson thành file JSON.
- Thêm link Authoring Studio trên Demo hiện tại.
- Không thêm package npm mới.

## v1.0.0-beta.1 – AI Teaching Brain
- Thêm Teaching Brain phân loại nguyên nhân sai theo từng lựa chọn ở các checkpoint cốt lõi.
- Thêm chẩn đoán có mức tin cậy LOW/MEDIUM/HIGH; giao diện luôn dùng ngôn ngữ “AI suy đoán”, không khẳng định quá mức.
- Thêm 5 chiến lược can thiệp: kiểm tra lại, gợi ý có mục tiêu, ví dụ đối chiếu, dạy lại từng bước và chuyển tiếp.
- QuestionCard hiển thị “AI Teaching Brain” với nguyên nhân có thể xảy ra và cách dạy tiếp theo.
- SessionAttempt lưu mistakeCategory + diagnosisLabel để Student Brain ghi nhớ lỗi cụ thể thay vì chỉ ghi “sai khái niệm”.
- Màn tổng kết hiển thị các diagnostic insight nổi bật của buổi học.
- Không thêm package mới; giữ tương thích Student Brain, Learning DNA và Adaptive Exercise của Alpha.

## v0.3.0-alpha.5 – Demo Alpha Candidate
- Thêm màn hình bắt đầu buổi học dành cho học sinh.
- Thêm Learning DNA bản đầu từ dữ liệu hành vi học thực tế.
- Lưu Learning DNA bằng localStorage.
- Thêm AI Mentor message ở cuối buổi.
- Thêm phiếu phản hồi Demo 20 giây để lấy ý kiến học sinh.
- Giữ tương thích Student Brain Sync + Adaptive Exercise Engine.

## v0.3.0-alpha.2 — AI Teaching Session
- Thêm Teaching Session Engine.
- Adaptive Feedback 3 tầng khi học sinh trả lời sai.
- Ghi nhận thời gian phản hồi từng lượt.
- Thêm Confidence Score.
- Thêm tổng kết theo kỹ năng.
- Phát hiện điểm mạnh và kỹ năng cần ôn.
- Nâng Session Summary phục vụ Student Brain Sync ở alpha.3.

## v0.2.0-dev – Phase 1.5
- Thêm Student Brain data model.
- Thêm Student Profile.
- Thêm Student Skill Matrix.
- Thêm Mistake Memory.
- Thêm Learning History.
- Thêm Student Brain service.
- Thêm logic xếp hạng kỹ năng cần ưu tiên.
- Thêm đề xuất học tiếp dựa trên kỹ năng yếu và lỗi lặp lại.
- Nâng giao diện từ Knowledge Foundation lên Student Brain Foundation.

## v0.3.0-alpha.4 - Adaptive Exercise Engine
- Thêm Adaptive Exercise Bank cho Bài 1 với 3 mức độ khó.
- Thêm engine xếp hạng kỹ năng cần ưu tiên từ Student Brain + session attempts.
- Thêm logic chọn độ khó khởi điểm.
- Thêm logic tăng/giữ/giảm độ khó theo kết quả, số lần thử và thời gian trả lời.
- Thêm Adaptive Practice 4 câu sau Lesson Core.
- Gộp adaptive attempts vào Teaching Session Summary và Student Brain Sync.
- Thêm Adaptive Exercise Report ở màn hình hoàn thành.
