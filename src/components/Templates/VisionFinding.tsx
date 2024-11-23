import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Camera, UserInfo } from '@/lib/types';

interface StageTwoProps {
  camera: Camera;
}

export default function VisionFinding({ camera }: StageTwoProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
          className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-lg pointer-events-auto overflow-hidden"
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
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium">
                      Step 2
                    </span>
                    <h2 className="font-semibold text-gray-800">
                      팀 목표 설정
                    </h2>
                  </div>
                  <p className="text-xs text-gray-500">
                    우리 팀의 목표와 방향성을 함께 정해보세요
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 hover:bg-blue-100 transition-colors cursor-pointer">
                    <h3 className="font-medium text-blue-800 mb-1 text-sm flex items-center gap-1">
                      <span>🎯</span> 목표 설정
                    </h3>
                    <p className="text-xs text-blue-600">핵심 목표 정하기</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-3 hover:bg-indigo-100 transition-colors cursor-pointer">
                    <h3 className="font-medium text-indigo-800 mb-1 text-sm flex items-center gap-1">
                      <span>📅</span> 일정
                    </h3>
                    <p className="text-xs text-indigo-600">타임라인 구성</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 hover:bg-purple-100 transition-colors cursor-pointer">
                    <h3 className="font-medium text-purple-800 mb-1 text-sm flex items-center gap-1">
                      <span>👥</span> 역할
                    </h3>
                    <p className="text-xs text-purple-600">역할 분담하기</p>
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
                <div className="flex flex-col items-center gap-1">
                  <span className="text-blue-500">
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
                  <span className="text-xs font-medium text-blue-600">
                    Step 2
                  </span>
                </div>
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
                className="absolute right-0 top-0 h-full w-12 hover:bg-gray-100/50 transition-colors flex items-center justify-center"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-400"
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
    </>
  );
}
