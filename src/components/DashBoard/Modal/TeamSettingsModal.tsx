'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import useModalStore from '@/store/useModalStore';
import pencil from '~/images/pencil.svg';
import out from '~/images/out.svg';

interface TeamSettingModalProps {
  onClose: () => void;
}

const TeamSettingModal: React.FC<TeamSettingModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      className="absolute top-8 left-0 w-56 bg-white shadow-lg rounded-lg flex flex-col items-center z-50"
    >
      <div className="w-full h-[48px] p-4 flex items-center cursor-pointer  hover:bg-gray-100">
        <Image src={pencil} width={12} height={7} alt="edit" />
        <p className="ml-2">이름 변경</p>
      </div>
      <div className="w-11/12 border-b border-[#EDEDED]"></div>
      <div className="w-full h-[48px] p-4 flex items-center cursor-pointer hover:bg-gray-100">
        <Image src={out} width={12} height={7} alt="exit" />
        <p className="ml-2">팀 나가기</p>
      </div>
    </div>
  );
};

export default TeamSettingModal;
