import { UserInfo } from '@/lib/types';
import { create } from 'zustand';

// 상태 타입 정의
export type UserStoreType = {
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  clearUserInfo: () => void;
};

// Zustand 스토어 생성
const useUserStore = create<UserStoreType>((set) => ({
  userInfo: {
    _id: '',
    name: '',
    avatar: '',
    email: '',
    token: '',
  },

  // 사용자 정보 설정 및 로컬 스토리지 저장
  setUserInfo: (userInfo) => {
    set({ userInfo });
    localStorage.setItem('userInfo', JSON.stringify(userInfo)); // 로컬 스토리지에 저장
  },

  // 사용자 정보 초기화 및 로컬 스토리지에서 제거
  clearUserInfo: () => {
    set({
      userInfo: {
        _id: '',
        name: '',
        avatar: '',
        email: '',
        token: '',
      },
    });
    localStorage.removeItem('userInfo');
  },
}));

// 페이지 로드시 로컬 스토리지에서 사용자 정보를 가져오는 초기화 코드
const loadUserInfoFromLocalStorage = () => {
  const storedUserInfo = localStorage.getItem('userInfo');
  if (storedUserInfo) {
    const parsedUserInfo = JSON.parse(storedUserInfo);
    useUserStore.getState().setUserInfo(parsedUserInfo);
  }
};

// 브라우저에서만 초기화 코드 실행
if (typeof window !== 'undefined') {
  loadUserInfoFromLocalStorage();
}

export default useUserStore;
