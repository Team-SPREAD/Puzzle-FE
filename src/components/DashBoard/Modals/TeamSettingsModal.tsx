'use client';
import React, { useEffect, useRef } from 'react';
import useModalStore from '@/store/useModalStore';
import { Pencil, LogOut } from 'lucide-react';

interface TeamSettingModalProps {
  onClose: () => void;
}

const TeamSettingModal: React.FC<TeamSettingModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { openModal } = useModalStore();

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
      className="absolute top-24 left-10 w-56 bg-white shadow-lg rounded-lg flex flex-col items-center z-50"
    >
      <div
        className="w-full h-[48px] p-4 flex items-center cursor-pointer hover:bg-gray-100"
        onClick={() => {
          openModal('EDIT_TEAM');
        }}
      >
        <Pencil size={20} />
        <p className="ml-2">이름 변경</p>
      </div>
      <div className="w-11/12 border-b border-[#EDEDED]"></div>
      <div
        className="w-full h-[48px] p-4 flex items-center cursor-pointer hover:bg-gray-100"
        onClick={() => {
          openModal('DELETE_TEAM'); // 모달 상태를 DELETE_TEAM으로 설정하여 DeleteTeamModal을 열도록 함
        }}
      >
        <LogOut size={20} />
        <p className="ml-2">팀 나가기</p>
      </div>
    </div>
  );
};

export default TeamSettingModal;
