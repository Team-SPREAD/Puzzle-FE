import { motion } from 'framer-motion';
import { useMutation, useSelf } from '@/liveblocks.config';
import { useState } from 'react';
import { LayerType, DiscussionLayer, DiscussionCategory } from '@/lib/types';
import { DiscussionBoxProps } from './types';
import { LiveObject } from '@liveblocks/client';
import { nanoid } from 'nanoid';
import { STAGE_GIMMICKS } from './configs';

export default function DiscussionBoxTemplate({
  id,
  color,
  position,
}: DiscussionBoxProps) {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DiscussionCategory>('category');
  const [isCollapsed, setIsCollapsed] = useState(true);

  const me = useSelf();
  const userName = me?.info?.name || '익명 사용자';
  const avatar = me?.info?.avatar;

  const categoryInfo = {
    category: {
      title: '서비스 카테고리 토론',
      description: '어떤 분야의 서비스를 만들지 결정해봅시다',
      color: 'bg-blue-50 text-blue-600',
    },
    problem: {
      title: '문제점 정의 토론',
      description: '해결하고자 하는 구체적인 문제는 무엇인가요?',
      color: 'bg-red-50 text-red-600',
    },
    solution: {
      title: '해결 방향 토론',
      description: '어떻게 해결할 수 있을까요?',
      color: 'bg-green-50 text-green-600',
    },
    target: {
      title: '타겟 사용자 정의',
      description: '주요 사용자층은 누구인가요?',
      color: 'bg-purple-50 text-purple-600',
    },
  };

  const createDiscussion = useMutation(
    ({ storage }) => {
      if (!topic.trim()) return;

      const layers = storage.get('layers');
      const layerIds = storage.get('layerIds');
      const newId = nanoid();

      const currentStage = 5;
      const stageGimmick = STAGE_GIMMICKS[currentStage];
      if (!stageGimmick) {
        console.error('Invalid stage');
        return;
      }

      const basePosition = stageGimmick.boxes[0].position;
      const newX = basePosition.x + 550;
      const newY = basePosition.y + 4050;

      const newLayer = new LiveObject({
        type: LayerType.Discussion,
        x: newX,
        y: newY,
        width: 300,
        height: 540,
        fill: color,
        category,
        topic,
        description,
        priority: 'medium',
        status: 'ongoing',
        votes: {},
        comments: [],
        creator: {
          id: me?.id || '',
          name: userName,
          avatar,
        },
        connectedTo: [],
      } as DiscussionLayer);

      layers.set(newId, newLayer as any);
      layerIds.push(newId);

      setTopic('');
      setDescription('');
      setIsCollapsed(true);
    },
    [topic, description, category, color, me?.id, userName, avatar]
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
        width: isCollapsed ? '240px' : '320px',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ position: 'absolute', zIndex: 30 }}
    >
      <div className={`p-4 ${isCollapsed ? 'px-4 py-4' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-violet-50 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-violet-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-base font-medium text-gray-700">새로운 토론</span>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
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
            {/* 카테고리 선택 */}
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(categoryInfo) as [DiscussionCategory, typeof categoryInfo[keyof typeof categoryInfo]][]).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className={`p-2 rounded-lg text-xs font-medium text-center transition-colors ${
                    category === key ? info.color : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  {info.title}
                </button>
              ))}
            </div>

            {/* 현재 선택된 카테고리 설명 */}
            <p className="text-sm text-gray-500">
              {categoryInfo[category].description}
            </p>

            {/* 토론 주제 입력 */}
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="토론 주제를 입력하세요"
              className="w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 
                bg-violet-50/30 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
            />
            
            {/* 설명 입력 */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="자세한 설명을 입력하세요"
              rows={3}
              className="w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 
                bg-violet-50/30 border-violet-100 focus:border-violet-300 focus:ring-violet-200
                resize-none"
            />

            {/* 생성 버튼 */}
            <button
              onClick={() => createDiscussion()}
              className="w-full p-2.5 bg-violet-50 text-violet-800 rounded-lg
                hover:bg-violet-100 transition-colors cursor-pointer
                flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              토론 시작하기
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}