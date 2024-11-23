import React from 'react';
import {
  X,
  Music,
  MessageCircle,
  Vote,
  Palette,
  Footprints,
} from 'lucide-react';
import useModalStore from '@/store/useModalStore';

interface GuideModalProps {
  modalType?: string;
}

const GuideModal: React.FC<GuideModalProps> = () => {
  const { modalType, closeModal } = useModalStore();

  if (modalType !== 'GUIDE_MODAL') {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black/80 z-[50] flex items-center justify-center">
      <div className="bg-white/10 w-full h-full relative overflow-hidden">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/20 hover:bg-gray-800/30 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="h-full flex flex-col items-center justify-center p-8 space-y-12">
          {/* Process Bar Guide - 화살표 위로 */}
          <div className="relative w-full max-w-2xl">
            <div className="absolute -top-80 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg">
                <Footprints className="w-6 h-6 mr-2" />
                <p className="font-medium">
                  프로세스 바를 통해 각 단계를 확인하고 이동할 수 있습니다
                </p>
              </div>
              <div className="w-4 h-4 bg-blue-500 transform rotate-45 absolute -top-2 left-1/2 -translate-x-1/2" />
            </div>
          </div>

          {/* Toolbar Guide - 화살표 왼쪽으로 */}
          <div className="absolute left-32">
            <div className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg">
              <div className="flex items-center">
                <Palette className="w-6 h-6 mr-2" />
                <p className="font-medium">
                  도구 모음을 사용하여 자유롭게 아이디어를 표현하세요
                </p>
              </div>
            </div>
            <div className="w-4 h-4 bg-purple-500 transform rotate-45 absolute -left-2 top-1/2 -translate-y-1/2" />
          </div>

          {/* Right Nav Guide - 화살표 오른쪽으로 */}
          <div className="absolute right-80 -translate-y-1/2">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <Music className="w-6 h-6 mr-2" />
                  <p className="font-medium">
                    배경음악으로 분위기를 전환하세요
                  </p>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2" />
                  <p className="font-medium">음성 채팅으로 실시간 소통하세요</p>
                </div>
              </div>
            </div>
            <div className="w-4 h-4 bg-green-500 transform rotate-45 absolute -right-2 top-1/2 -translate-y-1/2" />
          </div>

          {/* Voting Guide - 화살표 아래로 */}
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
            <div className="bg-amber-500 text-white px-6 py-3 rounded-lg shadow-lg">
              <div className="flex items-center">
                <Vote className="w-6 h-6 mr-2" />
                <p className="font-medium">
                  투표 기능으로 팀원들과 의견을 모아보세요
                </p>
              </div>
            </div>
            <div className="w-4 h-4 bg-amber-500 transform rotate-45 absolute -bottom-2 left-1/2 -translate-x-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
