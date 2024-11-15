import React from 'react';
import useModalStore from '@/store/useModalStore';
const VotingModal = ({ onNextStep }: { onNextStep: () => void }) => {
  const { modalType, closeModal } = useModalStore();
  const isOpen = modalType === 'VOTE_COMPLETE';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px] text-center animate-in fade-in zoom-in">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-4">모든 팀원이 준비되었습니다!</h3>
          <p className="text-gray-600">다음 단계로 이동하시겠습니까?</p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={closeModal}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => {
              onNextStep();
              closeModal();
            }}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            다음 단계로
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotingModal;