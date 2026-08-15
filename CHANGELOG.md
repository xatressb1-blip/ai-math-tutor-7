# CHANGELOG

## v2.8.3-beta.10.1 FIX14.1 – Full Advanced Quality Hardening
- Sửa P0 Bài 8: chuẩn hóa chuỗi góc trong chứng minh hai phân giác của hai góc đối đỉnh.
- Chuẩn hóa Unicode toán học `² → ^2`, `³ → ^3` trong reasoning evaluator.
- Tăng direct adversarial coverage lên 99/99 reasoning step; giữ các semantic adversarial test chuyên biệt.
- Harden evaluator Bài 8 và Bài 11 chống scaffold cũ, converse error và keyword false PASS.
- Không thay đổi CORE Mastery; skill nâng cao tiếp tục `ADVANCED_ONLY`.


## v2.8.3-beta.10 FIX14 – Advanced Math Lesson 11
- Proof integrity: GIVEN/GOAL, proof map, circular reasoning, converse error.
- Thêm 3 canonical skill ADVANCED_ONLY, Golden evaluator và adversarial QA.


## v2.8.3-beta.9 FIX13 – Advanced Math Lesson 10
- Bổ sung Toán nâng cao Bài 10: Tiên đề Euclid. Tính chất của hai đường thẳng song song.
- Nâng cao 1: dùng tính duy nhất trong tiên đề Euclid để chứng minh hai đường qua cùng điểm và cùng song song với đường đã cho phải trùng nhau.
- Nâng cao 2: khóa chiều suy luận Bài 10 là song song → quan hệ góc; không dùng dấu hiệu nhận biết Bài 9 để chứng minh lại GIVEN.
- Thử thách: chứng minh một đường vuông góc với một trong hai đường song song thì cũng vuông góc với đường còn lại qua quan hệ góc 90°.
- Thêm Golden evaluator và adversarial QA riêng cho Bài 10.
- Thêm 3 canonical skill ADVANCED_ONLY; không làm tăng CORE Mastery.
- Cập nhật Reasoning Diversity Matrix cho reasoning P0 của Bài 10.


## v2.8.3-beta.8 FIX12 – Advanced Math Lesson 9
- Bổ sung Toán nâng cao Bài 9: Hai đường thẳng song song và dấu hiệu nhận biết.
- Nâng cao 1: chặn suy luận “hai góc bằng nhau → song song” khi thiếu đúng loại góc và cùng đường cắt.
- Nâng cao 2: phân biệt tính chất song song với dấu hiệu nhận biết, kiểm soát chiều thuận/đảo.
- Thử thách: chứng minh song song nhiều bước qua góc kề bù 115° và cặp góc đồng vị 65°.
- Thêm Golden evaluator và adversarial QA riêng cho Bài 9.
- Thêm 3 canonical skill ADVANCED_ONLY; không làm tăng CORE Mastery.
- Cập nhật Reasoning Diversity Matrix cho reasoning song song P0.


## v2.8.3-beta.7 FIX11 – Advanced Math Lesson 8
- Bổ sung Toán nâng cao Bài 8: Góc ở vị trí đặc biệt. Tia phân giác của một góc.
- Nâng cao 1: phản biện việc suy ra góc kề bù chỉ từ tổng 180°, bắt buộc kiểm tra cấu trúc cạnh.
- Nâng cao 2: chứng minh tổng quát hai tia phân giác của hai góc kề bù vuông góc.
- Thử thách: suy luận quan hệ hai tia phân giác của hai góc đối đỉnh, không dựa vào hình vẽ.
- Thêm Golden evaluator và adversarial QA riêng cho Bài 8.
- Thêm 3 canonical skill ADVANCED_ONLY; không làm tăng CORE Mastery.
- Cập nhật Reasoning Diversity Matrix với reasoning hình học và chống visual overclaim.


## v2.8.3-beta.6 FIX10 – Advanced Math Lesson 7
- Bổ sung Toán nâng cao Bài 7: Tập hợp các số thực.
- Nâng cao 1: suy luận số đối của biểu thức 3-√2 bằng định nghĩa tổng bằng 0.
- Nâng cao 2: định vị √2 trên trục số và so sánh với 1,42 bằng bình phương, không dùng máy tính căn.
- Thử thách: mô hình hóa khoảng cách |x-√2|=1, bắt buộc tìm đủ hai vị trí trên trục số.
- Thêm Golden evaluator và adversarial QA riêng cho Bài 7.
- Thêm 3 canonical skill ADVANCED_ONLY; không làm tăng CORE Mastery.
- Cập nhật Advanced Reasoning Diversity Matrix cho Bài 7.


## v2.8.3-beta.5 FIX9 – Advanced Math Lesson 6
- Bổ sung Toán nâng cao Bài 6: Số vô tỉ. Căn bậc hai số học.
- Nâng cao 1: ước lượng √10 bằng chặn trên/chặn dưới và mốc làm tròn, không dùng máy tính.
- Nâng cao 2: phân biệt √49=7 với phương trình x²=49 có hai nghiệm ±7.
- Thử thách: mô hình hóa khu vườn hình vuông diện tích 30 m², ước lượng cạnh và chu vi.
- Thêm Golden evaluator và adversarial QA riêng cho Bài 6.
- Cập nhật Reasoning Diversity Matrix với ước lượng, định nghĩa và mô hình hóa hình học.
- Thêm 3 canonical skill ADVANCED_ONLY; không ảnh hưởng CORE Mastery.


## v2.8.3-beta.4 FIX8 – Advanced Math Lesson 5
- Bổ sung Toán nâng cao Bài 5: Làm quen với số thập phân vô hạn tuần hoàn.
- Nâng cao 1: phân tích cấu trúc phần không lặp và chu kì; tránh nhận chu kì giả.
- Nâng cao 2: dùng phản ví dụ để bác bỏ mệnh đề “mọi số thập phân vô hạn đều tuần hoàn”.
- Thử thách: mô hình hóa làm tròn theo độ chính xác và kiểm chứng bằng sai số tuyệt đối.
- Thêm Golden evaluator và adversarial QA riêng cho Bài 5.
- Cập nhật Reasoning Diversity Matrix để Bài 5 không lặp mô-típ Bài 2/Bài 4.
- Thêm 3 canonical skill ADVANCED_ONLY; không ảnh hưởng CORE Mastery.


## v2.8.3-beta.3 FIX7.1 – Advanced Math Quality Hardening
- Harden Golden evaluator against fraction substring false positives and keyword stuffing.
- Require verified transformation chains in selected high-risk steps instead of loose token presence.
- Add adversarial Advanced Math QA covering contradictory claims, answer-only responses, wrong equalities and substring traps.
- Add teacher-only `/advanced-quality` dashboard.
- Add Reasoning Diversity Matrix and three-gate quality rubric: Mathematical Correctness, Reasoning Integrity, Pedagogical Diversity.
- No new Advanced lesson added; scope is quality hardening only.


## v2.8.3-beta.3 FIX7 – Advanced Math Lesson 4
- Bổ sung Toán nâng cao Bài 4: thứ tự thực hiện phép tính và quy tắc chuyển vế.
- Nâng cao 1: xử lí biểu thức nhiều tầng ngoặc và đánh giá chiến lược tính.
- Nâng cao 2: phân tích lỗi chuyển vế không đổi dấu.
- Thử thách: phối hợp rút gọn số hạng, chuyển vế và kiểm chứng nghiệm.
- Thêm Golden evaluator riêng cho các bước Bài 4.
- Thêm 3 canonical skill ADVANCED_ONLY; không ảnh hưởng CORE Mastery.


## v2.8.3-beta.3 FIX6 – Advanced Math Lesson 3
- Bổ sung Toán nâng cao Bài 3: Lũy thừa với số mũ tự nhiên của một số hữu tỉ.
- Nâng cao 1: chiến lược rút gọn biểu thức lũy thừa thay vì khai triển dài.
- Nâng cao 2: phân tích lỗi nhầm cộng số mũ với nhân số mũ.
- Thử thách: bài toán ngược tìm số mũ và bắt buộc kiểm chứng.
- Thêm Golden evaluator riêng cho các bước Bài 3.
- Thêm 3 canonical skill ADVANCED_ONLY; không ảnh hưởng CORE Mastery.


## v2.8.3-beta.3 FIX5 – Advanced Math Lesson 2
- Mở Toán nâng cao cho Bài 2: Cộng, trừ, nhân, chia số hữu tỉ.
- Thêm ba tầng: chiến lược tính hợp lí, phân tích lỗi lời giải, bài toán ngược có kiểm chứng.
- Thêm Golden reasoning checks: đúng đáp số nhưng thiếu chiến lược/lập luận/kiểm chứng chưa được PASS.
- Thêm 3 canonical skills L02_ADV_* ở tier ADVANCED_ONLY để bảo vệ CORE Mastery.


## v2.8.3-beta.3 FIX3 – Learning Companion & Advanced Math Lesson 1
- Sửa các nút “Bắt đầu” trong Mastery để mở đúng bài học thay vì quay về Home.
- Việt hóa thêm trang Mastery và lý do đề xuất ôn tập.
- Thêm route `/advanced/[lessonId]` và Toán nâng cao cho Bài 1.
- Bài nâng cao có 3 mức: Vận dụng, Suy luận, Thử thách; bắt buộc học sinh trình bày cách suy nghĩ.
- Thêm 3 canonical skill `ADVANCED_ONLY` cho Bài 1 để tách nâng cao khỏi CORE mastery.
- Gắn `source: REASONING` cho phiên suy luận để không làm tăng curriculum coverage.
- Bổ sung tài liệu chiến lược nguồn cho kho Toán nâng cao lớp 7.


## v2.8.3-beta.3 FIX2 – Multi-Class Roster & Simple Student Login
- Hiển thị toàn bộ lớp đã tạo và cho phép chọn lớp để xem đúng danh sách học sinh.
- Bấm học sinh để xem hồ sơ chi tiết, kỹ năng yếu, lỗi cần khắc phục và phiên học gần nhất.
- Thêm xóa lớp có xác nhận; xóa học sinh vẫn giữ xác nhận an toàn.
- Học sinh chọn lớp từ danh sách và chỉ nhập mã HS0–HS9.
- Cho phép mã lớp ngắn như 7A, 7B, 7C trong Cloud API.
- Cấp mã HSx trên thiết bị ngay khi tạo học sinh; trạng thái đồng bộ đăng nhập được hiển thị riêng.


## v2.8.3-beta.3 – Teacher Guided Workflow & Vietnamese UX
- Biến Bảng điều khiển giáo viên thành quy trình 4 bước có liên kết thật: Tạo lớp & học sinh → Theo dõi → Chọn hoạt động → Kiểm tra tiến bộ.
- Bảng điều khiển giáo viên dùng dữ liệu roster thật thay vì trộn dữ liệu demo.
- Thêm cấu hình lớp cục bộ và sinh Mã lớp dễ đọc.
- Khi thêm học sinh, hệ thống có thể cấp Mã học sinh trực tuyến ngay bằng phiên đăng nhập giáo viên; không cần nhập khóa kỹ thuật lần hai.
- Trang Quản lý học sinh có hướng dẫn thao tác, sao chép mã, xem tiến độ, chọn hoạt động và xóa học sinh có xác nhận.
- Thêm `/teacher-progress` để xem tiến độ từng học sinh: thành thạo, chính xác, thời gian học, lỗi, kỹ năng yếu và lịch sử phiên học.
- Trang Theo dõi học sinh có hướng dẫn và nút Xem tiến độ trên từng dòng.
- Việt hóa thêm báo cáo CSV và khu vực quản lý mã học sinh.
- Xóa file rác `tatus --short` khỏi gói phát hành.
- Không thay đổi mastery engine, canonical skill, diagnostic/reasoning logic hoặc Supabase schema.


## v2.8.3-beta.2 – Student Access & Role Separation
- Tối giản Home thành hai vai trò Học sinh / Giáo viên.
- Học sinh vào bằng Mã lớp + Mã học sinh.
- Giáo viên đăng nhập bằng tài khoản trước khi vào khu vực quản lý.
- Tách thư viện bài học sang `/library`.
- Không thay đổi engine học tập hoặc Supabase schema.


## v2.8.3-beta.1 – Vietnamese UX & Guided Workflow
- Tách rõ điểm bắt đầu dành cho học sinh và giáo viên ngay tại trang chính.
- Trang học sinh có khu vực “Bắt đầu từ đây” theo 4 bước: hồ sơ → đánh giá đầu vào → học/luyện → xem tiến độ.
- Bảng điều khiển giáo viên có quy trình 4 công việc: chọn học sinh → ưu tiên hỗ trợ → giao hoạt động → kiểm tra tiến bộ.
- Nâng cấp danh sách học sinh: nhấn mạnh hồ sơ đang học và cảnh báo chọn đúng học sinh trước mỗi phiên.
- Việt hóa các thuật ngữ người dùng: Student Brain, Mastery, Confidence, Accuracy, Reasoning, Pilot, Cloud và nhiều nhãn kỹ thuật.
- Sửa trang thư viện từ thông tin cũ 11 bài/3 chương thành 19 bài/5 chương học kỳ I.
- Tách công cụ học sinh với khu vực giáo viên/quản trị để giảm nhầm thao tác.
- Không thay đổi thuật toán mastery, canonical skill, Student Brain evidence hoặc Supabase schema.


## v2.8.2-beta.5 – Semester Canonical Coverage & RC Gate
- Hoàn thiện Canonical Skill Registry cho đủ Bài 1–19.
- Map toàn bộ skill hiện có trong Lesson/Adaptive/Reasoning/Diagnostic sang canonical identity có chủ đích.
- Loại bỏ fallback LEGACY_* ngoài ý muốn cho curriculum hiện tại.
- Semester curriculum coverage chỉ tính session LESSON/ADAPTIVE/LEGACY được phép, không tính REASONING/DIAGNOSTIC.
- Verified mastery denominator dùng CORE canonical skills toàn học kỳ.
- Mở rộng /pilot-readiness thành RC-grade semester invariants.
- Không thay đổi Supabase schema.


## v2.8.2-beta.4 – Wave 4: Skill Identity, Progress & Multi-Student Integrity
- Thêm Canonical Skill Registry và canonicalSkillId để evidence không phụ thuộc display string.
- Hợp nhất các alias quan trọng Bài 8–14 và Bài 16–19; sửa phân mảnh do dấu chấm.
- Thêm compatibility bridge giữa single Student Brain và multi-student workspace.
- Đổi active student đồng bộ ngay brain tương ứng; save legacy brain cập nhật active workspace brain.
- LearningSession có source; Reasoning-only không còn được dùng để hoàn thành Lesson Core.
- Semester Readiness thêm curriculum coverage, verified mastery coverage và misconception penalty.
- Thêm /pilot-readiness QA cho các invariant Wave 4.
- Không thay đổi Supabase schema.

## v2.8.2-beta.3 – Wave 3: Diagnostic Accuracy & Student Brain Mastery Integrity
- Thêm evidence gate tập trung cho Student Brain: Diagnostic / Lesson Core / Adaptive / Reasoning / Legacy.
- Diagnostic-only bị cap mastery 72; một nguồn non-diagnostic bị cap 84.
- Chỉ MASTERED khi có ít nhất 2 nguồn evidence, >=4 evidence đúng và >=2 lần đúng độc lập lần đầu.
- Lesson Core và Adaptive ghi provenance vào từng SessionAttempt.
- Reasoning đồng bộ evidence theo bước đúng, first-try và misconception.
- Diagnostic không còn có thể tạo false mastery từ một câu đúng; câu sai tạo MistakeRecord có category/label.
- Diagnostic Bài 1 bỏ √2/π/√3 khỏi câu nhận biết hữu tỉ trước Chương II.
- Diagnostic strong skill cần tối thiểu 2 mẫu thay vì một câu đúng đơn lẻ.
- Learning Path yêu cầu ít nhất 2 câu đúng và ít nhất 1 câu đúng lần đầu trước khi ADVANCE.
- Session Strength cần ít nhất 2 câu đúng độc lập, tránh false strength.
- Thêm /mastery-integrity để QA trực tiếp các kịch bản false mastery.
- Không thay đổi Supabase schema hoặc Cloud Pilot.

## v2.8.2-beta.2 – Wave 2: Reasoning Integrity & Coverage Depth
- Bài 8: kiểm tra cấu trúc kề bù, đối đỉnh và đủ điều kiện tia phân giác.
- Bài 9: khóa chiều suy luận dấu hiệu góc → song song; chặn hai góc bằng nhau bất kì.
- Bài 10: tách rõ tính chất song song → góc khỏi dấu hiệu của Bài 9.
- Bài 11: thêm GIVEN → GOAL → JUSTIFICATION → CONCLUSION; phát hiện circular reasoning và lỗi đảo mệnh đề.
- Bài 12–14: tăng Reasoning coverage, góc ngoài, correspondence c.c.c, điều kiện c.g.c và g.c.g.
- Reasoning Engine hỗ trợ requiredPatternGroups để một bước chỉ PASS khi đủ nhiều ý bắt buộc.
- Knowledge QA yêu cầu tối thiểu 2 Reasoning problems cho Bài 8–14.
- Không thay đổi Supabase schema, Cloud Pilot hoặc Student Identity.

## v2.8.2-beta.1 – Wave 1: Correctness & False Mastery
- Thay generic mastery checkpoint Bài 12–19 bằng checkpoint Toán theo từng bài.
- Sửa lỗi kiến thức P0 Bài 16: định lí đảo tam giác cân.
- Bổ sung tam giác đều và hai chiều của tính chất đường trung trực.
- Bài 15 bao phủ các trường hợp bằng nhau của tam giác vuông theo SGK.
- Bài 7 bổ sung số đối, trục số thực, so sánh và atomic skill mapping.
- Bài 4 loại scope creep phương trình tuyến tính khỏi CORE/Adaptive/Reasoning/Diagnostic.
- Bài 1 loại √2/π khỏi checkpoint trước Chương II và bổ sung so sánh số hữu tỉ.
- Knowledge QA không coi generic meta-question là Student Brain mastery evidence.
- Không thay đổi Supabase schema hoặc Cloud Pilot.

## v2.8.1-beta.1 – Knowledge QA & Lesson Mapping Audit
- Audit toàn bộ 19 bài từ Academic Knowledge Base sang luồng học thật.
- Phát hiện và sửa khoảng trống Bài 12–19: trước đây có Academic KB nhưng chưa có Lesson Player runtime.
- Thêm Academic Lesson Adapter để đưa Bài 12–19 vào `/learn`, `/tutor`, Student Brain.
- Thêm Adaptive Practice bank cho Bài 12–19.
- Thêm Reasoning Lab problem cho Bài 12–19.
- AI Tutor tự hoạt động cho Bài 12–19 qua Lesson Repository.
- Student Brain nhận skills/mistakes/sessions qua checkpoint questions của Bài 12–19.
- Thêm `/knowledge-qa` với ma trận PASS/WARN/FAIL cho 19 bài.
- Giữ nguyên nguồn chuẩn: SGK PRIMARY; SBT PRACTICE; tài liệu học tập ENRICHMENT; chuyên đề ADVANCED_ONLY.
- Không thay đổi Supabase schema hoặc Cloud API.

## v2.8.0-beta.1 – Full Semester Knowledge Base Sync
- Đồng bộ Knowledge Engine đủ 5 chương, 19 bài của SGK Toán 7 Tập 1 KNTT.
- Thêm 2 hoạt động thực hành trải nghiệm theo SGK.
- SGK được khóa vai trò PRIMARY; SBT = PRACTICE; tài liệu học tập = ENRICHMENT; chuyên đề nâng cao = ADVANCED_ONLY.
- Thêm AcademicEnrichment với gate ALWAYS / AFTER_FOUNDATION / AFTER_MASTERY.
- Validator chặn nội dung ADVANCED nếu không khóa AFTER_MASTERY.
- Mỗi bài có objectives, concepts, vocabulary, teaching script, examples, mistake library, hint ladder, reasoning, practice blueprint, assessment, Student Brain mapping và Teacher tags.
- Knowledge Engine Dashboard nâng cấp để hiển thị Full Semester KB.
- Không thay đổi Supabase schema, Cloud API, Student Brain schema hoặc Pilot Production logic.

## v2.7.1-beta.1 – Vietnamese Student UX & Navigation Cleanup
- Việt hóa khu vực điều hướng chính dành cho học sinh.
- Thiết kế lại trang chủ theo bố cục: Học Toán 7 → Học tập → Tài khoản học tập → Công cụ giáo viên.
- Gom toàn bộ chức năng giáo viên vào khu vực thu gọn mặc định.
- Loại bỏ các thuật ngữ kỹ thuật khỏi vùng điều hướng học sinh khi có thể.
- Đổi Geometry Lab → Phòng học Hình học; Mock Test → Thi thử; Semester Mastery → Mức độ thành thạo.
- Đổi Student Cloud → Đồng bộ bài học; Pilot Onboarding → Bắt đầu học.
- Loại các badge kỹ thuật khỏi vùng nổi bật của học sinh; version chuyển xuống footer.
- Ẩn nút Biên soạn khỏi thẻ bài học dành cho học sinh.
- Chuẩn hóa typography bằng font sans-serif dễ đọc tiếng Việt, không thêm font/package bên ngoài.
- Không thay đổi Student Brain, Supabase schema, Cloud API, Safe Sync hoặc conflict protection.

## v2.7.0-beta.1 – Real 10-Student Pilot Operations
- Thêm `/pilot-onboarding`: onboarding học sinh bằng Mã lớp + Mã HS, Pull Student Brain ngay từ đầu.
- Thêm `/pilot-ops`: Teacher Pilot Control Center.
- Theo dõi số HS, sync hôm nay, HS quá 24h, HS cần chú ý, mastery/accuracy lớp.
- Cảnh báo vận hành dựa trên stale sync, chưa có session, mastery thấp và lỗi chưa xử lý.
- Export CSV summary cho giáo viên.
- Backup JSON toàn bộ Cloud Student Brain của lớp Pilot.
- Checklist Trước / Trong / Sau buổi Pilot lưu bằng localStorage.
- Giữ nguyên schema Supabase và cơ chế Safe Cloud Sync của v2.6.3.
- Không thêm package npm mới.

## v2.6.3-beta.1 – 10-Student Pilot Management & Production Hardening
- Giới hạn server-side tối đa 10 học sinh cho mỗi lớp Pilot.
- Thêm Safe Push: thiết bị bắt buộc Pull trước khi Push.
- Thêm optimistic concurrency bằng `baseUpdatedAt`; chặn ghi đè nếu Cloud mới hơn.
- Thêm thông báo conflict rõ ràng trên `/cloud-sync`.
- Thêm cấp lại Mã HS phía server; mã cũ mất hiệu lực ngay.
- Thêm thu hồi hồ sơ Cloud từ Teacher Cloud.
- Thêm trạng thái freshness theo thời điểm đồng bộ.
- Mã HS đầy đủ chỉ hiển thị trong phiên cấp mã; Cloud chỉ giữ hash + 4 ký tự cuối.
- Sửa label giao diện Pilot sang Beta 2.6.3.
- Không thay schema Supabase và không thêm package npm mới.

## v2.6.2-beta.1 – Supabase Pilot Cloud Activation
- Thêm `/cloud-activation` health dashboard cho env, Data API và schema.
- Mã học sinh được hash SHA-256 trước khi lưu Supabase; không lưu mã rõ trong schema mới.
- Teacher Cloud có nút kích hoạt toàn bộ Pilot.
- Student Cloud Sync ghi nhận lần đồng bộ gần nhất.
- API validate class/access code, giới hạn kích thước Student Brain và so sánh Teacher Key constant-time.
- Thêm migration SQL từ schema v2.6.1.
- Không thêm package npm mới.

## v2.6.1-beta.1 – Cloud Pilot Data & Student Identity
- Thêm Next.js API route `/api/pilot-cloud` làm lớp server bảo vệ Supabase Secret key.
- Hỗ trợ Supabase REST không cần thêm package npm.
- Thêm `/cloud-sync`: học sinh liên kết bằng Mã lớp + Mã học sinh, tải/gửi Student Brain giữa các thiết bị.
- Thêm `/teacher-cloud`: giáo viên đưa hồ sơ trong Pilot Roster lên Cloud, cấp mã học sinh riêng và xem danh sách Cloud.
- Thêm SQL schema `docs/cloud/supabase-pilot-schema.sql`.
- Thêm `.env.example` cho `SUPABASE_URL`, `SUPABASE_SECRET_KEY` và `PILOT_TEACHER_KEY`.
- Giữ localStorage làm fallback; Cloud chưa cấu hình thì toàn bộ luồng cũ vẫn chạy.
- Không thêm package npm mới.

## v2.6.0-beta.1 – Multi-Student Pilot & Cloud Data Foundation
- Thêm MultiStudentWorkspace schema v1, tách dữ liệu theo studentId.
- Tự migrate Student Brain local hiện tại thành học sinh đầu tiên trong Pilot Workspace.
- Thêm `/pilot-roster`: tạo/chọn tối đa 10 hồ sơ học sinh Pilot.
- Thêm `/teacher-multi`: Class Analytics Foundation cho nhiều hồ sơ.
- Thêm StudentDataProvider và CloudStudentRepository contract để chuẩn bị adapter database.
- Giữ localStorage làm provider mặc định; chưa gửi dữ liệu học sinh lên cloud.
- Không thêm package npm mới.

## v2.5.0-beta.1 – Pilot Student Experience
- `/student`: Student Home 2.0 + Personalized Daily Mission.
- Learning Streak nhẹ: active days/current streak.
- `/reflection`: End-of-session Reflection.
- `/pilot-feedback`: Dễ hiểu / Khó hiểu / AI giúp ích / Cần cải thiện.
- `/teacher-pilot`: Teacher Pilot View.
- Mobile-first cho các màn hình Pilot mới.
- Giữ localStorage; chưa triển khai Multi-Student Cloud.
- Không thêm package npm mới.

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
