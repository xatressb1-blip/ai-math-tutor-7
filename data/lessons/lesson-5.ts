import type { LessonDefinition } from "@/types/lesson";

export const lesson5: LessonDefinition = {
  id: "lesson-player-05",
  knowledgeNodeId: "lesson-5-thap-phan-vo-han-tuan-hoan",
  grade: 7,
  chapter: 2,
  lessonNumber: 5,
  title: "Làm quen với số thập phân vô hạn tuần hoàn",
  subtitle: "Số thập phân hữu hạn, vô hạn tuần hoàn, chu kì và làm tròn theo độ chính xác",
  objectives: [
  "Nhận biết số thập phân vô hạn tuần hoàn.",
  "Xác định chu kì.",
  "Làm tròn theo độ chính xác cho trước."
],
  estimatedMinutes: 28,
  steps: [
    {
      id: "welcome",
      action: "WELCOME",
      title: "Bắt đầu Bài 5",
      content: "Ta sẽ học bằng cách quan sát, gọi tên đúng khái niệm, rồi giải thích vì sao kết luận đúng.",
      estimatedMinutes: 1,
    },
    {
      id: "objective",
      action: "OBJECTIVE",
      title: "Mục tiêu",
      content: "Nhận biết số thập phân vô hạn tuần hoàn. • Xác định chu kì. • Làm tròn theo độ chính xác cho trước.",
      estimatedMinutes: 2,
    },
    {
      id: "explain",
      action: "EXPLAIN",
      title: "Kiến thức trọng tâm",
      content: "Một số hữu tỉ khi viết dạng thập phân sẽ hữu hạn hoặc vô hạn tuần hoàn. Phần lặp lại mãi được gọi là chu kì. Khi làm tròn, cần xác định đúng hàng làm tròn tương ứng với độ chính xác.",
      estimatedMinutes: 7,
    },
    {
      id: "example",
      action: "EXAMPLE",
      title: "Ví dụ minh họa",
      content: "Ví dụ: 5/18 = 0,2(7), trong đó 7 là chu kì. Số 2,376 làm tròn đến hàng phần mười là 2,4.",
      estimatedMinutes: 5,
    },
    {
      id: "question-1",
      action: "QUESTION",
      title: "Kiểm tra nhanh",
      content: "Chọn đáp án rồi giải thích lại bằng lời của em.",
      estimatedMinutes: 4,
      question: {
        id: "lesson-player-05-q1",
        prompt: "Số nào là số thập phân vô hạn tuần hoàn?",
        choices: [
            { id: "a", text: "0,125" },
            { id: "b", text: "0,2(7)" },
            { id: "c", text: "3,14" },
            { id: "d", text: "2,75" }
        ],
        correctChoiceId: "b",
        skillName: "Nhận biết số thập phân tuần hoàn",
        hint: "Tìm số có phần thập phân lặp lại mãi.",
        retryHint: "Kí hiệu trong ngoặc cho biết chu kì.",
        explanation: "0,2(7) là số thập phân vô hạn tuần hoàn.",
      },
    },
    {
      id: "question-2",
      action: "QUESTION",
      title: "Vận dụng",
      content: "Quan sát quan hệ trước khi tính hoặc kết luận.",
      estimatedMinutes: 5,
      question: {
        id: "lesson-player-05-q2",
        prompt: "Làm tròn 12,746 với độ chính xác 0,05, ta làm tròn đến hàng nào?",
        choices: [
            { id: "a", text: "Hàng đơn vị" },
            { id: "b", text: "Hàng phần mười" },
            { id: "c", text: "Hàng phần trăm" },
            { id: "d", text: "Hàng phần nghìn" }
        ],
        correctChoiceId: "b",
        skillName: "Làm tròn theo độ chính xác",
        hint: "Độ chính xác bằng nửa đơn vị của hàng làm tròn.",
        retryHint: "0,05 là một nửa của 0,1.",
        explanation: "Cần làm tròn đến hàng phần mười.",
      },
    },
    {
      id: "summary",
      action: "SUMMARY",
      title: "Chốt bài",
      content: "Nhớ: số hữu tỉ có dạng thập phân hữu hạn hoặc vô hạn tuần hoàn; chu kì là phần lặp; chọn hàng làm tròn theo độ chính xác.",
      estimatedMinutes: 4,
    },
  ],
};
