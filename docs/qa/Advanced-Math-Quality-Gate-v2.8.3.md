# Advanced Math Quality Gate – v2.8.3

## Mục tiêu
Không mở rộng Toán nâng cao chỉ vì bài toán đúng đáp số. Mỗi bài mới phải vượt ba cổng:

1. **Mathematical Correctness**
2. **Reasoning Integrity**
3. **Pedagogical Diversity**

## Rubric bắt buộc cho từng bước
Tùy loại bài, evaluator phải yêu cầu một hoặc nhiều thành phần:

- **Kết quả**: giá trị/kết luận toán học đúng.
- **Biến đổi**: phép biến đổi trung gian đúng, không nhảy bước quan trọng.
- **Lý do**: nêu đúng quy tắc/định lí/điều kiện.
- **Điều kiện**: nêu điều kiện xác định khi cần.
- **Kiểm chứng**: thay lại/đối chiếu khi bài toán là bài toán ngược.
- **Kết luận**: trả lời đúng yêu cầu cuối cùng.

Không được PASS chỉ vì câu trả lời chứa đủ từ khóa rời rạc.

## Adversarial QA
Bộ QA phải có các tình huống:
- substring trap: 3/4 không được khớp trong 13/40;
- đáp số đúng nhưng thiếu lập luận;
- từ khóa đúng nhưng đẳng thức trung gian sai;
- câu tự mâu thuẫn;
- nhảy thẳng tới nghiệm;
- thiếu điều kiện xác định;
- kết luận đúng nhưng không kiểm chứng.

## Ma trận đa dạng hiện tại
- Bài 1: khái quát hóa, chứng minh, tính duy nhất, so sánh.
- Bài 2: chiến lược tính, phản biện lỗi, bài toán ngược, kiểm chứng.
- Bài 3: quy luật lũy thừa, phân biệt quy tắc, suy luận số mũ.
- Bài 4: kế hoạch nhiều bước, phân tích lỗi, biến đổi tương đương, kiểm chứng.

### Cảnh báo
Bài 4 bắt đầu gần mô-típ Bài 2. Từ Bài 5 phải ưu tiên các mô-típ khác như:
- phản ví dụ;
- nhiều cách giải;
- tối ưu hóa;
- mô hình hóa;
- khám phá quy luật;
- đánh giá tính đúng/sai của một mệnh đề;
- bài toán mở.

## Release gate
`/advanced-quality` phải PASS toàn bộ adversarial cases trước khi thêm bài nâng cao mới.
