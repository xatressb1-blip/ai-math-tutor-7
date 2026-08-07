import type { LessonDefinition } from "@/types/lesson";

export const lesson10: LessonDefinition = {
  id: "lesson-player-10",
  knowledgeNodeId: "lesson-10-tien-de-euclid-tinh-chat-song-song",
  grade: 7,
  chapter: 3,
  lessonNumber: 10,
  title: "Tiên đề Euclid. Tính chất của hai đường thẳng song song",
  subtitle: "Đường thẳng song song duy nhất qua một điểm và các góc tạo bởi đường cắt",
  objectives: [
  "Hiểu tiên đề Euclid về đường thẳng song song.",
  "Sử dụng tính chất của hai đường thẳng song song.",
  "Tính số đo góc khi có hai đường thẳng song song."
],
  estimatedMinutes: 28,
  steps: [
    {
      id: "welcome",
      action: "WELCOME",
      title: "Bắt đầu Bài 10",
      content: "Ta sẽ học bằng cách quan sát, gọi tên đúng khái niệm, rồi giải thích vì sao kết luận đúng.",
      estimatedMinutes: 1,
    },
    {
      id: "objective",
      action: "OBJECTIVE",
      title: "Mục tiêu",
      content: "Hiểu tiên đề Euclid về đường thẳng song song. • Sử dụng tính chất của hai đường thẳng song song. • Tính số đo góc khi có hai đường thẳng song song.",
      estimatedMinutes: 2,
    },
    {
      id: "explain",
      action: "EXPLAIN",
      title: "Kiến thức trọng tâm",
      content: "Qua một điểm nằm ngoài một đường thẳng, chỉ có một đường thẳng song song với đường thẳng đó. Nếu một đường thẳng cắt hai đường thẳng song song thì các cặp góc so le trong bằng nhau và các cặp góc đồng vị bằng nhau.",
      estimatedMinutes: 7,
    },
    {
      id: "example",
      action: "EXAMPLE",
      title: "Ví dụ minh họa",
      content: "Ví dụ: nếu a ∥ b và c là đường cắt, một góc đồng vị bằng 125° thì góc đồng vị tương ứng cũng bằng 125°.",
      estimatedMinutes: 5,
    },
    {
      id: "question-1",
      action: "QUESTION",
      title: "Kiểm tra nhanh",
      content: "Chọn đáp án rồi giải thích lại bằng lời của em.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-10-q1",
        prompt: "Qua điểm M nằm ngoài đường thẳng a có bao nhiêu đường thẳng đi qua M và song song với a?",
        choices: [
            { id: "a", text: "0" },
            { id: "b", text: "1" },
            { id: "c", text: "2" },
            { id: "d", text: "Vô số" }
        ],
        correctChoiceId: "b",
        skillName: "Tiên đề Euclid",
        hint: "Đây là nội dung cốt lõi của tiên đề Euclid.",
        retryHint: "Chỉ có một đường thẳng như vậy.",
        explanation: "Có duy nhất một.",
      },
    },
    {
      id: "question-2",
      action: "QUESTION",
      title: "Vận dụng",
      content: "Quan sát quan hệ trước khi tính hoặc kết luận.",
      estimatedMinutes: 5,
      question: {
        id: "lesson-player-10-q2",
        prompt: "Nếu a ∥ b và c cắt a, b thì hai góc so le trong tương ứng có quan hệ?",
        choices: [
            { id: "a", text: "Bù nhau luôn" },
            { id: "b", text: "Bằng nhau" },
            { id: "c", text: "Phụ nhau" },
            { id: "d", text: "Không liên hệ" }
        ],
        correctChoiceId: "b",
        skillName: "Tính chất song song",
        hint: "Đây là chiều ngược với dấu hiệu nhận biết đã học.",
        retryHint: "Song song → so le trong bằng nhau.",
        explanation: "Hai góc so le trong bằng nhau.",
      },
    },
    {
      id: "summary",
      action: "SUMMARY",
      title: "Chốt bài",
      content: "Nhớ hai chiều: dùng góc để nhận biết song song; khi đã biết song song thì dùng tính chất để suy ra các góc bằng nhau.",
      estimatedMinutes: 4,
    },
  ],
};
