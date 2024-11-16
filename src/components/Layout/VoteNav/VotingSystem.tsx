import React, { useEffect } from 'react';
import { useMutation, useStorage, useSelf, useBroadcastEvent } from '@/liveblocks.config';
import useProcessStore from '@/store/useProcessStore';
import useModalStore from '@/store/useModalStore';
import { useParams } from 'next/navigation';
import axiosInstance from '@/app/api/axiosInstance';

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
    <div className="flex items-center gap-4">
      {!isHost && (
        <button
          onClick={() => vote()}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all
            ${votes[self.id?.toString() || ''] 
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-primary text-white hover:opacity-90'}`}
          disabled={!!votes[self.id?.toString() || '']}
        >
          {votes[self.id?.toString() || ''] ? '투표 완료' : '투표하기'}
        </button>
      )}

      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_USERS }).map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full transition-all duration-300 
              ${index < voteCount ? 'bg-green-500 scale-110' : 'bg-gray-300'}`}
          />
        ))}
      </div>

      {isHost && voting?.isCompleted && (
        <button
          onClick={() => saveProgress()}
          className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all bg-green-500 text-white hover:bg-green-600"
        >
          저장하기
        </button>
      )}
    </div>
  );
};

export default VotingSystem;