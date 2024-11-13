import axiosInstance from './axiosInstance';
import axios from 'axios';

// 사용자 정보 요청 함수
export const getUserInfo = async (token: string) => {
  return axiosInstance.get('/api/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 팀 생성 함수
export const createTeam = async (teamName: string) => {
  return axiosInstance.post('/api/team', {
    teamName,
  });
};

// 팀 정보 요청 함수
export const getMyTeams = async (token: string) => {
  return axiosInstance.get('/api/team/my-teams', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 팀 멤버 정보 요청 함수
export const getTeamMembers = async (teamId: string, token: string) => {
  return axiosInstance.get(`api/team/${teamId}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 팀 초대 함수
export const inviteTeamMembers = async (
  emails: string[],
  teamId: string,
  sender: string,
) => {
  return axiosInstance.post('/api/invitation', {
    emails,
    teamId,
    sender,
  });
};

// 초대 수락 함수
export const acceptInvitation = async (id: string) => {
  return axios.post(`/api/invitation/acceptance/${id}`);
};

//팀 삭제 함수
export const deleteTeam = async (teamId: string) => {
  return axiosInstance.delete(`/api/team/${teamId}`);
};

//팀 이름 수정 함수
export const updateTeam = async (teamId: string, teamName: string) => {
  return axiosInstance.patch(`/api/team/${teamId}`, {
    teamName,
  });
};
