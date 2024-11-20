import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BoardProgress, ProcessState } from './types';
import axiosInstance from '@/app/api/axiosInstance';

export const useProcessStore = create<ProcessState>()(
  persist(
    (set, get) => ({
      boardProgress: {} as BoardProgress,
      isVotingCompleted: false,
      isModalOpen: false,

      setModalOpen: (status: boolean) => set({ isModalOpen: status }),

      setVotingCompleted: (status: boolean) =>
        set({ isVotingCompleted: status }),

      setBoardProgress: (boardProgress: BoardProgress) =>
        set({ boardProgress }),

      setHost: (boardId: string, hostId: string) =>
        set((state) => ({
          boardProgress: {
            ...state.boardProgress,
            [boardId]: {
              ...state.boardProgress[boardId],
              hostId,
            },
          },
        })),

      resetVotingState: () =>
        set({ isVotingCompleted: false, isModalOpen: false }),

      addCompletedStep: async (boardId: string, step: number) => {
        try {
          const liveblocksToken = localStorage.getItem('roomToken');
          const response = await axiosInstance.patch(
            `/api/board/currentStep/${boardId}`,
            {
              currentStep: step,
            },
            {
              headers: {
                'Liveblocks-Token': liveblocksToken,
              },
            },
          );

          if (response.status === 200) {
            set((state) => {
              const boardState = state.boardProgress[boardId] || {
                completedSteps: [1],
                currentStep: 1,
                isLocked: false,
              };

              const completedSteps = Array.from(
                { length: step - 1 },
                (_, i) => i + 1,
              );

              return {
                boardProgress: {
                  ...state.boardProgress,
                  [boardId]: {
                    ...boardState,
                    currentStep: step,
                    completedSteps: [...new Set([...completedSteps])].sort(
                      (a, b) => a - b,
                    ),
                  },
                },
              };
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Failed to update step:', error);
          return false;
        }
      },

      isStepAccessible: (boardId: string, step: number) => {
        const state = get();
        const boardState = state.boardProgress[boardId];

        if (!boardState) return step === 1;
        if (boardState.isLocked) return false;

        const maxCompletedStep = Math.max(
          ...(boardState.completedSteps || [1]),
        );
        return step <= maxCompletedStep + 1;
      },

      setCurrentStep: async (boardId: string, step: number) => {
        try {
          const liveblocksToken = localStorage.getItem('roomToken');
          const response = await axiosInstance.patch(
            `/api/board/currentStep/${boardId}`,
            {
              currentStep: step,
            },
            {
              headers: {
                'Liveblocks-Token': liveblocksToken,
              },
            },
          );

          if (response.status === 200) {
            set((state) => {
              const existingState = state.boardProgress[boardId];
              const maxCompletedStep = Math.max(
                ...(existingState?.completedSteps || [1]),
              );

              return {
                boardProgress: {
                  ...state.boardProgress,
                  [boardId]: {
                    ...existingState,
                    currentStep: step,
                    completedSteps:
                      step > maxCompletedStep
                        ? Array.from({ length: step - 1 }, (_, i) => i + 1)
                        : existingState.completedSteps,
                  },
                },
              };
            });
          }
        } catch (error) {
          console.error('Error in setCurrentStep:', error);
        }
      },

      getCurrentStep: (boardId: string) => {
        const state = get();
        return state.boardProgress[boardId]?.currentStep || 1;
      },

      getCompletedSteps: (boardId: string) => {
        const state = get();
        return state.boardProgress[boardId]?.completedSteps || [1];
      },

      resetBoardProgress: (boardId: string) => {
        set((state) => ({
          boardProgress: {
            ...state.boardProgress,
            [boardId]: {
              completedSteps: [1],
              currentStep: 1,
              isLocked: false,
            },
          },
        }));
      },
    }),
    {
      name: 'board-progress-storage',
      version: 1,
    },
  ),
);
