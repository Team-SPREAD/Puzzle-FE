'use client';
import Link from 'next/link';
import Image from 'next/image';
import dots from '~/images/dots.svg';
import testImage from '~/images/testUserIcon.jpeg';
import useModalStore from '@/store/useModalStore';
import { useState } from 'react';
import CreateBoardModal from './Modals/CreateBoardModal';
import { BoardInfo } from '@/lib/types';
import BoardCard from './BoardCard';

interface BoardGridProps {
  boards: BoardInfo[];
  buttonColor: string;
  teamId: string | null;
}

export default function BoardGrid({
  boards = [],
  buttonColor,
  teamId,
}: BoardGridProps) {
  const getBoardUrl = (boardName: string) => {
    return `/board/${boardName.toLowerCase().replace(/ /g, '-')}`;
  };

  const { modalType, openModal, closeModal } = useModalStore();
  const [isThrottled, setIsThrottled] = useState(false);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);

  const handleBoardClick = (boardId: string) => {
    if (isThrottled) return;
    setIsThrottled(true);

    // 클릭한 boardId에 따라 모달 열기/닫기
    if (modalType === 'PROJECT_SETTING' && activeBoardId === boardId) {
      closeModal();
      setActiveBoardId(null);
    } else {
      openModal('PROJECT_SETTING');
      setActiveBoardId(boardId);
    }

    setTimeout(() => {
      setIsThrottled(false);
    }, 1000);
  };

  const handleNewBoardClick = () => {
    openModal('CREATE_BOARD');
  };

  const TOTAL_STEPS = 10;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 overflow-y-auto ">
      {teamId ? (
        <div
          style={{ backgroundColor: buttonColor }}
          className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 aspect-[2/3] flex items-center justify-center flex-col text-white"
        >
          <button
            onClick={handleNewBoardClick}
            className="w-3/4 h-3/4 flex items-center justify-center text-white text-6xl rounded-md hover:opacity-90 transition-opacity duration-200"
          >
            +
          </button>
          <p>New board</p>
        </div>
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-gray-700">
            팀을 생성해서 보드를 만들어 보아요
          </p>
          <p className="text-sm text-gray-500 mt-2">
            프로젝트를 시작하려면 새로운 팀을 생성하세요.
          </p>
        </div>
      )}

      {boards?.length > 0 ? (
        boards.map((board) => (
          <BoardCard
            key={board._id}
            board={board}
            buttonColor={buttonColor}
            TOTAL_STEPS={TOTAL_STEPS}
            getBoardUrl={getBoardUrl}
           
          />
        ))
      ) : (
        <div></div>
      )}
      {modalType === 'CREATE_BOARD' && (
        <CreateBoardModal
          isOpen={modalType === 'CREATE_BOARD'}
          onClose={closeModal}
          teamId={teamId}
        />
      )}
    </div>
  );
}
