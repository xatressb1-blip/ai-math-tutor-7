import type { LessonDefinition } from "@/types/lesson";

export const lesson7: LessonDefinition = {
  id: "lesson-player-07",
  knowledgeNodeId: "lesson-7-tap-hop-so-thuc",
  grade: 7,
  chapter: 2,
  lessonNumber: 7,
  title: "Tập hợp các số thực",
  subtitle: "Số thực, số đối, trục số thực, thứ tự và giá trị tuyệt đối",
  objectives: [
    "Nhận biết tập hợp số thực.",
    "Nhận biết số đối của một số thực.",
    "Biểu diễn số thực trên trục số trong trường hợp thuận lợi.",
    "So sánh số thực trong trường hợp phù hợp.",
    "Hiểu giá trị tuyệt đối là khoảng cách đến 0.",
  ],
  estimatedMinutes: 32,
  steps: [
    { id:"welcome", action:"WELCOME", title:"Bắt đầu Bài 7", content:"Ta sẽ nối số hữu tỉ và số vô tỉ thành tập số thực, rồi dùng trục số để hiểu số đối, thứ tự và giá trị tuyệt đối.", estimatedMinutes:1 },
    { id:"objective", action:"OBJECTIVE", title:"Mục tiêu", content:"Nhận biết R; xác định số đối; biểu diễn và so sánh số thực trên trục số; hiểu giá trị tuyệt đối là khoảng cách đến 0.", estimatedMinutes:2 },
    { id:"explain-real", action:"EXPLAIN", title:"Tập hợp số thực R", content:"Số hữu tỉ và số vô tỉ gọi chung là số thực, kí hiệu R. Mỗi số thực được biểu diễn bởi một điểm trên trục số.", estimatedMinutes:5 },
    { id:"question-real", action:"QUESTION", title:"Checkpoint 1", content:"Chọn mô tả đúng.", estimatedMinutes:3, question:{
      id:"lesson-player-07-q1", prompt:"Khẳng định nào mô tả đúng tập hợp số thực R?",
      choices:[{id:"a",text:"R gồm cả số hữu tỉ và số vô tỉ"},{id:"b",text:"R chỉ gồm số hữu tỉ"},{id:"c",text:"R chỉ gồm số vô tỉ"},{id:"d",text:"R không chứa số 0"}],
      correctChoiceId:"a", skillName:"Nhận biết số thực", hint:"R là tập hợp chung của hai nhóm số đã học trong Chương II.", retryHint:"Số hữu tỉ và số vô tỉ đều là số thực.", explanation:"R gồm cả số hữu tỉ và số vô tỉ."
    }},
    { id:"explain-opposite-line", action:"EXPLAIN", title:"Số đối và trục số thực", content:"Hai số đối nhau nằm ở hai phía của 0 và cách 0 một khoảng bằng nhau. Trên trục số, số nhỏ hơn nằm bên trái số lớn hơn.", estimatedMinutes:5 },
    { id:"question-opposite", action:"QUESTION", title:"Checkpoint 2", content:"Xác định số đối.", estimatedMinutes:3, question:{
      id:"lesson-player-07-q2", prompt:"Số đối của √2 là số nào?",
      choices:[{id:"a",text:"-√2"},{id:"b",text:"√2"},{id:"c",text:"1/√2"},{id:"d",text:"2"}],
      correctChoiceId:"a", skillName:"Số đối của số thực", hint:"Hai số đối nhau có tổng bằng 0.", retryHint:"Giữ độ lớn và đổi dấu.", explanation:"Số đối của √2 là -√2."
    }},
    { id:"question-line", action:"QUESTION", title:"Checkpoint 3", content:"Dùng vị trí trên trục số.", estimatedMinutes:3, question:{
      id:"lesson-player-07-q3", prompt:"Biết 1 < √2 < 2. Điểm biểu diễn √2 nằm ở đâu trên trục số?",
      choices:[{id:"a",text:"Giữa 1 và 2"},{id:"b",text:"Giữa -2 và -1"},{id:"c",text:"Bên trái -2"},{id:"d",text:"Tại 0"}],
      correctChoiceId:"a", skillName:"Biểu diễn số thực trên trục số", hint:"Dựa trực tiếp vào bất đẳng thức 1 < √2 < 2.", retryHint:"Số nằm giữa 1 và 2 thì điểm biểu diễn cũng nằm giữa hai mốc đó.", explanation:"√2 nằm giữa 1 và 2 trên trục số."
    }},
    { id:"question-compare", action:"QUESTION", title:"Checkpoint 4", content:"So sánh số thực.", estimatedMinutes:3, question:{
      id:"lesson-player-07-q4", prompt:"So sánh √5 và √7.",
      choices:[{id:"a",text:"√5 < √7"},{id:"b",text:"√5 > √7"},{id:"c",text:"√5 = √7"},{id:"d",text:"Không thể so sánh"}],
      correctChoiceId:"a", skillName:"So sánh số thực", hint:"5 và 7 đều dương; trước hết so sánh 5 với 7.", retryHint:"5 < 7 nên √5 < √7.", explanation:"√5 < √7."
    }},
    { id:"explain-absolute", action:"EXPLAIN", title:"Giá trị tuyệt đối", content:"Giá trị tuyệt đối |a| là khoảng cách từ điểm biểu diễn a đến 0 trên trục số, nên luôn không âm.", estimatedMinutes:4 },
    { id:"question-absolute", action:"QUESTION", title:"Checkpoint 5", content:"Dùng nghĩa khoảng cách.", estimatedMinutes:3, question:{
      id:"lesson-player-07-q5", prompt:"|-5,2| bằng bao nhiêu?",
      choices:[{id:"a",text:"5,2"},{id:"b",text:"-5,2"},{id:"c",text:"0"},{id:"d",text:"10,4"}],
      correctChoiceId:"a", skillName:"Giá trị tuyệt đối", hint:"Hãy nghĩ tới khoảng cách từ -5,2 đến 0.", retryHint:"Khoảng cách không thể âm.", explanation:"|-5,2| = 5,2."
    }},
    { id:"summary", action:"SUMMARY", title:"Chốt bài", content:"R gồm số hữu tỉ và vô tỉ. Số đối đối xứng qua 0; trục số thể hiện thứ tự; |a| là khoảng cách từ a đến 0.", estimatedMinutes:2 },
  ],
};
