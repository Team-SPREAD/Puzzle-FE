import { motion } from 'framer-motion';
import { useMutation } from '@/liveblocks.config';
import { useState } from 'react';
import { LayerType, SpreadLayer } from '@/lib/types';
import { SpreadBoxProps } from './types';
import { LiveObject } from '@liveblocks/client';
import { nanoid } from 'nanoid';
import { STAGE_GIMMICKS } from './configs';

export default function SpreadBoxTemplate({
  id,
  color,
  position,
}: SpreadBoxProps) {
  const [centerIdea, setCenterIdea] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  // 중앙 아이디어 박스 생성 mutation
  const createCenterSpread = useMutation(
    ({ storage }) => {
      if (!centerIdea.trim()) return;

      const layers = storage.get('layers');
      const layerIds = storage.get('layerIds');
      const newId = nanoid();

      // 현재 단계의 위치 정보 가져오기
      const currentStage = 4;
      const stageGimmick = STAGE_GIMMICKS[currentStage];
      if (!stageGimmick) {
        console.error('Invalid stage');
        return;
      }

      const basePosition = stageGimmick.boxes[0].position;
      const newX = basePosition.x + 550;
      const newY = basePosition.y + 3100;

      // 중앙 SpreadLayer 생성
      const newLayer = new LiveObject({
        type: LayerType.Spread,
        x: newX,
        y: newY,
        width: 250,
        height: 150,
        fill: color,
        centerIdea: centerIdea,
        content: '', // 처음에는 비어있음
        ideas: [], // 확장된 아이디어들을 위한 배열
      });

      // Storage에 추가
      layers.set(newId, newLayer);
      layerIds.push(newId);

      // 입력 필드 초기화
      setCenterIdea('');
      setIsExpanded(false);
    },
    [centerIdea, color, position]
  );
  return (
    <motion.div
      className="absolute bg-gradient-to-br from-white to-blue-50 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100"
      style={{
        width: isExpanded ? '20rem' : '14rem',
        zIndex: 99999,
        position: 'absolute',
        left: position.x,
        top: position.y,
      }}
      drag
      dragMomentum={false}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-base font-medium text-gray-700">
              아이디어 확장하기
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-blue-50 rounded-full transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {isExpanded && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              중앙 아이디어
            </label>
            <div className="flex gap-2">
              <input
                value={centerIdea}
                onChange={(e) => setCenterIdea(e.target.value)}
                placeholder="중앙 아이디어를 입력하세요"
                className="flex-1 p-2 border rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
              <button
                onClick={() => createCenterSpread()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                생성
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}