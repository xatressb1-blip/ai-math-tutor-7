import type { AdvancedMathProblem } from "@/types/advanced";

export const lesson11AdvancedProblems: AdvancedMathProblem[] = [
  {
    id:"l11-advanced-proof-map", lessonId:"lesson-player-11", knowledgeNodeId:"lesson-11-dinh-li-chung-minh",
    title:"Tách giả thiết – kết luận trước khi chứng minh",
    prompt:"Định lí: “Nếu hai góc đối đỉnh thì chúng bằng nhau.” Với ∠xOy và ∠x'Oy' đối đỉnh, hãy lập bản đồ chứng minh gồm GIVEN, GOAL và các bước trung gian. Không được bắt đầu bằng chính điều cần chứng minh.",
    skillName:"Lập bản đồ giả thiết–kết luận–chuỗi chứng minh", canonicalSkillId:"L11_ADV_GIVEN_GOAL_PROOF_MAP",
    difficulty:3, level:"VAN_DUNG", levelLabel:"Nâng cao 1 · Bản đồ chứng minh",
    learningGoal:"Tách rõ giả thiết, kết luận và chuỗi suy luận trước khi viết chứng minh.",
    companionMessage:"Trước khi chứng minh, hãy viết rõ em đang BIẾT gì và CẦN CHỨNG MINH gì.",
    steps:[
      {id:"l11a1-step1",instruction:"Viết GIVEN và GOAL.",acceptedPatterns:["GIVEN","GOAL","đối đỉnh","bằng nhau"],keyIdea:"GIVEN: hai góc đối đỉnh. GOAL: ∠xOy=∠x'Oy'.",hint1:"GOAL không được coi là đã biết.",hint2:"Tách giả thiết khỏi kết luận.",explanation:"Tách GIVEN/GOAL ngăn dùng kết luận làm giả thiết."},
      {id:"l11a1-step2",instruction:"Chọn một góc kề bù trung gian và lập hai tổng bằng 180°.",acceptedPatterns:["kề bù","180°","góc trung gian"],keyIdea:"Hai góc cần xét cùng bù với một góc trung gian.",hint1:"Không dùng ngay 'đối đỉnh thì bằng nhau'.",hint2:"Dùng quan hệ kề bù đã biết.",explanation:"Đây là căn cứ độc lập để xây chứng minh."},
      {id:"l11a1-step3",instruction:"Từ hai tổng 180°, suy ra GOAL.",acceptedPatterns:["trừ cùng","bằng nhau","∠xOy=∠x'Oy'"],keyIdea:"Hai tổng cùng 180° và cùng chứa góc trung gian nên hai góc còn lại bằng nhau.",hint1:"Trừ cùng một góc.",hint2:"Kết thúc bằng GOAL.",explanation:"Chuỗi đi từ GIVEN qua bước trung gian đến GOAL."}
    ], finalAnswer:"GIVEN: hai góc đối đỉnh. GOAL: chúng bằng nhau. Dùng một góc kề bù chung để lập hai tổng 180°, trừ cùng góc trung gian và suy ra hai góc bằng nhau."
  },
  {
    id:"l11-advanced-circular", lessonId:"lesson-player-11", knowledgeNodeId:"lesson-11-dinh-li-chung-minh",
    title:"Phát hiện chứng minh vòng tròn",
    prompt:"GIVEN: a // b và c cắt a,b. GOAL: hai góc so le trong α, β bằng nhau. Một lời giải viết: “Vì α=β nên theo tính chất hai đường thẳng song song, α=β.” Hãy chỉ ra lỗi và sửa chứng minh.",
    skillName:"Phát hiện và sửa chứng minh vòng tròn", canonicalSkillId:"L11_ADV_CIRCULAR_REASONING_DETECTION",
    difficulty:3, level:"SUY_LUAN", levelLabel:"Nâng cao 2 · Kiểm tra tính hợp lệ",
    learningGoal:"Không dùng chính kết luận cần chứng minh làm tiền đề.", companionMessage:"Nếu một câu chính là GOAL nhưng được dùng như tiền đề, chứng minh bị vòng tròn.",
    steps:[
      {id:"l11a2-step1",instruction:"Xác định GIVEN và GOAL.",acceptedPatterns:["a//b","c cắt","α=β"],keyIdea:"GIVEN: a//b, c là đường cắt. GOAL: α=β.",hint1:"Không đưa α=β vào GIVEN.",hint2:"α=β là đích.",explanation:"Phân tách giúp phát hiện vòng tròn."},
      {id:"l11a2-step2",instruction:"Chỉ ra câu gây chứng minh vòng tròn.",acceptedPatterns:["Vì α=β","dùng kết luận làm giả thiết","vòng tròn"],keyIdea:"Câu 'Vì α=β' dùng GOAL làm tiền đề.",hint1:"So câu đó với GOAL.",hint2:"Không giả sử điều cần chứng minh.",explanation:"Đó là circular reasoning."},
      {id:"l11a2-step3",instruction:"Viết chuỗi hợp lệ.",acceptedPatterns:["a//b","c cắt","tính chất hai đường thẳng song song","α=β"],keyIdea:"a//b + c là đường cắt → tính chất hai đường thẳng song song → α=β.",hint1:"Bắt đầu từ GIVEN.",hint2:"Đặt tính chất hợp lệ giữa GIVEN và GOAL.",explanation:"Chuỗi đúng không dùng GOAL làm tiền đề."}
    ], finalAnswer:"Lời giải vòng tròn vì dùng α=β trước khi chứng minh. Đúng: a//b và c là đường cắt → tính chất hai đường thẳng song song → α=β."
  },
  {
    id:"l11-advanced-converse", lessonId:"lesson-player-11", knowledgeNodeId:"lesson-11-dinh-li-chung-minh",
    title:"Không tự ý đảo định lí",
    prompt:"Biết định lí P ⇒ Q đã được chứng minh. Một bạn nói: “Vậy Q ⇒ P cũng đúng.” Hãy đánh giá, đưa phản ví dụ đơn giản và nêu khi nào được phép dùng chiều đảo.",
    skillName:"Phát hiện lỗi mệnh đề đảo và kiểm tra chiều đảo", canonicalSkillId:"L11_ADV_CONVERSE_ERROR_DETECTION",
    difficulty:3, level:"THU_THACH", levelLabel:"Thử thách · Logic định lí",
    learningGoal:"Hiểu mệnh đề đảo không tự động đúng; phải có chứng minh hoặc định lí độc lập.", companionMessage:"Mũi tên logic có hướng. Muốn đi ngược, em cần căn cứ riêng.",
    steps:[
      {id:"l11a3-step1",instruction:"Đánh giá phát biểu P⇒Q đúng thì Q⇒P cũng đúng.",acceptedPatterns:["sai","không nhất thiết","mệnh đề đảo"],keyIdea:"Sai nói chung; Q⇒P là mệnh đề đảo và cần kiểm tra riêng.",hint1:"Mũi tên có hướng.",hint2:"Đảo hai vế tạo mệnh đề khác.",explanation:"Chiều thuận đúng không bảo đảm chiều đảo."},
      {id:"l11a3-step2",instruction:"Nêu phản ví dụ.",acceptedPatterns:["chia hết cho 4","chia hết cho 2","6"],keyIdea:"n chia hết cho 4 ⇒ chia hết cho 2; đảo sai vì 6 chia hết cho 2 nhưng không chia hết cho 4.",hint1:"Dùng tính chia hết.",hint2:"Thử n=6.",explanation:"Một phản ví dụ đủ bác bỏ mệnh đề tổng quát."},
      {id:"l11a3-step3",instruction:"Khi nào được dùng Q⇒P?",acceptedPatterns:["đã được chứng minh","định lí","chứng minh riêng"],keyIdea:"Chỉ dùng khi chiều đảo đã được chứng minh hoặc có định lí/tính chất hợp lệ.",hint1:"Không dựa vào chiều thuận.",hint2:"Cần căn cứ độc lập.",explanation:"Mỗi chiều suy luận phải có căn cứ."}
    ], finalAnswer:"P⇒Q không kéo theo Q⇒P. Ví dụ chia hết cho 4 ⇒ chia hết cho 2, nhưng 6 bác bỏ chiều đảo. Chỉ dùng Q⇒P khi chiều đảo đã được chứng minh hoặc có định lí hợp lệ."
  }
];
