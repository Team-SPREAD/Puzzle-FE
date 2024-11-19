import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useVoteAnimation } from '@/hooks/vote/useVoteAnimation';
import { useColorStore } from '@/store/vote/colorStore';
import { PuzzlePiece } from './components/PuzzlePiece';
import { SaveButton } from './components/SaveButton';
import { PuzzleText } from './components/PuzzleText';
import { useVoteProgress } from '@/hooks/vote/useVoteProgress';
import { generateRandomColor } from '@/utils/getRandomColor';

interface VotingSystemProps {
  currentStep: number;
  canvasRef: React.RefObject<HTMLDivElement>;
}

export const VotingSystem: React.FC<VotingSystemProps> = ({
  currentStep,
  canvasRef,
}) => {
  const params = useParams();
  const boardId = Array.isArray(params.boardId)
    ? params.boardId[0]
    : params.boardId;
  const {
    vote,
    saveProgress,
    isHost,
    hasVoted,
    voteCount,
    isCompleted,
    TOTAL_USERS,
  } = useVoteProgress(boardId, currentStep, canvasRef);
  const { showTransform } = useVoteAnimation(isCompleted, TOTAL_USERS);
  const { progressColor, puzzleColors, setPuzzleColors } = useColorStore();

  useEffect(() => {
    if (!puzzleColors || puzzleColors.length === 0) {
      setPuzzleColors(TOTAL_USERS);
    }
  }, [puzzleColors, setPuzzleColors, TOTAL_USERS]);

  const handleVote = () => {
    if (!hasVoted) {
      vote();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {isCompleted && !isHost && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-500 px-3 py-1.5 rounded-full bg-white/80"
        >
          호스트의 저장을 기다리는 중...
        </motion.div>
      )}

      <div className="bg-white/90 backdrop-blur-sm rounded-xl px-8 py-4">
        <div className="relative flex items-center justify-center w-[180px] h-[40px]">
          <AnimatePresence>
            {(!isCompleted || !showTransform) &&
              Array.from({ length: TOTAL_USERS }).map((_, index) => (
                <motion.div
                  key={index}
                  layout
                  className="relative mx-[4px]"
                  style={{ zIndex: TOTAL_USERS - index }}
                >
                  <PuzzlePiece
                    isVoted={index < voteCount}
                    color={puzzleColors[index]}
                    onClick={handleVote}
                    disabled={hasVoted}
                    shouldMerge={isCompleted}
                    index={index}
                    totalUsers={TOTAL_USERS}
                  />
                </motion.div>
              ))}
          </AnimatePresence>

          <AnimatePresence>
            {showTransform && !isHost && <PuzzleText color={progressColor} />}
          </AnimatePresence>
        </div>
      </div>

      {isCompleted && isHost && showTransform && (
        <SaveButton onClick={saveProgress} color={progressColor} />
      )}
    </div>
  );
};
