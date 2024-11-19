'use client';
import React, { useState } from 'react';
import { deleteTeam } from '@/app/api/dashboard-axios';
import CheckModal from '@/components/AniModals/CheckModal';
import trash from '~/lotties/trash.json';

interface DeleteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  currentTeamName: string;
  teamName: string;
}

const DeleteTeamModal: React.FC<DeleteTeamModalProps> = ({
  isOpen,
  onClose,
  teamId,
  currentTeamName,
  teamName,
}) => {
  const [teamNameInput, setTeamNameInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTeamDeleted, setIsTeamDeleted] = useState(false); // 팀 삭제 완료 상태 추가
  const [showThinkModal, setShowThinkModal] = useState(false); // ThinkModal 딜레이를 위해 추가
  const [isIncorrect, setIsIncorrect] = useState(false); // 팀 이름이 정확하지 않은 경우 상태

  if (!isOpen && !isTeamDeleted) return null;

  // 모달 외부 클릭 시 모달을 닫는 함수
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (isTeamDeleted) {
        setIsTeamDeleted(false); // ThinkModal이 열려있다면 ThinkModal 닫기
      } else {
        onClose();
      }
    }
  };

  // 팀 삭제 핸들러
  const handleDeleteTeam = async () => {
    if (teamNameInput !== currentTeamName) {
      setIsIncorrect(true); // 팀 이름이 정확하지 않은 경우 안내 텍스트 색 변경
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await deleteTeam(teamId);
      if (response.status === 200) {
        console.log('Team deleted successfully');
        setIsTeamDeleted(true); // 팀 삭제 성공 시 상태 업데이트

        // 딜레이 후 ThinkModal 표시
        setTimeout(() => {
          setShowThinkModal(true);
        }, 1000); // 1000ms 딜레이
      } else {
        console.error('Failed to delete team');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 입력 값이 변경될 때마다 정확한지 확인
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamNameInput(e.target.value);
    setIsIncorrect(false); // 입력 변경 시 안내 텍스트 색상 초기화
  };

  return (
    <>
      {/* 팀 삭제 모달 */}
      {!isTeamDeleted && isOpen && (
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
              팀 삭제하기
            </h2>
            <p
              className={`text-center mb-1 ${
                isIncorrect ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              팀 이름을 정확히 입력해야 삭제할 수 있습니다.
            </p>
            <p
              className={`text-center mb-4 ${isIncorrect ? 'text-red-600' : 'text-gray-600'}`}
            >
              {`확인하려면 아래 상자에 "${teamName}"을 입력하세요`}
            </p>
            <input
              type="text"
              value={teamNameInput}
              onChange={handleInputChange}
              placeholder="팀 이름 입력"
              className={`w-full p-3 border rounded-lg mt-4 focus:outline-none focus:ring-2 ${
                teamNameInput === currentTeamName
                  ? 'border-blue-500 focus:ring-blue-500'
                  : 'border-red-500 focus:ring-red-500'
              }`}
            />
            <button
              className={`w-full mt-6 p-3 rounded-lg transition duration-200 ${
                isSubmitting
                  ? 'bg-gray-500 text-white'
                  : teamNameInput === currentTeamName
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
              }`}
              onClick={handleDeleteTeam}
              disabled={isSubmitting || teamNameInput !== currentTeamName} // 팀 이름이 정확하지 않으면 비활성화
            >
              {isSubmitting ? '팀 삭제 중...' : '팀 삭제'}
            </button>
          </div>
        </div>
      )}
      {/* 팀 삭제 완료 모달 */}
      {showThinkModal && (
        <CheckModal
          onClose={() => {
            setShowThinkModal(false); // ThinkModal 닫기
            setIsTeamDeleted(false); // ThinkModal 닫기
            onClose(); // DeleteTeamModal도 닫기
            window.location.reload(); // 페이지 새로고침
          }}
          lottieAnimationData={trash}
          title={'삭제 완료'}
          description={'새로운 팀으로 만나요'}
        />
      )}
    </>
  );
};

export default DeleteTeamModal;
