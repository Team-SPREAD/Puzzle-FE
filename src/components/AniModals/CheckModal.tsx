'use client';
import React from 'react';
import Lottie from 'react-lottie-player';

interface CheckModalProps {
  onClose: () => void;
  lottieAnimationData: any;
  title: string;
  description: string;
}

const CheckModal: React.FC<CheckModalProps> = ({
  onClose,
  lottieAnimationData,
  title,
  description,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex h-fit w-[30rem] flex-col items-center justify-center gap-[0.8rem] rounded-[2rem] bg-white px-[4.45rem] py-[3.2rem] shadow-2xl relative">
        <button
          className="absolute top-4 right-4 text-gray-400 text-2xl hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex h-[16rem] w-[16rem] items-center justify-center">
          <Lottie
            loop
            animationData={lottieAnimationData}
            play
            style={{ width: 150, height: 150 }}
          />
        </div>
        <span className="text-[3.6rem] font-bold text-div-text">{title}</span>
        <span className="text-[1.6rem] font-normal text-div-text">
          {description}
        </span>
        <button
          className="mt-[0.4rem] w-fit cursor-pointer rounded-[1.2rem] bg-[#3B82F6] px-[1.2rem] py-[0.8rem] text-center text-[1.4rem] font-semibold text-white"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default CheckModal;
