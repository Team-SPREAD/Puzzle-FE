import React from 'react';
import { motion } from 'framer-motion';
import { useMutation, useSelf, useStorage } from '@/liveblocks.config';
import { LayerType, SolvingProblemLayer } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { BOX_CONFIG } from './StageGimmicks';

interface SolvingProblemProps {
  id: string;
  layer: SolvingProblemLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const boxConfig = {
  define: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    icon: '❓',
    title: 'How Bad?',
    description: '현재 상황 정의',
    nextType: 'analyze' as const,
    minLength: 20, // 최소 20자 이상 작성해야 다음 단계 해금
  },
  analyze: {
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-600',
    icon: '🔍',
    title: 'How Come?',
    description: '원인 분석',
    nextType: 'solve' as const,
    minLength: 30, // 최소 30자 이상 작성해야 다음 단계 해금
  },
  solve: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-600',
    icon: '💡',
    title: 'How To?',
    description: '해결 방안',
    nextType: null,
    minLength: 0,
  },
};

export default function SolvingProblem({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: SolvingProblemProps) {
  const layers = useStorage((root) => root.layers);

  const updateContent = useMutation(
    ({ storage }, content: string) => {
      const layers = storage.get('layers');
      const currentLayer = layers.get(id);
      if (!currentLayer) return;

      currentLayer.update({
        content: content,
      });

      // 체크 로직을 분리하여 더 명확하게 처리
      const allLayersOfType = new Map();
      let totalCompleted = 0;

      // 현재 타입의 모든 레이어 수집
      layers.forEach((layerValue, layerId) => {
        const l = layerValue.toObject();
        if (
          l.type === LayerType.SolvingProblem &&
          l.boxType === layer.boxType
        ) {
          allLayersOfType.set(layerId, l);
          if (
            l.content &&
            l.content.length >= boxConfig[layer.boxType].minLength
          ) {
            totalCompleted++;
          }
        }
      });

      // 모든 레이어가 완료되었는지 확인
      const currentConfig = boxConfig[layer.boxType];
      if (
        currentConfig.nextType &&
        totalCompleted === BOX_CONFIG[layer.boxType].maxCount
      ) {
        // 다음 단계의 모든 레이어 해금
        layers.forEach((layerValue, layerId) => {
          const l = layerValue.toObject();
          if (
            l.type === LayerType.SolvingProblem &&
            l.boxType === currentConfig.nextType
          ) {
            layerValue.update({ isLocked: false });
          }
        });
      }
    },
    [layer.boxType],
  );

  const handleTextAreaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleTextAreaPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    // Backspace나 Delete 키 이벤트 전파 중지
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.stopPropagation();
    }
  };

  const currentBoxStyle = boxConfig[layer.boxType];
  if (!currentBoxStyle) return null;

  const remainingChars =
    currentBoxStyle.minLength - (layer.content?.length || 0);
  const isComplete = remainingChars <= 0;

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
        <div
          className={cn(
            'h-full flex flex-col',
            'backdrop-blur-sm rounded-xl shadow-lg',
            'border-2',
            layer.isLocked ? 'opacity-50' : '',
            currentBoxStyle.borderColor,
          )}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  currentBoxStyle.bgColor,
                )}
              >
                <span className="text-xl">{currentBoxStyle.icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  {currentBoxStyle.title}
                </h3>
                <span
                  className={cn(
                    'text-sm font-medium',
                    currentBoxStyle.textColor,
                  )}
                >
                  {currentBoxStyle.description}
                </span>
              </div>
            </div>
            {/* 잠금 상태 표시 */}
            {layer.isLocked ? (
              <span className="text-red-500">🔒</span>
            ) : (
              <span className="text-green-500">🔓</span>
            )}
          </div>

          {/* 내용 */}
          <div className={cn('flex-1 p-4', currentBoxStyle.bgColor)}>
            <div
              className="w-full h-full relative"
              onClick={handleTextAreaClick}
              onPointerDown={handleTextAreaPointerDown}
            >
              <textarea
                value={layer.content}
                onChange={(e) => updateContent(e.target.value)}
                onKeyDown={handleKeyDown}
                onClick={handleTextAreaClick}
                onPointerDown={handleTextAreaPointerDown}
                disabled={layer.isLocked}
                placeholder={
                  layer.isLocked
                    ? '이전 단계를 완료해야 작성할 수 있습니다'
                    : `최소 ${currentBoxStyle.minLength}자 이상 작성해주세요...`
                }
                className={cn(
                  'w-full h-full p-3 rounded-lg',
                  'bg-white/50 backdrop-blur-sm',
                  'border-2 border-transparent',
                  'focus:outline-none focus:ring-2',
                  currentBoxStyle.textColor,
                  {
                    'cursor-not-allowed': layer.isLocked,
                    'cursor-text': !layer.isLocked,
                    [currentBoxStyle.borderColor]: !layer.isLocked,
                    'focus:ring-blue-200': !layer.isLocked,
                  },
                )}
                style={{ resize: 'none' }}
              />
            </div>
          </div>

          {/* 푸터 - 진행 상태 표시 */}
          <div className="p-3 border-t bg-white/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
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
              </div>
              {!layer.isLocked && !isComplete && (
                <span className="text-sm text-gray-500">
                  {remainingChars}자 남음
                </span>
              )}
              {isComplete && currentBoxStyle.nextType && (
                <span className="text-sm text-green-600">
                  ✓ 다음 단계 해금됨
                </span>
              )}
            </div>
            {!layer.isLocked && (
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    currentBoxStyle.bgColor,
                  )}
                  style={{
                    width: `${Math.min(100, ((layer.content?.length || 0) / currentBoxStyle.minLength) * 100)}%`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </foreignObject>
    </motion.g>
  );
}
