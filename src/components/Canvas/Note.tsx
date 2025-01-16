import { useCallback, useRef, useState, useEffect } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { NoteLayer, Color } from '@/lib/types';
import { cn, colorToCss } from '@/lib/utils';
import { useMutation } from '@/liveblocks.config';
import { motion } from 'framer-motion';

const DEFAULT_NOTE_COLOR: Color = {
  r: 255,
  g: 244,
  b: 189
};

interface MemoProps {
  id: string;
  layer: NoteLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
  isSelected?: boolean;
  onColorChange?: (color: Color) => void;
}

export default function Memo({
  layer,
  onPointerDown,
  id,
  selectionColor,
  isSelected,
  onColorChange,
}: MemoProps) {
  const { x, y, width, height, fill = DEFAULT_NOTE_COLOR, value } = layer;
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

  // 색상 업데이트를 위한 mutation
  const updateColor = useMutation(({ storage }, newColor: Color) => {
    const liveLayers = storage.get('layers');
    const layer = liveLayers.get(id);

    if (layer) {
      layer.update({
        fill: newColor,
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

  useEffect(() => {
    if (layer.fill && onColorChange) {
      onColorChange(layer.fill);
    }
  }, [layer.fill, onColorChange]);

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
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* 포스트잇 그림자 */}
      <rect
        x={x + 3}
        y={y + 3}
        width={width}
        height={height}
        fill="rgba(0,0,0,0.1)"
        rx={8}
        ry={8}
      />
      {/* 포스트잇 배경 */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={colorToCss(fill)}
        stroke={selectionColor || "transparent"}
        strokeWidth={2}
        rx={8}
        ry={8}
        filter="url(#paper-texture)"
        style={{
          transform: `rotate(-1deg)`,
          transformOrigin: `${x + width/2}px ${y + height/2}px`
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
          transformOrigin: `${x + width/2}px ${y + height/2}px`
        }}
      >
        <ContentEditable
          innerRef={contentRef}
          html={value || ''}
          disabled={!isEditing}
          onChange={handleContentChange}
          onDoubleClick={handleDoubleClick}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full h-full',
            'outline-none',
            'whitespace-pre-wrap',
            isEditing ? 'bg-white/10' : 'bg-transparent',
            'transition-colors',
            'p-4',
            'font-memo', // Tailwind 설정에 추가 필요
          )}
          style={{
            color: '#2D3748', // 진한 회색으로 가독성 확보
            cursor: isEditing ? 'text' : 'move',
            fontFamily: "'Cute Font', 'Nanum Pen Script', cursive", // 필기체 스타일
            fontSize: '1.1rem',
            lineHeight: '1.5',
            boxShadow: isSelected ? `0 0 0 2px ${selectionColor}` : 'none',
          }}
        />
      </foreignObject>
      
      {/* 종이 질감을 위한 SVG 필터 */}
      <defs>
        <filter id="paper-texture">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="4" 
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2"
          />
        </filter>
      </defs>
    </motion.g>
  );
}