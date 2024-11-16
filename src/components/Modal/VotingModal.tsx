import React from 'react';
import { useParams } from 'next/navigation';
import useProcessStore from '@/store/useProcessStore';
import useModalStore from '@/store/useModalStore';
import { motion } from 'framer-motion';
import { useStorage } from '@/liveblocks.config';
import Lottie from 'lottie-react';
import think from '~/lotties/think.json'; //이건 나중에 변경
import { useColorStore } from '@/store/useColorStore';

const VotingModal = () => {
  const { closeModal } = useModalStore();
  const params = useParams();
  const boardId = Array.isArray(params.boardId) ? params.boardId[0] : params.boardId;
  const { setCurrentStep } = useProcessStore();
  const { progressColor } = useColorStore();
  
  const { currentStep } = useStorage((root) => ({
    currentStep: root.voting?.currentStep || 1
  }));

  const handleNextStep = async () => {
    if (!boardId) return;

    try {
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
        className="bg-white p-8 rounded-2xl shadow-xl w-[400px] text-center relative overflow-hidden"
      >
        {/* 배경 블러 효과 */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-10" />
        
        {/* Lottie 애니메이션 */}
        <div className="relative -mt-10 -mb-10 z-0">
          <Lottie
            animationData={think}
            loop={true}
            style={{ height: 200 }}
          />
        </div>

        <div className="relative z-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h3 className="text-2xl font-bold mb-4 mt-10">단계가 저장되었습니다!</h3>
            <p className="text-gray-600">
              다음 단계로 이동하시겠습니까?
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={closeModal}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              취소
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNextStep}
              style={{ backgroundColor: progressColor }}
              className="px-6 py-2 text-white rounded-lg hover:brightness-110 transition-all"
            >
              다음 단계로 이동
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default VotingModal;