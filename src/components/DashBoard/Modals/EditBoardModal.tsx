'use client';
import React, { useState, useEffect } from 'react';
import CheckModal from '@/components/AniModals/CheckModal';
import { updateBoard } from '@/app/api/dashboard-axios';
import pencilAnimation from '~/lotties/pencil.json';

interface EditBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  currentBoardName: string;
  currentDescription: string;
}

const EditBoardModal: React.FC<EditBoardModalProps> = ({
  isOpen,
  onClose,
  boardId,
  currentBoardName,
  currentDescription,
}) => {
  // 상태 관리
  const [boardName, setBoardName] = useState(currentBoardName);
  const [description, setDescription] = useState(currentDescription);
  const [editBoardImg, setEditBoardImg] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBoardUpdated, setIsBoardUpdated] = useState(false);

  // 모달이 열릴 때마다 현재 값으로 초기화
  useEffect(() => {
    if (isOpen) {
      setBoardName(currentBoardName);
      setDescription(currentDescription);
      setEditBoardImg(null);
      setIsSubmitting(false);
      setIsBoardUpdated(false);
    }
  }, [isOpen, currentBoardName, currentDescription]);

  // 보드 수정 핸들러
  const handleEditBoard = async () => {
    if (!boardName.trim() || !description.trim()) {
      alert('보드 이름과 설명을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('boardName', boardName.trim());
    formData.append('description', description.trim());

    if (editBoardImg) {
      formData.append('boardImg', editBoardImg);
    }

    try {
      const response = await updateBoard(boardId, formData);
      if (response.status === 200) {
        console.log('Board updated successfully:', response.data);
        setIsBoardUpdated(true);
      } else {
        throw new Error('Failed to update board');
      }
    } catch (error) {
      console.error('Error updating board:', error);
      alert('보드 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (예: 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }
      // 이미지 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
      setEditBoardImg(file);
      console.log(editBoardImg);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // 제출 중에는 닫지 않음
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {!isBoardUpdated && isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-center mb-4">
              보드 수정하기
            </h2>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="보드 이름"
              className="w-full p-3 border border-gray-300 rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="보드 설명"
              className="w-full p-3 border border-gray-300 rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
              disabled={isSubmitting}
            />
            <input
              id="upload"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={isSubmitting}
            />
            <label
              htmlFor="upload"
              className={`w-full flex items-center justify-center mt-4 p-3 border border-dashed border-gray-300 rounded-lg ${
                !isSubmitting
                  ? 'cursor-pointer hover:bg-gray-100'
                  : 'cursor-not-allowed opacity-60'
              } focus-within:ring-2 focus-within:ring-blue-500`}
            >
              {editBoardImg ? (
                <span className="text-gray-600 truncate">
                  {editBoardImg.name}
                </span>
              ) : (
                <span className="text-gray-600">이미지 파일 업로드 (클릭)</span>
              )}
            </label>
            <button
              className={`w-full mt-6 bg-blue-500 text-white p-3 rounded-lg ${
                !isSubmitting ? 'hover:bg-blue-600' : 'opacity-60'
              } transition duration-200`}
              onClick={handleEditBoard}
              disabled={isSubmitting}
            >
              {isSubmitting ? '보드 수정 중...' : '보드 수정'}
            </button>
          </div>
        </div>
      )}
      {isBoardUpdated && (
        <CheckModal
          onClose={() => {
            setIsBoardUpdated(false);
            onClose();
            window.location.reload();
          }}
          lottieAnimationData={pencilAnimation}
          title={'수정 완료'}
          description={'보드가 성공적으로 수정되었습니다!'}
        />
      )}
    </>
  );
};

export default EditBoardModal;
