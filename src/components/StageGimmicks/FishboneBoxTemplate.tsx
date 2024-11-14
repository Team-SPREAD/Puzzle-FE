import { motion } from 'framer-motion';
import { useMutation, useSelf } from '@/liveblocks.config';
import { useState, useRef } from 'react';
import { LayerType, FishboneLayer, FishboneCategory } from '@/lib/types';
import { FishboneBoxProps } from './types';
import { LiveObject } from '@liveblocks/client';
import { nanoid } from 'nanoid';

const CATEGORIES: Array<{ id: FishboneCategory; label: string; icon: string }> = [
  { id: 'user', label: '사용자', icon: '👥' },
  { id: 'tech', label: '기술', icon: '⚙️' },
  { id: 'feature', label: '기능', icon: '✨' },
  { id: 'design', label: 'UI/UX', icon: '🎨' },
  { id: 'business', label: '비즈니스', icon: '💼' },
  { id: 'resource', label: '리소스', icon: '🔧' },
];

export default function FishboneBoxTemplate({
  id,
  color,
  position,
}: FishboneBoxProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mainProblem, setMainProblem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FishboneCategory>('user');
  const [causeText, setCauseText] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const me = useSelf();
  const userName = me?.info?.name || '익명';

  const createFishbone = useMutation(
    ({ storage }) => {
      if (!mainProblem.trim()) return;

      const layers = storage.get('layers');
      const layerIds = storage.get('layerIds');
      const newId = nanoid();

      const newLayer = new LiveObject({
        type: LayerType.Fishbone,
        x: position.x + 550,
        y: position.y + 5100,
        width: 800,
        height: 600,
        fill: color,
        mainProblem: mainProblem,
        categories: {
          user: [],
          tech: [],
          feature: [],
          design: [],
          business: [],
          resource: [],
        },
        connections: [],
        collaborators: [{
          id: me?.id || '',
          cursor: { x: 0, y: 0 }
        }],
      } as FishboneLayer);

      layers.set(newId, newLayer as any);
      layerIds.push(newId);

      setMainProblem('');
      setIsCollapsed(true);
    },
    [mainProblem, color, me?.id]
  );

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      createFishbone();
    }
  };

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
      style={{ position: 'absolute', zIndex: 9999 }}
    >
      <div
        ref={containerRef}
        className={`p-4 ${isCollapsed ? 'px-4 py-4' : ''}`}
        onWheel={(e) => {
          if (containerRef.current) {
            e.stopPropagation();
          }
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center">
              <span className="text-purple-500 text-sm">🦴</span>
            </div>
            <span className="text-base font-medium text-gray-700">
              원인 분석
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
                value={mainProblem}
                onChange={(e) => setMainProblem(e.target.value)}
                onKeyDown={handleInputKeyDown}
                onPointerDown={(e) => e.stopPropagation()}
                placeholder="해결하고자 하는 문제는 무엇인가요?"
                rows={2}
                className="w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 
                  bg-purple-50/30 border-purple-100 focus:border-purple-300 focus:ring-purple-200
                  resize-none"
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                createFishbone();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-full p-2.5 bg-purple-50 text-purple-800 rounded-lg
                hover:bg-purple-100 transition-colors cursor-pointer
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
              피쉬본 다이어그램 만들기
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}