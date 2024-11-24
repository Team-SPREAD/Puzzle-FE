import { create } from 'zustand';
import { generateRandomColor } from '@/utils/getRandomColor';

interface ColorState {
  progressColor: string;
  puzzleColors: string[];
  setPuzzleColors: (totalUsers: number) => void;
  setProgressColor: () => void;
}

export const useColorStore = create<ColorState>((set) => ({
  progressColor: '#3b82f6',
  puzzleColors: [],

  setPuzzleColors: (totalUsers: number) => {
    const colors = Array(totalUsers)
      .fill('')
      .map(() => generateRandomColor());
    set({ puzzleColors: colors });
  },

  setProgressColor: () => {
    const colors = [
      '#3b82f6', // blue
      '#f59e0b', // amber
      '#ef4444', // red
      '#ec4899', // pink
      '#14b8a6', // teal
      '#f97316', // orange
      '#84cc16', // lime
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    set({ progressColor: randomColor });
  },
}));
