import { create } from 'zustand';
import { TeamsInfo } from '@/lib/types';

interface TeamsStore {
  teams: TeamsInfo[];
  currentTeam: TeamsInfo | null; // 현재 활성화된 팀
  setTeams: (teams: TeamsInfo[]) => void;
  addTeam: (team: TeamsInfo) => void;
  updateTeam: (teamId: string, updatedData: Partial<TeamsInfo>) => void;
  setCurrentTeam: (teamId: string) => void; // 현재 팀을 설정하는 함수
  clearTeams: () => void;
}

const useTeamsStore = create<TeamsStore>((set, get) => ({
  teams: [],
  currentTeam: null, // 초기값은 null

  // 팀 정보를 설정하는 함수
  setTeams: (teams) => set(() => ({ teams })),

  // 새로운 팀을 추가하는 함수
  addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),

  // 특정 팀 정보를 업데이트하는 함수
  updateTeam: (teamId, updatedData) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team._id === teamId ? { ...team, ...updatedData } : team,
      ),
    })),

  // 현재 팀을 설정하는 함수
  setCurrentTeam: (teamId) => {
    const { teams } = get();
    const team = teams.find((team) => team._id === teamId) || null;
    set({ currentTeam: team });
  },

  // 모든 팀 정보를 초기화하는 함수
  clearTeams: () => set(() => ({ teams: [], currentTeam: null })),
}));

export default useTeamsStore;
