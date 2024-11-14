import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@/liveblocks.config';
import { FishboneLayer, FishboneCategory, FishboneCause } from '@/lib/types';
import { cn, colorToCss } from '@/lib/utils';
import { LiveObject } from '@liveblocks/client';

interface FishboneProps {
  id: string;
  layer: FishboneLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const CATEGORY_COLORS: Record<FishboneCategory, string> = {
  user: '#FF6B6B',
  tech: '#4ECDC4',
  feature: '#45B7D1',
  design: '#96CEB4',
  business: '#FFEEAD',
  resource: '#D4A5A5'
};

const CATEGORY_ICONS: Record<FishboneCategory, string> = {
  user: '👥',
  tech: '⚙️',
  feature: '✨',
  design: '🎨',
  business: '💼',
  resource: '🔧'
};

export default function Fishbone({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: FishboneProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newCause, setNewCause] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FishboneCategory>('user');
  const contentRef = useRef<HTMLDivElement>(null);

  const addCause = useMutation(
    ({ storage }) => {
      if (!newCause.trim()) return;

      const layers = storage.get('layers');
      const currentLayer = layers.get(id);

      if (!currentLayer) return;

      const fishboneLayer = currentLayer as unknown as LiveObject<FishboneLayer>;
      const currentCategories = fishboneLayer.get('categories');
      const currentCauses = currentCategories[selectedCategory] || [];

      const newCauseObj: FishboneCause = {
        id: Math.random().toString(),
        category: selectedCategory,
        content: newCause,
        position: {
          x: 0,  // 기본 위치, 나중에 계산해서 배치
          y: 0
        },
        importance: 1
      };

      fishboneLayer.update({
        categories: {
          ...currentCategories,
          [selectedCategory]: [...currentCauses, newCauseObj]
        }
      });

      setNewCause('');
    },
    [newCause, selectedCategory]
  );

  return (
    <motion.g>
      <foreignObject
        x={layer.x}
        y={layer.y}
        width={layer.width}
        height={layer.height}
        onPointerDown={(e) => onPointerDown(e, id)}
      >
        <div className={cn(
          'h-full flex flex-col',
          'bg-white/90 backdrop-blur-sm rounded-xl shadow-lg',
          'border-2',
          selectionColor ? `border-[${selectionColor}]` : 'border-purple-200'
        )}>
          {/* 헤더 영역 */}
          <div className="flex-shrink-0 p-4 border-b">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                  🦴
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">원인 분석</h3>
                  <p className="text-sm text-gray-500">{layer.mainProblem}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-white/30 rounded-full"
              >
                {isExpanded ? '△' : '▽'}
              </button>
            </div>
          </div>

          {isExpanded && (
            <>
              {/* 카테고리 탭 */}
              <div className="flex-shrink-0 flex p-2 gap-1 bg-gray-50/50">
                {Object.entries(CATEGORY_ICONS).map(([category, icon]) => (
                  <button
                    key={category}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(category as FishboneCategory);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      selectedCategory === category
                        ? 'bg-purple-100 text-purple-700'
                        : 'hover:bg-gray-100 text-gray-600'
                    )}
                  >
                    {icon} {category}
                  </button>
                ))}
              </div>

              {/* 원인 목록 */}
              <div
                ref={contentRef}
                className="flex-1 p-4 overflow-y-auto space-y-2"
                onWheel={(e) => e.stopPropagation()}
              >
                {layer.categories[selectedCategory]?.map((cause) => (
                  <div
                    key={cause.id}
                    className="p-3 bg-white rounded-lg border border-gray-100 
                      flex items-center gap-2 cursor-move"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', cause.id);
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[cause.category] }}
                    />
                    <span className="text-sm text-gray-700">{cause.content}</span>
                  </div>
                ))}
              </div>

              {/* 입력 영역 */}
              <div className="flex-shrink-0 p-4 border-t bg-white/30">
                <div className="flex gap-2">
                  <input
                    value={newCause}
                    onChange={(e) => setNewCause(e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
                    placeholder="새로운 원인 추가..."
                    className="flex-1 px-3 py-2 text-sm bg-white/50 border rounded-lg 
                      focus:outline-none focus:ring-1 focus:ring-purple-300"
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        addCause();
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addCause();
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="px-4 py-2 text-sm font-medium text-purple-600 
                      bg-purple-50 hover:bg-purple-100 rounded-lg 
                      transition-colors"
                  >
                    추가
                  </button>
                </div>
              </div>
            </>
          )}

          {/* 피쉬본 다이어그램 SVG */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${layer.width} ${layer.height}`}
          >
            {/* 중심선 */}
            <line
              x1={0}
              y1={layer.height / 2}
              x2={layer.width}
              y2={layer.height / 2}
              stroke="#666"
              strokeWidth="2"
            />
            
            {/* 각 카테고리별 가지와 원인들 */}
            {Object.entries(layer.categories).map(([category, causes], index) => {
              const angle = (index - 2.5) * 30;  // -75도부터 75도까지 분포
              return causes.map((cause, i) => (
                <g key={cause.id}>
                  <line
                    x1={layer.width / 2}
                    y1={layer.height / 2}
                    x2={layer.width / 2 + Math.cos(angle * Math.PI / 180) * 200}
                    y2={layer.height / 2 + Math.sin(angle * Math.PI / 180) * 100}
                    stroke={CATEGORY_COLORS[category as FishboneCategory]}
                    strokeWidth="1"
                  />
                  <text
                    x={cause.position.x}
                    y={cause.position.y}
                    className="text-sm"
                    fill="#666"
                  >
                    {cause.content}
                  </text>
                </g>
              ));
            })}
          </svg>
        </div>
      </foreignObject>
    </motion.g>
  );
}