import { create } from 'zustand';

interface Project {
  id: string;
  name: string;
  teamId: string | null;
  isFavorite: boolean;
}

interface Team {
  id: string;
  name: string;
  members: string[];
}

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  color: string;
  hostingRooms: string[];
  joinedRooms: string[];
  teams: Team[];
  projects: Project[];
  token: string;
  avatar: string;
}

interface UserInfoStore extends UserInfo {
  setUserInfo: (userInfo: UserInfo) => void;
  clearUserInfo: () => void;
}

const initialUserInfo: UserInfo = {
  _id: '',
  name: '',
  email: '',
  color: '',
  hostingRooms: [],
  joinedRooms: [],
  teams: [],
  projects: [],
  token: '',
  avatar: '',
};

const useUserInfoStore = create<UserInfoStore>((set) => ({
  ...initialUserInfo,
  setUserInfo: (userInfo: UserInfo) => set(userInfo),
  clearUserInfo: () => set(initialUserInfo),
}));

export default useUserInfoStore;
