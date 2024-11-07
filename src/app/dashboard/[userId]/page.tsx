'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/DashBoard/SideBar';
import Header from '@/components/DashBoard/Header';
import TeamMembersBar from '@/components/DashBoard/TeamMembersBar';
import { generateRandomColor } from '@/utils/getRandomColor';
import useUserInfoStore from '@/store/useUserInfoStore';

import useModalStore from '@/store/useModalStore';
import CreateTeamModal from '@/components/DashBoard/Modal/CreateTeamModal';
import ProjectOverview from '@/components/DashBoard/ProjecOverview';

export default function DashboardPage() {
  const { userId } = useParams();
  const router = useRouter();
  const mockUserInfo = useUserInfoStore();
  const { modalType, closeModal } = useModalStore();

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [buttonColor, setButtonColor] = useState('');
  const [userTeams, setUserTeams] = useState([]);

  // 사용자가 속한 팀 목록 가져오기
  const fetchUserTeams = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('http://kim-sun-woo.com/puzzle/me/teams', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const teams = await response.json();
        setUserTeams(teams);
      } else {
        console.error('Failed to fetch teams');
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  useEffect(() => {
    setButtonColor(generateRandomColor());
  }, [router, userId]);

  const filteredProjects =
    selectedTeamId === null
      ? mockUserInfo.projects
      : mockUserInfo.projects.filter((p) => p.teamId === selectedTeamId);
  const dashboardTitle =
    selectedTeamId === null
      ? '개인 대시보드'
      : mockUserInfo.teams.find((t) => t.id === selectedTeamId)?.name ||
        '팀 대시보드';

  return (
    <div className="flex w-screen h-screen ">
      {/* //userInfo를 변경 하기 */}
      <TeamMembersBar
        teamMembers={
          selectedTeamId
            ? mockUserInfo.teams.find((t) => t.id === selectedTeamId)
                ?.members || []
            : []
        }
        buttonColor={buttonColor}
      />
      <div className="w-[96%] h-full">
        <Header
          isDashboardPersonal={selectedTeamId === null}
          buttonColor={buttonColor}
          userName={mockUserInfo.name}
        />

        <div className="flex w-full h-[92%] ">
          <Sidebar
            selectedTeamId={selectedTeamId}
            setSelectedTeamId={setSelectedTeamId}
            buttonColor={buttonColor}
            favoriteProjects={mockUserInfo.projects.filter((p) => p.isFavorite)}
            teams={mockUserInfo.teams}
            userInfo={{
              id: mockUserInfo._id,
              name: mockUserInfo.name,
              avatar: mockUserInfo.avatar,
              email: mockUserInfo.email,
            }}
          />
          <ProjectOverview
            dashboardTitle={dashboardTitle}
            filteredProjects={filteredProjects}
            buttonColor={buttonColor}
          />
        </div>
        {/* 모달 타입에 따른 조건부 렌더링 */}
        {modalType === 'CREATE_TEAM' && (
          <CreateTeamModal
            isOpen={true}
            onClose={closeModal}
            userId={Number(mockUserInfo._id)}
          />
        )}
      </div>
    </div>
  );
}
