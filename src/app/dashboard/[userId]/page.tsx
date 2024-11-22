'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// 컴포넌트
import Sidebar from '@/components/DashBoard/SideBar';
import Header from '@/components/DashBoard/Header';
import BoardGrid from '@/components/DashBoard/BoardGrid';
import DashboardHeader from '@/components/DashBoard/DashboardHeader';
import CreateTeamModal from '@/components/DashBoard/Modals/CreateTeamModal';
import InviteTeamModal from '@/components/DashBoard/Modals/InviteTeamModal';
import EditTeamModal from '@/components/DashBoard/Modals/EditTeamModal';
import DeleteTeamModal from '@/components/DashBoard/Modals/DeleteTeamModal';
import { Loading } from '@/components/Loading';

// 유틸
import { generateRandomColor } from '@/utils/getRandomColor';

// 상태 관리
import useUserStore from '@/store/useUserStore';
import useTeamsStore from '@/store/useTeamsStore';
import useModalStore from '@/store/useModalStore';
import { useDarkMode } from '@/store/useDarkModeStore';

// API
import { getUserInfo, getMyTeams } from '@/app/api/dashboard-axios';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function DashboardPage() {
  const { userId } = useParams();
  const router = useRouter();
  const { isDarkMode } = useDarkMode();

  // Store hooks
  const userInfo = useUserStore((state) => state.userInfo);
  const setUser = useUserStore((state) => state.setUserInfo);
  const { modalType, closeModal } = useModalStore();
  const { setTeams, setCurrentTeam, teams } = useTeamsStore();

  // Local state
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [buttonColor, setButtonColor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [boardView, setBoardView] = useState<'MyBoards' | 'FavoriteBoards'>(
    'MyBoards',
  );

  // 랜덤 색상 설정
  useEffect(() => {
    setButtonColor(generateRandomColor());
  }, [router, userId]);

  // 사용자 및 팀 정보 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('로컬스토리지에 토큰이 없습니다.');
        router.push('/login');
        return;
      }

      try {
        const [userResponse, teamsResponse] = await Promise.all([
          getUserInfo(token),
          getMyTeams(token),
        ]);

        if (userResponse.status === 200) {
          const userData = userResponse.data;
          setUser({
            _id: userData._id,
            name: `${userData.firstName}${userData.lastName}`,
            email: userData.email,
            avatar: userData.avatar,
            token: token,
          });
        }

        if (teamsResponse.status === 200) {
          const teamsData = teamsResponse.data.map((team: any) => ({
            _id: team._id,
            teamName: team.teamName,
            users: team.users,
            createdDate: team.createdDate,
            updatedDate: team.updateDate,
          }));
          setTeams(teamsData);
        }
      } catch (error) {
        console.error('API 요청 실패:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, [setUser, setTeams, router]);

  // currentTeam 업데이트
  useEffect(() => {
    if (selectedTeamId) {
      setCurrentTeam(selectedTeamId);
    }
  }, [selectedTeamId, setCurrentTeam]);

  const dashboardTitle =
    selectedTeamId === null
      ? 'HOME 대시보드'
      : teams.find((t) => t._id === selectedTeamId)?.teamName || '팀 대시보드';

  if (isLoading) {
    return <Loading />;
  }

  return (
    <motion.div
      className={`flex w-screen h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Sidebar
        selectedTeamId={selectedTeamId}
        setSelectedTeamId={setSelectedTeamId}
        buttonColor={buttonColor}
        teams={teams}
        userInfo={userInfo}
        favoriteProjects={[]}
        boardView={boardView}
        setBoardView={setBoardView}
      />

      <div className="flex-1 flex flex-col ml-[80px] transition-all duration-300">
        <Header
          isDashboardPersonal={selectedTeamId === null}
          buttonColor={buttonColor}
          userInfo={userInfo}
          onSearch={setSearchTerm}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader
            title={dashboardTitle}
            teamId={selectedTeamId}
            buttonColor={buttonColor}
            token={userInfo.token}
          />

          <div className="flex-1 overflow-auto">
            <BoardGrid
              buttonColor={buttonColor}
              teamId={selectedTeamId}
              token={userInfo.token}
              searchTerm={searchTerm}
              boardView={boardView}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalType === 'CREATE_TEAM' && (
          <CreateTeamModal
            isOpen={true}
            onClose={closeModal}
            userId={Number(userInfo._id)}
            token={userInfo.token}
          />
        )}

        {modalType === 'INVITE_TEAM' && selectedTeamId && (
          <InviteTeamModal
            isOpen={true}
            onClose={closeModal}
            token={userInfo.token}
            teamId={selectedTeamId}
            sender={userInfo.name}
          />
        )}

        {modalType === 'EDIT_TEAM' && selectedTeamId && (
          <EditTeamModal
            isOpen={true}
            onClose={closeModal}
            teamId={selectedTeamId}
            currentTeamName={dashboardTitle}
          />
        )}

        {modalType === 'DELETE_TEAM' && selectedTeamId && (
          <DeleteTeamModal
            isOpen={true}
            onClose={closeModal}
            teamId={selectedTeamId}
            currentTeamName={dashboardTitle}
            teamName={dashboardTitle}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
