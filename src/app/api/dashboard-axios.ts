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

//보드를 생성하는 함수
export const createBoard = async (formData: FormData) => {
  return axiosInstance.post('/api/board', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

//전체 보드를 불러오는 함수
export const getAllBoard = async (token: string) => {
  return axiosInstance.get('/api/board', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//보드를 불러오는 함수
export const getBoard = async (teamId: string) => {
  return axiosInstance.get(`/api/board/${teamId}`);
};

//보드를 수정하는 함수
export const updateBoard = async (boardId: string, formData: FormData) => {
  return axiosInstance.patch(`/api/board/${boardId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

//보드를 삭제하는 함수
export const deleteBoard = async (boardId: string) => {
  return axiosInstance.delete(`/api/board/${boardId}`);
};

//보드를 즐겨찾기 함수
export const likeBoard = async (boardId: string) => {
  return axiosInstance.patch(`/api/board/like/${boardId}`);
};

//즐겨찾기 항목 모두 가져오기 함수
export const likeAllBoard = async () => {
  return axiosInstance.get('/api/board/like/all');
};

//룸 토큰 발급하는 함수
export const getRoomToken = async (roomId: string) => {
  return axiosInstance.post(`/api/board/token`, {
    roomId,
  });
};
