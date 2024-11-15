import React from 'react';
import { motion } from 'framer-motion';
import { useMutation, useSelf } from '@/liveblocks.config';
import { LayerType, SolvingProblemLayer } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface SolvingProblemProps {
  id: string;
  layer: SolvingProblemLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

// 단계별 스타일과 정보를 객체로 정의
const boxConfig = {
  define: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    icon: '❓',
    title: 'How Bad?',
    description: '현재 상황 정의',
  },
  analyze: {
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-600',
    icon: '🔍',
    title: 'How Come?',
    description: '원인 분석',
  },
  solve: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-600',
    icon: '💡',
    title: 'How To?',
    description: '해결 방안',
  },
} as const;

export default function SolvingProblem({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: SolvingProblemProps) {
  const updateContent = useMutation(
    ({ storage }, content: string) => {
      const layers = storage.get('layers');
      const layerUpdate = layers.get(id);
      if (layerUpdate) {
        layerUpdate.update({
          content: content,
        });
      }
    },
    [id]
  );

  const me = useSelf();
  const currentBoxStyle = boxConfig[layer.boxType];

  if (!currentBoxStyle) return null; // 타입 안전성을 위한 체크

  return (
    <motion.g>
      <foreignObject
        x={layer.x}
        y={layer.y}
        width={layer.width}
        height={layer.height}
        onPointerDown={(e) => onPointerDown(e, id)}
        style={{ 
          outline: selectionColor ? `2px solid ${selectionColor}` : 'none',
        }}
      >
        <div className={cn(
          'h-full flex flex-col',
          'backdrop-blur-sm rounded-xl shadow-lg',
          'border-2',
          layer.isLocked ? 'opacity-50' : '',
          currentBoxStyle.borderColor
        )}>
          {/* 헤더 */}
          <div className="flex items-center gap-3 p-4 border-b">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center',
              currentBoxStyle.bgColor
            )}>
              <span className="text-xl">{currentBoxStyle.icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                {currentBoxStyle.title}
              </h3>
              <span className={cn(
                'text-sm font-medium',
                currentBoxStyle.textColor
              )}>
                {currentBoxStyle.description}
              </span>
            </div>
          </div>

          {/* 내용 */}
          <div className={cn(
            'flex-1 p-4',
            currentBoxStyle.bgColor
          )}>
            <textarea
              value={layer.content}
              onChange={(e) => updateContent(e.target.value)}
              disabled={layer.isLocked}
              placeholder={layer.isLocked ? 
                "이전 단계를 완료해야 작성할 수 있습니다" : 
                "내용을 입력하세요..."
              }
              className={cn(
                'w-full h-full p-3 rounded-lg',
                'bg-white/50 backdrop-blur-sm',
                'border-2 border-transparent',
                'focus:outline-none focus:ring-2',
                currentBoxStyle.textColor,
                {
                  'cursor-not-allowed opacity-50': layer.isLocked,
                  'cursor-text': !layer.isLocked,
                  [currentBoxStyle.borderColor]: !layer.isLocked,
                  'focus:ring-blue-200': !layer.isLocked,
                }
              )}
            />
          </div>

          {/* 푸터 */}
          <div className="flex items-center gap-2 p-3 border-t bg-white/30">
            {layer.creator.avatar && (
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src={layer.creator.avatar}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            <span className="text-sm text-gray-600">
              {layer.creator.name}
            </span>
            {layer.isLocked && (
              <span className="ml-auto text-sm text-red-500">
                🔒 잠김
              </span>
            )}
          </div>
        </div>
      </foreignObject>
    </motion.g>
  );
}