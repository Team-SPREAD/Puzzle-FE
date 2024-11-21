'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Info } from 'lucide-react';
import { useDarkMode } from '@/store/useDarkModeStore';
import useModalStore from '@/store/useModalStore';
import { generateRandomColor } from '@/utils/getRandomColor';
import { BoardInfo } from '@/lib/types';
import BoardCard from './BoardCard';
import CreateBoardModal from './Modals/CreateBoardModal';

interface BoardGridProps {
  boards: BoardInfo[];
  buttonColor: string;
  teamId: string | null;
}

export default function BoardGrid({
  boards = [],
  buttonColor,
  teamId,
}: BoardGridProps) {
  const { isDarkMode } = useDarkMode();
  const { modalType, openModal, closeModal } = useModalStore();

  const getBoardUrl = (boardId: string) => {
    return `/board/${boardId}`;
  };

  const handleNewBoardClick = () => {
    openModal('CREATE_BOARD');
  };

  return (
    <div className="h-full overflow-y-auto">
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-6 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {teamId && (
        <div className="relative aspect-[3/4]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewBoardClick}
            className={`w-full h-full rounded-xl flex flex-col items-center justify-center shadow-lg transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-800' 
                : 'bg-white'
            }`}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: buttonColor }}
            >
              <Plus size={32} className="text-white" />
            </div>
            <p className={`text-xl font-bold ${
              isDarkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>New board</p>
          </motion.button>
        </div>
      )}
      

      {!teamId && boards.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-gray-700">
            팀을 생성해서 보드를 만들어 보아요
          </p>
          <p className="text-sm text-gray-500 mt-2">
            프로젝트를 시작하려면 새로운 팀을 생성하세요.
          </p>
        </div>
      )}

      {boards?.length > 0 ? (
        boards.map((board) => (
          <motion.div
            key={board._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative aspect-[3/4]"
          >
            <BoardCard
              board={board}
              buttonColor={buttonColor}
              TOTAL_STEPS={10}
              getBoardUrl={getBoardUrl}
            />
          </motion.div>
        ))
      ) : null}

      <AnimatePresence>
        {modalType === 'CREATE_BOARD' && (
          <CreateBoardModal
            isOpen={modalType === 'CREATE_BOARD'}
            onClose={closeModal}
            teamId={teamId}
          />
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}