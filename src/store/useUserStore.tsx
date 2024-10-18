import { UserInfo } from '@/lib/types';
import { create } from 'zustand';

export type UserStoreType = {
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
};

const useUserStore = create<UserStoreType>((set) => ({
  userInfo: {
    id: '',
    name: '',
    avatar: '',
    email: '',
  },
  setUserInfo: (userInfo) => set({ userInfo }),
}));

export default useUserStore;
