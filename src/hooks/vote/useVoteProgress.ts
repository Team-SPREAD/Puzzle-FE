import {
  useBroadcastEvent,
  useMutation,
  useSelf,
  useStorage,
  useOthers,
} from '@/liveblocks.config';
import { useVoteStore } from '@/store/vote/voteStore';
import { useProcessStore } from '@/store/vote/processStore';
import useModalStore from '@/store/useModalStore';
import { captureAndUpload } from '@/app/api/canvas-axios';
import { useEffect, useState } from 'react';
import { getTeamMembers } from '@/app/api/dashboard-axios';
import useProgressModalStore from '@/store/useProgressModalStore'; // Progress Modal Store 사용

export const useVoteProgress = (
  boardId: string,
  currentStep: number,
  canvasRef: React.RefObject<HTMLElement>,
) => {
  const { openModal } = useModalStore(); // 추가
  const broadcastEvent = useBroadcastEvent();
  const self = useSelf();
  const others = useOthers(); // 다른 사용자들 가져오기

  const { host, voting } = useStorage((root) => ({
    host: root.host,
    voting: root.voting,
  }));
  const totalUsers = others.length + 1;

  useEffect(() => {
    useVoteStore.setState({ totalUsers });
  }, [totalUsers]); //방 인원수에 맞게 투표 수 변경

  const isHost = host?.userId === self.id;
  const votes = voting?.votes || {};
  const voteCount = Object.keys(votes).length;
  const hasVoted = self?.id ? !!votes[self.id] : false; // self.id null 체크
  const isCompleted = totalUsers > 0 && voteCount >= totalUsers; // 조건 수정

  const vote = useMutation(
    ({ storage, self }) => {
      if (!self?.id) return;

      const voting = storage.get('voting');
      if (!voting) return;

      const currentVotes = voting.get('votes') || {};
      if (currentVotes[self.id]) return;

      const newVotes = {
        ...currentVotes,
        [self.id]: { userId: self.id, timestamp: Date.now() },
      };

      voting.set('votes', newVotes);

      if (Object.keys(newVotes).length >= totalUsers) {
        voting.set('isCompleted', true);
      }
    },
    [totalUsers],
  );

  const saveProgress = useMutation(
    async ({ storage }) => {
      if (!boardId || !isHost) return;

      try {
        const nextStep = currentStep + 1;
        // 현재 단계를 완료 처리
        await useProcessStore.getState().addCompletedStep(boardId, currentStep);
        // 다음 단계로 이동
        await useProcessStore.getState().setCurrentStep(boardId, nextStep);

        const voting = storage.get('voting');
        if (voting) {
          voting.set('votes', {});
          voting.set('isCompleted', false);
          voting.set('currentStep', nextStep);
        }

        if (!canvasRef.current) {
          console.error('Canvas element is not available.');
          return;
        }

        const liveblocksToken = localStorage.getItem(`roomToken:${boardId}`);
        console.log(localStorage.getItem(`roomToken:${boardId}`));
        if (!liveblocksToken) {
          console.error('Liveblocks token is missing.');
          return;
        }

        try {
          const modalStore = useProgressModalStore.getState(); // Progress Modal Store 사용
          modalStore.openModal(); // Progress 모달 열기
          await captureAndUpload(
            canvasRef.current,
            boardId,
            currentStep,
            liveblocksToken,
          );
          modalStore.closeModal(); // 에러 발생 시 모달 닫기
        } catch (captureError) {
          console.error(
            'Failed to capture and upload the canvas:',
            captureError,
          );
          return;
        }

        openModal('VOTE_COMPLETE');
        broadcastEvent({
          type: 'NEXT_STEP',
          nextStep,
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    },
    [boardId, currentStep, isHost],
  );

  return {
    vote,
    saveProgress,
    isHost,
    hasVoted,
    voteCount,
    isCompleted,
    totalUsers,
  };
};
