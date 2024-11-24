'use client';
import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie-player';
import puzzleLottie from '~/lotties/puzzle.json';
import pencilLottie from '~/lotties/pencil.json';
import confettiLottie from '~/lotties/confetti.json';
import MarkDownModal from '@/components/AniModals/MarkDownModal';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultModalProps {
  onClose: () => void;
  onConfirm: () => void;
  isGenerating: boolean;
}

const ResultModal: React.FC<ResultModalProps> = ({
  onClose,
  onConfirm,
  isGenerating,
}) => {
  const [progress, setProgress] = useState(0);
  const [showMarkDownModal, setShowMarkDownModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: confettiLottie,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isGenerating) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setShowMarkDownModal(true);
            setShowConfetti(true); // 100%가 되면 confetti 표시
            return 100;
          }
          return prev + 1;
        });
      }, 200);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isGenerating]);

  // Confetti 애니메이션이 끝나면 자동으로 숨기기
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000); // 3초 후에 confetti 숨기기

      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <>
      {/* Confetti Layer */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[60]"
          >
            <Lottie
              loop={false}
              animationData={confettiLottie}
              play
              style={{ width: '100%', height: '100%' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Layer */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="flex h-fit w-[30rem] flex-col items-center justify-center gap-[0.8rem] rounded-[2rem] bg-white px-[4.45rem] py-[3.2rem] shadow-2xl relative">
          <button
            className="absolute top-4 right-4 text-gray-400 text-2xl hover:text-gray-900"
            onClick={onClose}
          >
            ✕
          </button>

          {isGenerating ? (
            <>
              <div className="flex h-[16rem] w-[16rem] items-center justify-center">
                <Lottie
                  loop
                  animationData={pencilLottie}
                  play
                  style={{ width: 216, height: 216 }}
                />
              </div>
              <span className="text-[2rem] font-bold text-div-text">
                결과를 만드는 중입니다
              </span>
              <div className="w-full h-4 bg-gray-200 rounded-full mt-4">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[1.4rem] text-gray-600 mt-2">
                {progress}%
              </span>
            </>
          ) : (
            <>
              <div className="flex h-[16rem] w-[16rem] items-center justify-center">
                <Lottie
                  loop
                  animationData={puzzleLottie}
                  play
                  style={{ width: 216, height: 216 }}
                />
              </div>
              <span className="text-[2.6rem] font-bold text-div-text">
                퍼즐이 모였습니다.
              </span>
              <span className="text-[1.6rem] font-normal text-div-text">
                결과를 확인해보세요
              </span>
              <button
                className="mt-[0.4rem] w-fit cursor-pointer rounded-[1.2rem] bg-[#3B82F6] px-[1.2rem] py-[0.8rem] text-center text-[1.4rem] font-semibold text-white"
                onClick={onConfirm}
              >
                결과 확인
              </button>
            </>
          )}
        </div>

        <AnimatePresence>
          {showMarkDownModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden relative"
              >
                <MarkDownModal
                  onClose={() => {
                    setShowMarkDownModal(false);
                    onClose();
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ResultModal;
