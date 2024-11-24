import { motion } from 'framer-motion';
import { useMutation } from '@/liveblocks.config';
import { useEffect, useState, useRef } from 'react';
import { LayerType, TopicVoteLayer } from '@/lib/types';
import { TopicBoxProps } from './types';
import { LiveObject } from '@liveblocks/client';
import { STAGE_GIMMICKS } from './configs';
import { useSelf } from '@liveblocks/react';

export default function TopicVoteTemplate({
  id,
  color,
  position,
}: TopicBoxProps) {
  const [content, setContent] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const me = useSelf();
  const userName = me?.info?.name || '익명 사용자';
  const avatar = me?.info?.avatar;

  const updateContent = useMutation(({ storage }, newContent: string) => {
    const topicBox = storage.get('layers').get(id);
    if (topicBox) {
      topicBox.update({ value: `${newContent}` });
    }
  }, []);

  const duplicateBox = useMutation(
    ({ storage }) => {
      const layers = storage.get('layers');
      const layerIds = storage.get('layerIds');
      const newId = `topic-${Date.now()}`;

      const basePosition = STAGE_GIMMICKS[3].boxes[0].position;
      const newX = basePosition.x + 450;
      const newY = basePosition.y + 2200;

      const newLayer = {
        type: LayerType.TopicVote,
        x: newX,
        y: newY,
        width: 350,
        height: 200,
        value: `${content}`,
        fill: color,
        borderColor: { r: 99, g: 102, b: 241 },
        fontStyle: "'Poppins', system-ui, sans-serif",
        iconUrl: avatar,
        reactions: {},
      } as const;

      layers.set(newId, new LiveObject(newLayer));
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
            <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-emerald-500"
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
              새로운 주제 제안
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
                placeholder="프로젝트의 주제나 방향성에 대한 의견을 작성해주세요."
                rows={4}
                className="w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 
                  bg-emerald-50/30 border-emerald-100 focus:border-emerald-300 focus:ring-emerald-200
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
              className="w-full p-2.5 bg-emerald-50 text-emerald-800 rounded-lg
                hover:bg-emerald-100 transition-colors cursor-pointer
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
              주제 등록하기
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}