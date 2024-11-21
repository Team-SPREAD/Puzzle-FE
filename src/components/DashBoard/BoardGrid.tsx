'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Info } from 'lucide-react';
import { useDarkMode } from '@/store/useDarkModeStore';
import useModalStore from '@/store/useModalStore';
import { getAllBoard } from '@/app/api/dashboard-axios'; // API 가져오기
import { BoardInfo } from '@/lib/types';
import BoardCard from './BoardCard';
import CreateBoardModal from './Modals/CreateBoardModal';

interface BoardGridProps {
  boards: BoardInfo[]; // boards 속성 추가
  buttonColor: string;
  teamId: string | null;
  token: string; // 토큰 속성 유지
}

export default function BoardGrid({
  buttonColor,
  teamId,
  token,
}: BoardGridProps) {
  const { isDarkMode } = useDarkMode();
  const { modalType, openModal, closeModal } = useModalStore();
  const [boards, setBoards] = useState<BoardInfo[]>([]); // 상태 추가
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 오류 상태

  useEffect(() => {
    const fetchBoards = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllBoard(token);
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

    // 팀 ID가 없으면 전체 보드 불러오기
    if (!teamId) {
      fetchBoards();
    }
  }, [teamId, token]);

  const getBoardUrl = (boardId: string) => {
    return `/board/${boardId}`;
  };

  const handleNewBoardClick = () => {
    openModal('CREATE_BOARD');
  };

  return (
    <div className="h-full overflow-y-auto">
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-6 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        {teamId && (
          <div className="relative aspect-[3/4]">
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
          </div>
        )}

        {/* 로딩 상태 처리 */}
        {loading && (
          <div className="col-span-full flex justify-center items-center h-96">
            <p className="text-lg font-semibold text-gray-700">
              보드를 불러오는 중입니다...
            </p>
          </div>
        )}

        {/* 오류 처리 */}
        {error && (
          <div className="col-span-full flex justify-center items-center h-96">
            <p className="text-lg font-semibold text-red-500">{error}</p>
          </div>
        )}

        {/* 보드 표시 */}
        {!loading && !error && boards?.length > 0 ? (
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
        ) : (
          // 보드가 없을 때
          !loading &&
          !error && (
            <div className="col-span-full flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg shadow-md">
              <p className="text-lg font-semibold text-gray-700">
                팀을 생성해서 보드를 만들어 보아요
              </p>
              <p className="text-sm text-gray-500 mt-2">
                프로젝트를 시작하려면 새로운 팀을 생성하세요.
              </p>
            </div>
          )
        )}

        {/* 모달 */}
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
