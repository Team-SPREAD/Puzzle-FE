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
  const [isHovering, setIsHovering] = useState(false);

  const addSpreadIdea = useMutation(
    ({ storage }, direction: 'up' | 'right' | 'down' | 'left') => {
      const layers = storage.get('layers');
      const layerIds = storage.get('layerIds');
      const newId = nanoid();

      const VERTICAL_OFFSET = 130;
      const HORIZONTAL_OFFSET = 160;
      let newX = x;
      let newY = y;

      switch (direction) {
        case 'up':
          newY -= VERTICAL_OFFSET;
          break;
        case 'right':
          newX += HORIZONTAL_OFFSET;
          break;
        case 'down':
          newY += VERTICAL_OFFSET;
          break;
        case 'left':
          newX -= HORIZONTAL_OFFSET;
          break;
      }

      const newLayer = new LiveObject({
        type: LayerType.Spread,
        x: newX,
        y: newY,
        width: 180,
        height: 120,
        fill: layer.fill,
        centerIdea: '',
        content: '',
        direction,
      } as any);

      layers.set(newId, newLayer);
      layerIds.push(newId);
    },
    [x, y, layer.fill],
  );

  const updateContent = useMutation(
    ({ storage }) => {
      const layers = storage.get('layers');
      const currentLayer = layers.get(id);
      if (currentLayer) {
        currentLayer.update({ content: newContent });
      }
      setIsEditing(false);
    },
    [newContent],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setNewContent(content || '');
    } else if (e.key === 'Enter') {
      updateContent();
    }
  };

  const renderConnectionLine = () => {
    if (centerIdea || !layer.direction) return null;

    const LINE_LENGTH = 30;
    let x1, y1, x2, y2;

    switch (layer.direction) {
      case 'up':
        x1 = x + width / 2;
        y1 = y + height;
        x2 = x1;
        y2 = y1 + LINE_LENGTH;
        break;
      case 'right':
        x1 = x;
        y1 = y + height / 2;
        x2 = x1 - LINE_LENGTH;
        y2 = y1;
        break;
      case 'down':
        x1 = x + width / 2;
        y1 = y;
        x2 = x1;
        y2 = y1 - LINE_LENGTH;
        break;
      case 'left':
        x1 = x + width;
        y1 = y + height / 2;
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
          className={`w-full h-full rounded-xl shadow-sm backdrop-blur-sm cursor-pointer 
            ${
              centerIdea
                ? 'bg-gradient-to-br from-violet-50 to-indigo-50 border-2 border-violet-300/70'
                : 'bg-white/90 border-2 border-gray-300/50 hover:border-violet-300/70'
            }
            ${isEditing ? 'ring-2 ring-violet-200 border-violet-300' : ''}
            transition-all duration-200
          `}
          style={{
            boxShadow: centerIdea
              ? '0 4px 12px -2px rgba(139, 92, 246, 0.1), 0 2px 6px -1px rgba(139, 92, 246, 0.06)'
              : '0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
          onClick={() => {
            if (!centerIdea) {
              setIsEditing(true);
              onPointerDown(
                { stopPropagation: () => {} } as React.PointerEvent,
                '',
              );
            }
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="relative w-full h-full p-3">
            <div className="w-full h-full flex items-center justify-center">
              {centerIdea ? (
                <p className="text-base font-medium text-gray-800 text-center">
                  {centerIdea}
                </p>
              ) : isEditing ? (
                <input
                  className="w-3/4 px-2 py-1 text-sm rounded border border-violet-200 
                      focus:outline-none focus:ring-1 focus:ring-violet-300
                      bg-white/80"
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
              )}
            </div>

            <div className="absolute inset-0 pointer-events-none">
              {isHovering && !isEditing && (
                <>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addSpreadIdea('up');
                    }}
                    className="absolute top-1 left-1/2 -translate-x-1/2 pointer-events-auto"
                  >
                    <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-violet-500 hover:bg-violet-50 transition-colors">
                      ↑
                    </div>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addSpreadIdea('right');
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-auto"
                  >
                    <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-violet-500 hover:bg-violet-50 transition-colors">
                      →
                    </div>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addSpreadIdea('down');
                    }}
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 pointer-events-auto"
                  >
                    <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-violet-500 hover:bg-violet-50 transition-colors">
                      ↓
                    </div>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addSpreadIdea('left');
                    }}
                    className="absolute left-1 top-1/2 -translate-y-1/2 pointer-events-auto"
                  >
                    <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-violet-500 hover:bg-violet-50 transition-colors">
                      ←
                    </div>
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </foreignObject>
    </motion.g>
  );
}
