'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import useProgressModalStore from '@/store/useProgressModalStore';

interface ProgressModalProps {
  title?: string;
  description?: string;
  isLoading?: boolean;
}

const ProgressModal: React.FC<ProgressModalProps> = ({
  title = '저장 중입니다',
  description = '잠시만 기다려 주세요',
  isLoading = true,
}) => {
  const { isOpen, closeModal } = useProgressModalStore();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50 p-4"
      onClick={closeModal}
    >
      <div
        className="flex h-fit w-full max-w-[30rem] flex-col items-center justify-center gap-[1.5rem] rounded-[2rem] bg-white px-[4.45rem] py-[2.5rem] shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 로더 섹션 */}
        <div className="flex h-[12rem] w-[12rem] items-center justify-center">
          <Loader2
            className="animate-spin text-blue-500"
            size={96}
            strokeWidth={2.5}
          />
        </div>

        {/* 제목 및 설명 */}
        <div className="flex flex-col items-center gap-[0.6rem]">
          <h2 className="text-[2.4rem] font-bold text-div-text text-center">
            {title}
          </h2>
          <p className="text-[1.6rem] font-normal text-gray-600 text-center">
            {description}
          </p>
        </div>

        {/* 진행 애니메이션 바 */}
        {isLoading && (
          <div className="w-full h-[0.4rem] bg-gray-200 rounded-full overflow-hidden mt-[0.5rem]">
            <div className="h-full bg-blue-500 animate-progress-bar"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressModal;
