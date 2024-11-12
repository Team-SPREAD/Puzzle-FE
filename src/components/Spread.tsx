import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@/liveblocks.config';
import { SpreadLayer, LayerType } from '@/lib/types';
import { nanoid } from 'nanoid';
import { LiveObject } from '@liveblocks/client';

interface SpreadProps {
  id: string;
  layer: SpreadLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export default function Spread({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: SpreadProps) {
  const { x, y, width, height, centerIdea, content } = layer;
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(content || '');

  // 확장된 아이디어 추가 mutation
  const addSpreadIdea = useMutation(
    ({ storage }, direction: 'up' | 'right' | 'down' | 'left') => {
      const layers = storage.get('layers');
      const layerIds = storage.get('layerIds');
      const newId = nanoid();

      // 방향에 따른 새로운 위치 계산 - 좌우 간격 더 넓게 조정
      const VERTICAL_OFFSET = 130;
      const HORIZONTAL_OFFSET = 160; // 좌우 간격 늘림
      let newX = x;
      let newY = y;

      switch (direction) {
        case 'up': newY -= VERTICAL_OFFSET; break;
        case 'right': newX += HORIZONTAL_OFFSET; break;
        case 'down': newY += VERTICAL_OFFSET; break;
        case 'left': newX -= HORIZONTAL_OFFSET; break;
      }

      // 새로운 SpreadLayer 생성
      const newLayer = new LiveObject({
        type: LayerType.Spread,
        x: newX,
        y: newY,
        width: 140,
        height: 100,
        fill: layer.fill,
        centerIdea: '',
        content: '',
        direction,
      });

     
     
      layerIds.push(newId);
    },
    [x, y, layer.fill]
  );

  // 내용 업데이트 mutation
  const updateContent = useMutation(
    ({ storage }) => {
      const layers = storage.get('layers');
      const currentLayer = layers.get(id);
      if (currentLayer) {
        currentLayer.update({ content: newContent });
      }
      setIsEditing(false);
    },
    [newContent]
  );

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation(); // 이벤트 전파 중단

    if (e.key === 'Escape') {
      setIsEditing(false);
      setNewContent(content || ''); // 원래 내용으로 복구
    } else if (e.key === 'Enter') {
      updateContent();
    }
  };

  // 연결선 렌더링
  const renderConnectionLine = () => {
    if (centerIdea || !layer.direction) return null;

    const LINE_LENGTH = 30;
    let x1, y1, x2, y2;

    switch (layer.direction) {
      case 'up':
        x1 = x + width/2;
        y1 = y + height;
        x2 = x1;
        y2 = y1 + LINE_LENGTH;
        break;
      case 'right':
        x1 = x;
        y1 = y + height/2;
        x2 = x1 - LINE_LENGTH;
        y2 = y1;
        break;
      case 'down':
        x1 = x + width/2;
        y1 = y;
        x2 = x1;
        y2 = y1 - LINE_LENGTH;
        break;
      case 'left':
        x1 = x + width;
        y1 = y + height/2;
        x2 = x1 + LINE_LENGTH;
        y2 = y1;
        break;
      default:
        return null;
    }

    return (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#94A3B8"
        strokeWidth="2"
        strokeDasharray="4,8"
        className="opacity-60"
      />
    );
  };

  return (
    <motion.g>
      {renderConnectionLine()}
      <foreignObject
        x={x}
        y={y}
        width={width}
        height={height}
        onPointerDown={(e) => {
          if (!isEditing) {
            onPointerDown(e, id);
          }
        }}
      >
        <div 
          className={`w-full h-full rounded-xl shadow-sm backdrop-blur-sm cursor-pointer ${
            centerIdea 
              ? 'bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100' 
              : 'bg-white/90 border border-gray-100'
          }`}
          onClick={() => !centerIdea && setIsEditing(true)}
        >
          <div className="relative w-full h-full p-3">
            <div className="w-full h-full flex items-center justify-center">
              {centerIdea ? (
                <p className="text-base font-medium text-gray-800 text-center">
                  {centerIdea}
                </p>
              ) : (
                isEditing ? (
                  <input
                    className="w-full px-2 py-1 text-sm rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-violet-300"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    onBlur={updateContent}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    placeholder="아이디어 입력..."
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-600 hover:text-gray-800 text-center">
                    {content || '클릭하여 입력'}
                  </p>
                )
              )}
            </div>

            <div className="absolute inset-0 pointer-events-none">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addSpreadIdea('up');
                }}
                className="absolute top-1 left-1/2 -translate-x-1/2 pointer-events-auto"
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-violet-500 hover:bg-violet-50">
                  ↑
                </div>
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addSpreadIdea('right');
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-auto"
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-violet-500 hover:bg-violet-50">
                  →
                </div>
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addSpreadIdea('down');
                }}
                className="absolute bottom-1 left-1/2 -translate-x-1/2 pointer-events-auto"
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-violet-500 hover:bg-violet-50">
                  ↓
                </div>
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addSpreadIdea('left');
                }}
                className="absolute left-1 top-1/2 -translate-y-1/2 pointer-events-auto"
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-violet-500 hover:bg-violet-50">
                  ←
                </div>
              </button>
            </div>
          </div>
        </div>
      </foreignObject>
    </motion.g>
  );
}