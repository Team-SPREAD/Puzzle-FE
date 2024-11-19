'use client';

import React, { useState } from 'react';
import { createBoard } from '@/app/api/dashboard-axios';
import CheckModal from '@/components/AniModals/CheckModal'; // CheckModal 추가
import successAnimation from '~/lotties/check.json'; // 성공 애니메이션 JSON 파일 추가

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string | null;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  isOpen,
  onClose,
  teamId,
}) => {
  const [boardName, setBoardName] = useState('');
  const [description, setDescription] = useState('');
  const [boardImg, setBoardImg] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBoardCreated, setIsBoardCreated] = useState(false); // 보드 생성 완료 상태 추가

  if (!isOpen && !isBoardCreated) return null;

  // 보드 생성 핸들러
  const handleCreateBoard = async () => {
    if (!boardName || !description || !teamId) return; // 필수 값 체크
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('boardName', boardName);
    formData.append('description', description);
    formData.append('teamId', teamId);
    if (boardImg) {
      formData.append('boardImg', boardImg);
    }

    try {
      const response = await createBoard(formData);
      if (response.status === 201) {
        console.log('Board created successfully');
        setIsBoardCreated(true); // 보드 생성 성공 상태 업데이트
      } else {
        console.error('Failed to create board');
      }
    } catch (error) {
      console.error('Error creating board:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 보드 생성 모달 */}
      {!isBoardCreated && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={onClose}
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-center mb-4">
              새로운 보드 만들기
            </h2>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="보드 이름"
              className="w-full p-3 border border-gray-300 rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="보드 설명"
              className="w-full p-3 border border-gray-300 rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
            <input
              id="upload"
              type="file"
              onChange={(e) => setBoardImg(e.target.files?.[0] || null)}
              accept="image/*"
              className="hidden"
            />
            <label
              htmlFor="upload"
              className="w-full flex items-center justify-center mt-4 p-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500"
            >
              {boardImg ? (
                <span className="text-gray-600 truncate">{boardImg.name}</span>
              ) : (
                <span className="text-gray-600">이미지 파일 업로드 (클릭)</span>
              )}
            </label>
            <button
              className="w-full mt-6 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
              onClick={handleCreateBoard}
              disabled={isSubmitting}
            >
              {isSubmitting ? '보드 생성 중...' : '보드 생성'}
            </button>
          </div>
        </div>
      )}

      {/* 보드 생성 완료 모달 */}
      {isBoardCreated && (
        <CheckModal
          onClose={() => {
            setIsBoardCreated(false);
            onClose();
            window.location.reload(); // 페이지 새로고침
          }}
          lottieAnimationData={successAnimation} // 성공 애니메이션 데이터
          title={'축하합니다!'}
          description={'보드 생성이 완료되었습니다!'}
        />
      )}
    </>
  );
};

export default CreateBoardModal;
