import { useCallback } from 'react';
import { TopicVoteLayer } from '@/lib/types';
import { useMutation, useSelf } from '@/liveblocks.config';
import { motion } from 'framer-motion';
import { cn, colorToCss } from '@/lib/utils';
import { REACTIONS } from '@/components/StageGimmicks/configs';

interface TopicVoteProps {
  id: string;
  layer: TopicVoteLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
  isSelected?: boolean;
}

export default function TopicVote({
  layer,
  onPointerDown,
  id,
}: TopicVoteProps) {
  const { x, y, width, height, value, reactions = {}, iconUrl } = layer;
  const me = useSelf();

  const updateReaction = useMutation(({ storage }, emoji: string) => {
    const liveLayers = storage.get('layers');
    const layer = liveLayers.get(id);

    if (layer && me?.id) {
      const currentReactions = { ...(layer.get('reactions') || {}) };

      if (currentReactions[me.id]?.emoji === emoji) {
        const { [me.id]: _, ...remainingReactions } = currentReactions;
        layer.update({ reactions: remainingReactions });
      } else {
        layer.update({
          reactions: {
            ...currentReactions,
            [me.id]: { emoji, timestamp: Date.now() },
          },
        });
      }
    }
  }, []);

  const getReactionCount = useCallback(
    (emoji: string) => {
      return Object.values(reactions).filter((r) => r.emoji === emoji).length;
    },
    [reactions],
  );

  const hasUserReacted = useCallback(
    (emoji: string) => {
      return reactions[me?.id || '']?.emoji === emoji;
    },
    [reactions, me?.id],
  );

  return (
    <motion.foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      onPointerDown={(e) => onPointerDown(e, id)}
    >
      <div className="h-full">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-indigo-100">
          {/* 헤더 영역 */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-indigo-100">
            {iconUrl ? (
              <img
                src={iconUrl}
                alt=""
                className="w-10 h-10 rounded-full border-2 border-indigo-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-medium">
                {me?.info?.name?.[0] || '?'}
              </div>
            )}
            <div className="flex-1">
              <div className="text-sm text-indigo-600 font-medium mb-0.5">
                제안된 주제
              </div>
              <p className="font-medium text-gray-900">{value}</p>
            </div>
            <div className="text-xs text-gray-500">
              {Object.keys(reactions).length}명 참여
            </div>
          </div>

          {/* 리액션 영역 */}
          <div className="flex flex-wrap gap-2 relative">
            {' '}
            {/* relative 추가 */}
            {REACTIONS.map(({ emoji, label }) => {
              const count = getReactionCount(emoji);
              const hasReacted = hasUserReacted(emoji);

              return (
                <motion.button
                  key={emoji}
                  onClick={() => updateReaction(emoji)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative" // 개별 버튼 컨테이너
                >
                  <div
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200',
                      hasReacted
                        ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700',
                    )}
                  >
                    <span className="text-lg">{emoji}</span>
                    {count > 0 && (
                      <span
                        className={cn(
                          'text-sm font-medium',
                          hasReacted ? 'text-indigo-700' : 'text-gray-600',
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </div>

                  {/* 툴팁 수정 */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-1
            px-1.5 py-0.5 bg-gray-800/75 backdrop-blur-sm 
            text-white text-[10px] rounded-md whitespace-nowrap 
            opacity-0 group-hover:opacity-100 transition-opacity
            pointer-events-none z-[9999]"
                  >
                    {label}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.foreignObject>
  );
}
