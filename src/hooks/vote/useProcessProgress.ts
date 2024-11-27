import { useProcessStore } from '@/store/vote/processStore';
import { BoardProgress } from '@/store/vote/types';
import axiosInstance from '@/app/api/axiosInstance';

export const useProcessProgress = (boardId: string) => {
  const { boardProgress, setBoardProgress } = useProcessStore();
  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Liveblocks-Token': localStorage.getItem('roomToken'),
    },
  });

  const initializeBoardProgress = (
    initialStep: number = 1,
    hostId?: string,
  ) => {
    const existingState = boardProgress[boardId];
    const maxStep = Math.max(
      initialStep,
      ...(existingState?.completedSteps || [1]),
    );

    const newBoardProgress = {
      ...boardProgress,
      [boardId]: {
        completedSteps: Array.from({ length: maxStep }, (_, i) => i + 1),
        currentStep: initialStep,
        isLocked: false,
        hostId: hostId || '',
      },
    };

    setBoardProgress(newBoardProgress);
  };

  const isStepAccessible = (step: number) => {
    const boardState = boardProgress[boardId];
    if (!boardState) return step === 1;
    if (boardState.isLocked) return false;

    const maxCompletedStep = Math.max(...(boardState.completedSteps || [1]));
    return step <= maxCompletedStep + 1;
  };

  const setCurrentStep = async (step: number) => {
    try {
      const response = await axiosInstance.patch(
        `/api/board/currentStep/${boardId}`,
        { currentStep: step },
        getHeaders(),
      );

      if (response.status === 200) {
        const existingState = boardProgress[boardId];
        const maxCompletedStep = Math.max(
          ...(existingState?.completedSteps || [1]),
        );

        const newBoardProgress = {
          ...boardProgress,
          [boardId]: {
            ...existingState,
            currentStep: step,
            completedSteps:
              step > maxCompletedStep
                ? Array.from({ length: step - 1 }, (_, i) => i + 1)
                : existingState.completedSteps,
          },
        };

        setBoardProgress(newBoardProgress);
      }
    } catch (error) {
      console.error('Error in setCurrentStep:', error);
    }
  };

  const addCompletedStep = async (step: number): Promise<boolean> => {
    try {
      const response = await axiosInstance.patch(
        `/api/board/currentStep/${boardId}`,
        { currentStep: step },
        getHeaders(),
      );

      if (response.status === 200) {
        const boardState = boardProgress[boardId] || {
          completedSteps: [1],
          currentStep: 1,
          isLocked: false,
        };

        const completedSteps = Array.from(
          { length: step - 1 },
          (_, i) => i + 1,
        );

        const newBoardProgress = {
          ...boardProgress,
          [boardId]: {
            ...boardState,
            currentStep: step,
            completedSteps: [...new Set([...completedSteps])].sort(
              (a, b) => a - b,
            ),
          },
        };

        setBoardProgress(newBoardProgress);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update step:', error);
      return false;
    }
  };

  const getCompletedSteps = () => boardProgress[boardId]?.completedSteps || [1];

  const getCurrentStep = () => boardProgress[boardId]?.currentStep || 1;

  const resetBoardProgress = () => {
    const newBoardProgress = {
      ...boardProgress,
      [boardId]: {
        completedSteps: [1],
        currentStep: 1,
        isLocked: false,
      },
    };
    setBoardProgress(newBoardProgress);
  };

  return {
    initializeBoardProgress,
    isStepAccessible,
    setCurrentStep,
    addCompletedStep,
    getCompletedSteps,
    getCurrentStep,
    resetBoardProgress,
  };
};
