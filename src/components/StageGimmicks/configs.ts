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

  4: {
    boxes: [
      {
        id: 'spread-box',
        type: 'spread',
        color: { r: 236, g: 72, b: 153 },
        position: { x: 150, y: 250 },
      },
    ],
    title: '아이디어를 확장해보세요',
    description: '핵심 아이디어로부터 다양한 관점과 가능성을 탐색해보세요',
  },
  5: {
    boxes: [
      {
        id: 'discussion-box',
        type: 'discussion',
        color: { r: 236, g: 72, b: 153 },
        position: { x: 150, y: 250 },
      },
    ],
    title: '정하고 토론해보세요',
    description: '대화하며 토론해서 결정하는 순간입니다.',
  },
  6: {
    boxes: [
      {
        id: 'persona-box',
        type: 'persona',
        color: { r: 147, g: 51, b: 134 },
        position: { x: 150, y: 250 },
      },
    ],
    title: '페르소나 정의하기',
    description: '우리 서비스의 주요 사용자 페르소나를 정의해봅시다',
  },
  7: {
    boxes: [
      {
        id: 'solving-problem-box',
        type: 'solvingProblem',
        color: { r: 59, g: 130, b: 246 },
        position: { x: 150, y: 250 },
      },
    ],
    title: '단계별 문제해결',
    description: 'How를 통해 문제를 단계별로 해결해보세요',
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

export const getPersonaEmoji = (age: number, gender: string) => {
  if (gender === 'male') {
    if (age < 13) return '👦';
    if (age < 20) return '👨‍🦱';
    if (age < 40) return '👨';
    if (age < 60) return '👨‍💼';
    return '👴';
  } else if (gender === 'female') {
    if (age < 13) return '👧';
    if (age < 20) return '👩‍🦱';
    if (age < 40) return '👩';
    if (age < 60) return '👩‍💼';
    return '👵';
  }
  return '🧑';
};

export const BOX_CONFIG = {
  define: {
    title: 'How Bad?',
    description: '현재 상황을 정의해주세요',
    icon: '❓',
    color: 'bg-blue-50 border-blue-200 text-blue-600',
    maxCount: 5,
    minLength: 20,
    guideQuestions: [
      '어떤 문제가 있나요?',
      '문제의 심각성은 어느 정도인가요?',
      '누구에게 영향을 미치나요?',
    ],
  },
  analyze: {
    title: 'How Come?',
    description: '원인을 분석해주세요',
    icon: '🔍',
    color: 'bg-amber-50 border-amber-200 text-amber-600',
    maxCount: 3,
    minLength: 30,
    guideQuestions: [
      '왜 이 문제가 발생했나요?',
      '어떤 요인들이 영향을 미쳤나요?',
      '근본적인 원인은 무엇인가요?',
    ],
  },
  solve: {
    title: 'How To?',
    description: '해결 방안을 제시해주세요',
    icon: '💡',
    color: 'bg-green-50 border-green-200 text-green-600',
    maxCount: 1,
    minLength: 40,
    guideQuestions: [
      '어떻게 해결할 수 있을까요?',
      '필요한 자원은 무엇인가요?',
      '실현 가능한 방법은 무엇인가요?',
    ],
  },
} as const;
