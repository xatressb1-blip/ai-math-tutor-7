import type { AdvancedMathProblem } from "@/types/advanced";

export const lesson9AdvancedProblems: AdvancedMathProblem[] = [
  {
    id: "l9-advanced-valid-parallel-criterion",
    lessonId: "lesson-player-09",
    knowledgeNodeId: "lesson-9-hai-duong-thang-song-song",
    title: "Góc bằng nhau chưa đủ: phải đúng cặp góc mới suy ra song song",
    prompt:
      "Cho đường thẳng c cắt hai đường thẳng a và b. Một bạn thấy hai góc bằng nhau nên kết luận ngay a // b. Em hãy giải thích vì sao kết luận này chưa chắc đúng nếu chưa xác định vị trí của hai góc, rồi nêu một dấu hiệu hợp lệ để kết luận a // b.",
    skillName: "Kiểm soát điều kiện của dấu hiệu nhận biết hai đường thẳng song song",
    canonicalSkillId: "L09_ADV_PARALLEL_CRITERION_VALIDITY",
    difficulty: 3,
    level: "VAN_DUNG",
    levelLabel: "Nâng cao 1 · Kiểm tra điều kiện",
    learningGoal:
      "Biết rằng 'hai góc bằng nhau' chỉ có ý nghĩa nhận biết song song khi chúng thuộc đúng loại góc và cùng một đường cắt.",
    companionMessage:
      "Đừng nhìn mỗi số đo. Hãy hỏi: hai góc đó là đồng vị, so le trong hay một cặp bất kỳ?",
    steps: [
      {
        id: "l9a1-step1",
        instruction:
          "Chỉ ra vì sao câu 'hai góc bằng nhau nên a // b' là thiếu điều kiện.",
        acceptedPatterns: ["chưa xác định vị trí", "không phải cặp góc bất kỳ", "cùng đường cắt"],
        keyIdea:
          "Hai góc bằng nhau bất kỳ không đủ để suy ra hai đường thẳng song song; cần đúng cặp góc do cùng một đường cắt tạo ra.",
        hint1: "Một dấu hiệu hình học luôn có giả thiết về vị trí, không chỉ có số đo.",
        hint2: "Hãy nhắc đến 'cùng một đường cắt' và 'đúng loại góc'.",
        explanation:
          "Nếu chưa biết hai góc thuộc cặp đồng vị/so le trong thích hợp trên cùng một đường cắt thì không thể suy ra song song.",
      },
      {
        id: "l9a1-step2",
        instruction:
          "Nêu một dấu hiệu hợp lệ để kết luận a // b.",
        acceptedPatterns: ["so le trong bằng nhau", "đồng vị bằng nhau", "trong cùng phía bù nhau"],
        keyIdea:
          "Ví dụ: nếu một cặp góc so le trong bằng nhau thì hai đường thẳng song song.",
        hint1: "Chỉ cần nêu một trong các dấu hiệu chuẩn.",
        hint2: "Có thể dùng cặp góc so le trong.",
        explanation:
          "Một dấu hiệu hợp lệ: có một cặp góc so le trong bằng nhau thì a // b.",
      },
      {
        id: "l9a1-step3",
        instruction:
          "Viết lại kết luận dưới dạng chuỗi suy luận đầy đủ có giả thiết và kết luận.",
        acceptedPatterns: ["góc so le trong bằng nhau", "nên a//b", "vì cùng một đường cắt"],
        keyIdea:
          "Vì c cắt a,b và tạo một cặp góc so le trong bằng nhau nên theo dấu hiệu nhận biết, a // b.",
        hint1: "Chuỗi phải có: đường cắt → loại góc → bằng nhau → kết luận song song.",
        hint2: "Không bỏ qua tên dấu hiệu.",
        explanation:
          "Một chuỗi hợp lệ phải nói rõ vì sao cặp góc đang xét đủ điều kiện áp dụng dấu hiệu.",
      },
    ],
    finalAnswer:
      "Hai góc bằng nhau bất kỳ không đủ để suy ra song song. Phải xác định đúng cặp góc do cùng một đường cắt tạo ra; chẳng hạn một cặp góc so le trong bằng nhau thì suy ra a // b.",
  },
  {
    id: "l9-advanced-converse-direction",
    lessonId: "lesson-player-09",
    knowledgeNodeId: "lesson-9-hai-duong-thang-song-song",
    title: "Phân biệt dấu hiệu nhận biết với tính chất: không đảo định lí tùy ý",
    prompt:
      "Một bạn lập luận: “Nếu a // b thì hai góc so le trong bằng nhau. Em thấy hai góc bằng nhau, vậy a // b.” Em hãy đánh giá lập luận này: phần nào đúng, phần nào cần bổ sung để phép suy luận đảo là hợp lệ?",
    skillName: "Phân biệt chiều thuận và chiều đảo trong suy luận song song",
    canonicalSkillId: "L09_ADV_PARALLEL_CONVERSE_DIRECTION",
    difficulty: 3,
    level: "SUY_LUAN",
    levelLabel: "Nâng cao 2 · Chiều suy luận",
    learningGoal:
      "Phân biệt tính chất của hai đường thẳng song song với dấu hiệu nhận biết song song và tránh đảo định lí thiếu điều kiện.",
    companionMessage:
      "Một mệnh đề đúng theo chiều 'song song → góc bằng nhau' không tự động cho phép đảo nếu em chưa kiểm tra đúng giả thiết của dấu hiệu nhận biết.",
    steps: [
      {
        id: "l9a2-step1",
        instruction:
          "Nêu chiều suy luận đúng của tính chất hai đường thẳng song song.",
        acceptedPatterns: ["a//b", "so le trong bằng nhau", "đồng vị bằng nhau"],
        keyIdea:
          "Nếu a // b và có một đường cắt thì các cặp góc so le trong bằng nhau, đồng vị bằng nhau.",
        hint1: "Bắt đầu từ giả thiết a // b.",
        hint2: "Đây là 'tính chất', không phải 'dấu hiệu nhận biết'.",
        explanation:
          "Chiều thuận: a // b → các quan hệ góc tương ứng.",
      },
      {
        id: "l9a2-step2",
        instruction:
          "Nêu điều kiện để chiều đảo 'góc bằng nhau → song song' được phép dùng.",
        acceptedPatterns: ["đúng cặp so le trong", "đúng cặp đồng vị", "cùng một đường cắt"],
        keyIdea:
          "Phải là đúng cặp góc so le trong/đồng vị do cùng một đường cắt tạo ra.",
        hint1: "Không phải bất kỳ hai góc bằng nhau nào.",
        hint2: "Nhắc đủ vị trí và đường cắt.",
        explanation:
          "Chiều đảo chỉ hợp lệ khi đúng dấu hiệu nhận biết song song.",
      },
      {
        id: "l9a2-step3",
        instruction:
          "Kết luận về lời giải của bạn và sửa thành một lập luận hợp lệ.",
        acceptedPatterns: ["thiếu điều kiện", "nếu là so le trong", "thì a//b"],
        keyIdea:
          "Lời giải thiếu điều kiện. Sửa: nếu hai góc đang xét là một cặp so le trong bằng nhau trên cùng một đường cắt thì a // b.",
        hint1: "Không cần bác bỏ toàn bộ, chỉ ra chính xác chỗ thiếu.",
        hint2: "Viết lại dưới dạng 'nếu ... thì ...'.",
        explanation:
          "Cần bổ sung loại góc và đường cắt để phép suy luận đảo là hợp lệ.",
      },
    ],
    finalAnswer:
      "Chiều thuận a//b → góc so le trong bằng nhau là đúng. Chiều đảo chỉ dùng được khi hai góc bằng nhau đó chính là một cặp so le trong/đồng vị do cùng một đường cắt tạo ra.",
  },
  {
    id: "l9-advanced-multi-step-parallel-proof",
    lessonId: "lesson-player-09",
    knowledgeNodeId: "lesson-9-hai-duong-thang-song-song",
    title: "Chứng minh song song qua một góc trung gian",
    prompt:
      "Đường thẳng c cắt a và b. Biết một góc đồng vị tại giao điểm với a bằng 65°. Tại giao điểm với b, góc kề bù với góc đồng vị tương ứng bằng 115°. Hãy chứng minh a // b bằng chuỗi suy luận đầy đủ.",
    skillName: "Chứng minh song song qua biến đổi góc trung gian",
    canonicalSkillId: "L09_ADV_PARALLEL_MULTI_STEP_PROOF",
    difficulty: 3,
    level: "THU_THACH",
    levelLabel: "Thử thách · Chuỗi suy luận nhiều bước",
    learningGoal:
      "Kết hợp quan hệ kề bù với dấu hiệu góc đồng vị để tạo một chứng minh song song nhiều bước.",
    companionMessage:
      "Em chưa có ngay hai góc đồng vị bằng nhau. Trước hết phải dùng 115° để tìm góc kề bù còn lại.",
    steps: [
      {
        id: "l9a3-step1",
        instruction:
          "Tính số đo góc đồng vị tại giao điểm với b từ góc kề bù 115°.",
        acceptedPatterns: ["180°-115°=65°", "65°"],
        keyIdea:
          "Hai góc kề bù có tổng 180°, nên góc cần tìm bằng 65°.",
        hint1: "Dùng tổng 180°.",
        hint2: "180°-115°=?",
        explanation:
          "Góc đồng vị tại b bằng 65°.",
      },
      {
        id: "l9a3-step2",
        instruction:
          "So sánh hai góc 65° và xác định quan hệ vị trí của chúng.",
        acceptedPatterns: ["bằng nhau", "đồng vị", "cùng đường cắt"],
        keyIdea:
          "Hai góc đồng vị do cùng đường c cắt a,b tạo ra đều bằng 65°.",
        hint1: "Tên loại góc là yếu tố bắt buộc.",
        hint2: "Không chỉ viết '65=65'.",
        explanation:
          "Ta có một cặp góc đồng vị bằng nhau.",
      },
      {
        id: "l9a3-step3",
        instruction:
          "Dùng dấu hiệu nhận biết để kết luận và trình bày toàn bộ chuỗi chứng minh.",
        acceptedPatterns: ["đồng vị bằng nhau", "a//b", "dấu hiệu nhận biết"],
        keyIdea:
          "Vì có một cặp góc đồng vị bằng nhau nên a // b.",
        hint1: "Nêu rõ tên dấu hiệu nhận biết.",
        hint2: "Chuỗi: kề bù → 65° → đồng vị bằng nhau → song song.",
        explanation:
          "Đây là chứng minh hợp lệ vì mỗi bước đều có lý do rõ ràng.",
      },
    ],
    finalAnswer:
      "Góc kề bù với 115° bằng 65°. Hai góc đồng vị trên cùng đường c đều bằng 65°. Theo dấu hiệu nhận biết hai đường thẳng song song, suy ra a // b.",
  },
];
