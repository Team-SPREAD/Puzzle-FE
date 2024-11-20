'use client';
import BoardGrid from '@/components/DashBoard/BoardGrid';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useModalStore from '@/store/useModalStore';
import useBoardStore from '@/store/useBoardStore';
import arrowBottom from '~/images/arrow-bottom.svg';
import TeamSettingModal from '@/components/DashBoard/Modals/TeamSettingsModal';
import { getBoard, getTeamMembers } from '@/app/api/dashboard-axios';
import { likeAllBoard } from '@/app/api/dashboard-axios';

interface BoardOverviewProps {
  dashboardTitle: string;
  buttonColor: string;
  teamId: string | null;
  searchTerm: string;
  boardView: 'MyBoards' | 'FavoriteBoards';
  token: string;
}
interface TeamMember {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
}


export default function BoardOverview({
  dashboardTitle,
  buttonColor,
  teamId,
  searchTerm,
  boardView,
  token
}: BoardOverviewProps) {
  const { modalType, openModal, closeModal } = useModalStore();
  const setBoardsInfo = useBoardStore((state) => state.setBoardsInfo);
  const boards = useBoardStore((state) => state.Boards);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isThrottled, setIsThrottled] = useState(false);

  // 팀 멤버 정보 로드
  useEffect(() => {
    if (teamId) {
      const fetchTeamMembers = async () => {
        try {
          const response = await getTeamMembers(teamId, token);
          if (response.status === 200) {
            setTeamMembers(response.data);
          }
        } catch (error) {
          console.error('Error fetching team members:', error);
          setTeamMembers([]);
        }
      };
      fetchTeamMembers();
    } else {
      setTeamMembers([]);
    }
  }, [teamId, token]);

  const handleArrowClick = () => {
    if (isThrottled) return;
    setIsThrottled(true);
    modalType === 'TEAM_SETTING' ? closeModal() : openModal('TEAM_SETTING');
    setTimeout(() => setIsThrottled(false), 1000);
  };

  useEffect(() => {
    const fetchBoards = async () => {
      if (boardView === 'MyBoards') {
        if (teamId) {
          try {
            const response = await getBoard(teamId);
            if (response.status === 200) {
              setBoardsInfo(response.data);
            }
          } catch (error) {
            console.error('Error fetching boards:', error);
          }
        } else {
          setBoardsInfo([]);
        }
      } else if (boardView === 'FavoriteBoards') {
        try {
          const response = await likeAllBoard();
          if (response.status === 200) {
            setBoardsInfo(response.data);
          }
        } catch (error) {
          console.error('Error fetching favorite boards:', error);
        }
      }
    };
    fetchBoards();
  }, [teamId, boardView, setBoardsInfo]);

  const filteredBoards = searchTerm
    ? boards.filter((board) =>
        board.boardName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : boards;

  return (
    <div className="flex flex-grow flex-col p-5">
      <div className="flex items-center mb-5 relative">
        <div className="flex items-center gap-2">
          <h1 className="text-[32px] font-bold">{dashboardTitle}</h1>
          
          {teamId && (
            <div className="flex -space-x-2 ml-4">
              {teamMembers.slice(0, 4).map((member, index) => (
                <div
                  key={member._id}
                  className="relative"
                  style={{ zIndex: teamMembers.length - index }}
                >
                  {member.avatar && member.avatar !== 'null' ? (
                    <Image
                      src={member.avatar}
                      width={32}
                      height={32}
                      alt={`${member.firstName} ${member.lastName}`}
                      className="rounded-full border-2 border-white"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-600">
                      {member.firstName[0]}
                    </div>
                  )}
                </div>
              ))}
              {teamMembers.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-600 relative z-0">
                  +{teamMembers.length - 4}
                </div>
              )}
            </div>
          )}

          {dashboardTitle !== '개인 대시보드' && (
            <div className="ml-3">
              <button
                className="w-6 h-6 rounded-full bg-[#EDEDED] flex justify-center items-center cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={handleArrowClick}
              >
                <Image src={arrowBottom} width={12} height={7} alt="arrowBottom" />
              </button>
              {modalType === 'TEAM_SETTING' && (
                <TeamSettingModal onClose={closeModal} />
              )}
            </div>
          )}
        </div>
      </div>
      <BoardGrid
        boards={filteredBoards}
        buttonColor={buttonColor}
        teamId={teamId}
      />
    </div>
  );
}