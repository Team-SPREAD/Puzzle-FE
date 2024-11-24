'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from '@/lib/types';
import { useMarkdownStore } from '@/store/useMarkdownStore';
import ModalContent from '@/components/AniModals/MarkDownModal';
import { stepResult } from '@/app/api/canvas-axios';
import Image from 'next/image';
import NotionIcon from '~/images/logo/Notion.png';
import FigmaIcon from '~/images/logo/Figma.png';

interface ResultProps {
  camera: Camera;
  boardId: string;
}

export default function Result({ camera, boardId }: ResultProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { markdown, setMarkdown } = useMarkdownStore();

  // 컴포넌트 마운트 시 결과를 가져옴
  const fetchResult = async () => {
    try {
      const liveblocksToken = localStorage.getItem('roomToken');

      const resultResponse = await stepResult(boardId, liveblocksToken);

      if (resultResponse) {
        setMarkdown(resultResponse.data.result);
        console.log('결과 데이터 가져오기 성공');
      }
    } catch (error) {
      console.error('Failed to fetch result:', error);
    }
  };

  const handleNotionClick = () => {
    window.open('https://www.notion.so', '_blank');
  };

  const handleFigmaClick = () => {
    window.open('https://www.figma.com', '_blank');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-5 top-[90px] z-30"
      >
        <motion.div
          animate={{ width: isCollapsed ? '48px' : '500px' }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          className="relative bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg pointer-events-auto overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 pr-12"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full font-medium">
                      final
                    </span>
                    <h2 className="font-semibold text-white">결과 마무리</h2>
                  </div>
                  <p className="text-xs text-gray-400">
                    프로젝트 마무리를 위해 README.md와 최종 검토를 진행하세요
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div
                    className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsCollapsed(true);
                      fetchResult();
                    }}
                  >
                    <h3 className="font-medium text-white mb-1 text-sm flex items-center gap-1">
                      <span>📝</span> README.md
                    </h3>
                    <p className="text-xs text-gray-400">결과 확인하기</p>
                  </div>
                  <div
                    onClick={handleNotionClick}
                    className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors cursor-pointer group"
                  >
                    <h3 className="font-medium text-white mb-1 text-sm flex items-center gap-1">
                      <span>
                        <Image
                          src={NotionIcon}
                          alt="notion"
                          width={16}
                          height={16}
                        />
                      </span>
                      Notion
                      <svg
                        className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </h3>
                    <p className="text-xs text-gray-400">기획 정리 하러가기</p>
                  </div>
                  <div
                    onClick={handleFigmaClick}
                    className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors cursor-pointer group"
                  >
                    <h3 className="font-medium text-white mb-1 text-sm flex items-center gap-1">
                      <span>
                        <Image
                          src={FigmaIcon}
                          alt="figma"
                          width={16}
                          height={16}
                        />
                      </span>
                      Figma
                      <svg
                        className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </h3>
                    <p className="text-xs text-gray-400">
                      이어서 디자인 하러가기
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center py-3"
              >
                <motion.div
                  className="flex flex-col items-center gap-1"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <span className="text-gray-400">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </span>
                  <span className="text-xs font-medium text-gray-400">
                    Step 9
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCollapsed(true)}
                className="absolute right-0 top-0 h-full w-12 hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-500"
                >
                  <path
                    d="M14 4L8 10L14 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          {isCollapsed && (
            <motion.button
              onClick={() => setIsCollapsed(false)}
              className="absolute inset-0 w-full h-full"
            />
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden relative"
            >
              <ModalContent onClose={() => setIsModalOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
