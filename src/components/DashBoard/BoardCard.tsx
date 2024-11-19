import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { setCookie } from 'nookies';
import Image from 'next/image';
import { Trash2, Star, Edit3, RotateCcw } from 'lucide-react';
import Lottie from 'lottie-react';
import starAnimation from '~/lotties/star.json';
import dots from '~/images/dots.svg';
import { BoardInfo } from '@/lib/types';
import TestImage from '~/images/testUserIcon.jpeg';
import { likeBoard, getRoomToken } from '@/app/api/dashboard-axios';
import EditBoardModal from './Modals/EditBoardModal';
import DeleteBoardModal from './Modals/DeleteBoardModal';

interface BoardCardProps {
  board: BoardInfo;
  buttonColor: string;
  TOTAL_STEPS: number;
  getBoardUrl: (id: string) => string;
}

const BoardCard: React.FC<BoardCardProps> = ({
  board,
  buttonColor,
  TOTAL_STEPS,
  getBoardUrl,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // 즐겨찾기 애니메이션 상태
  const [isLiked, setIsLiked] = useState(board.like); // 즐겨찾기 상태
  const [isEntering, setIsEntering] = useState(false); // 방 입장 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // EditModal 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // DeleteModal 상태

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleLikeBoard = async () => {
    setIsAnimating(true); // 애니메이션 시작
    try {
      const response = await likeBoard(board._id);
      if (response.status === 200) {
        setIsLiked(!isLiked); // 즐겨찾기 상태 토글
      } else {
        console.error('Failed to update like status');
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 1000); // 애니메이션 종료
    }
  };

  const handleEnterRoom = async () => {
    if (isEntering) return; // 중복 클릭 방지
    setIsEntering(true);

    try {
      const response = await getRoomToken(board._id);

      if (response.status === 201 && response.data?.token) {
        const { token } = response.data;

        // 로컬 스토리지에 룸 토큰 저장
        localStorage.setItem('roomToken', token);

        //쿠키에 룸 토큰 저장
        setCookie(null, 'roomToken', token, {
          maxAge: 3600, //1시간
          path: '/',
        });

        // 방 URL로 리다이렉트
        const roomUrl = getBoardUrl(board._id);
        window.location.href = roomUrl;
      } else {
        alert('토큰 발급에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error entering the room:', error);
      alert('방에 들어가는 중 오류가 발생했습니다.');
    } finally {
      setIsEntering(false); // 상태 해제
    }
  };

  return (
    <>
      {/* 보드 카드 */}
      <div className="relative w-full aspect-[2/3] perspective-1000 hover:shadow-2xl duration-500 mb-4">
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of card */}
          <motion.div
            className="w-full h-full absolute backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="bg-white rounded-lg shadow-md h-full flex flex-col relative">
              <AnimatePresence>
                {isAnimating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeOut',
                    }}
                    className="absolute inset-0 z-20 flex items-center justify-center"
                  >
                    {/* White overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white"
                    />
                    {/* Lottie Animation */}
                    <div className="relative z-30 w-1/2 max-w-[200px]">
                      <Lottie
                        animationData={starAnimation}
                        loop={false}
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Header */}
              <div className="h-[10%] flex justify-end items-center px-6">
                <Image
                  src={dots}
                  alt="dots"
                  width={21}
                  height={16}
                  onClick={handleFlip}
                  className="cursor-pointer"
                />
              </div>

              {/* Image Section */}
              <div className="h-[60%] flex justify-center items-center px-6">
                <button
                  onClick={handleEnterRoom} // 방 입장 버튼
                  className={`w-full h-full relative flex items-center justify-center border-2 border-gray-200 rounded-lg hover:bg-gray-50`}
                  style={{
                    backgroundImage: `url(${board.boardImgUrl || TestImage.src})`,
                    backgroundSize: 'cover', // 이미지 크기 조정
                    backgroundPosition: 'center', // 이미지 위치 조정
                  }}
                  disabled={isEntering} // 로딩 중 비활성화
                >
                  {isEntering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                      <span className="text-gray-500">로딩 중...</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Progress and Info Section */}
              <div className="h-[30%] px-6 flex flex-col justify-evenly">
                <div className="relative w-full h-1 bg-gray-200 rounded">
                  <div
                    className="h-full rounded"
                    style={{
                      width: `${
                        (Number(board.currentStep) / TOTAL_STEPS) * 100
                      }%`,
                      backgroundColor: board.team ? buttonColor : 'gray',
                    }}
                  ></div>
                </div>

                <div className="flex flex-col justify-center">
                  <h3 className="font-bold text-xl mb-2 line-clamp-1">
                    {board.boardName}
                  </h3>
                  <p className="text-sm text-gray-500">{board.description}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Back of card */}
          <motion.div
            className="w-full h-full absolute backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
              <div className="h-[10%] flex justify-end items-center px-6">
                <button onClick={handleFlip}>
                  <RotateCcw className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center gap-4 px-6">
                <button
                  className="w-full flex items-center gap-2 p-4 rounded-lg hover:bg-gray-100 transition-colors relative"
                  onClick={handleLikeBoard}
                >
                  <Star
                    className={`w-5 h-5 ${
                      isLiked ? 'text-yellow-500 fill-current' : 'text-black'
                    }`}
                  />
                  <span
                    className={`${isLiked ? 'text-yellow-500' : 'text-black'}`}
                  >
                    {isLiked ? '즐겨찾기 제거' : '즐겨찾기 추가'}
                  </span>
                </button>

                <button
                  className="w-full flex items-center gap-2 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit3 className="w-5 h-5" />
                  <span>보드 수정</span>
                </button>

                <button
                  className="w-full flex items-center gap-2 p-4 rounded-lg hover:bg-gray-100 transition-colors text-red-500"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 className="w-5 h-5" />
                  <span>보드 삭제</span>
                </button>
              </div>

              <div className="h-[10%]" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* EditBoardModal 로컬 상태로 관리 */}
      {isEditModalOpen && (
        <EditBoardModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          boardId={board._id}
          currentBoardName={board.boardName}
          currentDescription={board.description}
        />
      )}

      {/* DeleteBoardModal 로컬 상태로 관리 */}
      {isDeleteModalOpen && (
        <DeleteBoardModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          boardId={board._id}
          currentBoardName={board.boardName}
          boardName={board.boardName}
        />
      )}
    </>
  );
};

export default BoardCard;
