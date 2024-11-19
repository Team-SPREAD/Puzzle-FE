'use client';
import { useState, useEffect } from 'react';
import { UserInfo } from '@/lib/types';
import Image from 'next/image';
import useModalStore from '@/store/useModalStore';
import dots from '~/images/dots.svg';
import star from '~/images/star.svg';
import projects from '~/images/projects.svg';
import arrowBottom from '~/images/arrow-bottom.svg';
import UserSelectModal from './Modals/UserSelectModal';
import defaultIcon from '~/images/testUserIcon.jpeg';
import { generateRandomColor } from '@/utils/getRandomColor';
import house from '~/images/house.svg';

interface SidebarProps {
  selectedTeamId: string | null;
  setSelectedTeamId: (teamId: string | null) => void;
  buttonColor: string;
  favoriteProjects: { id: string; name: string; isFavorite: boolean }[];
  teams: { _id: string; teamName: string }[];
  userInfo: UserInfo;
  boardView: 'MyBoards' | 'FavoriteBoards'; // 현재 보드 상태
  setBoardView: (view: 'MyBoards' | 'FavoriteBoards') => void; // 상태 변경 함수
}

export default function Sidebar({
  selectedTeamId,
  setSelectedTeamId,
  buttonColor,
  favoriteProjects,
  teams,
  userInfo,
  boardView,
  setBoardView,
}: SidebarProps) {
  const { openModal, closeModal, modalType } = useModalStore();
  const [isUserSelectThrottled, setIsUserSelectThrottled] = useState(false); // 딜레이 상태 추가

  // 팀의 첫 글자와 랜덤 색상 저장 상태
  const [teamInitialColors, setTeamInitialColors] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    // 팀 리스트를 기반으로 각 팀의 첫 글자에 대한 랜덤 색상 생성
    const colors = teams.reduce(
      (acc, team) => {
        acc[team._id] = generateRandomColor();
        return acc;
      },
      {} as { [key: string]: string },
    );
    setTeamInitialColors(colors);
  }, [teams]);

  const handleTeamSelect = (teamId: string | null) => {
    setSelectedTeamId(teamId);
    closeModal();
  };

  const handleUserSelectClick = () => {
    if (isUserSelectThrottled) return; // 딜레이 중일 경우 클릭 무시

    setIsUserSelectThrottled(true); // 딜레이 상태 활성화
    if (modalType === 'USER_SELECT') {
      closeModal();
    } else {
      openModal('USER_SELECT');
    }

    setTimeout(() => {
      setIsUserSelectThrottled(false); // 일정 시간 후 딜레이 해제
    }, 1000); // 1초 딜레이 설정
  };

  const toggleFavorite = (projectId: string) => {
    console.log(`Toggle favorite for project ${projectId}`);
  };

  return (
    <div className="w-[16%] p-3 bg-white shadow-md flex flex-col">
      <div className="h-full flex flex-col justify-between">
        <div className="">
          <div className="mt-3 mb-10">
            <button
              onClick={() =>
                modalType === 'DROPDOWN_TEAM_SELECT'
                  ? closeModal()
                  : openModal('DROPDOWN_TEAM_SELECT')
              }
              className="w-full h-[48px] text-left px-3 py-2 border rounded-md flex justify-between items-center"
            >
              <div className="flex items-center">
                {selectedTeamId ? (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-2"
                    style={{
                      backgroundColor: teamInitialColors[selectedTeamId],
                    }}
                  >
                    {teams
                      .find((t) => t._id === selectedTeamId)
                      ?.teamName[0].toUpperCase()}
                  </div>
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-2"
                    style={{ backgroundColor: buttonColor }}
                  >
                    <Image src={house} width={16} height={16} alt="home" />
                  </div>
                )}
                {selectedTeamId
                  ? teams.find((t) => t._id === selectedTeamId)?.teamName
                  : 'Home'}
              </div>
              <Image
                src={arrowBottom}
                width={12}
                height={7}
                alt={'arrowBottom'}
              />
            </button>
            {modalType === 'DROPDOWN_TEAM_SELECT' && (
              <div className="mt-2 bg-white rounded-md shadow-lg absolute z-50 w-[14%]">
                <button
                  onClick={() => handleTeamSelect(null)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-2"
                    style={{ backgroundColor: buttonColor }}
                  >
                    <Image src={house} width={16} height={16} alt="home" />
                  </div>
                  Home
                </button>
                {teams.map((team) => (
                  <button
                    key={team._id}
                    onClick={() => handleTeamSelect(team._id)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-2"
                      style={{ backgroundColor: teamInitialColors[team._id] }}
                    >
                      {team.teamName[0].toUpperCase()}
                    </div>
                    {team.teamName}
                  </button>
                ))}
                <button
                  onClick={() => openModal('CREATE_TEAM')}
                  className="w-full text-left px-4 py-2 text-[#878787] hover:bg-gray-100"
                >
                  + Create Team
                </button>
              </div>
            )}
          </div>

          {/* My boards 버튼 */}
          <div className="mb-3">
            <button
              onClick={() => setBoardView('MyBoards')}
              className={`w-full h-[48px] text-left px-4 py-2 border rounded-md flex items-center ${
                boardView === 'MyBoards' ? 'bg-gray-200' : ''
              }`}
            >
              <Image
                src={projects}
                width={18}
                height={18}
                alt="projects_icon"
                style={{ marginRight: 10 }}
              />
              <span>My boards</span>
            </button>
          </div>

          {/* Favorite boards 버튼 */}
          <div>
            <button
              onClick={() => setBoardView('FavoriteBoards')}
              className={`w-full h-[48px] text-left px-4 py-2 border rounded-md flex items-center ${
                boardView === 'FavoriteBoards' ? 'bg-gray-200' : ''
              }`}
            >
              <Image
                src={star}
                width={18}
                height={18}
                alt="star_icon"
                style={{ marginRight: 10 }}
              />
              <span>Favorite boards</span>
            </button>
          </div>
        </div>
        <div className="">
          {modalType === 'USER_SELECT' && (
            <UserSelectModal email={userInfo.email} />
          )}
          <div
            onClick={handleUserSelectClick}
            className="w-full h-[48px] px-2 py-2 rounded-md border flex justify-between items-center"
          >
            <div className="flex justify-between items-center space-x-2">
              <Image
                src={userInfo.avatar || defaultIcon}
                alt="user avatar"
                width={35}
                height={35}
                className="rounded-full"
              />
              <p>{userInfo.name}</p>
            </div>
            <div>
              <Image src={dots} alt="dots" width={20} height={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
