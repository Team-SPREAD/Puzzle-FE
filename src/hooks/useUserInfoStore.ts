import { create } from 'zustand'

interface UserInfo {
  _id: string;
  name: string;
  color: string;
  hostingRooms: string[];
  joinedRooms: string[];
  token: string;
}

interface UserInfoStore extends UserInfo {
  setUserInfo: (userInfo: UserInfo) => void;
  clearUserInfo: () => void;
}

const useUserInfoStore = create<UserInfoStore>((set) => ({
  _id: '',
  name: '',
  color: '',
  hostingRooms: [],
  joinedRooms: [],
  token: '',
  setUserInfo: (userInfo: UserInfo) => set(userInfo),
  clearUserInfo: () => set({ _id: '', name: '', color: '', hostingRooms: [], joinedRooms: [], token: '' }),
}))

export default useUserInfoStore;