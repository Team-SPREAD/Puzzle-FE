import {
  useBroadcastEvent,
  useMutation,
  useSelf,
  useStorage,
} from '@/liveblocks.config';
import { useVoteStore } from '@/store/vote/voteStore';
import { useProcessStore } from '@/store/vote/processStore';
import useModalStore from '@/store/useModalStore';
import { getTeamMembers } from '@/app/api/dashboard-axios';
import { useState, useEffect } from 'react';

export const useVoteProgress = (boardId: string, currentStep: number) => {
  const { openModal } = useModalStore();
  const broadcastEvent = useBroadcastEvent();
  const self = useSelf();
  const { host, voting } = useStorage((root) => ({
    host: root.host,
    voting: root.voting,
  }));
  const [totalUsers, setTotalUsers] = useState(1);

  useEffect(() => {
    const fetchTeamUsers = async () => {
      if (!boardId) return; // boardId 체크 추가

      try {
        const response = await getTeamMembers(
          boardId,
          localStorage.getItem('token') || '',
        );
        if (response.data && Array.isArray(response.data)) {
          // 데이터 유효성 검사
          setTotalUsers(response.data.length);
          useVoteStore.setState({ totalUsers: response.data.length });
        }
      } catch (error) {
        console.error('Error fetching team users:', error);
        // 에러 시에도 기존 상태 유지
      }
    };

    fetchTeamUsers();
  }, [boardId]);

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
