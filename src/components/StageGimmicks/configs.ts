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
  3: {
    boxes: [
      {
        id: 'topic-vote-box',
        type: 'topicVote',
        color: { r: 99, g: 102, b: 241 }, // Indigo 색상
        position: { x: 150, y: 250 },
      },
    ],
    title: '주제에 대해 투표해주세요',
    description: '프로젝트의 방향성을 결정하기 위해 의견을 나누고 투표해주세요',
  },
  8: {
    boxes: [
      {
        id: 'user-story-box',
        type: 'userStory',
        color: { r: 34, g: 197, b: 94 }, // Green 색상
        position: { x: 150, y: 250 },
      },
    ],
    title: '사용자 스토리 맵',
    description:
      '사용자가 목표를 달성하기 위해 수행하는 모든 행동을 시각적으로 정리합시다',
  },
};

export const REACTIONS = [
  { emoji: '👍', label: '좋아요' },
  { emoji: '🔥', label: '멋져요' },
  { emoji: '💡', label: '아이디어' },
  { emoji: '🤔', label: '고민해봐요' },
  { emoji: '❓', label: '궁금해요' },
];
