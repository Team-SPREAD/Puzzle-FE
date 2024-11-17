export interface BoardProgress {
  [boardId: string]: {
    completedSteps: number[];
    currentStep: number;
    isLocked?: boolean;
    hostId?: string;
  };
}
export interface ProcessState {
  boardProgress: BoardProgress;
  isVotingCompleted: boolean;
  isModalOpen: boolean;
  setModalOpen: (status: boolean) => void;
  setVotingCompleted: (status: boolean) => void;
  setHost: (boardId: string, hostId: string) => void;
  setBoardProgress: (boardProgress: BoardProgress) => void;
  addCompletedStep: (boardId: string, step: number) => Promise<boolean>;
  isStepAccessible: (boardId: string, step: number) => boolean;
  setCurrentStep: (boardId: string, step: number) => Promise<void>;
  getCurrentStep: (boardId: string) => number;
  getCompletedSteps: (boardId: string) => number[];
  resetBoardProgress: (boardId: string) => void;
  resetVotingState: () => void;
}
export interface VoteState {
  votes: Record<string, { userId: string; timestamp: number }>;
  isCompleted: boolean;
  currentVoteCount: number;
  totalUsers: number;
  setVotes: (
    votes: Record<string, { userId: string; timestamp: number }>,
  ) => void;
  setIsCompleted: (isCompleted: boolean) => void;
  resetVoteState: () => void;
}

export interface ColorState {
  progressColor: string;
  setPuzzleColors: (totalUsers: number) => void;
  setProgressColor: () => void;
}
