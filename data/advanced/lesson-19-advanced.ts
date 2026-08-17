import type { AdvancedMathProblem } from "@/types/advanced";

export const lesson19AdvancedProblems: AdvancedMathProblem[] = [
  {
    id: "l19-advanced-read-trend",
    lessonId: "lesson-player-19",
    knowledgeNodeId: "lesson-19-bieu-do-doan-thang",
    title: "Đọc xu hướng nhưng không kết luận quá dữ liệu",
    prompt:
      "Một biểu đồ đoạn thẳng ghi số sách thư viện được mượn trong 5 tháng: Tháng 1: 120, Tháng 2: 135, Tháng 3: 150, Tháng 4: 145, Tháng 5: 165. Hãy mô tả xu hướng, xác định giai đoạn giảm và phản biện câu: “Số lượt mượn chắc chắn sẽ tiếp tục tăng ở Tháng 6.”",
    skillName: "Đọc điểm dữ liệu, mô tả xu hướng và tránh suy rộng quá mức",
    canonicalSkillId: "L19_ADV_LINE_READ_TREND_LIMIT",
    difficulty: 3,
    level: "VAN_DUNG",
    levelLabel: "Nâng cao 1 · Đọc và phân tích xu hướng",
    learningGoal:
      "Đọc đúng điểm dữ liệu, mô tả xu hướng theo từng đoạn và phân biệt mô tả dữ liệu với dự đoán chưa có căn cứ.",
    companionMessage:
      "Đừng chỉ nói “tăng”. Hãy so từng cặp tháng liên tiếp rồi mới tổng hợp xu hướng.",
    steps: [
      {
        id: "l19a1-step1",
        instruction:
          "Liệt kê đúng năm giá trị và tính các thay đổi liên tiếp giữa các tháng.",
        acceptedPatterns: ["120", "135", "150", "145", "165", "+15", "-5", "+20"],
        keyIdea:
          "Các thay đổi là +15, +15, −5, +20.",
        hint1: "Lấy giá trị tháng sau trừ tháng trước.",
        hint2: "135−120, 150−135, 145−150, 165−145.",
        explanation:
          "Đọc điểm chính xác là điều kiện trước khi mô tả xu hướng.",
      },
      {
        id: "l19a1-step2",
        instruction:
          "Mô tả xu hướng toàn giai đoạn và chỉ ra chính xác đoạn giảm.",
        acceptedPatterns: ["tăng nhìn chung", "tháng 3 đến tháng 4 giảm", "150 xuống 145", "tăng trở lại"],
        keyIdea:
          "Nhìn chung tăng từ 120 lên 165, nhưng có một đoạn giảm từ Tháng 3 sang Tháng 4: 150 xuống 145.",
        hint1: "Xu hướng tổng thể không có nghĩa mọi đoạn đều tăng.",
        hint2: "Tìm thay đổi âm.",
        explanation:
          "Mô tả tốt phải giữ cả xu hướng tổng thể và biến động cục bộ.",
      },
      {
        id: "l19a1-step3",
        instruction:
          "Đánh giá câu “Tháng 6 chắc chắn tiếp tục tăng” và nêu giới hạn của dữ liệu.",
        acceptedPatterns: ["không chắc chắn", "chưa đủ dữ liệu", "chỉ đến tháng 5", "dự đoán"],
        keyIdea:
          "Biểu đồ chỉ quan sát đến Tháng 5; xu hướng trước đó có thể gợi ý nhưng không đảm bảo Tháng 6 sẽ tăng.",
        hint1: "Phân biệt mô tả dữ liệu đã quan sát với dự đoán tương lai.",
        hint2: "Từ “chắc chắn” mạnh hơn những gì biểu đồ hỗ trợ.",
        explanation:
          "Không được suy rộng một xu hướng quan sát thành kết quả chắc chắn ngoài phạm vi dữ liệu.",
      },
    ],
    finalAnswer:
      "Các thay đổi lần lượt +15, +15, −5, +20. Tổng thể số lượt mượn tăng từ 120 lên 165 nhưng giảm nhẹ ở Tháng 3→4. Không thể khẳng định chắc chắn Tháng 6 tăng vì biểu đồ chưa có dữ liệu Tháng 6.",
  },
  {
    id: "l19-advanced-construct-two-lines",
    lessonId: "lesson-player-19",
    knowledgeNodeId: "lesson-19-bieu-do-doan-thang",
    title: "Thiết kế biểu đồ hai đường với thang đo hợp lí",
    prompt:
      "Hai lớp có số bài tập hoàn thành trong 4 tuần: 7A = 20, 30, 40, 50; 7B = 25, 35, 35, 45. Hãy lập kế hoạch vẽ một biểu đồ đoạn thẳng hai đường: xác định trục, chọn thang đo hợp lí, liệt kê các điểm cần đặt và mô tả cách phân biệt hai đường. Cuối cùng nêu tuần nào khoảng cách giữa hai lớp lớn nhất.",
    skillName: "Thiết kế biểu đồ đoạn thẳng nhiều đường và chọn thang đo",
    canonicalSkillId: "L19_ADV_LINE_CONSTRUCT_MULTI_SCALE",
    difficulty: 3,
    level: "SUY_LUAN",
    levelLabel: "Nâng cao 2 · Vẽ biểu đồ có cấu trúc",
    learningGoal:
      "Từ bảng dữ liệu xây cấu trúc biểu đồ đúng: trục, thang đo, điểm dữ liệu, thứ tự nối và chú giải cho nhiều đường.",
    companionMessage:
      "Một biểu đồ đúng không chỉ có các điểm. Hãy khóa trục, đơn vị và thang đo trước rồi mới đặt điểm.",
    steps: [
      {
        id: "l19a2-step1",
        instruction:
          "Xác định nội dung trục ngang, trục đứng và đề xuất một thang đo đứng hợp lí.",
        acceptedPatterns: ["trục ngang tuần", "trục đứng số bài", "0 đến 50", "mỗi 5", "mỗi 10"],
        keyIdea:
          "Trục ngang là Tuần 1–4; trục đứng là số bài hoàn thành. Có thể chọn 0–50 với bước 5 hoặc 10.",
        hint1: "Biến thời gian đặt trên trục ngang.",
        hint2: "Thang đo phải chứa toàn bộ giá trị 20–50 và có khoảng chia đều.",
        explanation:
          "Thang đo hợp lí giúp đặt và đọc điểm nhất quán.",
      },
      {
        id: "l19a2-step2",
        instruction:
          "Liệt kê các điểm của 7A và 7B, rồi nêu quy tắc nối và cách phân biệt hai đường.",
        acceptedPatterns: ["7A", "20", "30", "40", "50", "7B", "25", "35", "45", "nối theo thứ tự tuần", "chú giải"],
        keyIdea:
          "7A: (1,20),(2,30),(3,40),(4,50); 7B: (1,25),(2,35),(3,35),(4,45). Nối riêng từng dãy theo thứ tự tuần và dùng kí hiệu/chú giải khác nhau.",
        hint1: "Không nối điểm của 7A sang điểm của 7B.",
        hint2: "Mỗi đường cần được nhận diện bằng chú giải/kí hiệu.",
        explanation:
          "Biểu đồ nhiều đường cần giữ đúng chuỗi thời gian của từng nhóm và chú giải rõ.",
      },
      {
        id: "l19a2-step3",
        instruction:
          "Tính chênh lệch 7A và 7B theo từng tuần, xác định tuần có khoảng cách lớn nhất.",
        acceptedPatterns: ["5", "10", "tuần 3", "40-35=5", "50-45=5"],
        keyIdea:
          "Độ lệch tuyệt đối: Tuần 1=5, Tuần 2=5, Tuần 3=5, Tuần 4=5; vì vậy không có tuần duy nhất lớn nhất, cả bốn tuần đều chênh 5.",
        hint1: "So sánh bằng độ lệch tuyệt đối ở từng tuần.",
        hint2: "20 và 25; 30 và 35; 40 và 35; 50 và 45.",
        explanation:
          "Hãy tính thay vì nhìn khoảng cách hình học trên bản vẽ; với thang đo đúng, cả bốn tuần đều lệch 5.",
      },
    ],
    finalAnswer:
      "Trục ngang: tuần; trục đứng: số bài, chọn thang đều 0–50. Đặt hai dãy điểm riêng, nối theo thứ tự tuần và dùng chú giải. Độ lệch mỗi tuần đều là 5, nên cả bốn tuần cùng có khoảng cách lớn nhất bằng 5.",
  },
  {
    id: "l19-advanced-misleading-scale",
    lessonId: "lesson-player-19",
    knowledgeNodeId: "lesson-19-bieu-do-doan-thang",
    title: "Hai biểu đồ cùng dữ liệu nhưng cảm giác rất khác",
    prompt:
      "Cùng dữ liệu doanh số 75, 80, 85 được vẽ thành hai biểu đồ. Biểu đồ A có trục đứng 0–100; biểu đồ B có trục đứng 70–90. Một bạn nhìn B và nói: “Doanh số tăng cực mạnh, gần gấp đôi.” Hãy kiểm tra mức tăng thật, giải thích tác động của trục đứng bị cắt và đưa ra cách nhận xét trung thực hơn.",
    skillName: "Phát hiện biểu đồ đoạn thẳng gây hiểu nhầm do thang đo",
    canonicalSkillId: "L19_ADV_MISLEADING_LINE_SCALE",
    difficulty: 3,
    level: "THU_THACH",
    levelLabel: "Thử thách · Chống biểu đồ gây hiểu nhầm",
    learningGoal:
      "Phân biệt dữ liệu thực với ấn tượng thị giác do thang đo; tính thay đổi tuyệt đối/tương đối và đánh giá phát biểu từ biểu đồ.",
    companionMessage:
      "Hai biểu đồ có cùng dữ liệu. Vì vậy trước khi tin vào độ dốc, hãy kiểm tra mốc đầu, mốc cuối và miền của trục đứng.",
    steps: [
      {
        id: "l19a3-step1",
        instruction:
          "Tính mức tăng tuyệt đối từ 75 lên 85 và mức tăng tương đối so với 75.",
        acceptedPatterns: ["10", "13,3%", "13.3%", "10/75"],
        keyIdea:
          "Tăng tuyệt đối 10; tăng tương đối 10/75≈13,3%. Không gần gấp đôi.",
        hint1: "85−75=10.",
        hint2: "10÷75≈0,133.",
        explanation:
          "Định lượng mức tăng trước khi đánh giá cảm giác từ hình.",
      },
      {
        id: "l19a3-step2",
        instruction:
          "Giải thích vì sao biểu đồ B có thể làm mức tăng trông mạnh hơn dù dữ liệu không đổi.",
        acceptedPatterns: ["trục đứng bắt đầu 70", "không bắt đầu từ 0", "phóng đại", "thang đo", "cắt trục"],
        keyIdea:
          "Trục B chỉ hiển thị 70–90 nên cùng chênh lệch 10 chiếm phần lớn chiều cao biểu đồ, làm biến động trông lớn hơn.",
        hint1: "So miền 0–100 với 70–90.",
        hint2: "Dữ liệu giống nhau; phần thay đổi là cách biểu diễn.",
        explanation:
          "Trục bị cắt không làm số liệu sai nhưng có thể phóng đại ấn tượng thị giác nếu người đọc không chú ý thang đo.",
      },
      {
        id: "l19a3-step3",
        instruction:
          "Đánh giá phát biểu “gần gấp đôi” và viết lại một nhận xét trung thực dựa trên số liệu.",
        acceptedPatterns: ["sai", "không gần gấp đôi", "tăng 10", "13,3%", "thang đo"],
        keyIdea:
          "Phát biểu sai: 85/75≈1,133 chứ không gần 2. Nhận xét trung thực: doanh số tăng 10 đơn vị, khoảng 13,3%; biểu đồ B làm biến động trông mạnh hơn do trục 70–90.",
        hint1: "Gấp đôi 75 phải gần 150.",
        hint2: "Dùng cả con số và cảnh báo thang đo.",
        explanation:
          "Graph literacy yêu cầu kiểm tra số liệu và thang đo trước khi dùng ngôn ngữ cường điệu.",
      },
    ],
    finalAnswer:
      "Doanh số tăng 10, tương đương khoảng 13,3%, không gần gấp đôi. Biểu đồ B dùng trục 70–90 nên chênh lệch chiếm phần lớn chiều cao và bị phóng đại về thị giác. Nhận xét đúng phải nêu mức tăng thật và lưu ý thang đo.",
  },
];
