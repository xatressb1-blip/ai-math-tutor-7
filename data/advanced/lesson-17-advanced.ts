import type { AdvancedMathProblem } from "@/types/advanced";

export const lesson17AdvancedProblems: AdvancedMathProblem[] = [
  {
    id: "l17-advanced-data-classification",
    lessonId: "lesson-player-17",
    knowledgeNodeId: "lesson-17-thu-thap-phan-loai-du-lieu",
    title: "Phân loại dữ liệu: số, thứ bậc hay chỉ là nhãn?",
    prompt:
      "Một lớp thu thập ba biến: (A) số anh/chị/em ruột: 0,1,2,3...; (B) mức hài lòng: Rất không hài lòng, Không hài lòng, Bình thường, Hài lòng, Rất hài lòng; (C) môn học yêu thích: Toán, Văn, Anh, Khoa học... Hãy phân loại từng biến thành dữ liệu số, dữ liệu không là số có thể sắp thứ tự, hoặc dữ liệu không là số không thể sắp thứ tự. Giải thích tiêu chí thay vì chỉ gọi tên.",
    skillName: "Phân loại dữ liệu số, thứ bậc và danh nghĩa theo bản chất",
    canonicalSkillId: "L17_ADV_DATA_TYPE_CLASSIFICATION",
    difficulty: 3,
    level: "VAN_DUNG",
    levelLabel: "Nâng cao 1 · Phân loại đúng bản chất",
    learningGoal:
      "Phân biệt dữ liệu số, dữ liệu không là số có thứ tự và dữ liệu không là số không có thứ tự; không nhầm mã số với đại lượng số.",
    companionMessage:
      "Hãy hỏi hai câu: dữ liệu có mang ý nghĩa số lượng không? Nếu không, các giá trị có một thứ tự tự nhiên hay chỉ là tên nhóm?",
    steps: [
      {
        id: "l17a1-step1",
        instruction:
          "Phân loại biến A – số anh/chị/em ruột – và nêu vì sao đây là dữ liệu số.",
        acceptedPatterns: ["dữ liệu số", "đếm được", "số lượng"],
        keyIdea:
          "A là dữ liệu số vì các giá trị 0,1,2,... biểu thị số lượng và có thể thực hiện các phép so sánh/tính toán có ý nghĩa.",
        hint1: "0,1,2,3 ở đây là số lượng thật, không phải mã nhãn.",
        hint2: "Có thể nói 2 nhiều hơn 1 một người.",
        explanation:
          "Dữ liệu số mang ý nghĩa định lượng.",
      },
      {
        id: "l17a1-step2",
        instruction:
          "Phân loại biến B – mức hài lòng – và giải thích vì sao không phải dữ liệu số nhưng vẫn có thể sắp thứ tự.",
        acceptedPatterns: ["không là số", "có thể sắp thứ tự", "thứ bậc", "Rất không hài lòng"],
        keyIdea:
          "B là dữ liệu không là số có thể sắp thứ tự vì các mức hài lòng có thứ tự tự nhiên từ thấp đến cao.",
        hint1: "Các giá trị là từ/ngữ, không phải đại lượng số.",
        hint2: "Nhưng 'Rất không hài lòng' < ... < 'Rất hài lòng' theo mức độ.",
        explanation:
          "Đây là dữ liệu phân loại có thứ bậc.",
      },
      {
        id: "l17a1-step3",
        instruction:
          "Phân loại biến C – môn học yêu thích – và phản biện việc gán Toán=1, Văn=2, Anh=3 rồi gọi đó là dữ liệu số.",
        acceptedPatterns: ["không là số", "không thể sắp thứ tự", "chỉ là nhãn", "mã", "1 2 3 không có ý nghĩa số lượng"],
        keyIdea:
          "C là dữ liệu không là số không có thứ tự tự nhiên. Gán 1,2,3 chỉ tạo mã nhãn; các con số đó không biến môn học thành đại lượng số.",
        hint1: "Toán không 'nhỏ hơn' Văn theo nghĩa dữ liệu.",
        hint2: "Mã 1,2,3 chỉ giúp lưu trữ, không tạo khoảng cách hay số lượng.",
        explanation:
          "Phải phân loại theo ý nghĩa của biến, không theo hình thức ký hiệu.",
      },
    ],
    finalAnswer:
      "A là dữ liệu số; B là dữ liệu không là số có thể sắp thứ tự; C là dữ liệu không là số không thể sắp thứ tự. Mã số gán cho C chỉ là nhãn, không biến dữ liệu thành định lượng.",
  },
  {
    id: "l17-advanced-representative-sample",
    lessonId: "lesson-player-17",
    knowledgeNodeId: "lesson-17-thu-thap-phan-loai-du-lieu",
    title: "Mẫu lớn chưa chắc đại diện",
    prompt:
      "Trường có 900 học sinh ở nhiều khối và muốn ước lượng thời gian tự học trung bình mỗi ngày của toàn trường. Cách 1: hỏi 150 học sinh tự nguyện trong câu lạc bộ Học thuật sau giờ học. Cách 2: chọn ngẫu nhiên học sinh từ danh sách toàn trường, bảo đảm mỗi khối đều có học sinh được chọn. Hãy đánh giá cách nào đại diện hơn và giới hạn kết luận được phép rút ra.",
    skillName: "Đánh giá tính đại diện, thiên lệch mẫu và phạm vi suy rộng",
    canonicalSkillId: "L17_ADV_REPRESENTATIVE_SAMPLE_REASONING",
    difficulty: 3,
    level: "SUY_LUAN",
    levelLabel: "Nâng cao 2 · Mẫu đại diện và thiên lệch",
    learningGoal:
      "Hiểu rằng cách chọn mẫu quan trọng hơn chỉ riêng cỡ mẫu; xác định quần thể mục tiêu, thiên lệch và phạm vi kết luận.",
    companionMessage:
      "Đừng hỏi 'mẫu nào đông hơn' trước. Hãy hỏi: quần thể muốn kết luận là ai, và cách chọn có cho mọi nhóm cơ hội xuất hiện hợp lí không?",
    steps: [
      {
        id: "l17a2-step1",
        instruction:
          "Xác định quần thể mục tiêu và mẫu của Cách 1.",
        acceptedPatterns: ["900 học sinh", "toàn trường", "150", "câu lạc bộ Học thuật", "tự nguyện"],
        keyIdea:
          "Quần thể mục tiêu là 900 học sinh toàn trường; mẫu Cách 1 là 150 học sinh tự nguyện trong câu lạc bộ Học thuật.",
        hint1: "Quần thể là nhóm mà nhà trường muốn kết luận về.",
        hint2: "Mẫu là nhóm thực tế được hỏi.",
        explanation:
          "Phân biệt quần thể và mẫu là bước đầu để đánh giá tính đại diện.",
      },
      {
        id: "l17a2-step2",
        instruction:
          "Chỉ ra ít nhất hai nguồn thiên lệch của Cách 1 và giải thích vì sao '150 người là mẫu lớn nên chắc chắn đại diện' là sai.",
        acceptedPatterns: ["tự nguyện", "câu lạc bộ Học thuật", "thiên lệch", "mẫu lớn chưa chắc đại diện", "không đại diện"],
        keyIdea:
          "Cách 1 có thiên lệch tự nguyện và thiên lệch do chỉ lấy học sinh câu lạc bộ Học thuật. Cỡ mẫu lớn không sửa được sai lệch trong cách chọn mẫu.",
        hint1: "Những học sinh tham gia CLB Học thuật có thể có thói quen tự học khác.",
        hint2: "Người tự nguyện trả lời cũng có thể khác người không trả lời.",
        explanation:
          "Representativeness phụ thuộc cơ chế chọn mẫu, không chỉ số lượng người.",
      },
      {
        id: "l17a2-step3",
        instruction:
          "Đánh giá Cách 2 và nêu kết luận nào được phép rút ra thận trọng.",
        acceptedPatterns: ["đại diện hơn", "ngẫu nhiên", "mỗi khối", "ước lượng", "toàn trường", "không khẳng định tuyệt đối"],
        keyIdea:
          "Cách 2 đại diện hơn vì chọn ngẫu nhiên từ toàn trường và có học sinh ở mỗi khối. Kết quả có thể dùng để ước lượng cho toàn trường, nhưng vẫn là ước lượng từ mẫu chứ không phải giá trị chắc chắn của từng học sinh.",
        hint1: "Ngẫu nhiên + phủ các khối giảm nguy cơ bỏ sót nhóm.",
        hint2: "Dữ liệu mẫu hỗ trợ ước lượng, không tạo sự chắc chắn tuyệt đối.",
        explanation:
          "Một mẫu tốt cho phép suy rộng thận trọng đến quần thể mục tiêu.",
      },
    ],
    finalAnswer:
      "Quần thể là 900 học sinh toàn trường. Cách 1 dễ thiên lệch vì chỉ hỏi người tự nguyện trong CLB Học thuật; 150 người vẫn có thể không đại diện. Cách 2 đại diện hơn nhờ chọn ngẫu nhiên và có học sinh ở mỗi khối, nên phù hợp hơn để ước lượng cho toàn trường.",
  },
  {
    id: "l17-advanced-questionnaire-bias",
    lessonId: "lesson-player-17",
    knowledgeNodeId: "lesson-17-thu-thap-phan-loai-du-lieu",
    title: "Phản biện khảo sát: câu hỏi dẫn dắt và kết luận vượt mẫu",
    prompt:
      "Ban căng tin muốn biết học sinh toàn trường có hài lòng với thực đơn mới không. Họ đứng ngay cửa căng tin vào giờ trưa, hỏi những học sinh vừa mua đồ: “Bạn có đồng ý rằng thực đơn mới ngon và đa dạng hơn hẳn không?”. 82% trả lời 'Có', rồi ban căng tin tuyên bố: “82% học sinh toàn trường rất hài lòng.” Hãy audit toàn bộ quy trình và đề xuất cách sửa.",
    skillName: "Phát hiện câu hỏi dẫn dắt, mẫu thuận tiện và kết luận vượt phạm vi",
    canonicalSkillId: "L17_ADV_SURVEY_BIAS_OVERGENERALIZATION",
    difficulty: 3,
    level: "THU_THACH",
    levelLabel: "Thử thách · Audit khảo sát",
    learningGoal:
      "Phát hiện đồng thời thiên lệch câu hỏi, thiên lệch chọn mẫu và suy rộng vượt phạm vi; biết thiết kế khảo sát công bằng hơn.",
    companionMessage:
      "Tách ba lớp lỗi: ai được hỏi, câu hỏi được viết thế nào, và kết luận cuối nói về ai.",
    steps: [
      {
        id: "l17a3-step1",
        instruction:
          "Phân tích lỗi chọn mẫu khi chỉ hỏi học sinh vừa mua đồ ở căng tin.",
        acceptedPatterns: ["mẫu thuận tiện", "thiên lệch", "chỉ học sinh mua đồ", "không đại diện", "học sinh không mua"],
        keyIdea:
          "Đây là mẫu thuận tiện và có thể thiên lệch: học sinh không mua đồ hoặc không đến căng tin bị loại khỏi cơ hội được hỏi.",
        hint1: "Những người không dùng căng tin có xuất hiện trong mẫu không?",
        hint2: "Quần thể mục tiêu là toàn trường.",
        explanation:
          "Cách chọn mẫu không phủ hợp lí quần thể mục tiêu.",
      },
      {
        id: "l17a3-step2",
        instruction:
          "Phân tích câu hỏi “Bạn có đồng ý rằng thực đơn mới ngon và đa dạng hơn hẳn không?” và viết lại một câu trung lập.",
        acceptedPatterns: ["dẫn dắt", "thiên lệch câu hỏi", "trung lập", "mức độ hài lòng", "rất hài lòng", "không hài lòng"],
        keyIdea:
          "Câu hỏi dẫn dắt vì gợi sẵn đánh giá tích cực. Có thể sửa thành: 'Mức độ hài lòng của bạn với thực đơn mới là: Rất không hài lòng / Không hài lòng / Bình thường / Hài lòng / Rất hài lòng?'",
        hint1: "Cụm 'ngon và đa dạng hơn hẳn' đã gợi đáp án tích cực.",
        hint2: "Câu trung lập không cài sẵn kết luận.",
        explanation:
          "Thiết kế câu hỏi ảnh hưởng trực tiếp đến chất lượng dữ liệu thu thập.",
      },
      {
        id: "l17a3-step3",
        instruction:
          "Phản biện kết luận '82% học sinh toàn trường rất hài lòng' và đề xuất quy trình khảo sát tốt hơn.",
        acceptedPatterns: ["không được suy rộng", "mẫu không đại diện", "82% người được hỏi", "chọn ngẫu nhiên", "các khối", "câu hỏi trung lập"],
        keyIdea:
          "82% chỉ mô tả nhóm được hỏi trong quy trình thiên lệch, không đủ để khẳng định cho toàn trường. Nên chọn mẫu ngẫu nhiên/bao phủ các khối và hỏi bằng câu trung lập trước khi suy rộng.",
        hint1: "Kết quả 82% thuộc về mẫu nào?",
        hint2: "Sửa cả cách chọn mẫu lẫn câu hỏi.",
        explanation:
          "Một kết luận thống kê hợp lệ cần dữ liệu được thu thập bằng quy trình phù hợp với quần thể mục tiêu.",
      },
    ],
    finalAnswer:
      "Khảo sát có mẫu thuận tiện thiên lệch, câu hỏi dẫn dắt và kết luận vượt phạm vi mẫu. 82% chỉ thuộc nhóm đã được hỏi theo quy trình đó. Cần chọn mẫu đại diện hơn từ toàn trường và dùng câu hỏi trung lập trước khi suy rộng.",
  },
];
