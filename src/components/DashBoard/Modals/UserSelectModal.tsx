'use client';
import React, { useEffect, useRef } from 'react';
import useModalStore from '@/store/useModalStore';
import { destroyCookie } from 'nookies';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/useUserStore';

interface UserSelectModalProps {
  email: string;
}

const UserSelectModal: React.FC<UserSelectModalProps> = ({ email }) => {
  const { closeModal } = useModalStore();
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const clearUserInfo = useUserStore((state) => state.clearUserInfo);

  const handleLogout = () => {
    // 로컬 스토리지에서 인증 토큰 제거
    localStorage.removeItem('token');
    clearUserInfo(); // Zustand의 clearUserInfo 호출
    // 로그아웃 후 메인 페이지로 이동
    router.push('/');
    closeModal();
  };

  // 모달 외부 클릭 시 모달 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeModal]);

  return (
    <div
      ref={modalRef}
      className="relative bottom-5 bg-white shadow-lg rounded-lg p-2 w-50 h-32 z-50 flex flex-col"
    >
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-800 text-sm">{email}</p>
      </div>
      <button onClick={handleLogout} className="flex-1 w-full p-3 text-left ">
        <div className=" w-full h-full text-white bg-red-500 hover:bg-red-400 rounded flex items-center justify-center">
          로그아웃
        </div>
      </button>
    </div>
  );
};

export default UserSelectModal;
