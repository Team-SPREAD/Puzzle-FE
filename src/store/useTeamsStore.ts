import { create } from 'zustand';
import { TeamsInfo } from '@/lib/types';

interface TeamsStore {
  teams: TeamsInfo[];
  setTeams: (teams: TeamsInfo[]) => void;
  addTeam: (team: TeamsInfo) => void;
  updateTeam: (teamId: string, updatedData: Partial<TeamsInfo>) => void;
  clearTeams: () => void;
}

const useTeamsStore = create<TeamsStore>((set) => ({
  teams: [],

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

  // 모든 팀 정보를 초기화하는 함수
  clearTeams: () => set(() => ({ teams: [] })),
}));

export default useTeamsStore;
