import React, { useEffect } from 'react';
import { useMutation, useStorage, useSelf, useBroadcastEvent } from '@/liveblocks.config';
import useProcessStore from '@/store/useProcessStore';
import useModalStore from '@/store/useModalStore';
import { useParams } from 'next/navigation';
import axiosInstance from '@/app/api/axiosInstance';
import { motion } from 'framer-motion';
import { CheckCircle2, Save, Vote } from 'lucide-react';

interface BoardInfo {
  _id: string;
  currentStep: number;
  team: string;
}

interface VotingSystemProps {
  currentStep: number;
}

const VotingSystem: React.FC<VotingSystemProps> = ({ currentStep }) => {
  const self = useSelf();
  const params = useParams();
  const boardId = Array.isArray(params.boardId) ? params.boardId[0] : params.boardId;
  const { openModal } = useModalStore();
  const broadcastEvent = useBroadcastEvent();
  const { initializeBoardProgress } = useProcessStore();


  
  // 보드 상태 동기화
  useEffect(() => {
    const syncBoardState = async () => {
      if (!boardId) return;

      try {
        // 보드 정보 조회
        const response = await axiosInstance.get(`/api/board/${boardId}`);
        const boardData = Array.isArray(response.data) ? response.data[0] : response.data;

        if (boardData) {
          const currentStepFromBoard = Number(boardData.currentStep);
          console.log('Board currentStep:', currentStepFromBoard);

          // 1부터 현재 단계까지만 completedSteps로 설정
          const completedSteps = Array.from(
            { length: currentStepFromBoard },
            (_, i) => i + 1
          );

          // 상태 초기화
          useProcessStore.getState().initializeBoardProgress(
            boardId,
            currentStepFromBoard,
            self.id,
            
          );
        }
      } catch (error) {
        console.error('Failed to sync board state:', error);
      }
    };

    // 컴포넌트 마운트 및 boardId 변경 시 동기화
    syncBoardState();
  }, [boardId, self.id]);

  const { host, voting } = useStorage((root) => ({
    host: root.host,
    voting: root.voting
  }));

  const isHost = host?.userId === self.id;
  const votes = voting?.votes || {};
  const voteCount = Object.keys(votes).length;
  const TOTAL_USERS = 2;

  // 투표하기
  const vote = useMutation(({ storage, self }) => {
    if (!self.id) return;
    
    const voting = storage.get('voting');
    if (!voting) return;

    const currentVotes = voting.get('votes') || {};
    if (currentVotes[self.id]) return;

    voting.set('votes', {
      ...currentVotes,
      [self.id]: { userId: self.id, timestamp: Date.now() }
    });

    if (Object.keys(currentVotes).length + 1 === TOTAL_USERS) {
      voting.set('isCompleted', true);
    }
  }, []);


  

  // 저장하기 (호스트만 가능)
  const saveProgress = useMutation(async ({ storage }) => {
    if (!boardId || !isHost) return;
  
    try {
      const nextStep = currentStep + 1;
      console.log('Saving progress:', { boardId, nextStep });
  
      const success = await useProcessStore.getState().addCompletedStep(boardId, nextStep);
      
      if (success) {
        // 현재 단계 업데이트
        useProcessStore.getState().setCurrentStep(boardId, nextStep);
  
        // 투표 상태 초기화
        const voting = storage.get('voting');
        if (voting) {
          voting.set('votes', {});
          voting.set('isCompleted', false);
          voting.set('currentStep', nextStep);
        }
  
        // 모달 표시
        openModal('VOTE_COMPLETE');
  
        // 다른 클라이언트들에게 단계 변경 알림
        broadcastEvent({ 
          type: 'NEXT_STEP', 
          nextStep 
        });
      }
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [boardId, currentStep, isHost]);


  return (
    <div className="flex flex-col items-center gap-4">
      {/* 투표 진행 상태 표시 */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl px-4 py-2 flex items-center gap-4">
        {/* 투표 카운터 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_USERS }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8 }}
                animate={{
                  scale: index < voteCount ? 1.1 : 1,
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 
                  ${index < voteCount 
                    ? 'bg-green-500 ring-2 ring-green-200' 
                    : 'bg-gray-200'
                  }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {voteCount}/{TOTAL_USERS}
          </span>
        </div>

        {/* 투표/저장 버튼 */}
        {!isHost ? (
          <motion.button
            initial={false}
            animate={{ 
              backgroundColor: votes[self.id?.toString() || ''] ? '#22c55e' : '#3b82f6',
              scale: votes[self.id?.toString() || ''] ? 0.98 : 1
            }}
            onClick={() => vote()}
            disabled={!!votes[self.id?.toString() || '']}
            className="px-4 py-1.5 rounded-lg flex items-center gap-2 text-white font-medium shadow-sm hover:shadow transition-all"
          >
            {votes[self.id?.toString() || ''] ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>투표 완료</span>
              </>
            ) : (
              <>
                <Vote className="w-4 h-4" />
                <span>투표하기</span>
              </>
            )}
          </motion.button>
        ) : voting?.isCompleted ? (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => saveProgress()}
            className="px-4 py-1.5 rounded-lg flex items-center gap-2 bg-green-500 text-white font-medium shadow-sm hover:bg-green-600 hover:shadow transition-all"
          >
            <Save className="w-4 h-4" />
            <span>저장하기</span>
          </motion.button>
        ) : (
          // 호스트도 투표할 수 있도록 투표 버튼 표시
          <motion.button
            initial={false}
            animate={{ 
              backgroundColor: votes[self.id?.toString() || ''] ? '#22c55e' : '#3b82f6',
              scale: votes[self.id?.toString() || ''] ? 0.98 : 1
            }}
            onClick={() => vote()}
            disabled={!!votes[self.id?.toString() || '']}
            className="px-4 py-1.5 rounded-lg flex items-center gap-2 text-white font-medium shadow-sm hover:shadow transition-all"
          >
            {votes[self.id?.toString() || ''] ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>투표 완료</span>
              </>
            ) : (
              <>
                <Vote className="w-4 h-4" />
                <span>투표하기</span>
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* 추가 정보 표시 (선택적) */}
      {voting?.isCompleted && !isHost && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-500 bg-white/80 px-3 py-1 rounded-full shadow-sm"
        >
          호스트의 저장을 기다리는 중...
        </motion.div>
      )}
    </div>
  );
};


export default VotingSystem;