import type { AdvancedMathProblem } from "@/types/advanced";

export const lesson16AdvancedProblems: AdvancedMathProblem[] = [
  {
    id: "l16-advanced-isosceles-converse-proof",
    lessonId: "lesson-player-16",
    knowledgeNodeId: "lesson-16-tam-giac-can-duong-trung-truc",
    title: "Định lí đảo tam giác cân: từ hai góc bằng nhau đến hai cạnh bằng nhau",
    prompt:
      "Trong tam giác ABC, biết ∠B = ∠C. Một bạn nói: “Hai góc bằng nhau chưa thể suy ra hai cạnh bằng nhau.” Em hãy phản biện bằng đúng định lí đảo của tam giác cân, xác định hai cạnh đối diện tương ứng và kết luận tam giác cân tại đâu.",
    skillName: "Vận dụng định lí đảo của tam giác cân theo đúng cạnh đối diện",
    canonicalSkillId: "L16_ADV_ISOSCELES_CONVERSE_PROOF",
    difficulty: 3,
    level: "VAN_DUNG",
    levelLabel: "Nâng cao 1 · Định lí đảo",
    learningGoal:
      "Dùng đúng chiều đảo: hai góc bằng nhau trong một tam giác suy ra hai cạnh đối diện bằng nhau và xác định đúng đỉnh cân.",
    companionMessage:
      "Đừng dừng ở tên định lí. Hãy ghép từng góc với cạnh đối diện nó: ∠B đối diện cạnh nào? ∠C đối diện cạnh nào?",
    steps: [
      {
        id: "l16a1-step1",
        instruction:
          "Xác định cạnh đối diện ∠B và cạnh đối diện ∠C.",
        acceptedPatterns: ["∠B đối diện AC", "∠C đối diện AB", "AC", "AB"],
        keyIdea:
          "Cạnh đối diện ∠B là AC; cạnh đối diện ∠C là AB.",
        hint1: "Cạnh đối diện một góc là cạnh không đi qua đỉnh của góc đó.",
        hint2: "∠B không nằm trên cạnh AC; ∠C không nằm trên cạnh AB.",
        explanation:
          "Việc ghép đúng góc–cạnh đối diện quyết định đúng đỉnh cân.",
      },
      {
        id: "l16a1-step2",
        instruction:
          "Dùng định lí đảo của tam giác cân để suy ra đẳng thức cạnh.",
        acceptedPatterns: ["AB=AC", "AC=AB", "định lí đảo", "hai góc bằng nhau"],
        keyIdea:
          "Vì ∠B=∠C nên hai cạnh đối diện bằng nhau: AC=AB.",
        hint1: "Hai góc bằng nhau thì hai cạnh đối diện chúng bằng nhau.",
        hint2: "Đây chính là chiều đảo của tính chất góc ở đáy.",
        explanation:
          "Không được trả lời 'chưa đủ': trong một tam giác, hai góc bằng nhau là đủ để suy ra hai cạnh đối diện bằng nhau.",
      },
      {
        id: "l16a1-step3",
        instruction:
          "Kết luận tam giác ABC cân tại đâu và bác bỏ phát biểu ban đầu.",
        acceptedPatterns: ["cân tại A", "AB=AC", "phát biểu sai", "nhận định sai"],
        keyIdea:
          "AB=AC nên tam giác ABC cân tại A; phát biểu 'hai góc bằng nhau chưa suy được tam giác cân' là sai.",
        hint1: "Hai cạnh bằng nhau gặp nhau ở đỉnh nào?",
        hint2: "AB và AC cùng gặp tại A.",
        explanation:
          "Đỉnh A là đỉnh cân, còn B,C là hai góc ở đáy.",
      },
    ],
    finalAnswer:
      "∠B đối diện AC và ∠C đối diện AB. Vì ∠B=∠C, theo định lí đảo của tam giác cân suy ra AC=AB. Do đó ΔABC cân tại A. Nhận định 'hai góc bằng nhau chưa thể suy ra tam giác cân' là sai.",
  },
  {
    id: "l16-advanced-perp-bisector-iff",
    lessonId: "lesson-player-16",
    knowledgeNodeId: "lesson-16-tam-giac-can-duong-trung-truc",
    title: "Đường trung trực theo hai chiều: thuộc đường ⇄ cách đều hai mút",
    prompt:
      "Cho đoạn AB và điểm M. Hãy phân biệt chính xác hai chiều suy luận sau: (I) M thuộc đường trung trực của AB; (II) MA=MB. Viết kết luận đúng theo mỗi chiều và giải thích vì sao chỉ biết MA=MB thì vẫn đủ để kết luận M thuộc đường trung trực của AB.",
    skillName: "Kiểm soát hai chiều của tính chất đường trung trực",
    canonicalSkillId: "L16_ADV_PERP_BISECTOR_BIDIRECTIONAL",
    difficulty: 3,
    level: "SUY_LUAN",
    levelLabel: "Nâng cao 2 · Hai chiều suy luận",
    learningGoal:
      "Phân biệt tính chất và tính chất đảo của đường trung trực, đồng thời hiểu đường trung trực là tập hợp các điểm cách đều hai mút.",
    companionMessage:
      "Đây là quan hệ hai chiều. Một chiều bắt đầu từ vị trí của M; chiều còn lại bắt đầu từ đẳng thức khoảng cách.",
    steps: [
      {
        id: "l16a2-step1",
        instruction:
          "Từ M thuộc đường trung trực của AB, suy ra điều gì và gọi tên chiều suy luận.",
        acceptedPatterns: ["MA=MB", "tính chất đường trung trực", "thuộc đường trung trực"],
        keyIdea:
          "Nếu M thuộc đường trung trực của AB thì MA=MB.",
        hint1: "Điểm nằm trên đường trung trực thì cách đều hai mút.",
        hint2: "Đây là chiều thuận.",
        explanation:
          "Chiều thuận đi từ 'thuộc đường trung trực' đến 'cách đều'.",
      },
      {
        id: "l16a2-step2",
        instruction:
          "Từ MA=MB, suy ra điều gì và gọi tên chiều đảo.",
        acceptedPatterns: ["M thuộc đường trung trực", "tính chất đảo", "MA=MB"],
        keyIdea:
          "Nếu MA=MB thì M thuộc đường trung trực của AB.",
        hint1: "Điểm cách đều hai mút của đoạn thẳng nằm trên đường trung trực của đoạn đó.",
        hint2: "Đây là chiều đảo.",
        explanation:
          "Chiều đảo đi từ 'cách đều' đến 'thuộc đường trung trực'.",
      },
      {
        id: "l16a2-step3",
        instruction:
          "Tóm tắt hai chiều thành một mệnh đề tương đương và bác bỏ câu 'MA=MB chưa đủ để biết vị trí của M'.",
        acceptedPatterns: ["M thuộc đường trung trực khi và chỉ khi MA=MB", "khi và chỉ khi", "tập hợp các điểm cách đều"],
        keyIdea:
          "M thuộc đường trung trực của AB ⇔ MA=MB; vì thế MA=MB là đủ để xác định M nằm trên đường trung trực.",
        hint1: "Gộp chiều thuận và chiều đảo.",
        hint2: "Có thể dùng cụm 'khi và chỉ khi'.",
        explanation:
          "Đường trung trực của AB chính là tập hợp tất cả các điểm cách đều A và B.",
      },
    ],
    finalAnswer:
      "M thuộc đường trung trực AB ⇒ MA=MB. Ngược lại, MA=MB ⇒ M thuộc đường trung trực AB. Do đó M thuộc đường trung trực của AB khi và chỉ khi MA=MB.",
  },
  {
    id: "l16-advanced-two-equidistant-points",
    lessonId: "lesson-player-16",
    knowledgeNodeId: "lesson-16-tam-giac-can-duong-trung-truc",
    title: "Hai điểm cách đều xác định đường trung trực",
    prompt:
      "Cho hai điểm phân biệt M,N cùng thỏa MA=MB và NA=NB, với A≠B. Chứng minh đường thẳng MN chính là đường trung trực của AB. Không được kết luận chỉ vì 'M và N nhìn có vẻ đối xứng'.",
    skillName: "Chứng minh đường trung trực từ hai điểm cách đều",
    canonicalSkillId: "L16_ADV_PERP_BISECTOR_TWO_POINTS_PROOF",
    difficulty: 3,
    level: "THU_THACH",
    levelLabel: "Thử thách · Chuỗi chứng minh đường trung trực",
    learningGoal:
      "Kết hợp tính chất đảo của đường trung trực với tiên đề qua hai điểm phân biệt có một đường thẳng duy nhất để chứng minh một đường thẳng là đường trung trực.",
    companionMessage:
      "Đừng cố chứng minh vuông góc và trung điểm trực tiếp. Hãy đưa M và N lên đường trung trực trước.",
    steps: [
      {
        id: "l16a3-step1",
        instruction:
          "Từ MA=MB và NA=NB, xác định vị trí của M và N đối với đoạn AB.",
        acceptedPatterns: ["M thuộc đường trung trực", "N thuộc đường trung trực", "tính chất đảo"],
        keyIdea:
          "MA=MB ⇒ M thuộc đường trung trực của AB; NA=NB ⇒ N thuộc đường trung trực của AB.",
        hint1: "Dùng chiều đảo vừa học.",
        hint2: "Áp dụng riêng cho M và N.",
        explanation:
          "Cả hai điểm đều nằm trên cùng đường trung trực của AB.",
      },
      {
        id: "l16a3-step2",
        instruction:
          "Vì M,N phân biệt và cùng nằm trên đường trung trực, suy ra quan hệ giữa đường thẳng MN và đường trung trực của AB.",
        acceptedPatterns: ["MN trùng với đường trung trực", "qua hai điểm phân biệt", "một đường thẳng duy nhất"],
        keyIdea:
          "Qua hai điểm phân biệt M,N chỉ có một đường thẳng; đường trung trực của AB đi qua cả M,N nên chính là đường thẳng MN.",
        hint1: "Một đường thẳng được xác định bởi hai điểm phân biệt.",
        hint2: "Cả MN và đường trung trực đều đi qua M,N.",
        explanation:
          "Tính duy nhất của đường thẳng qua hai điểm khóa kết luận trùng nhau.",
      },
      {
        id: "l16a3-step3",
        instruction:
          "Kết luận đầy đủ ý nghĩa 'MN là đường trung trực của AB' và nêu hai hệ quả hình học về trung điểm và vuông góc.",
        acceptedPatterns: ["MN vuông góc AB", "đi qua trung điểm AB", "đường trung trực"],
        keyIdea:
          "Vì MN là đường trung trực của AB nên MN⊥AB và MN đi qua trung điểm của AB.",
        hint1: "Quay lại định nghĩa đường trung trực.",
        hint2: "Định nghĩa có hai ý: vuông góc và đi qua trung điểm.",
        explanation:
          "Kết luận cuối nối chứng minh tập hợp điểm với định nghĩa hình học của đường trung trực.",
      },
    ],
    finalAnswer:
      "MA=MB và NA=NB nên theo tính chất đảo, M,N đều thuộc đường trung trực của AB. Vì M,N phân biệt, đường thẳng qua M,N là duy nhất; do đó MN trùng với đường trung trực của AB. Suy ra MN⊥AB và MN đi qua trung điểm của AB.",
  },
];
