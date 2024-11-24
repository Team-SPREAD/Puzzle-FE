import AudioPlayer from './AudioPlayer';
import Timer from './Timer';
import GroupCall from './GroupCall';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { memo } from 'react';
import LiveAvatars from './LiveAvatars';
import { SoundBlocks } from './SoundBlocks';

type GroupCallProps = {
  roomId: string;
};

const RightNav = memo(({ roomId }: GroupCallProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute right-5 top-40 z-30" // 위치 조정
      >
        <motion.div
          animate={{ width: isCollapsed ? '100px' : '250px' }} // 너비 감소
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          className="relative bg-white/90 backdrop-blur-sm rounded-lg shadow-lg pointer-events-auto overflow-hidden" // rounded-xl -> rounded-lg
        >
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-3 pl-6" // 패딩 감소
              >
                {/* LiveAvatars */}
                <div className="mb-3">
                  {' '}
                  {/* 마진 감소 */}
                  <LiveAvatars />
                </div>
                {/* Timer */}
                <div className="mb-3">
                  {' '}
                  {/* 마진 감소 */}
                  <Timer />
                </div>

                {/* Audio Player */}
                <div className="mb-3">
                  {' '}
                  {/* 마진 감소 */}
                  <AudioPlayer />
                </div>

                {/* Sound Blocks */}
                <div className="mb-3">
                  {' '}
                  {/* 마진 감소 */}
                  <SoundBlocks />
                </div>

                {/* Group Call */}
                <div className="mb-2">
                  <GroupCall roomId={roomId} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center py-2" // 패딩 감소
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-purple-500">
                    <svg
                      width="20" // 크기 감소
                      height="20" // 크기 감소
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m-8-9h8m8 0-8 8m8-8L4 7" />
                    </svg>
                  </span>
                  <span className="text-xs font-medium text-purple-600">
                    Collaborate
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapse/Expand Button */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCollapsed(true)}
                className="absolute left-0 top-0 h-full w-6 hover:bg-gray-100/50 transition-colors flex items-center justify-center" // 너비 감소
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <svg
                    width="16" // 크기 감소
                    height="16" // 크기 감소
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-purple-500"
                  >
                    <path
                      d="M6 4L12 10L6 16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
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
});

export default RightNav;
RightNav.displayName = 'RightNav';
