import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useSelf } from '@/liveblocks.config';
import {
  DiscussionLayer,
  Comment,
  VoteType,
} from '@/lib/types';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface DiscussionProps {
  id: string;
  layer: DiscussionLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export default function Discussion({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: DiscussionProps) {
  const [newComment, setNewComment] = useState('');
  const [voteType, setVoteType] = useState<VoteType>('neutral');
  const [isExpanded, setIsExpanded] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const me = useSelf();

  // 카테고리별 스타일과 정보
  const categoryStyles = {
    category: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      icon: '🎯',
      nextStep: 'problem',
    },
    problem: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-600',
      icon: '❗',
      nextStep: 'solution',
    },
    solution: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-600',
      icon: '💡',
      nextStep: 'target',
    },
    target: {
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-600',
      icon: '👥',
      nextStep: 'target',
    },
  };

  // 진행 단계 처리
  const proceedToNextStep = useMutation(
    ({ storage }) => {
      const layers = storage.get('layers');
      const currentLayer = layers.get(id);

      if (!currentLayer || !layer.category) return;

      const nextStep = categoryStyles[layer.category].nextStep;
      if (!nextStep) return;

      currentLayer.update({
        status: 'completed',
      });
    },
    [layer.category],
  );

  // 댓글 추가
  const addComment = useMutation(
    ({ storage }) => {
      if (!newComment.trim() || !me) return;

      const layers = storage.get('layers');
      const currentLayer = layers.get(id);

      if (!currentLayer) return;

      // 새로운 댓글 객체 생성
      const newCommentObj: Comment = {
        id: nanoid(),
        userId: me.id,
        userName: me.info?.name || '익명 사용자',
        userAvatar: me.info?.avatar,
        content: newComment,
        timestamp: Date.now(),
        voteType,
        category: layer.category,
        reactions: {},
      };

      // 기존 댓글을 가져옴
      const existingComments = currentLayer.get('comments');
      const commentsArray = Array.isArray(existingComments) ? existingComments : [];
      
      // 댓글 추가
      currentLayer.update({
        comments: [...commentsArray, newCommentObj],
      });
      setNewComment('');
    },
    [newComment, voteType, me, layer.category],
  );

  // 진행률 계산
  const totalComments = layer.comments?.length || 0;
  const agreeComments =
    layer.comments?.filter((c) => c.voteType === 'agree').length || 0;
  const progress = totalComments
    ? Math.round((agreeComments / totalComments) * 100)
    : 0;

  return (
    <motion.g>
      <foreignObject
        x={Number(layer.x)}
        y={Number(layer.y)}
        width={Number(layer.width)}
        height={Number(layer.height)}
        onPointerDown={(e) => onPointerDown(e, id)}
      >
        <div
          ref={containerRef}
          className={cn(
            'h-full flex flex-col',
            'backdrop-blur-sm rounded-xl shadow-lg',
            'border-2',
            layer.status === 'completed' ? 'opacity-75' : '',
            categoryStyles[layer.category].borderColor,
          )}
        >
          {/* 헤더 */}
          <div className="flex-shrink-0 p-4 border-b">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {categoryStyles[layer.category].icon}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {layer.topic}
                  </h3>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      categoryStyles[layer.category].textColor,
                    )}
                  >
                    {layer.category === 'category'
                      ? '서비스 카테고리'
                      : layer.category === 'problem'
                        ? '문제점 정의'
                        : layer.category === 'solution'
                          ? '해결 방향'
                          : '타겟 정의'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-white/30 rounded-full"
              >
                {isExpanded ? '△' : '▽'}
              </button>
            </div>
          </div>

          {isExpanded && (
            <>
              {/* 설명 영역 */}
              <div className="flex-shrink-0 p-4 bg-white/30">
                <p className="text-sm text-gray-600">{layer.description}</p>
              </div>

              {/* 진행 상태 */}
              <div className="flex-shrink-0 p-4 bg-white/30 border-b">
                {layer.status === 'completed' ? (
                  <div className="text-center">
                    <span className="text-green-600 font-medium">완료됨</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">진행률</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    {progress >= 70 && agreeComments >= 3 && (
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => proceedToNextStep()}
                          className={cn(
                            'px-3 py-1 rounded-lg text-sm font-medium',
                            'bg-white/50 hover:bg-white/70',
                            categoryStyles[layer.category].textColor,
                          )}
                        >
                          다음 단계로
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 댓글 목록 - 스크롤 영역 */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3"
                onWheel={(e) => {
                  e.stopPropagation();
                  if (containerRef.current) {
                    const container = containerRef.current;
                    const isScrollable =
                      container.scrollHeight > container.clientHeight;
                    if (isScrollable) {
                      e.preventDefault();
                      container.scrollTop += e.deltaY;
                    }
                  }
                }}
              >
                {layer.comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    {comment.userAvatar && (
                      <div className="relative flex-shrink-0 w-8 h-8">
                        <Image
                          src={comment.userAvatar}
                          alt=""
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      </div>
                    )}
                    <div
                      className={cn(
                        'flex-1 p-3 rounded-lg text-sm',
                        'bg-white/50',
                        comment.voteType === 'agree'
                          ? 'border-l-4 border-green-400'
                          : comment.voteType === 'disagree'
                            ? 'border-l-4 border-red-400'
                            : 'border-l-4 border-gray-400',
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-700">
                          {comment.userName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 입력 영역 - 하단 고정 */}
              {layer.status !== 'completed' && (
                <div className="flex-shrink-0 p-4 border-t bg-white/30">
                  <div className="flex gap-2 mb-2">
                    {[
                      {
                        type: 'agree',
                        label: '찬성',
                        color: 'bg-green-100 text-green-600',
                      },
                      {
                        type: 'disagree',
                        label: '반대',
                        color: 'bg-red-100 text-red-600',
                      },
                      {
                        type: 'neutral',
                        label: '중립',
                        color: 'bg-gray-100 text-gray-600',
                      },
                    ].map((opt) => (
                      <button
                        key={opt.type}
                        onClick={() => setVoteType(opt.type as VoteType)}
                        className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium transition-colors',
                          voteType === opt.type
                            ? opt.color
                            : 'bg-white/50 text-gray-600',
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      onPointerDown={(e) => e.stopPropagation()} // 추가
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="의견을 입력하세요..."
                      className="flex-1 px-3 py-2 text-sm bg-white/50 border rounded-lg 
                        focus:outline-none focus:ring-1 focus:ring-blue-300"
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          addComment();
                        }
                      }}
                    />
                    <button
                      onClick={() => addComment()}
                      onPointerDown={(e) => e.stopPropagation()}
                      className={cn(
                        'px-4 py-2 text-sm rounded-lg relative overflow-hidden group',
                        'bg-white/50 hover:bg-white/70 transition-colors',
                        categoryStyles[layer.category].textColor,
                      )}
                    >
                      <span className="relative z-10">등록</span>
                      <div
                        className={cn(
                          'absolute left-0 bottom-0 w-full bg-current',
                          'opacity-10 transition-all duration-300 ease-out',
                          'h-0 group-hover:h-full',
                        )}
                      />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </foreignObject>
    </motion.g>
  );
}
