export interface StageGimmick {
  boxes: {
    id: string;
    type: string;
    color: { r: number; g: number; b: number };
    position: { x: number; y: number };
  }[];
  title: string;
  description: string;
}

export const STAGE_GIMMICKS: { [key: number]: StageGimmick } = {
  2: {
    boxes: [
      {
        id: 'vision-box',
        type: 'vision',
        color: { r: 59, g: 130, b: 246 },
        position: { x: 150, y: 250 },
      },
    ],
    title: '우리는 왜 모였을까요?',
    description: '이 프로젝트에 대한 당신의 비전을 자유롭게 작성해주세요',
  },
};
