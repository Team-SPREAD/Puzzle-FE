import { Process } from "./types";

export const steps: Process[] = [
  {
    step: 1,
    title: "아이스 브레이킹",
    description: "펜, 도구, 텍스트를 이용하여 자신을 표현하세요.",
    camera: { x: 0, y: 0 },
    done: false,
  },
  {
    step: 2,
    title: "팀 목표 설정",
    description: "우리가 모인 목적을 공유해보세요.",
    camera: { x: 0, y: -1000 },
    done: false,
  },
  {
    step: 3,
    title: "문제 선정",
    description: "우리의 문제는 무엇일까요?",
    camera: { x: 0, y: -2000 },
    done: false,
  },
  {
    step: 4,
    title: "주제 선정",
    description: "주제를 다같이 정해봐요.",
    camera: { x: 0, y: -3000 },
    done: false,
  },
  {
    step: 5,
    title: "페르소나",
    description: "다같이 몰입해서 생각해봅시다.",
    camera: { x: 0, y: -4000 },
    done: false,
  },
  {
    step: 6,
    title: "문재 해결",
    description: "HOW? 어떻게 해결하죠?",
    camera: { x: 0, y: -5000 },
    done: false,
  },
  {
    step: 7,
    title: "역할 분담",
    description: "에자일하게 나눠봅시다.",
    camera: { x: 0, y: -6000 },
    done: false,
  },
  {
    step: 8,
    title: "마무리",
    description: "요약된 보고서를 확인해주세요",
    camera: { x: 0, y: -7000 },
    done: false,
  },
  
];