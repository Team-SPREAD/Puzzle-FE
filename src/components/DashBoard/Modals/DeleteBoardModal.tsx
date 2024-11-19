'use client';
import React, { useState } from 'react';
import { deleteBoard } from '@/app/api/dashboard-axios'; // 보드 삭제 API 호출 함수
import CheckModal from '@/components/AniModals/CheckModal'; // 확인 모달 컴포넌트
import trash from '~/lotties/trash.json'; // Lottie 애니메이션

interface DeleteBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  currentBoardName: string;
  boardName: string;
}

const DeleteBoardModal: React.FC<DeleteBoardModalProps> = ({
  isOpen,
  onClose,
  boardId,
  currentBoardName,
  boardName,
}) => {
  const [boardNameInput, setBoardNameInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBoardDeleted, setIsBoardDeleted] = useState(false); // 보드 삭제 완료 상태
  const [showThinkModal, setShowThinkModal] = useState(false); // 확인 모달 딜레이
  const [isIncorrect, setIsIncorrect] = useState(false); // 보드 이름 불일치 상태

  if (!isOpen && !isBoardDeleted) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (isBoardDeleted) {
        setIsBoardDeleted(false);
      } else {
        onClose();
      }
    }
  };

  const handleDeleteBoard = async () => {
    if (boardNameInput !== currentBoardName) {
      setIsIncorrect(true);
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await deleteBoard(boardId);
      if (response.status === 200) {
        console.log('Board deleted successfully');
        setIsBoardDeleted(true);

        // 딜레이 후 ThinkModal 표시
        setTimeout(() => {
          setShowThinkModal(true);
        }, 1000); // 1000ms 딜레이
      } else {
        console.error('Failed to delete board');
      }
    } catch (error) {
      console.error('Error deleting board:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardNameInput(e.target.value);
    setIsIncorrect(false);
  };

  return (
    <>
      {/* 보드 삭제 모달 */}
      {!isBoardDeleted && isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50"
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
              보드 삭제하기
            </h2>
            <p
              className={`text-center mb-1 ${
                isIncorrect ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              보드 이름을 정확히 입력해야 삭제할 수 있습니다.
            </p>
            <p
              className={`text-center mb-4 ${
                isIncorrect ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              {`확인하려면 아래 상자에 "${boardName}"을 입력하세요`}
            </p>
            <input
              type="text"
              value={boardNameInput}
              onChange={handleInputChange}
              placeholder="보드 이름 입력"
              className={`w-full p-3 border rounded-lg mt-4 focus:outline-none focus:ring-2 ${
                boardNameInput === currentBoardName
                  ? 'border-blue-500 focus:ring-blue-500'
                  : 'border-red-500 focus:ring-red-500'
              }`}
            />
            <button
              className={`w-full mt-6 p-3 rounded-lg transition duration-200 ${
                isSubmitting
                  ? 'bg-gray-500 text-white'
                  : boardNameInput === currentBoardName
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
              }`}
              onClick={handleDeleteBoard}
              disabled={isSubmitting || boardNameInput !== currentBoardName}
            >
              {isSubmitting ? '보드 삭제 중...' : '보드 삭제'}
            </button>
          </div>
        </div>
      )}
      {/* 보드 삭제 완료 모달 */}
      {showThinkModal && (
        <CheckModal
          onClose={() => {
            setShowThinkModal(false);
            setIsBoardDeleted(false);
            onClose();
            window.location.reload();
          }}
          lottieAnimationData={trash}
          title={'삭제 완료'}
          description={'새로운 보드로 만나요'}
        />
      )}
    </>
  );
};

export default DeleteBoardModal;
