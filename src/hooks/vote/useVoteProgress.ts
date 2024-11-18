import {
  useBroadcastEvent,
  useMutation,
  useSelf,
  useStorage,
} from '@/liveblocks.config';
import { useVoteStore } from '@/store/vote/voteStore';
import { useProcessStore } from '@/store/vote/processStore';
import useModalStore from '@/store/useModalStore';

export const useVoteProgress = (boardId: string, currentStep: number) => {
  const { openModal } = useModalStore(); // 추가
  const broadcastEvent = useBroadcastEvent();
  const self = useSelf();
  const { host, voting } = useStorage((root) => ({
    host: root.host,
    voting: root.voting,
  }));

  const isHost = host?.userId === self.id;
  const votes = voting?.votes || {};
  const voteCount = Object.keys(votes).length;
  const TOTAL_USERS = 1; // 상수로 정의
  const hasVoted = !!votes[self.id?.toString() || ''];
  const isCompleted = voteCount === TOTAL_USERS;

  const vote = useMutation(({ storage, self }) => {
    if (!self.id) return;

    const voting = storage.get('voting');
    if (!voting) return;

    const currentVotes = voting.get('votes') || {};
    if (currentVotes[self.id]) return;

    voting.set('votes', {
      ...currentVotes,
      [self.id]: { userId: self.id, timestamp: Date.now() },
    });

    const voteCount = Object.keys(currentVotes).length + 1;
    if (voteCount === useVoteStore.getState().totalUsers) {
      voting.set('isCompleted', true);
    }
  }, []); // 빈 배열 추가

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
  ); // 의존성 배열 추가

  return {
    vote,
    saveProgress,
    isHost,
    hasVoted,
    voteCount,
    isCompleted,
    TOTAL_USERS,
  };
};
