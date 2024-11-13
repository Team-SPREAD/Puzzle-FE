import { BoardInfo } from '@/lib/types';
import { create } from 'zustand';

export type BoardStoreType = {
  Boards: BoardInfo[];
  setBoardsInfo: (boards: BoardInfo[]) => void;
};

const useBoardStore = create<BoardStoreType>((set) => ({
  Boards: [],
  setBoardsInfo: (boards) => set({ Boards: boards }),
}));

export default useBoardStore;
