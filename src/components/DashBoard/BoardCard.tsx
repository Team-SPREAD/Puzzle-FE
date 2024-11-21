'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { setCookie } from 'nookies';
import Image from 'next/image';
import { Trash2, Star, Edit3, Info, ChevronLeft } from 'lucide-react';
import Lottie from 'lottie-react';
import starAnimation from '~/lotties/star.json';
import { BoardInfo } from '@/lib/types';
import { likeBoard, getRoomToken } from '@/app/api/dashboard-axios';
import EditBoardModal from './Modals/EditBoardModal';
import DeleteBoardModal from './Modals/DeleteBoardModal';
import { useDarkMode } from '@/store/useDarkModeStore';

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
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLiked, setIsLiked] = useState(board.like);
  const [isEntering, setIsEntering] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { isDarkMode } = useDarkMode();

  const cardVariants = {
    initial: { scale: 0.95, opacity: 0 },
    enter: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    exit: { scale: 0.95, opacity: 0, transition: { duration: 0.3 } },
  };

  const flipVariants = {
    front: {
      rotateY: 0,
      transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
    },
  };

  const handleLikeBoard = async () => {
    setIsAnimating(true);
    try {
      const response = await likeBoard(board._id);
      if (response.status === 200) {
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const handleEnterRoom = async () => {
    if (isEntering || isFlipped) return;
    setIsEntering(true);

    try {
      const response = await getRoomToken(board._id);
      if (response.status === 201 && response.data?.token) {
        const { token } = response.data;
        localStorage.setItem('roomToken', token);
        setCookie(null, 'roomToken', token, {
          maxAge: 3600,
          path: '/',
        });
        window.location.href = getBoardUrl(board._id);
      } else {
        alert('토큰 발급에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error entering the room:', error);
      alert('방에 들어가는 중 오류가 발생했습니다.');
    } finally {
      setIsEntering(false);
    }
  };

  const cardBackground = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const cardText = isDarkMode ? 'text-gray-200' : 'text-gray-800';
  const cardTextSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardHover = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="relative aspect-[3/4] perspective-1000"
    >
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        animate={isFlipped ? 'back' : 'front'}
        variants={flipVariants}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <motion.div
          className={`absolute w-full h-full backface-hidden ${cardBackground} rounded-xl shadow-lg overflow-hidden border ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 flex justify-between items-center">
              <h3 className={`font-semibold text-lg truncate ${cardText}`}>
                {board.boardName}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFlipped(true)}
                className={`p-2 rounded-full ${cardHover}`}
              >
                <Info className={cardTextSecondary} size={20} />
              </motion.button>
            </div>

            {/* Image Section */}
            <div
              className="flex-1 relative group cursor-pointer"
              onClick={handleEnterRoom}
            >
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundImage: board.boardImgUrl
                    ? `url(${board.boardImgUrl})`
                    : `url('/images/testUserIcon.jpeg')`,
                }}
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
              {isEntering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent" />
                </div>
              )}
            </div>

            {/* Progress Section */}
            <div className="p-4">
              <div className="mb-3">
                <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{ backgroundColor: buttonColor }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(Number(board.currentStep) / TOTAL_STEPS) * 100}%`,
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <p className={`text-sm mt-1 ${cardTextSecondary}`}>
                  진행률:{' '}
                  {Math.round((Number(board.currentStep) / TOTAL_STEPS) * 100)}%
                </p>
              </div>

              <p className={`text-sm ${cardTextSecondary} line-clamp-2`}>
                {board.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back */}
        <motion.div
          className={`absolute w-full h-full backface-hidden ${cardBackground} rounded-xl shadow-lg overflow-hidden border ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="h-full flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className={`font-semibold text-lg truncate ${cardText}`}>
                {board.boardName}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFlipped(false)}
                className={`p-2 rounded-full ${cardHover}`}
              >
                <ChevronLeft className={cardTextSecondary} size={20} />
              </motion.button>
            </div>

            <div className="flex-1 space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-lg flex items-center gap-3 ${
                  isLiked
                    ? isDarkMode
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-yellow-50 text-yellow-600'
                    : cardHover
                }`}
                onClick={handleLikeBoard}
              >
                <Star className={isLiked ? 'fill-current' : ''} size={20} />
                <span>{isLiked ? '즐겨찾기 해제' : '즐겨찾기 추가'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-lg flex items-center gap-3 ${cardHover}`}
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit3 size={20} />
                <span>보드 수정</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-lg flex items-center gap-3 ${
                  isDarkMode
                    ? 'text-red-400 hover:bg-red-500/20'
                    : 'text-red-600 hover:bg-red-50'
                }`}
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 size={20} />
                <span>보드 삭제</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Star Animation Overlay */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center"
            >
              <div className="relative w-1/2 max-w-[200px]">
                <Lottie animationData={starAnimation} loop={false} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditBoardModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            boardId={board._id}
            currentBoardName={board.boardName}
            currentDescription={board.description}
          />
        )}

        {isDeleteModalOpen && (
          <DeleteBoardModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            boardId={board._id}
            currentBoardName={board.boardName}
            boardName={board.boardName}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BoardCard;
