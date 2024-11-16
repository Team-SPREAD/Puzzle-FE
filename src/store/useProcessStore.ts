import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '@/app/api/axiosInstance';

interface BoardProgress {
  [boardId: string]: {
    completedSteps: number[];
    currentStep: number;
    isLocked?: boolean;
    hostId?: string;
  };
}

interface ProcessState {
  boardProgress: BoardProgress;
  isVotingCompleted: boolean;
  isModalOpen: boolean;
  setModalOpen: (status: boolean) => void;
  setVotingCompleted: (status: boolean) => void;
  setHost: (boardId: string, hostId: string) => void;
  addCompletedStep: (boardId: string, step: number) => Promise<boolean>;
  isStepAccessible: (boardId: string, step: number) => boolean;
  setCurrentStep: (boardId: string, step: number) => Promise<void>;
  getCurrentStep: (boardId: string) => number;
  initializeBoardProgress: (
    boardId: string,
    initialStep?: number,
    hostId?: string,
  ) => void;
  getCompletedSteps: (boardId: string) => number[];
  resetBoardProgress: (boardId: string) => void;
  resetVotingState: () => void;
}

const useProcessStore = create<ProcessState>()(
  persist(
    (set, get) => ({
      boardProgress: {},
      isVotingCompleted: false,
      isModalOpen: false,

      resetVotingState: () => {
        set({ isVotingCompleted: false, isModalOpen: false });
      },

      setModalOpen: (status: boolean) => {
        set({ isModalOpen: status });
      },

      setVotingCompleted: (status: boolean) => {
        set({ isVotingCompleted: status });
      },

      setHost: (boardId: string, hostId: string) => {
        set((state) => ({
          boardProgress: {
            ...state.boardProgress,
            [boardId]: {
              ...state.boardProgress[boardId],
              hostId,
            },
          },
        }));
      },
      initializeBoardProgress: (
        boardId: string,
        initialStep: number = 1,
        hostId?: string,
      ) => {
        set((state) => {
          const existingState = state.boardProgress[boardId];
          const maxStep = Math.max(
            initialStep,
            ...(existingState?.completedSteps || [1]),
          );

          return {
            boardProgress: {
              ...state.boardProgress,
              [boardId]: {
                completedSteps: Array.from(
                  { length: maxStep },
                  (_, i) => i + 1,
                ),
                currentStep: initialStep,
                isLocked: false,
                hostId: hostId || '',
              },
            },
          };
        });
      },

      isStepAccessible: (boardId: string, step: number) => {
        const { boardProgress } = get();
        const boardState = boardProgress[boardId];

        if (!boardState) return step === 1;
        if (boardState.isLocked) return false;

        // 완료된 단계들 중 가장 높은 단계까지 접근 가능
        const maxCompletedStep = Math.max(...boardState.completedSteps);
        return step <= maxCompletedStep;
      },

      getCompletedSteps: (boardId: string) => {
        const { boardProgress } = get();
        return boardProgress[boardId]?.completedSteps || [1];
      },

      setCurrentStep: async (boardId: string, step: number) => {
        try {
          const response = await axiosInstance.patch(
            `/api/board/currentStep/${boardId}`,
            {
              currentStep: step,
            },
          );

          if (response.status === 200) {
            set((state) => {
              const existingState = state.boardProgress[boardId];
              // 현재 단계와 이전에 완료된 단계들 중 더 큰 값까지의 단계들을 completedSteps로 설정
              const maxStep = Math.max(
                step,
                ...(existingState?.completedSteps || [1]),
              );

              return {
                boardProgress: {
                  ...state.boardProgress,
                  [boardId]: {
                    ...existingState,
                    currentStep: step,
                    completedSteps: Array.from(
                      { length: maxStep },
                      (_, i) => i + 1,
                    ),
                  },
                },
              };
            });
          }
        } catch (error) {
          console.error('Error in setCurrentStep:', error);
        }
      },

      addCompletedStep: async (boardId: string, step: number) => {
        try {
          const response = await axiosInstance.patch(
            `/api/board/currentStep/${boardId}`,
            {
              currentStep: step,
            },
          );

          if (response.status === 200) {
            set((state) => {
              const boardState = state.boardProgress[boardId] || {
                completedSteps: [1],
                currentStep: 1,
                isLocked: false,
              };

              // 이전에 완료된 단계들을 유지하면서 새로운 단계 추가
              const maxStep = Math.max(step, ...boardState.completedSteps);
              const newCompletedSteps = Array.from(
                { length: maxStep },
                (_, i) => i + 1,
              );

              return {
                boardProgress: {
                  ...state.boardProgress,
                  [boardId]: {
                    ...boardState,
                    currentStep: step,
                    completedSteps: newCompletedSteps,
                  },
                },
                isVotingCompleted: false,
                isModalOpen: false,
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

      getCurrentStep: (boardId: string) => {
        const { boardProgress } = get();
        return boardProgress[boardId]?.currentStep || 1;
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

export default useProcessStore;
