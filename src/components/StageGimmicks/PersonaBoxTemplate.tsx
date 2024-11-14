import { motion } from 'framer-motion';
import { useMutation, useSelf } from '@/liveblocks.config';
import { useState, useRef } from 'react';
import { LayerType, PersonaLayer } from '@/lib/types';
import { PersonaBoxProps } from './types';
import { LiveObject } from '@liveblocks/client';
import { nanoid } from 'nanoid';

export default function PersonaBoxTemplate({
  id,
  color,
  position,
}: PersonaBoxProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [personaData, setPersonaData] = useState({
    name: '',
    age: '',
    gender: '',
    occupation: '',
    quote: '',
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const me = useSelf();
  const userName = me?.info?.name || '익명 사용자';
  const avatar = me?.info?.avatar;

  const createPersona = useMutation(
    ({ storage }) => {
      if (!personaData.name.trim()) return;

      const layers = storage.get('layers');
      const layerIds = storage.get('layerIds');
      const newId = nanoid();

      const newX = position.x + 550;
      const newY = position.y + 5100;

      const newLayer = new LiveObject({
        type: LayerType.Persona,
        x: newX,
        y: newY,
        width: 320,
        height: 480,
        fill: color,
        name: personaData.name,
        age: parseInt(personaData.age) || 25,
        gender: personaData.gender || 'other',
        occupation: personaData.occupation,
        quote: personaData.quote,
        traits: [],
        borderColor: color,
        fontStyle: 'default',
        creator: {
          id: me?.id || '',
          name: userName,
          avatar,
        },
      } as PersonaLayer);

      layers.set(newId, newLayer as any);
      layerIds.push(newId);

      setPersonaData({
        name: '',
        age: '',
        gender: '',
        occupation: '',
        quote: '',
      });
      setIsCollapsed(true);
    },
    [personaData, color, me?.id, userName, avatar],
  );

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      createPersona();
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
        className={`p-4 ${isCollapsed ? 'px-4 py-4' : ''} max-h-[80vh] overflow-y-auto`}
        onWheel={(e) => {
          if (containerRef.current) {
            const container = containerRef.current;
            const isScrollable =
              container.scrollHeight > container.clientHeight;
            if (isScrollable) {
              e.stopPropagation();
            }
          }
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-indigo-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="text-base font-medium text-gray-700">
              새로운 페르소나
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
              <input
                value={personaData.name}
                onChange={(e) =>
                  setPersonaData({ ...personaData, name: e.target.value })
                }
                onKeyDown={handleInputKeyDown}
                onPointerDown={(e) => e.stopPropagation()}
                placeholder="이름"
                className="w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 
                  bg-indigo-50/30 border-indigo-100 focus:border-indigo-300 focus:ring-indigo-200"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  value={personaData.age}
                  onChange={(e) =>
                    setPersonaData({ ...personaData, age: e.target.value })
                  }
                  onKeyDown={handleInputKeyDown}
                  onPointerDown={(e) => e.stopPropagation()}
                  placeholder="나이"
                  type="number"
                  className="w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 
                    bg-indigo-50/30 border-indigo-100 focus:border-indigo-300 focus:ring-indigo-200"
                />
                <select
                  value={personaData.gender}
                  onChange={(e) =>
                    setPersonaData({ ...personaData, gender: e.target.value })
                  }
                  onKeyDown={handleInputKeyDown}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 
                    bg-indigo-50/30 border-indigo-100 focus:border-indigo-300 focus:ring-indigo-200"
                >
                  <option value="">성별 선택</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                  <option value="other">기타</option>
                </select>
              </div>

              <input
                value={personaData.occupation}
                onChange={(e) =>
                  setPersonaData({ ...personaData, occupation: e.target.value })
                }
                onKeyDown={handleInputKeyDown}
                onPointerDown={(e) => e.stopPropagation()}
                placeholder="직업"
                className="w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 
                  bg-indigo-50/30 border-indigo-100 focus:border-indigo-300 focus:ring-indigo-200"
              />
              <textarea
                value={personaData.quote}
                onChange={(e) =>
                  setPersonaData({ ...personaData, quote: e.target.value })
                }
                onKeyDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                placeholder="대표 발언 (ex: '시간이 부족해서 운동할 여유가 없어요')"
                rows={2}
                className="w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 
                  bg-indigo-50/30 border-indigo-100 focus:border-indigo-300 focus:ring-indigo-200
                  resize-none"
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                createPersona();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-full p-2.5 bg-indigo-50 text-indigo-800 rounded-lg
                hover:bg-indigo-100 transition-colors cursor-pointer
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
              페르소나 만들기
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
