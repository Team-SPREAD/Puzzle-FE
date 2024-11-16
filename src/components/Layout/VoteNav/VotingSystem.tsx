import React, { useEffect, useState } from 'react';
import {
  useMutation,
  useStorage,
  useSelf,
  useBroadcastEvent,
} from '@/liveblocks.config';
import useProcessStore from '@/store/useProcessStore';
import useModalStore from '@/store/useModalStore';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Save } from 'lucide-react';
import { generateRandomColor } from '@/utils/getRandomColor';
import { useColorStore } from '@/store/useColorStore';

interface VotingSystemProps {
  currentStep: number;
}

interface PuzzlePieceProps {
  isVoted: boolean;
  color: string;
  onClick: () => void;
  disabled: boolean;
  className?: string;
  shouldMerge?: boolean;
  index: number;
  isLast: boolean;
  totalUsers: number;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  isVoted,
  color,
  onClick,
  disabled,
  className = '',
  shouldMerge = false,
  index,
  isLast,
  totalUsers,
}) => {
  const centerOffset = (totalUsers - 1) / 2;
  // 초기 간격을 더 크게 설정하여 모이는 과정이 잘 보이도록
  const xOffset = shouldMerge
    ? 0 // 최종 위치는 중앙
    : (index - centerOffset) * 35; // 초기 간격 증가

  return (
    <div className="relative">
      <motion.svg
        width="25"
        height="21"
        viewBox="0 0 25 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`cursor-pointer transition-transform ${className} ${
          disabled ? 'cursor-not-allowed' : ''
        }`}
        onClick={onClick}
        whileHover={disabled ? undefined : { scale: 1.1 }}
        animate={{
          x: xOffset,
          scale: shouldMerge ? 0.6 : 1, // 크기 변화를 더 작게
          opacity: shouldMerge ? 0 : 1,
          transition: {
            x: {
              duration: 0.8, // 이동 시간 증가
              ease: 'easeInOut',
              delay: index * 0.15, // 순차적 이동 딜레이 증가
            },
            scale: {
              duration: 0.6,
              delay: 0.6 + index * 0.15, // 크기/투명도 변화는 이동 후에 시작
            },
            opacity: {
              duration: 0.6,
              delay: 0.6 + index * 0.15,
            },
          },
        }}
        initial={{ scale: 0.9, opacity: 0 }}
      >
        <path
          d="M20.5 6.5C26.3699 5.01859 25.866 16.2016 20.5 14.5V21H13.1626C15.8147 14.5038 5.2241 14.2936 7.7082 21H0.715588V13.9333C6.09044 15.6349 6.58549 5.24499 0.715588 6.7264V0H20.5V6.5Z"
          fill={isVoted ? color : '#C9CACA'}
          className="transition-colors duration-300"
        />
      </motion.svg>
    </div>
  );
};

const VotingSystem: React.FC<VotingSystemProps> = ({ currentStep }) => {
  const self = useSelf();
  const params = useParams();
  const boardId = Array.isArray(params.boardId)
    ? params.boardId[0]
    : params.boardId;
  const { openModal } = useModalStore();
  const broadcastEvent = useBroadcastEvent();
  const [puzzleColors, setPuzzleColors] = useState<string[]>([]);
  const { progressColor } = useColorStore();

  const { host, voting } = useStorage((root) => ({
    host: root.host,
    voting: root.voting,
  }));

  const isHost = host?.userId === self.id;
  const votes = voting?.votes || {};
  const voteCount = Object.keys(votes).length;
  const TOTAL_USERS = 3;
  const hasVoted = !!votes[self.id?.toString() || ''];
  const isCompleted = voteCount === TOTAL_USERS;

  // 초기 퍼즐 색상 설정
  useEffect(() => {
    setPuzzleColors(
      Array(TOTAL_USERS)
        .fill('')
        .map(() => generateRandomColor()),
    );
  }, []);

  const vote = useMutation(({ storage, self }) => {
    if (!self.id) return;

    const voting = storage.get('voting');
    if (!voting) return;

    const currentVotes = voting.get('votes') || {};
    if (currentVotes[self.id]) return;

    voting.set('votes', {
      ...currentVotes,
      [self.id]: {
        userId: self.id,
        timestamp: Date.now(),
      },
    });

    if (Object.keys(currentVotes).length + 1 === TOTAL_USERS) {
      voting.set('isCompleted', true);
    }
  }, []);

  const saveProgress = useMutation(
    async ({ storage }) => {
      if (!boardId || !isHost) return;

      try {
        const nextStep = currentStep + 1;
        const success = await useProcessStore
          .getState()
          .addCompletedStep(boardId, nextStep);

        if (success) {
          useProcessStore.getState().setCurrentStep(boardId, nextStep);

          const voting = storage.get('voting');
          if (voting) {
            voting.set('votes', {});
            voting.set('isCompleted', false);
            voting.set('currentStep', nextStep);
          }

          openModal('VOTE_COMPLETE');
          broadcastEvent({
            type: 'NEXT_STEP',
            nextStep,
          });
        }
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    },
    [boardId, currentStep, isHost],
  );

  const handleVote = () => {
    if (!hasVoted) {
      vote();
    }
  };
  // 퍼즐 변환 애니메이션 상태
  const [showTransform, setShowTransform] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      // 퍼즐이 모이고 사라지는 총 시간을 계산
      // 마지막 퍼즐의 이동 시간(0.8) + 딜레이(0.15 * (TOTAL_USERS-1)) + 사라지는 시간(0.6)
      const totalAnimationTime = 800 + (150 * (TOTAL_USERS - 1)) + 600;
      
      const timer = setTimeout(() => {
        setShowTransform(true);
      }, totalAnimationTime);

      return () => clearTimeout(timer);
    } else {
      setShowTransform(false);
    }
  }, [isCompleted, TOTAL_USERS]);

  return (
    <div className="flex flex-col items-center gap-4">
      {voting?.isCompleted && !isHost && (
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
                    isLast
                  />
                </motion.div>
              ))}
          </AnimatePresence>

          {/* PUZZLE 텍스트 */}
          <AnimatePresence>
            {showTransform && !isHost && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                  },
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div
                  style={{ color: progressColor }}
                  className="text-2xl font-bold tracking-wider"
                >
                  PUZZLE!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 호스트 저장 버튼 - showTransform 상태에 따라 표시 */}
      {voting?.isCompleted && isHost && showTransform && (
        <motion.button
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          onClick={() => saveProgress()}
          style={{ backgroundColor: progressColor }}
          className="px-6 py-2.5 rounded-lg flex items-center gap-2 text-white font-medium hover:brightness-110 transition-all shadow-lg mb-4"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Save className="w-4 h-4 " />
          <span>저장하기</span>
        </motion.button>
      )}
    </div>
  );
};

export default VotingSystem;
