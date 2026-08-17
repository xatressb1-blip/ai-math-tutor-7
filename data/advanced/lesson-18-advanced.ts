import type { AdvancedMathProblem } from "@/types/advanced";

export const lesson18AdvancedProblems: AdvancedMathProblem[] = [
  {
    id:"l18-advanced-pie-consistency", lessonId:"lesson-player-18",
    knowledgeNodeId:"lesson-18-bieu-do-hinh-quat-tron",
    title:"Kiểm định biểu đồ trước khi tính",
    prompt:"Biểu đồ phương tiện đến trường ghi: đi bộ 28%, xe đạp 35%, xe buýt 22%, còn lại là xe máy điện. Tìm phần còn lại, kiểm tra dữ liệu có hợp lệ và phản biện: “Có bốn nhóm nên nhóm còn lại là 25%.”",
    skillName:"Kiểm định tổng 100% và suy ra phần còn thiếu của biểu đồ quạt tròn",
    canonicalSkillId:"L18_ADV_PIE_TOTAL_CONSISTENCY", difficulty:3, level:"VAN_DUNG",
    levelLabel:"Nâng cao 1 · Kiểm định dữ liệu",
    learningGoal:"Dùng tổng 100% để suy phần thiếu và kiểm định dữ liệu, không đoán theo số nhóm.",
    companionMessage:"Toàn bộ hình tròn là 100%. Hãy kiểm tổng trước khi tính tiếp.",
    steps:[
      {id:"l18a1-step1",instruction:"Tính tổng ba tỉ lệ đã biết và phần còn thiếu.",acceptedPatterns:["85%","15%"],keyIdea:"28%+35%+22%=85%, nên còn 15%.",hint1:"Cộng ba lát.",hint2:"Lấy 100% trừ tổng.",explanation:"Toàn bộ biểu đồ ứng với 100%."},
      {id:"l18a1-step2",instruction:"Kiểm tra bộ 28%,35%,22%,15% có hợp lệ không.",acceptedPatterns:["100%","hợp lệ"],keyIdea:"Tổng bốn lát bằng 100%, nên hợp lệ.",hint1:"Cộng đủ bốn lát.",hint2:"Tổng phải bằng 100%.",explanation:"Tổng 100% là điều kiện bắt buộc."},
      {id:"l18a1-step3",instruction:"Phản biện kết luận 25% và chỉ ra lỗi.",acceptedPatterns:["sai","15%","không chia đều"],keyIdea:"Bốn nhóm không có nghĩa bốn lát bằng nhau; phần còn lại là 15%.",hint1:"25% chỉ đúng nếu bốn nhóm bằng nhau.",hint2:"Ba tỉ lệ đã cho không bằng nhau.",explanation:"Số nhóm không quyết định kích thước lát."}
    ],
    finalAnswer:"Ba nhóm đã biết chiếm 85%, nên còn 15%. Tổng là 100% nên dữ liệu hợp lệ. Không thể chia đều 25% chỉ vì có bốn nhóm."
  },
  {
    id:"l18-advanced-reverse-count", lessonId:"lesson-player-18",
    knowledgeNodeId:"lesson-18-bieu-do-hinh-quat-tron",
    title:"Bài toán ngược: từ một lát suy ra toàn bộ",
    prompt:"18 học sinh chọn Bơi và lát Bơi chiếm 30%. Các tỉ lệ còn lại: Bóng đá 35%, Cầu lông 20%, Khác 15%. Suy ra tổng số học sinh, tính số ở từng nhóm và kiểm tra.",
    skillName:"Suy ngược tổng thể và phân bổ số lượng từ tỉ lệ biểu đồ quạt tròn",
    canonicalSkillId:"L18_ADV_PIE_REVERSE_COUNT", difficulty:3, level:"SUY_LUAN",
    levelLabel:"Nâng cao 2 · Bài toán ngược",
    learningGoal:"Từ số lượng ứng với một tỉ lệ suy ra tổng thể rồi kiểm chứng cả tỉ lệ và số lượng.",
    companionMessage:"Đặt N là tổng số học sinh: 30%·N=18.",
    steps:[
      {id:"l18a2-step1",instruction:"Lập quan hệ và tìm tổng N.",acceptedPatterns:["0,3N=18","N=60"],keyIdea:"0,30N=18 nên N=60.",hint1:"30% của N bằng 18.",hint2:"18÷0,30=60.",explanation:"Đây là bài toán ngược từ một phần về toàn bộ."},
      {id:"l18a2-step2",instruction:"Tính số học sinh Bóng đá, Cầu lông và Khác.",acceptedPatterns:["21","12","9"],keyIdea:"35%·60=21; 20%·60=12; 15%·60=9.",hint1:"Nhân 60 với từng tỉ lệ.",hint2:"0,35·60; 0,20·60; 0,15·60.",explanation:"Số lượng bằng tỉ lệ nhân tổng."},
      {id:"l18a2-step3",instruction:"Kiểm tra bằng cả tổng tỉ lệ và tổng số lượng.",acceptedPatterns:["100%","18+21+12+9=60"],keyIdea:"Tổng tỉ lệ 100% và tổng số lượng 60.",hint1:"Kiểm tra hai tầng.",hint2:"Cả hai tổng phải khớp.",explanation:"Kiểm chứng kép giúp phát hiện lỗi."}
    ],
    finalAnswer:"N=60. Bóng đá 21, Cầu lông 12, Khác 9; tổng tỉ lệ 100% và tổng số lượng 60."
  },
  {
    id:"l18-advanced-percentage-point-analysis", lessonId:"lesson-player-18",
    knowledgeNodeId:"lesson-18-bieu-do-hinh-quat-tron",
    title:"Điểm phần trăm hay phần trăm tăng?",
    prompt:"Tỉ lệ đi xe đạp tăng từ 20% lên 30%. Phân biệt chênh lệch điểm phần trăm với mức tăng tương đối. Nếu năm trước có 200 học sinh, năm nay 300 học sinh, hãy so sánh số học sinh đi xe đạp.",
    skillName:"Phân biệt điểm phần trăm, phần trăm tăng tương đối và số lượng",
    canonicalSkillId:"L18_ADV_PIE_PERCENTAGE_POINT_REASONING", difficulty:3, level:"THU_THACH",
    levelLabel:"Thử thách · Phân tích biểu đồ",
    learningGoal:"Phân biệt điểm phần trăm với tăng tương đối và xét quy mô khi so số lượng.",
    companionMessage:"20%→30% có hai cách mô tả: chênh lệch trực tiếp và mức tăng so với mốc 20%.",
    steps:[
      {id:"l18a3-step1",instruction:"Tính chênh lệch theo điểm phần trăm.",acceptedPatterns:["10 điểm phần trăm"],keyIdea:"30%−20%=10 điểm phần trăm.",hint1:"Lấy hai tỉ lệ trừ nhau.",hint2:"Đơn vị là điểm phần trăm.",explanation:"Chênh lệch trực tiếp là 10 điểm phần trăm."},
      {id:"l18a3-step2",instruction:"Tính mức tăng tương đối so với năm trước.",acceptedPatterns:["50%","(30-20)/20"],keyIdea:"(30−20)/20=50%; khác với 10 điểm phần trăm.",hint1:"Lấy phần tăng chia giá trị ban đầu.",hint2:"10÷20=0,5.",explanation:"Điểm phần trăm và phần trăm tăng tương đối khác nhau."},
      {id:"l18a3-step3",instruction:"Tính số học sinh mỗi năm và giải thích vì sao phải xét quy mô.",acceptedPatterns:["40","90","tăng 50","quy mô"],keyIdea:"20%·200=40; 30%·300=90; tăng 50 học sinh.",hint1:"Tính tỉ lệ nhân tổng từng năm.",hint2:"Hai tổng thể khác nhau.",explanation:"Tỉ lệ một mình không quyết định chênh lệch số lượng khi quy mô thay đổi."}
    ],
    finalAnswer:"Tăng 10 điểm phần trăm, tương đương tăng tương đối 50%. Số học sinh tăng từ 40 lên 90, tức 50 học sinh."
  }
];
