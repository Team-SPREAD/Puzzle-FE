import { useCallback, useRef, useState, useEffect } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { VisionLayer, Color } from '@/lib/types';
import { useMutation } from '@/liveblocks.config';
import { motion } from 'framer-motion';
import { cn, colorToCss } from '@/lib/utils';

interface VisionBoxProps {
  id: string;
  layer: VisionLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
  isSelected?: boolean;
}

export default function Vision({
  layer,
  onPointerDown,
  id,
  selectionColor,
  isSelected,
}: VisionBoxProps) {
  const { x, y, width, height, fill, value, borderColor, fontStyle, iconUrl } =
    layer;
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 텍스트 업데이트를 위한 mutation
  const updateText = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get('layers');
    const layer = liveLayers.get(id);

    if (layer) {
      layer.update({
        value: newValue,
      });
    }
  }, []);

  const handleContentChange = useCallback(
    (e: ContentEditableEvent) => {
      const newValue = e.target.value;
      updateText(newValue);
    },
    [updateText],
  );

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    contentRef.current?.focus();
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isEditing) {
        e.stopPropagation();
      }
    },
    [isEditing],
  );

  return (
    <motion.g
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
    >
      {/* 유리모피즘 느낌의 그림자 */}
      <rect
        x={x + 5}
        y={y + 5}
        width={width}
        height={height}
        fill="rgba(0, 0, 0, 0.15)"
        rx={25}
        ry={25}
      />
      {/* 비전 박스 배경 */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="rgba(255, 255, 255, 0.4)" // 반투명한 배경
        stroke={colorToCss(borderColor)}
        strokeWidth={2}
        rx={25}
        ry={25}
        style={{
          backdropFilter: 'blur(10px)', // 배경 블러 효과
          WebkitBackdropFilter: 'blur(10px)', // 사파리 호환성
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)', // 깊은 그림자 효과
          transform: `rotate(-1deg)`,
          transformOrigin: `${x + width / 2}px ${y + height / 2}px`,
        }}
      />
      <foreignObject
        x={x}
        y={y}
        width={width}
        height={height}
        onPointerDown={(e) => !isEditing && onPointerDown(e, id)}
        style={{
          transform: `rotate(-1deg)`,
          transformOrigin: `${x + width / 2}px ${y + height / 2}px`,
        }}
      >
        <div className="flex items-center p-3">
          {/* 아이콘 추가 (옵션) */}
          {iconUrl && (
            <img
              src={iconUrl}
              alt="user avatar"
              className="w-8 h-8 rounded-full mr-3" // 작은 동그라미 모양 아바타
            />
          )}
          <ContentEditable
            innerRef={contentRef}
            html={value || ''}
            disabled={!isEditing}
            onChange={handleContentChange}
            onDoubleClick={handleDoubleClick}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              'flex-1',
              'outline-none',
              'whitespace-nowrap', // 한 줄로 표시
              'overflow-hidden', // 넘칠 경우 숨김
              isEditing ? 'bg-white/20' : 'bg-transparent',
              'transition-all',
              'font-vision', // Tailwind 설정에 추가 필요
            )}
            style={{
              color: '#1A202C',
              cursor: isEditing ? 'text' : 'move',
              fontFamily: fontStyle || "'Poppins', 'Cute Font', sans-serif",
              fontSize: '1.2rem', // 약간 작게 설정
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', // 가벼운 텍스트 그림자 추가
              boxShadow: isSelected ? `0 0 0 2px ${selectionColor}` : 'none',
              fontWeight: '500',
            }}
          />
        </div>
      </foreignObject>
    </motion.g>
  );
}
