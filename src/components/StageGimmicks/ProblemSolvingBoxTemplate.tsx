import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useSelf, useStorage } from '@/liveblocks.config';
import { LayerType } from '@/lib/types';
import { LiveObject } from '@liveblocks/client';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';
import { SolvingProblemBoxProps } from './types';

const BOX_CONFIG = {
  define: {
    title: 'How Bad?',
    description: '현재 상황을 정의해주세요',
    icon: '❓',
    color: 'bg-blue-50 border-blue-200 text-blue-600',
    maxCount: 3,
    minLength: 20,
    guideQuestions: [
      '어떤 문제가 있나요?',
      '문제의 심각성은 어느 정도인가요?',
      '누구에게 영향을 미치나요?'
    ]
  },
  analyze: {
    title: 'How Come?',
    description: '원인을 분석해주세요',
    icon: '🔍',
    color: 'bg-amber-50 border-amber-200 text-amber-600',
    maxCount: 3,
    minLength: 30,
    guideQuestions: [
      '왜 이 문제가 발생했나요?',
      '어떤 요인들이 영향을 미쳤나요?',
      '근본적인 원인은 무엇인가요?'
    ]
  },
  solve: {
    title: 'How To?',
    description: '해결 방안을 제시해주세요',
    icon: '💡',
    color: 'bg-green-50 border-green-200 text-green-600',
    maxCount: 3,
    minLength: 40,
    guideQuestions: [
      '어떻게 해결할 수 있을까요?',
      '필요한 자원은 무엇인가요?',
      '실현 가능한 방법은 무엇인가요?'
    ]
  }
} as const;

type BoxType = keyof typeof BOX_CONFIG;

export default function SolvingProblemBoxTemplate({
  id,
  color,
  position,
}: SolvingProblemBoxProps) {
  const [selectedType, setSelectedType] = useState<BoxType>('define');
  const [showGuide, setShowGuide] = useState(false);
  const me = useSelf();
  const layers = useStorage((root) => root.layers);

  // 특정 타입의 박스 개수를 계산하는 함수
  const getBoxCount = (type: BoxType) => {
    let count = 0;
    layers?.forEach((layer) => {
      if (layer.type === LayerType.SolvingProblem && layer.boxType === type) {
        count++;
      }
    });
    return count;
  };

  // 특정 타입의 모든 박스가 조건을 충족하는지 확인하는 함수
  const checkAllBoxesComplete = (type: BoxType) => {
    let allComplete = true;
    let count = 0;
    layers?.forEach((layer) => {
      if (layer.type === LayerType.SolvingProblem && layer.boxType === type) {
        count++;
        if (!layer.content || layer.content.length < BOX_CONFIG[type].minLength) {
          allComplete = false;
        }
      }
    });
    return allComplete && count === BOX_CONFIG[type].maxCount;
  };

  const createProblemBox = useMutation(
    ({ storage }, boxType: BoxType) => {
      const currentCount = getBoxCount(boxType);
      if (currentCount >= BOX_CONFIG[boxType].maxCount) return;

      const layers = storage.get('layers');
      const layerIds = storage.get('layerIds');
      const newId = nanoid();

      // 기본 위치 설정
      const baseX = position.x + (boxType === 'define' ? 450 : 
                                boxType === 'analyze' ? 600 : 1200);
      const baseY = position.y + 6050;
      
      let newX = baseX;
      let newY = baseY;

      // 같은 타입 박스들의 위치 계산
      const existingPositions = new Set();
      layers.forEach((layer) => {
        const layerObj = layer.toObject();
        if (layerObj.type === LayerType.SolvingProblem && layerObj.boxType === boxType) {
          existingPositions.add(`${layerObj.x},${layerObj.y}`);
        }
      });

      // Y축으로 배치 (같은 타입끼리는 아래로 쌓임)
      const offsetY = 200;
      let i = 0;
      while (existingPositions.has(`${newX},${newY}`)) {
        i++;
        newY = baseY + (i * offsetY);
      }

      // 해금 상태 확인
      const checkUnlockStatus = (type: BoxType) => {
        if (type === 'define') return true;
        
        const previousType = type === 'analyze' ? 'define' : 'analyze';
        return checkAllBoxesComplete(previousType);
      };

      const isLocked = !checkUnlockStatus(boxType);

      const newLayer = new LiveObject({
        type: LayerType.SolvingProblem,
        x: newX,
        y: newY,
        width: 320,
        height: 250,
        fill: color,
        boxType,
        content: '',
        isLocked,
        creator: {
          id: me?.id || '',
          name: me?.info?.name || '익명',
          avatar: me?.info?.avatar,
        },
      });

      layers.set(newId, newLayer as any);
      layerIds.push(newId);
    },
    [position, color, me?.id, layers]
  );

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="absolute bg-white/90 backdrop-blur-sm rounded-xl shadow-lg"
      animate={{
        x: position.x,
        y: position.y,
        width: showGuide ? '500px' : '240px',
      }}
      initial={{
        width: showGuide ? '500px' : '240px',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ position: 'absolute', zIndex: 30 }}
    >
      <div className={cn(
        'p-6 space-y-6',
        !showGuide && 'px-4 py-4'
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-violet-50 flex items-center justify-center">
              <span className="text-violet-500">💭</span>
            </div>
            <h2 className="text-base font-medium text-gray-700">문제 해결 프로세스</h2>
          </div>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full"
          >
            {showGuide ? '─' : '□'}
          </button>
        </div>

        {showGuide && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-3 gap-4">
              {(Object.entries(BOX_CONFIG) as [BoxType, typeof BOX_CONFIG[BoxType]][]).map(([type, config]) => {
                const currentCount = getBoxCount(type);
                const isMaxed = currentCount >= config.maxCount;
                const canCreate = type === 'define' || 
                                (type === 'analyze' && checkAllBoxesComplete('define')) ||
                                (type === 'solve' && checkAllBoxesComplete('analyze'));

                return (
                  <div
                    key={type}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all',
                      config.color,
                      'relative'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{config.icon}</span>
                      <h3 className="font-bold">{config.title}</h3>
                    </div>
                    <p className="text-sm mb-2">{config.description}</p>
                    <div className="text-xs mb-2">
                      생성된 박스: {currentCount}/{config.maxCount}
                    </div>
                    <button
                      onClick={() => canCreate && createProblemBox(type)}
                      disabled={isMaxed || !canCreate}
                      className={cn(
                        'w-full p-2 rounded-lg mt-2 flex items-center justify-center gap-1',
                        canCreate && !isMaxed ? 'bg-white/50 hover:bg-white/70' : 'bg-gray-100 cursor-not-allowed',
                        config.color
                      )}
                    >
                      <span>추가하기</span>
                      {!canCreate ? '🔒' : isMaxed ? '✓' : '+'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-violet-50/30 rounded-lg border border-violet-100">
              <h4 className="font-medium mb-2 text-violet-800">사용 방법</h4>
              <ol className="text-sm text-violet-600 space-y-1 list-decimal list-inside">
                <li>How Bad? 박스를 3개 생성하고 모두 작성해주세요.</li>
                <li>모든 How Bad가 완료되면 How Come이 해금됩니다.</li>
                <li>How Come 3개를 모두 작성하면 How To가 해금됩니다.</li>
                <li>마지막으로, How To를 작성하여 해결방안을 제시해주세요.</li>
              </ol>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}