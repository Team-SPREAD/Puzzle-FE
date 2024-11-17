import { create } from 'zustand';
import { VoteState } from './types';

const initialState: Omit<
  VoteState,
  'setVotes' | 'setIsCompleted' | 'resetVoteState'
> = {
  votes: {},
  isCompleted: false,
  currentVoteCount: 0,
  totalUsers: 3,
};

export const useVoteStore = create<VoteState>((set) => ({
  ...initialState,

  setVotes: (votes: Record<string, { userId: string; timestamp: number }>) =>
    set({
      votes,
      currentVoteCount: Object.keys(votes).length,
    }),

  setIsCompleted: (isCompleted: boolean) => set({ isCompleted }),

  resetVoteState: () => set(initialState),
}));
