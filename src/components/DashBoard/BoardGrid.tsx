'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Info } from 'lucide-react';
import { useDarkMode } from '@/store/useDarkModeStore';
import useModalStore from '@/store/useModalStore';
import { getAllBoard, getBoard, likeAllBoard } from '@/app/api/dashboard-axios';
import { BoardInfo } from '@/lib/types';
import BoardCard from './BoardCard';
import CreateBoardModal from './Modals/CreateBoardModal';

interface BoardGridProps {
  buttonColor: string;
  teamId: string | null;
  token: string;
  searchTerm: string;
  boardView: 'MyBoards' | 'FavoriteBoards';
}

export default function BoardGrid({
  buttonColor,
  teamId,
  token,
  searchTerm,
  boardView,
}: BoardGridProps) {
  const { isDarkMode } = useDarkMode();
  const { modalType, openModal, closeModal } = useModalStore();
  const [boards, setBoards] = useState<BoardInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoards = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;

        if (boardView === 'FavoriteBoards') {
          response = await likeAllBoard();
        } else {
          // MyBoards view
          if (!teamId) {
            response = await getAllBoard(token);
          } else {
            response = await getBoard(teamId);
          }
        }

        if (response.status === 200) {
          setBoards(response.data);
        } else {
          throw new Error('Failed to fetch boards');
        }
      } catch (err) {
        console.error('Error fetching boards:', err);
        setError('보드를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [teamId, token, boardView]);

  const getBoardUrl = (boardId: string) => {
    return `/board/${boardId}`;
  };

  const handleNewBoardClick = () => {
    openModal('CREATE_BOARD');
  };

  // 검색어로 보드 필터링
  const filteredBoards = searchTerm
    ? boards.filter((board) =>
        board.boardName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : boards;

  return (
    <div className="h-full overflow-y-auto">
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-6 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        {teamId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative aspect-[3/4]"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNewBoardClick}
              className={`w-full h-full rounded-xl flex flex-col items-center justify-center shadow-lg transition-all duration-200 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: buttonColor }}
              >
                <Plus size={32} className="text-white" />
              </div>
              <p
                className={`text-xl font-bold ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}
              >
                New board
              </p>
            </motion.button>
          </motion.div>
        )}

        {/* 로딩 상태 */}
        {loading && (
          <div className="col-span-full flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="col-span-full flex justify-center items-center h-96">
            <p className="text-lg font-semibold text-red-500">{error}</p>
          </div>
        )}

        {/* 보드가 없는 상태 */}
        {!loading && !error && filteredBoards.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center h-96">
            <Info
              size={48}
              className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}
            />
            <p
              className={`text-lg font-semibold mt-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {teamId
                ? '이 팀에는 아직 보드가 없습니다.'
                : boardView === 'FavoriteBoards'
                  ? '즐겨찾기한 보드가 없습니다.'
                  : '생성된 보드가 없습니다.'}
            </p>
            {teamId && (
              <p
                className={`text-sm mt-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                새 보드를 만들어 프로젝트를 시작해보세요!
              </p>
            )}
          </div>
        )}

        {/* 보드 목록 */}
        {!loading &&
          !error &&
          filteredBoards.map((board) => (
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
          ))}
      </div>

      {/* 모달 */}
      <AnimatePresence>
        {modalType === 'CREATE_BOARD' && (
          <CreateBoardModal
            isOpen={true}
            onClose={closeModal}
            teamId={teamId}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
