'use client';

import { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import Sidebar from '@/components/DashBoard/SideBar';
import Header from '@/components/DashBoard/Header';
import ProjectGrid from '@/components/DashBoard/ProjectGrid';
import TeamMembersBar from '@/components/DashBoard/TeamMembersBar';
import { generateRandomColor } from '@/utils/getRandomColor';
import useUserInfoStore from '@/hooks/useUserInfoStore';
// import useUserInfoStore from '@/store/useUserInfoStore';
export default function DashboardPage() {
  const userInfo = useUserInfoStore();
  //   const { projects, setUserInfo, setProjectsInfo } = useUserInfoStore();
  useAuth();

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [buttonColor, setButtonColor] = useState('');

  useEffect(() => {
    setButtonColor(generateRandomColor());
  }, []);

  const filteredProjects =
    selectedTeamId === null
      ? userInfo.projects // 개인 대시보드: 모든 프로젝트 표시
      : userInfo.projects.filter((p) => p.teamId === selectedTeamId);

  const dashboardTitle =
    selectedTeamId === null
      ? '개인 대시보드'
      : userInfo.teams.find((t) => t.id === selectedTeamId)?.name ||
        '팀 대시보드';

  return (
    <div className="flex h-screen bg-gray-100">
      <TeamMembersBar
        teamMembers={
          selectedTeamId
            ? userInfo.teams.find((t) => t.id === selectedTeamId)?.members || []
            : []
        }
        buttonColor={buttonColor}
      />
      <Sidebar
        selectedTeamId={selectedTeamId}
        setSelectedTeamId={setSelectedTeamId}
        buttonColor={buttonColor}
        favoriteProjects={userInfo.projects.filter((p) => p.isFavorite)}
        teams={userInfo.teams}
      />
      <div className="flex flex-col flex-1">
        <Header
          isDashboardPersonal={selectedTeamId === null}
          buttonColor={buttonColor}
          userName={userInfo.name}
        />
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">{dashboardTitle}</h1>
          <ProjectGrid projects={filteredProjects} buttonColor={buttonColor} />
        </main>
      </div>
    </div>
  );
}
