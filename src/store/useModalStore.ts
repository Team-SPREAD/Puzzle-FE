import { create } from 'zustand';

type ModalType =
  | 'CREATE_TEAM'
  | 'TEAM_SETTING'
  | 'INVITE_TEAM'
  | 'EDIT_TEAM'
  | 'DELETE_TEAM'
  | 'DROPDOWN_TEAM_SELECT'
  | 'USER_SELECT'
  | 'PROJECT_SETTING' // 여기까지 대시보드 모달
  | 'VOTE_COMPLETE' //투표 모달
  | 'NEXT_STEP' //단계 이동 모달
  | 'CREATE_BOARD'
  | 'DELETE_BOARD'
  | 'EDIT_BOARD'
  | 'GUIDE_MODAL' // 안내 모달
  | 'SETTINGS' // SETTINGS 추가
  | null;

interface ModalProps {
  [key: string]: any; // 각 모달의 속성에 대해 유연하게 타입을 받을 수 있도록 설정
}

interface ModalState {
  modalType: ModalType;
  modalProps: any;
  openModal: (type: ModalType, props?: any) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  modalType: null,
  modalProps: null,
  openModal: (type, props = null) =>
    set({ modalType: type, modalProps: props }),
  closeModal: () => set({ modalType: null, modalProps: null }),
}));

export default useModalStore;
