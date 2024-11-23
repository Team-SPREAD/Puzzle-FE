import { motion } from 'framer-motion';
import { useMutation } from '@/liveblocks.config';
import { useEffect, useState, useRef } from 'react';
import { LayerType, VisionLayer } from '@/lib/types';
import { VisionBoxProps } from './types';
import { LiveObject } from '@liveblocks/client';
import { STAGE_GIMMICKS } from './configs';
import { useSelf } from '@liveblocks/react';

export default function VisionBoxTemplate({
  id,
  color,
  position,
}: VisionBoxProps) {
  const [content, setContent] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const me = useSelf();
  const userName = me?.info?.name || '익명 사용자';
  const avatar = me?.info?.avatar;

  const updateContent = useMutation(({ storage }, newContent: string) => {
    const visionBox = storage.get('layers').get(id);
    if (visionBox) {
      visionBox.update({ value: `${newContent}` });
    }
  }, []);

  const duplicateBox = useMutation(
    ({ storage }) => {
      const layers = storage.get('layers');
      const layerIds = storage.get('layerIds');
      const newId = `vision-${Date.now()}`;

      const currentStage = 2;
      const stageGimmick = STAGE_GIMMICKS[currentStage];
      if (!stageGimmick) {
        console.error('Invalid stage');
        return;
      }

      const basePosition = stageGimmick.boxes[0].position;
      const newX = basePosition.x + 450;
      const newY = basePosition.y + 1100;

      const newLayer: VisionLayer = {
        type: LayerType.Vision,
        x: newX,
        y: newY,
        width: 230,
        height: 130,
        value: `${content}`,
        fill: color,
        borderColor: { r: 255, g: 223, b: 120 },
        fontStyle: "'Cute Font', 'Nanum Pen Script', cursive",
        iconUrl: avatar,
      };

      const newLiveLayer = new LiveObject(newLayer);

      layers.set(newId, newLiveLayer);
      layerIds.push(newId);
      setContent('');
    },
    [content, color, avatar],
  );

  useEffect(() => {
    updateContent(content);
  }, [content, updateContent]);

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
        width: isCollapsed ? '240px' : '320px',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ position: 'absolute', zIndex: 30 }}
    >
      <div
        ref={containerRef}
        className={`p-4 ${isCollapsed ? 'px-4 py-4' : ''} max-h-[80vh] overflow-y-auto`}
        onWheel={(e) => {
          if (containerRef.current) {
            const container = containerRef.current;
            const isScrollable = container.scrollHeight > container.clientHeight;
            if (isScrollable) {
              e.stopPropagation();
            }
          }
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <span className="text-base font-medium text-gray-700">
              나의 비전은?
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(!isCollapsed);
            }}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full"
          >
            {isCollapsed ? '□' : '─'}
          </button>
        </div>

        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4"
          >
            <div className="space-y-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                placeholder="이 프로젝트를 통해 이루고 싶은 것, 기대하는 것을 자유롭게 작성해주세요."
                rows={4}
                className="w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 
                  bg-blue-50/30 border-blue-100 focus:border-blue-300 focus:ring-blue-200
                  resize-none"
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateBox();
                setContent('');
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-full p-2.5 bg-blue-50 text-blue-800 rounded-lg
                hover:bg-blue-100 transition-colors cursor-pointer
                flex items-center justify-center gap-2"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              비전 등록하기
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}