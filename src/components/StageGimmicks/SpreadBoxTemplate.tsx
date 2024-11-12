import { motion } from 'framer-motion';
import { useMutation } from '@/liveblocks.config';
import { useState } from 'react';
import { LayerType } from '@/lib/types';
import { SpreadBoxProps } from './types';
import { LiveObject } from '@liveblocks/client';
import { nanoid } from 'nanoid';
import { STAGE_GIMMICKS } from './configs';

export default function SpreadBoxTemplate({
  id,
  color,
  position,
}: SpreadBoxProps) {
  const [centerIdea, setCenterIdea] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const createCenterSpread = useMutation(
    ({ storage }) => {
      if (!centerIdea.trim()) return;

      const layers = storage.get('layers');
      const layerIds = storage.get('layerIds');
      const newId = nanoid();

      const currentStage = 4;
      const stageGimmick = STAGE_GIMMICKS[currentStage];
      if (!stageGimmick) {
        console.error('Invalid stage');
        return;
      }

      const basePosition = stageGimmick.boxes[0].position;
      const newX = basePosition.x + 550;
      const newY = basePosition.y + 3100;

      const newLayer = new LiveObject({
        type: LayerType.Spread,
        x: newX,
        y: newY,
        width: 250,
        height: 150,
        fill: color,
        centerIdea: centerIdea,
        content: '',
        ideas: [],
      });

      layers.set(newId, newLayer);
      layerIds.push(newId);
      setCenterIdea('');
      setIsCollapsed(true);
    },
    [centerIdea, color]
  );

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="absolute bg-white/90 backdrop-blur-sm rounded-xl shadow-lg"
      animate={{
        x: position.x,
        y: position.y,
        height: isCollapsed ? '54px' : 'auto',
        width: isCollapsed ? '240px' : '320px',
      }}
      initial={{
        height: isCollapsed ? '54px' : 'auto',
        width: isCollapsed ? '180px' : '320px',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ position: 'absolute', zIndex: 9999 }}
    >
      <div className={`p-4 ${isCollapsed ? 'px-4 py-4' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-violet-50 flex items-center justify-center">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                className="text-violet-500"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <span className="text-base font-medium text-gray-700">
              아이디어 확장하기
            </span>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full mb-2"
          >
            {isCollapsed ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="11" width="16" height="2" />
              </svg>
            )}
          </button>
        </div>

        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <input
              value={centerIdea}
              onChange={(e) => setCenterIdea(e.target.value)}
              placeholder="중심이 되는 아이디어를 입력하세요"
              className="w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 
                bg-violet-50/30 border-violet-100 focus:border-violet-300 focus:ring-violet-200
                placeholder:text-gray-400"
            />
            <button
              onClick={() => createCenterSpread()}
              className="mt-3 p-2.5 bg-violet-50 text-violet-800 rounded-lg w-full 
                text-center hover:bg-violet-100 transition-colors cursor-pointer
                flex items-center justify-center gap-2"
            >
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                className="text-violet-600"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4"
                />
              </svg>
              생성하기
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}