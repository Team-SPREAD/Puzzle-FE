'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
// 컴포넌트
import Sidebar from '@/components/DashBoard/SideBar';
import Header from '@/components/DashBoard/Header';
import TeamMembersBar from '@/components/DashBoard/TeamMembersBar';
import BoardOverview from '@/components/DashBoard/BoardOverview';
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
// Axios API 호출 함수
import { getUserInfo, getMyTeams } from '@/app/api/dashboard-axios';

export default function DashboardPage() {
  const { userId } = useParams();
  const router = useRouter();

  const userInfo = useUserStore((state) => state.userInfo);
  const setUser = useUserStore((state) => state.setUserInfo);
  const { modalType, closeModal } = useModalStore();

  const setTeams = useTeamsStore((state) => state.setTeams);
  const setCurrentTeam = useTeamsStore((state) => state.setCurrentTeam); // 현재 팀 설정 함수 가져오기
  const teams = useTeamsStore((state) => state.teams);

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [buttonColor, setButtonColor] = useState('');
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [searchTerm, setSearchTerm] = useState(''); // 검색 상태 추가

  const [boardView, setBoardView] = useState<'MyBoards' | 'FavoriteBoards'>(
    'MyBoards',
  ); //현재 보드들의 상태

  // 랜덤 색상 설정
  useEffect(() => {
    setButtonColor(generateRandomColor());
  }, [router, userId]);

  // 사용자 및 팀 정보 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // 사용자 정보 API 요청
          const response = await getUserInfo(token);

          if (response.status === 200) {
            const userData = response.data;

            // 상태 저장
            setUser({
              _id: userData._id,
              name: `${userData.firstName}${userData.lastName}`,
              email: userData.email,
              avatar: userData.avatar,
              token: token,
            });

            // 팀 정보 가져오기
            const teamsResponse = await getMyTeams(token);

            if (teamsResponse.status === 200) {
              const teamsData = teamsResponse.data;
              setTeams(
                teamsData.map((team: any) => ({
                  _id: team._id,
                  teamName: team.teamName,
                  users: team.users,
                  createdDate: team.createdDate,
                  updatedDate: team.updateDate,
                })),
              );
            } else {
              console.error('Failed to fetch teams');
            }
          } else {
            console.error('Failed to fetch user information');
          }
        } catch (error) {
          console.error('API 요청 실패:', error);
        } finally {
          setIsLoading(false); // 로딩 상태 해제
        }
      } else {
        console.error('로컬스토리지에 토큰이 없습니다.');
        setIsLoading(false); // 로딩 상태 해제
      }
    };

    loadUserInfo();
  }, [setUser, setTeams]);

  // selectedTeamId가 변경될 때 currentTeam 업데이트
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
    return <Loading />; // 로딩 중일 때 로딩 컴포넌트 표시
  }

  return (
    <div className="flex w-screen h-screen">
      <TeamMembersBar
        teamId={selectedTeamId!}
        buttonColor={buttonColor}
        token={userInfo.token}
      />
      <div className="w-[96%] h-full">
        <Header
          isDashboardPersonal={selectedTeamId === null}
          buttonColor={buttonColor}
          userName={userInfo.name}
          onSearch={setSearchTerm}
        />

        <div className="flex w-full h-[92%]">
          <Sidebar
            selectedTeamId={selectedTeamId}
            setSelectedTeamId={setSelectedTeamId}
            buttonColor={buttonColor}
            teams={teams}
            userInfo={{
              _id: userInfo._id,
              name: userInfo.name,
              avatar: userInfo.avatar,
              email: userInfo.email,
              token: userInfo.token,
            }}
            favoriteProjects={[]}
            boardView={boardView} // 상태 전달
            setBoardView={setBoardView} // 상태 업데이트 함수 전달
          />
          <BoardOverview
            dashboardTitle={dashboardTitle}
            buttonColor={buttonColor}
            teamId={selectedTeamId}
            searchTerm={searchTerm}
            boardView={boardView} // 상태 전달
          />
        </div>
        {/* 모달 타입에 따른 조건부 렌더링 */}
        {modalType === 'CREATE_TEAM' && (
          <CreateTeamModal
            isOpen={true}
            onClose={closeModal}
            userId={Number(userInfo._id)}
            token={userInfo.token}
          />
        )}
        {modalType === 'INVITE_TEAM' && (
          <InviteTeamModal
            isOpen={true}
            onClose={closeModal}
            token={userInfo.token}
            teamId={selectedTeamId!}
            sender={userInfo.name}
          />
        )}
        {modalType === 'EDIT_TEAM' && (
          <EditTeamModal
            isOpen={true}
            onClose={closeModal}
            teamId={selectedTeamId!}
            currentTeamName={dashboardTitle}
          />
        )}
        {modalType === 'DELETE_TEAM' && (
          <DeleteTeamModal
            isOpen={true}
            onClose={closeModal}
            teamId={selectedTeamId!}
            currentTeamName={dashboardTitle}
            teamName={dashboardTitle}
          />
        )}
      </div>
    </div>
  );
}
