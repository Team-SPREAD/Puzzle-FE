'use client';
import Link from 'next/link';
import Image from 'next/image';
import dots from '~/images/dots.svg';
import testImage from '~/images/testUserIcon.jpeg';
import useModalStore from '@/store/useModalStore';
import { useState } from 'react';
import BoardSettingModal from '@/components/DashBoard/Modal/BoardSettingModal';

interface BoardGridProps {
  boards: {
    id: string;
    name: string;
    teamId: string | null;
    currentStep: number;
  }[];
  buttonColor: string;
}

export default function BoardGrid({ boards, buttonColor }: BoardGridProps) {
  const getBoardUrl = (boardName: string) => {
    return `/board/${boardName.toLowerCase().replace(/ /g, '-')}`;
  };

  const { modalType, openModal, closeModal } = useModalStore();
  const [isThrottled, setIsThrottled] = useState(false);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);

  const handleBoardClick = (boardId: string) => {
    if (isThrottled) return;
    setIsThrottled(true);

    // 클릭한 projectId에 따라 모달 열기/닫기
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

  const TOTAL_STEPS = 10;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto">
      <div
        style={{ backgroundColor: buttonColor }}
        className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 aspect-[2/3] flex items-center justify-center flex-col text-white"
      >
        <button className="w-3/4 h-3/4 flex items-center justify-center text-white text-6xl rounded-md hover:opacity-90 transition-opacity duration-200">
          +
        </button>
        <p>New board</p>
      </div>
      {boards.map((board) => (
        <div key={board.id}>
          <div className="bg-white rounded-lg shadow-md transition-all duration-200 aspect-[2/3] p-6 flex flex-col justify-around transform group hover:shadow-lg">
            <div className="flex justify-end">
              <Image
                src={dots}
                alt="dots"
                onClick={() => handleBoardClick(board.id)}
                className="cursor-pointer"
              />
              {/* 현재 project.id가 activeProjectId와 동일할 때만 모달 표시 */}
              {modalType === 'PROJECT_SETTING' &&
                activeBoardId === board.id && (
                  <BoardSettingModal onClose={closeModal} />
                )}
            </div>
            <Link
              href={getBoardUrl(board.name)}
              className="flex justify-center"
            >
              <Image
                src={testImage}
                alt="project-icon"
                className="rounded-full w-36 h-36 transition-all duration-500 group-hover:rounded-lg group-hover:w-40 group-hover:h-40"
              />
            </Link>
            <div className="relative w-full h-1 mt-4 bg-gray-200 rounded">
              <div
                className="h-full rounded"
                style={{
                  width: `${(board.currentStep / TOTAL_STEPS) * 100}%`,
                  backgroundColor: board.teamId ? buttonColor : 'gray',
                }}
              ></div>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">{board.name}</h3>
              <p className="text-sm text-gray-500">
                {board.teamId ? '팀 프로젝트' : '개인 프로젝트'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
