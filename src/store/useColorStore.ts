import { create } from 'zustand';

interface ColorState {
  progressColor: string;
  setProgressColor: () => void;
}

export const useColorStore = create<ColorState>()((set) => ({
  progressColor: "#3b82f6", // 기본 색상
  setProgressColor: () => {
    const colors = [
      "#3b82f6", // blue
      "#f59e0b", // amber
      "#ef4444", // red
      "#ec4899", // pink
      "#14b8a6", // teal
      "#f97316", // orange
      "#84cc16", // lime
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    set({ progressColor: randomColor });
  },
}));