import { motion } from 'framer-motion';
import { useMutation } from '@/liveblocks.config';
import { useEffect, useState } from 'react';
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

  const me = useSelf();
  const userName = me?.info?.name || '익명 사용자';
  const avatar = me?.info?.avatar;

  // 내용 업데이트 mutation
  const updateContent = useMutation(({ storage }, newContent: string) => {
    const topicBox = storage.get('layers').get(id);
    if (topicBox) {
      topicBox.update({ value: `${newContent}` });
    }
  }, []);

  // 박스 복제 mutation
  const duplicateBox = useMutation(
    ({ storage }) => {
      const layers = storage.get('layers');
      const layerIds = storage.get('layerIds');
      const newId = `topic-${Date.now()}`;

      const basePosition = STAGE_GIMMICKS[3].boxes[0].position;
      const newX = basePosition.x + 450;
      const newY = basePosition.y + 2200;

      // 새로운 레이어 생성
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
      } as const; // 타입을 상수로 처리

      // LiveObject로 생성하여 저장
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
        height: isCollapsed ? '50px' : 'auto',
        width: isCollapsed ? '180px' : '320px',
      }}
      initial={{
        height: isCollapsed ? '50px' : 'auto',
        width: isCollapsed ? '180px' : '320px',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ position: 'absolute', zIndex: 30 }}
    >
      <div className={`p-4 ${isCollapsed ? 'px-3 py-2' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-medium text-gray-700">
            새로운 주제 제안
          </span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full"
          >
            {isCollapsed ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
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
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="프로젝트의 주제나 방향성에 대한 의견을 작성해주세요."
              className="w-full h-32 p-3 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 
                bg-indigo-50/30 border-indigo-100 focus:border-indigo-300 focus:ring-indigo-200"
            />
            <button
              onClick={() => {
                duplicateBox();
                setContent('');
              }}
              className="mt-2 p-2 bg-emerald-50 text-emerald-800 rounded-lg w-full text-center hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              등록하기
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
