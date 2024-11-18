import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Camera, UserInfo } from '@/lib/types';

interface RoleAssignmentProps {
  camera: Camera;
}

export default function RoleAssignment({ camera }: RoleAssignmentProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-5 top-20 z-30"
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
                {/* 단계 설명 */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-cyan-100 text-cyan-600 text-xs px-2 py-0.5 rounded-full font-medium">
                      Step 9
                    </span>
                    <h2 className="font-semibold text-gray-800">메뉴 트리</h2>
                  </div>
                  <p className="text-xs text-gray-500">
                    프로젝트 수행을 위한 역할을 나누어보세요
                  </p>
                </div>

                {/* 카드 그리드 */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-cyan-50 rounded-lg p-3 hover:bg-cyan-100 transition-colors cursor-pointer">
                    <h3 className="font-medium text-cyan-800 mb-1 text-sm flex items-center gap-1">
                      <span>👨‍💻</span> 개발
                    </h3>
                    <p className="text-xs text-cyan-600">기술 구현</p>
                  </div>
                  <div className="bg-cyan-50 rounded-lg p-3 hover:bg-cyan-100 transition-colors cursor-pointer">
                    <h3 className="font-medium text-cyan-800 mb-1 text-sm flex items-center gap-1">
                      <span>🎨</span> 디자인
                    </h3>
                    <p className="text-xs text-cyan-600">UI/UX 설계</p>
                  </div>
                  <div className="bg-cyan-50 rounded-lg p-3 hover:bg-cyan-100 transition-colors cursor-pointer">
                    <h3 className="font-medium text-cyan-800 mb-1 text-sm flex items-center gap-1">
                      <span>📋</span> 기획
                    </h3>
                    <p className="text-xs text-cyan-600">서비스 설계</p>
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
                  <span className="text-cyan-500">
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
                  <span className="text-xs font-medium text-cyan-600">
                    Step 9
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 접기/펼치기 버튼 - 펼쳐진 상태에서만 보임 */}
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

          {/* 접힌 상태에서는 전체 영역이 클릭 가능 */}
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
