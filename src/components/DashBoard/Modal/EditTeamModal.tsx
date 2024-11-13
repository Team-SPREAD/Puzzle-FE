'use client';
import React, { useState } from 'react';
import CheckModal from '@/components/AniModals/CheckModal';
import { updateTeam } from '@/app/api/dashboard-axios';
import pencil from '~/lotties/pencil.json';

interface EditTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  currentTeamName: string;
}

const EditTeamModal: React.FC<EditTeamModalProps> = ({
  isOpen,
  onClose,
  teamId,
  currentTeamName,
}) => {
  const [teamName, setTeamName] = useState(currentTeamName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTeamUpdated, setIsTeamUpdated] = useState(false); // 팀 수정 완료 상태 추가
  const [showThinkModal, setShowThinkModal] = useState(false); // ThinkModal 딜레이를 위해 추가

  if (!isOpen && !isTeamUpdated) return null;

  // 모달 외부 클릭 시 모달을 닫는 함수
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (isTeamUpdated) {
        setIsTeamUpdated(false); // ThinkModal이 열려있다면 ThinkModal 닫기
      } else {
        onClose();
      }
    }
  };

  // 팀 수정 핸들러
  const handleEditTeam = async () => {
    if (!teamName) return; // 팀 이름이 비어 있는 경우 요청하지 않음
    setIsSubmitting(true);

    try {
      const response = await updateTeam(teamId, teamName);
      if (response.status === 200) {
        console.log('Team updated successfully');
        setIsTeamUpdated(true); // 팀 수정 성공 시 상태 업데이트

        // 딜레이 후 ThinkModal 표시
        setTimeout(() => {
          setShowThinkModal(true);
        }, 1000); // 1000ms 딜레이
      } else {
        console.error('Failed to update team');
      }
    } catch (error) {
      console.error('Error updating team:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 팀 수정 모달 */}
      {!isTeamUpdated && isOpen && (
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
              팀 이름 수정하기
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
              onClick={handleEditTeam}
              disabled={isSubmitting}
            >
              {isSubmitting ? '팀 수정 중...' : '팀 수정'}
            </button>
          </div>
        </div>
      )}
      {/* 팀 수정 완료 모달 */}
      {showThinkModal && (
        <CheckModal
          onClose={() => {
            setShowThinkModal(false); // ThinkModal 닫기
            setIsTeamUpdated(false); // ThinkModal 닫기
            onClose(); // EditTeamModal도 닫기
            window.location.reload(); // 페이지 새로고침
          }}
          lottieAnimationData={pencil}
          title={'수정 완료'}
          description={'멋진 이름으로 수정하셨군요!'}
        />
      )}
    </>
  );
};

export default EditTeamModal;
