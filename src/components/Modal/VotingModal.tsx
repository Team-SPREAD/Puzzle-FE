import React from 'react';
import { useParams } from 'next/navigation';
import useProcessStore from '@/store/useProcessStore';
import useModalStore from '@/store/useModalStore';
import { motion } from 'framer-motion';
import { useStorage } from '@/liveblocks.config';

const VotingModal = () => {
  const { closeModal } = useModalStore();
  const params = useParams();
  const boardId = Array.isArray(params.boardId) ? params.boardId[0] : params.boardId;
  const { setCurrentStep } = useProcessStore();
  
  // 현재 단계 정보 가져오기
  const { currentStep } = useStorage((root) => ({
    currentStep: root.voting?.currentStep || 1
  }));

  const handleNextStep = async () => {
    if (!boardId) return;

    try {
      // 모달만 닫기
      closeModal();
    } catch (error) {
      console.error('Failed to proceed to next step:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-[400px] text-center"
      >
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-4">단계가 저장되었습니다!</h3>
          <p className="text-gray-600">
            다음 단계로 이동하시겠습니까?
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={closeModal}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleNextStep}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            다음 단계로 이동
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VotingModal;