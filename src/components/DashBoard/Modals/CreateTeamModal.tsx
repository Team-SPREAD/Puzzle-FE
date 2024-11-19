'use client';
import React, { useState } from 'react';
import CheckModal from '@/components/AniModals/CheckModal';
import { createTeam } from '@/app/api/dashboard-axios';
import think from '~/lotties/think.json';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  token: string; // JWT 토큰 추가
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  userId,
  token,
}) => {
  const [teamName, setTeamName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTeamCreated, setIsTeamCreated] = useState(false); // 팀 생성 완료 상태 추가
  const [showThinkModal, setShowThinkModal] = useState(false); // ThinkModal 딜레이를 위해 추가

  if (!isOpen && !isTeamCreated) return null;

  // 모달 외부 클릭 시 모달을 닫는 함수
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (isTeamCreated) {
        setIsTeamCreated(false); // ThinkModal이 열려있다면 ThinkModal 닫기
      } else {
        onClose();
      }
    }
  };

  // 팀 생성 핸들러
  const handleCreateTeam = async () => {
    if (!teamName) return; // 팀 이름이 비어 있는 경우 요청하지 않음
    setIsSubmitting(true);

    try {
      const response = await createTeam(teamName);
      if (response.status === 201) {
        console.log('Team created successfully');
        setIsTeamCreated(true); // 팀 생성 성공 시 상태 업데이트
        setIsSubmitting(true);
        // 딜레이 후 ThinkModal 표시
        setTimeout(() => {
          setShowThinkModal(true);
        }, 1000); // 1000ms 딜레이
      } else {
        console.error('Failed to create team');
      }
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 팀 생성 모달 */}
      {!isTeamCreated && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={onClose}
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-center mb-4">
              새로운 팀 만들기
            </h2>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="팀 이름"
              className="w-full p-3 border border-gray-300 rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="w-full mt-6 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
              onClick={handleCreateTeam}
              disabled={isSubmitting}
            >
              {isSubmitting ? '팀 생성 중...' : '팀 생성'}
            </button>
          </div>
        </div>
      )}
      {/* 팀 생성 완료 모달 */}
      {showThinkModal && (
        <CheckModal
          onClose={() => {
            setShowThinkModal(false);
            setIsTeamCreated(false);
            onClose();
            window.location.reload();
          }}
          lottieAnimationData={think}
          title={'축하합니다!'}
          description={'팀 생성이 완료되었어요'}
        />
      )}
    </>
  );
};

export default CreateTeamModal;
