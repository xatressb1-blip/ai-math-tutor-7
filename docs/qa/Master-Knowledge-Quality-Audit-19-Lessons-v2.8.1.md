# AI Math Tutor v2.8.1-beta.1
# MASTER KNOWLEDGE QUALITY AUDIT – 19 LESSONS
## Remediation Blueprint for v2.8.2-beta.1 – Knowledge Quality Refinement

## 1. Mục tiêu
Tài liệu này tổng hợp Deep Knowledge Quality Audit của toàn bộ 19 bài Toán 7 Tập 1.

Nguồn chuẩn:
- PRIMARY: SGK Toán 7 Tập 1 KNTT.
- PRACTICE: SBT Toán 7 Tập 1 KNTT.
- ENRICHMENT: tài liệu học tập bổ trợ.
- ADVANCED_ONLY: chuyên đề nâng cao, chỉ mở sau mastery.

Production v2.8.1-beta.1 được giữ làm baseline. Không thay đổi Cloud/Supabase trong remediation này.

## 2. Kết quả 19 bài

| Bài | Chủ đề | Audit | Priority |
|---|---|---|---|
| 1 | Tập hợp các số hữu tỉ | HIGH PRIORITY | P0 |
| 2 | Cộng, trừ, nhân, chia số hữu tỉ | NEEDS REFINEMENT | P1 |
| 3 | Lũy thừa với số mũ tự nhiên | PASS / REFINE | P2 |
| 4 | Thứ tự phép tính – chuyển vế | HIGH PRIORITY | P0 |
| 5 | Số thập phân vô hạn tuần hoàn | NEEDS REFINEMENT | P1 |
| 6 | Số vô tỉ – căn bậc hai số học | NEEDS REFINEMENT | P1 |
| 7 | Tập hợp các số thực | HIGH PRIORITY | P0 |
| 8 | Góc đặc biệt – tia phân giác | NEEDS REFINEMENT | P1 |
| 9 | Dấu hiệu hai đường thẳng song song | HIGH PRIORITY | P0 |
| 10 | Tiên đề Euclid – tính chất song song | HIGH PRIORITY | P0 |
| 11 | Định lí – chứng minh | HIGH PRIORITY | P0 |
| 12 | Tổng các góc trong tam giác | HIGH PRIORITY | P0 |
| 13 | Hai tam giác bằng nhau – c.c.c | HIGH PRIORITY | P0 |
| 14 | c.g.c – g.c.g | HIGH PRIORITY | P0 |
| 15 | Tam giác vuông bằng nhau | HIGH PRIORITY | P0 |
| 16 | Tam giác cân – đường trung trực | CRITICAL | P0 |
| 17 | Thu thập – phân loại dữ liệu | HIGH PRIORITY | P0 |
| 18 | Biểu đồ hình quạt tròn | NEEDS REFINEMENT / HIGH | P1 |
| 19 | Biểu đồ đoạn thẳng | HIGH PRIORITY | P0 |

## 3. P0 – phải sửa trước

### P0.1 Bài 16 – Knowledge correctness
Academic KB chứa misconception trái SGK về chiều đảo tam giác cân.

Sửa:
- Hai góc bằng nhau → hai cạnh đối diện bằng nhau → tam giác cân.
- Bổ sung theorem/converse.
- Bổ sung tam giác đều.
- Đo cả hai chiều của tính chất đường trung trực.
- Không đánh mastery từ generic MCQ.

PASS khi:
- Không còn statement sai.
- Core, Adaptive, Reasoning thống nhất theorem/converse.
- Student Brain tách các skill tương ứng.

### P0.2 Bài 12–19 – Generic checkpoint false mastery
Generic Lesson Adapter đang tạo câu hỏi meta về “cách làm phù hợp” thay vì kiểm tra toán thật.

Sửa:
- Thay generic mastery checkpoint bằng domain-specific checkpoint.
- Generic adapter chỉ được dùng fallback/navigation, không dùng quyết định mastery.

PASS khi:
- Mỗi Bài 12–19 có ít nhất 2 checkpoint toán học thực.
- Mastery không thể đạt chỉ bằng câu hỏi meta.

### P0.3 Bài 15 – thiếu coverage tam giác vuông
Phải bao phủ đủ các trường hợp SGK, không chỉ cạnh huyền–cạnh góc vuông.

PASS khi:
- Adaptive/Reasoning phân biệt được các trường hợp.
- Student Brain không gộp tất cả vào một skill.

### P0.4 Bài 7 – thiếu core competency
Bổ sung:
- số đối của số thực;
- biểu diễn số thực trên trục số;
- checkpoint so sánh.

### P0.5 Bài 4 – scope creep
Loại khỏi PRIMARY:
- 2x + 3 = 11
- 3x = 15
- 4x - 3 = 13
- 3(x - 2) = 12

Nếu giữ, chuyển ENRICHMENT/AFTER_MASTERY.

### P0.6 Bài 1 – future knowledge leakage
Không dùng √2/π làm kiến thức cần biết để PASS checkpoint trước khi học Chương II.

### P0.7 Bài 9–11 – reasoning direction
Phải phân biệt:
- dấu hiệu: góc thích hợp bằng nhau → song song;
- tính chất: song song → góc thích hợp bằng nhau.

Bài 11 phải đo GIVEN → GOAL → JUSTIFICATION → CONCLUSION.

### P0.8 Bài 17/19 – statistical reasoning
Bài 17:
- không suy rộng mẫu thiên lệch;
- phân biệt population/sample/representativeness.

Bài 19:
- đọc đúng trục/thang đo;
- phát hiện biểu đồ gây hiểu nhầm;
- không suy xu hướng vượt dữ liệu.

## 4. P1 – coverage và skill mapping

### Bài 2
- tính chất phép toán;
- quy tắc dấu ngoặc;
- tính hợp lí;
- bài toán thực tiễn.

### Bài 5
- chuyển tiêu chuẩn mẫu 2/5 sang ENRICHMENT;
- tách skill làm tròn khỏi skill số thập phân tuần hoàn.

### Bài 6
- tách `Nhận biết số vô tỉ` khỏi `Căn bậc hai số học`;
- thêm tính gần đúng/làm tròn bằng máy tính;
- thêm vận dụng độ dài/diện tích.

### Bài 8
- phản ví dụ “tổng 180° nhưng không kề bù”;
- phân biệt kề bù/đối đỉnh/phân giác.

### Bài 18
- đọc chú giải;
- hoàn thiện biểu đồ;
- kiểm tra tổng 100%;
- chuyển phần trăm ↔ số lượng;
- phân tích nhiều lát.

## 5. P2 – chất lượng hint/reasoning

Áp dụng toàn hệ thống:
- Hint 1: định hướng.
- Hint 2: nhắc quy tắc/khái niệm.
- Hint 3: gợi bước thao tác.
- Không đưa phép tính gần đáp án ở hint đầu.
- Reasoning difficulty cao phải đo lựa chọn chiến lược/phát hiện lỗi, không chỉ nhiều phép tính hơn.

## 6. Chuẩn phân tầng nội dung

### CORE
Kiến thức/kĩ năng trực tiếp từ SGK và cần cho mastery bài.

### APPLIED
Vận dụng trực tiếp chuẩn SGK trong tình huống mới.

### ENRICHMENT
Bổ trợ, mở rộng; không quyết định core mastery.

### ADVANCED_ONLY
Chuyên đề nâng cao; chỉ mở khi học sinh đã mastery core.

Quy tắc:
`CORE mastery` không được phụ thuộc vào ENRICHMENT/ADVANCED_ONLY.

## 7. Student Brain – skill granularity

Không dùng skillName quá rộng kiểu:
- “Số thực và giá trị tuyệt đối”
- “Các trường hợp tam giác vuông”
- “Biểu đồ”

Thay bằng atomic skills có thể chẩn đoán:
- REAL_NUMBER_CLASSIFICATION
- REAL_NUMBER_OPPOSITE
- REAL_NUMBER_LINE
- REAL_NUMBER_COMPARE
- ABSOLUTE_VALUE
- TRIANGLE_CORRESPONDENCE
- SSS / SAS / ASA
- RIGHT_TRIANGLE_CASE_*
- REPRESENTATIVENESS
- LINE_CHART_SCALE
- MISLEADING_GRAPH_DETECTION
...

## 8. Misconception taxonomy chung

### Arithmetic / Number
- SIGN_ERROR
- RECIPROCAL_CONFUSION
- ROUNDING_PLACE_ERROR
- IRRATIONAL_CLASSIFICATION_ERROR

### Geometry
- DIAGRAM_TRUST_ERROR
- ANGLE_PAIR_TYPE_ERROR
- CONVERSE_ERROR
- MISSING_CONDITION
- GT_KL_CONFUSION
- CIRCULAR_REASONING
- UNJUSTIFIED_STEP
- TRIANGLE_CORRESPONDENCE_ERROR
- INSUFFICIENT_CONGRUENCE_CONDITION
- NON_INCLUDED_ANGLE_ERROR
- NON_INCLUDED_SIDE_ERROR
- RIGHT_TRIANGLE_CASE_CONFUSION
- ISOSCELES_CONVERSE_ERROR
- PERP_BISECTOR_CONVERSE_ERROR

### Statistics
- DATA_TYPE_CLASSIFICATION_ERROR
- POPULATION_SAMPLE_CONFUSION
- SAMPLING_BIAS
- OVERGENERALIZATION_FROM_SAMPLE
- PIE_PERCENT_TOTAL_ERROR
- LINE_CHART_AXIS_ERROR
- LINE_CHART_SCALE_ERROR
- MISLEADING_GRAPH_INTERPRETATION
- TREND_OVERCLAIM

## 9. Remediation waves cho v2.8.2-beta.1

### WAVE 1 – Correctness & false mastery
Ưu tiên tuyệt đối:
1. Bài 16 knowledge error.
2. Generic mastery checkpoint Bài 12–19.
3. Bài 15 coverage.
4. Bài 7 missing competencies.
5. Bài 4 scope creep.
6. Bài 1 leakage.

Gate:
- npm run build PASS
- Knowledge QA 19/19 PASS
- Không regression Lesson Player/Adaptive/Reasoning.

### WAVE 2 – Reasoning integrity
Bài 8–14:
- angle relation;
- directionality;
- theorem/converse;
- proof structure;
- triangle correspondence;
- congruence conditions.

Gate:
- mỗi reasoning task có justification;
- không chấp nhận keyword-only khi cần quan hệ cụ thể.

### WAVE 3 – Statistics literacy
Bài 17–19:
- representative sample;
- pie analysis;
- line-chart scale;
- misleading graphs.

### WAVE 4 – Skill & Hint normalization
- atomic Student Brain skills;
- 3-level hints;
- sourceTier;
- difficulty calibration;
- CORE/APPLIED/ENRICHMENT/ADVANCED_ONLY.

### WAVE 5 – Full Regression QA
Kiểm thử:
- 19 Lesson Players
- 19 Adaptive Practice paths
- 19 AI Tutor contexts
- 19 Student Brain mappings
- Reasoning banks
- Knowledge QA dashboard
- Cloud sync regression
- mobile UX smoke test

## 10. Release gates v2.8.2-beta.1

Chỉ được đóng ZIP khi:
- [ ] Không còn P0 correctness.
- [ ] Không còn generic false-mastery checkpoint trong Bài 12–19.
- [ ] 19/19 lesson core coverage PASS.
- [ ] Adaptive skills map đúng Student Brain.
- [ ] Reasoning không đảo định lí/thiếu điều kiện.
- [ ] Enrichment không ảnh hưởng core mastery.
- [ ] npm run build PASS.
- [ ] Local smoke PASS.
- [ ] Knowledge QA 19/19 PASS.

Chỉ deploy Production sau khi:
- [ ] Local PASS.
- [ ] Git working tree clean sau commit.
- [ ] Production smoke test PASS.
- [ ] Cloud/Supabase regression PASS.

## 11. Thứ tự triển khai đề xuất
Bắt đầu code v2.8.2 theo thứ tự:

`B16 → generic adapter B12–19 → B15 → B7 → B4 → B1 → B9–11 → B12–14 → B17–19 → B2/B5/B6/B8/B18 → hint/skill normalization → full QA`

## 12. Kết luận
v2.8.1-beta.1 là baseline integration tốt, nhưng Deep Audit chứng minh rằng “runtime PASS” chưa đồng nghĩa “mastery content PASS”.

Mục tiêu của v2.8.2-beta.1 không phải thêm nhiều chức năng. Mục tiêu là làm cho mỗi tín hiệu PASS của hệ thống có ý nghĩa sư phạm: học sinh thực sự đã chứng minh được đúng kiến thức/kĩ năng mà Student Brain ghi nhận.
