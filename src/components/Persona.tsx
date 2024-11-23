import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@/liveblocks.config';
import { PersonaLayer } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getPersonaEmoji } from './StageGimmicks';
import { LiveObject } from '@liveblocks/client';

interface PersonaProps {
  id: string;
  layer: PersonaLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export default function Persona({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: PersonaProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newTrait, setNewTrait] = useState('');
  const [currentTab, setCurrentTab] = useState<
    'traits' | 'goals' | 'pain' | 'behavior'
  >('traits');
  const contentRef = useRef<HTMLDivElement>(null);

  const personaEmoji = getPersonaEmoji(layer.age, layer.gender);

  const addTrait = useMutation(
    ({ storage }) => {
      const trimmedTrait = newTrait.trim();
      if (!trimmedTrait) return;

      const layers = storage.get('layers');
      const currentLayer = layers.get(id);

      if (!currentLayer) return;

      const personaLayer = currentLayer as unknown as LiveObject<PersonaLayer>;
      const currentTraits = personaLayer.get('traits') || [];
      
      // 중복 체크
      const isDuplicate = currentTraits.some(
        trait => trait.category === currentTab && trait.value === trimmedTrait
      );

      if (isDuplicate) {
        setNewTrait('');
        return;
      }

      const updatedTraits = [
        ...currentTraits,
        {
          category: currentTab,
          value: trimmedTrait,
        },
      ];

      personaLayer.update({
        traits: updatedTraits,
      });

      setNewTrait('');
    },
    [newTrait, currentTab],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addTrait();
    }
  };

  const handleContentScroll = (e: React.WheelEvent) => {
    if (contentRef.current) {
      const container = contentRef.current;
      if (container.scrollHeight > container.clientHeight) {
        e.stopPropagation();
      }
    }
  };

  return (
    <motion.g>
      <foreignObject
        x={layer.x}
        y={layer.y}
        width={layer.width}
        height={layer.height}
        onPointerDown={(e) => onPointerDown(e, id)}
      >
        <div
          className={cn(
            'h-full flex flex-col',
            'bg-white/90 backdrop-blur-sm rounded-xl shadow-lg',
            'border-2 border-indigo-200',
          )}
        >
          {/* 헤더 */}
          <div className="flex-shrink-0 p-4 border-b">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">
                  {personaEmoji}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {layer.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{layer.age}세</span>
                    <span>•</span>
                    <span>
                      {layer.gender === 'male'
                        ? '남성'
                        : layer.gender === 'female'
                          ? '여성'
                          : '기타'}
                    </span>
                    <span>•</span>
                    <span>{layer.occupation}</span>
                  </div>
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
            {layer.quote && (
              <div className="mt-2 p-3 bg-indigo-50/50 rounded-lg">
                <p className="text-sm text-gray-600 italic">{layer.quote}</p>
              </div>
            )}
          </div>

          {isExpanded && (
            <>
              {/* 탭 네비게이션 */}
              <div className="flex-shrink-0 flex p-2 gap-1 bg-gray-50/50">
                {[
                  { id: 'traits', label: '특성', icon: '👤' },
                  { id: 'goals', label: '목표', icon: '🎯' },
                  { id: 'pain', label: '페인포인트', icon: '😣' },
                  { id: 'behavior', label: '행동', icon: '🔄' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentTab(tab.id as any);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      currentTab === tab.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'hover:bg-gray-100 text-gray-600',
                    )}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* 콘텐츠 영역 */}
              <div
                ref={contentRef}
                onWheel={handleContentScroll}
                className="flex-1 p-4 overflow-y-auto max-h-[200px] min-h-[100px]"
              >
                <div className="space-y-2">
                  {layer.traits
                    .filter((trait) => trait.category === currentTab)
                    .map((trait, index) => (
                      <div
                        key={index}
                        className="p-2 bg-white rounded-lg border border-gray-100 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-indigo-400" />
                        <span className="text-sm text-gray-700">
                          {trait.value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* 입력 영역 */}
              <div className="flex-shrink-0 p-4 border-t bg-white/30">
                <div className="flex gap-2">
                  <input
                    value={newTrait}
                    onChange={(e) => setNewTrait(e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
                    placeholder={
                      currentTab === 'traits'
                        ? '새로운 특성 추가...'
                        : currentTab === 'goals'
                          ? '새로운 목표 추가...'
                          : currentTab === 'pain'
                            ? '새로운 페인포인트 추가...'
                            : '새로운 행동 패턴 추가...'
                    }
                    className="flex-1 px-3 py-2 text-sm bg-white/50 border rounded-lg 
                      focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addTrait();
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="px-4 py-2 text-sm font-medium text-indigo-600 
                      bg-indigo-50 hover:bg-indigo-100 rounded-lg 
                      transition-colors relative overflow-hidden group"
                  >
                    추가
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </foreignObject>
    </motion.g>
  );
}