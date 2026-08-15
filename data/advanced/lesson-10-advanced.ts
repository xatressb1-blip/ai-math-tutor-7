import type { AdvancedMathProblem } from "@/types/advanced";

export const lesson10AdvancedProblems: AdvancedMathProblem[] = [
  {
    id: "l10-advanced-euclid-uniqueness",
    lessonId: "lesson-player-10",
    knowledgeNodeId: "lesson-10-tien-de-euclid-song-song",
    title: "Tiên đề Euclid và tính duy nhất của đường thẳng song song",
    prompt:
      "Cho điểm M nằm ngoài đường thẳng a. Qua M có hai đường thẳng b và c đều được cho là song song với a. Hãy dùng đúng nội dung tiên đề Euclid để kết luận quan hệ giữa b và c. Không được lập luận chỉ bằng hình vẽ.",
    skillName: "Suy luận tính duy nhất từ tiên đề Euclid",
    canonicalSkillId: "L10_ADV_EUCLID_UNIQUENESS",
    difficulty: 3,
    level: "VAN_DUNG",
    levelLabel: "Nâng cao 1 · Tiên đề và tính duy nhất",
    learningGoal:
      "Dùng tiên đề Euclid để suy luận tính duy nhất của đường thẳng qua một điểm và song song với một đường thẳng cho trước.",
    companionMessage:
      "Từ khóa quan trọng của tiên đề là 'chỉ một'. Nếu b và c cùng đi qua M và cùng song song với a, em hãy đối chiếu trực tiếp với tính duy nhất đó.",
    steps: [
      {
        id: "l10a1-step1",
        instruction:
          "Phát biểu phần của tiên đề Euclid cần dùng trong tình huống này.",
        acceptedPatterns: ["qua một điểm nằm ngoài", "chỉ một đường thẳng", "song song với đường thẳng đã cho"],
        keyIdea:
          "Qua một điểm nằm ngoài một đường thẳng, chỉ có một đường thẳng song song với đường thẳng đó.",
        hint1: "Hãy nhấn mạnh tính duy nhất.",
        hint2: "Cụm cần có là 'chỉ một đường thẳng'.",
        explanation:
          "Tiên đề Euclid đảm bảo tồn tại duy nhất một đường thẳng qua M và song song với a.",
      },
      {
        id: "l10a1-step2",
        instruction:
          "Áp dụng tiên đề cho b và c: chỉ ra các điều kiện mà b và c cùng thỏa.",
        acceptedPatterns: ["đều đi qua M", "đều song song với a"],
        keyIdea:
          "Cả b và c đều đi qua M và đều song song với a.",
        hint1: "So sánh b và c theo đúng hai điều kiện trong tiên đề.",
        hint2: "Điểm chung là M; đường thẳng cùng song song là a.",
        explanation:
          "b và c cùng là ứng viên cho đường thẳng duy nhất qua M song song với a.",
      },
      {
        id: "l10a1-step3",
        instruction:
          "Kết luận quan hệ giữa b và c và giải thích vì sao không thể có hai đường khác nhau.",
        acceptedPatterns: ["b=c", "trùng nhau", "tính duy nhất"],
        keyIdea:
          "Do tính duy nhất trong tiên đề Euclid, b và c phải trùng nhau.",
        hint1: "Nếu b khác c thì qua M có mấy đường cùng song song với a?",
        hint2: "Điều đó mâu thuẫn với 'chỉ một'.",
        explanation:
          "b=c. Nếu chúng khác nhau thì sẽ có hai đường qua M cùng song song với a, trái tiên đề Euclid.",
      },
    ],
    finalAnswer:
      "Qua M chỉ có một đường thẳng song song với a. Vì b và c đều đi qua M và đều song song với a nên b và c phải trùng nhau.",
  },
  {
    id: "l10-advanced-directionality-property",
    lessonId: "lesson-player-10",
    knowledgeNodeId: "lesson-10-tien-de-euclid-song-song",
    title: "Bài 10 đi theo chiều nào? Song song trước, quan hệ góc sau",
    prompt:
      "GIVEN: a // b và đường thẳng c cắt a, b. GOAL: chứng minh một cặp góc so le trong bằng nhau. Một bạn lại viết: “Vì hai góc so le trong bằng nhau nên a // b.” Hãy phân tích vì sao cách viết đó không phù hợp với bài toán này và sửa thành chuỗi suy luận đúng.",
    skillName: "Kiểm soát chiều suy luận từ song song đến quan hệ góc",
    canonicalSkillId: "L10_ADV_PARALLEL_PROPERTY_DIRECTION",
    difficulty: 3,
    level: "SUY_LUAN",
    levelLabel: "Nâng cao 2 · Chiều suy luận",
    learningGoal:
      "Phân biệt dấu hiệu nhận biết song song của Bài 9 với tính chất góc của hai đường thẳng song song ở Bài 10.",
    companionMessage:
      "Hãy đọc GIVEN trước. Ở đây a // b đã được cho sẵn, nên em không cần chứng minh lại song song.",
    steps: [
      {
        id: "l10a2-step1",
        instruction:
          "Xác định GIVEN và GOAL của bài toán bằng lời.",
        acceptedPatterns: ["given a//b", "a//b đã cho", "goal góc so le trong bằng nhau"],
        keyIdea:
          "GIVEN là a // b; GOAL là quan hệ bằng nhau của cặp góc so le trong.",
        hint1: "Bài toán cho điều gì trước?",
        hint2: "Đích cần chứng minh là quan hệ góc, không phải song song.",
        explanation:
          "Ta bắt đầu từ giả thiết a // b và cần suy ra tính chất góc.",
      },
      {
        id: "l10a2-step2",
        instruction:
          "Chỉ ra lỗi về chiều suy luận trong lời giải của bạn.",
        acceptedPatterns: ["đảo chiều", "dùng dấu hiệu nhận biết thay cho tính chất", "chứng minh lại điều đã cho"],
        keyIdea:
          "Bạn đã dùng chiều của Bài 9: góc thích hợp bằng nhau → song song, trong khi ở đây cần chiều Bài 10: song song → góc thích hợp bằng nhau.",
        hint1: "So sánh mũi tên suy luận của Bài 9 và Bài 10.",
        hint2: "a // b đã nằm trong GIVEN.",
        explanation:
          "Lời giải dùng sai hướng và còn cố chứng minh lại giả thiết đã cho.",
      },
      {
        id: "l10a2-step3",
        instruction:
          "Viết chuỗi suy luận đúng từ giả thiết đến kết luận.",
        acceptedPatterns: ["a//b", "c cắt", "so le trong bằng nhau", "tính chất hai đường thẳng song song"],
        keyIdea:
          "Vì a // b và c là đường cắt, theo tính chất hai đường thẳng song song, cặp góc so le trong bằng nhau.",
        hint1: "Chuỗi phải bắt đầu bằng a // b.",
        hint2: "Nêu tên tính chất trước khi kết luận góc.",
        explanation:
          "Đây là chiều suy luận đúng của Bài 10.",
      },
    ],
    finalAnswer:
      "GIVEN: a//b; GOAL: cặp góc so le trong bằng nhau. Lời giải cũ dùng ngược chiều. Đúng là: a//b và c cắt a,b ⇒ theo tính chất hai đường thẳng song song, các góc so le trong bằng nhau.",
  },
  {
    id: "l10-advanced-perpendicular-transfer",
    lessonId: "lesson-player-10",
    knowledgeNodeId: "lesson-10-tien-de-euclid-song-song",
    title: "Chuyển tính vuông góc qua hai đường thẳng song song",
    prompt:
      "Cho a // b và đường thẳng d vuông góc với a tại A. Hãy chứng minh d cũng vuông góc với b. Em phải dùng tính chất góc của hai đường thẳng song song, không được chỉ nói 'song song nên cùng vuông góc'.",
    skillName: "Chứng minh vuông góc với đường song song bằng quan hệ góc",
    canonicalSkillId: "L10_ADV_PERPENDICULAR_TRANSFER_PROOF",
    difficulty: 3,
    level: "THU_THACH",
    levelLabel: "Thử thách · Chứng minh nhiều bước",
    learningGoal:
      "Dùng góc đồng vị/so le trong của hai đường thẳng song song để chuyển tính vuông góc từ một đường sang đường song song với nó.",
    companionMessage:
      "Hãy biến 'd ⟂ a' thành thông tin về một góc 90°, rồi dùng a // b để chuyển số đo góc sang giao điểm với b.",
    steps: [
      {
        id: "l10a3-step1",
        instruction:
          "Từ d ⟂ a, nêu số đo của góc tạo bởi d và a.",
        acceptedPatterns: ["90°", "góc vuông", "d⊥a"],
        keyIdea:
          "d ⟂ a nên góc tạo bởi d và a bằng 90°.",
        hint1: "Định nghĩa hai đường thẳng vuông góc.",
        hint2: "Một trong các góc tạo thành là góc vuông.",
        explanation:
          "Ta có một góc 90° tại giao điểm của d với a.",
      },
      {
        id: "l10a3-step2",
        instruction:
          "Dùng a // b và d là đường cắt để suy ra góc tương ứng tại giao điểm của d với b cũng bằng 90°.",
        acceptedPatterns: ["đồng vị bằng nhau", "so le trong bằng nhau", "90°", "a//b"],
        keyIdea:
          "Vì a // b, các góc đồng vị (hoặc so le trong phù hợp) do d tạo ra bằng nhau, nên góc tương ứng tại b bằng 90°.",
        hint1: "Hãy xác định cặp góc do d cắt hai đường song song.",
        hint2: "Tầng này mới dùng tính chất góc của hai đường thẳng song song.",
        explanation:
          "Góc tương ứng tại b bằng góc 90° tại a.",
      },
      {
        id: "l10a3-step3",
        instruction:
          "Từ góc 90° tại giao điểm với b, kết luận quan hệ giữa d và b.",
        acceptedPatterns: ["d⊥b", "vuông góc", "góc 90°"],
        keyIdea:
          "Vì d tạo với b một góc 90° nên d ⟂ b.",
        hint1: "Quay lại định nghĩa vuông góc.",
        hint2: "Một góc tạo bởi hai đường bằng 90° là đủ để kết luận.",
        explanation:
          "Suy ra d vuông góc với b.",
      },
    ],
    finalAnswer:
      "d⊥a nên có một góc 90°. Vì a//b và d cắt cả hai đường, góc đồng vị/so le trong tương ứng tại b cũng bằng 90°. Do đó d⊥b.",
  },
];
