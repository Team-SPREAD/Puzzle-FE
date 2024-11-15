import React, { useEffect, useState } from 'react';
import { useMutation, useStorage, useSelf } from '@/liveblocks.config';
import { useUpdateMyPresence } from '@/liveblocks.config';
import useModalStore from '@/store/useModalStore';

interface VotingSystemProps {
  currentStep: number;
  onStepComplete: () => void;
}

const VotingSystem: React.FC<VotingSystemProps> = ({
  currentStep,
  onStepComplete,
}) => {
  const self = useSelf();
  const voting = useStorage((root) => root.voting);
  const { openModal } = useModalStore();

  const TOTAL_USERS = 2; // 테스트용 2명

  // 투표 상태 변경 감지 및 모달 표시
  useEffect(() => {
    if (voting?.votes && Object.keys(voting.votes).length === TOTAL_USERS) {
      openModal('VOTE_COMPLETE');
    }
  }, [voting?.votes]);

  // 단계 변경 시 투표 초기화
  useEffect(() => {
    resetVotes();
  }, [currentStep]);

  const resetVotes = useMutation(({ storage }) => {
    const voting = storage.get('voting');
    voting.set('votes', {});
    voting.set('isCompleted', false);
  }, []);

  const vote = useMutation(({ storage, self }) => {
    if (!self.id) return;

    const voting = storage.get('voting');
    const currentVotes = voting.get('votes') || {};

    if (currentVotes[self.id]) {
      return;
    }

    voting.set('votes', {
      ...currentVotes,
      [self.id]: {
        userId: self.id,
        timestamp: Date.now(),
      },
    });
  }, []);

  const voteCount = voting?.votes ? Object.keys(voting.votes).length : 0;
  const hasVoted = self.id ? !!(voting?.votes && voting.votes[self.id]) : false;
  const isAllVoted = voteCount === TOTAL_USERS;

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => vote()}
        disabled={hasVoted && !isAllVoted}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all
            ${isAllVoted ? 'bg-green-500' : 'bg-primary'} text-white hover:opacity-90
            ${hasVoted && !isAllVoted ? 'opacity-50 cursor-not-allowed' : ''}
          `}
      >
        {isAllVoted ? '저장하기' : 'Puzzle'}
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_USERS }).map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full transition-all duration-300 
                ${index < voteCount ? 'bg-green-500 scale-110' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default VotingSystem;
