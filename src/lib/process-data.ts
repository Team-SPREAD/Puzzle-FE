import { Process } from './types';

export const steps: Process[] = [
  {
    step: 1,
    title: '아이스 브레이킹',
    description: '펜, 도구, 텍스트를 이용하여 자신을 표현하세요.',
    camera: { x: 0, y: 0 },
    done: false,
  },
  {
    step: 2,
    title: '비전 설정',
    description: '우리가 모인 목적을 공유해보세요.',
    camera: { x: 0, y: -1000 },
    done: false,
  },
  {
    step: 3,
    title: '주제 선정',
    description: '주제를 정해봐요',
    camera: { x: 0, y: -2000 },
    done: false,
  },
  {
    step: 4,
    title: '스프레드',
    description: '주제를 다같이 정해봐요.',
    camera: { x: 0, y: -3000 },
    done: false,
  },
  {
    step: 5,
    title: '토론하기',
    description: '뭐가 좋을지! 생각해 봐요',
    camera: { x: 0, y: -4000 },
    done: false,
  },
  {
    step: 6,
    title: '페르소나',
    description: '몰입해봅시다',
    camera: { x: 0, y: -5000 },
    done: false,
  },
  {
    step: 7,
    title: '문제해결',
    description: '어떤 문제를 해결할까요?',
    camera: { x: 0, y: -6000 },
    done: false,
  },
  {
    step: 8,
    title: '사용자 스토리',
    description: '요약된 보고서를 확인해주세요',
    camera: { x: 0, y: -7000 },
    done: false,
  },
  {
    step: 9,
    title: '역할분담',
    description: '내 역할을 정해봐여',
    camera: { x: 0, y: -8000 },
    done: false,
  },
  {
    step: 10,
    title: '마무리',
    description: '요약된 보고서를 확인해주세요',
    camera: { x: 0, y: -9000 },
    done: false,
  },
];
