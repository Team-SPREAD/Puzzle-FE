'use client';
import BoardGrid from '@/components/DashBoard/BoardGrid';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useModalStore from '@/store/useModalStore';
import useBoardStore from '@/store/useBoardStore';
import arrowBottom from '~/images/arrow-bottom.svg';
import TeamSettingModal from '@/components/DashBoard/Modals/TeamSettingsModal';
import { getBoard } from '@/app/api/dashboard-axios';
import { likeAllBoard } from '@/app/api/dashboard-axios';
interface BoardOverviewProps {
  dashboardTitle: string;
  buttonColor: string;
  teamId: string | null; // 팀 ID가 없는 경우 null
  searchTerm: string;
  boardView: 'MyBoards' | 'FavoriteBoards';
}

export default function BoardOverview({
  dashboardTitle,
  buttonColor,
  teamId,
  searchTerm,
  boardView,
}: BoardOverviewProps) {
  const { modalType, openModal, closeModal } = useModalStore();
  const setBoardsInfo = useBoardStore((state) => state.setBoardsInfo);
  const boards = useBoardStore((state) => state.Boards);

  const [isThrottled, setIsThrottled] = useState(false);

  const handleArrowClick = () => {
    if (isThrottled) return;
    setIsThrottled(true);

    modalType === 'TEAM_SETTING' ? closeModal() : openModal('TEAM_SETTING');

    setTimeout(() => {
      setIsThrottled(false);
    }, 1000);
  };

  // 팀 ID 또는 boardView 변경에 따라 보드 데이터 로드
  useEffect(() => {
    const fetchBoards = async () => {
      if (boardView === 'MyBoards') {
        if (teamId) {
          try {
            const response = await getBoard(teamId);
            if (response.status === 200) {
              setBoardsInfo(response.data);
              console.log('MyBoards:', response.data);
            } else {
              console.error('Failed to fetch boards');
            }
          } catch (error) {
            console.error('Error fetching boards:', error);
          }
        } else {
          setBoardsInfo([]); // 팀 ID가 없는 경우 보드 상태 초기화
        }
      } else if (boardView === 'FavoriteBoards') {
        try {
          const response = await likeAllBoard();
          if (response.status === 200) {
            setBoardsInfo(response.data);
            console.log('FavoriteBoards:', response.data);
          } else {
            console.error('Failed to fetch favorite boards');
          }
        } catch (error) {
          console.error('Error fetching favorite boards:', error);
        }
      }
    };

    fetchBoards();
  }, [teamId, boardView, setBoardsInfo]);

  // 검색어가 있는 경우에만 필터링
  const filteredBoards = searchTerm
    ? boards.filter((board) =>
        board.boardName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : boards; // 검색어가 없으면 전체 보드 사용
  return (
    <div className="flex flex-grow flex-col p-5">
      <div className="flex items-center mb-5 relative">
        <h1 className="text-[32px] font-bold">{dashboardTitle}</h1>

        {dashboardTitle !== '개인 대시보드' && (
          <div className="ml-5 relative">
            <div
              className="w-[20px] h-[20px] rounded-full bg-[#EDEDED] flex justify-center items-center cursor-pointer"
              onClick={handleArrowClick}
            >
              <Image
                src={arrowBottom}
                width={12}
                height={7}
                alt="arrowBottom"
              />
            </div>

            {/* 팀 세팅 모달창 */}
            {modalType === 'TEAM_SETTING' && (
              <TeamSettingModal onClose={closeModal} />
            )}
          </div>
        )}
      </div>
      <BoardGrid
        boards={filteredBoards}
        buttonColor={buttonColor}
        teamId={teamId}
      />
    </div>
  );
}
