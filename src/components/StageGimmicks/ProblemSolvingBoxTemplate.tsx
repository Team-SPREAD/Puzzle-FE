import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useSelf } from '@/liveblocks.config';
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
  const [showGuide, setShowGuide] = useState(true);
  const me = useSelf();

  const createProblemBox = useMutation(
    ({ storage }, boxType: BoxType, index: number) => {
      const layers = storage.get('layers');
      const layerIds = storage.get('layerIds');
      const newId = nanoid();

      const offsetX = index * 400;
      const newX = position.x + offsetX;
      const newY = position.y + 4850;

      const isLocked = boxType === 'define' ? false : true;

      const newLayer = new LiveObject({
        type: LayerType.SolvingProblem,
        x: newX,
        y: newY,
        width: 320,
        height: 400,
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
    [position, color, me?.id]
  );

  React.useEffect(() => {
    const boxTypes: BoxType[] = ['define', 'analyze', 'solve'];
    boxTypes.forEach((type, index) => {
      createProblemBox(type, index);
    });
  }, []);

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
      style={{ position: 'absolute', zIndex: 9999 }}
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
              {(Object.entries(BOX_CONFIG) as [BoxType, typeof BOX_CONFIG[BoxType]][]).map(([type, config]) => (
                <div
                  key={type}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all cursor-pointer',
                    config.color,
                    selectedType === type ? 'ring-2 ring-offset-2' : ''
                  )}
                  onClick={() => setSelectedType(type)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{config.icon}</span>
                    <h3 className="font-bold">{config.title}</h3>
                  </div>
                  <p className="text-sm mb-2">{config.description}</p>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    {config.guideQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="p-4 bg-violet-50/30 rounded-lg border border-violet-100">
              <h4 className="font-medium mb-2 text-violet-800">사용 방법</h4>
              <ol className="text-sm text-violet-600 space-y-1 list-decimal list-inside">
                <li>How Bad? 박스에서 현재 상황과 문제점을 정의합니다.</li>
                <li>문제 정의가 완료되면 How Come? 박스가 해금됩니다.</li>
                <li>원인 분석이 완료되면 How To? 박스가 해금됩니다.</li>
                <li>각 박스는 자유롭게 이동하고 내용을 수정할 수 있습니다.</li>
              </ol>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}