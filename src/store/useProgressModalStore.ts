import { create } from 'zustand';

interface ProgressModalState {
  isOpen: boolean;
  message: string | null;
  openModal: (message?: string) => void;
  closeModal: () => void;
}

const useProgressModalStore = create<ProgressModalState>((set) => ({
  isOpen: false,
  message: null,

  openModal: (message = '처리 중입니다...') => set({ isOpen: true, message }),

  closeModal: () => set({ isOpen: false, message: null }),
}));

export default useProgressModalStore;
