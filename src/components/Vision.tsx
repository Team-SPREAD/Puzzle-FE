import { useCallback, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { VisionLayer } from '@/lib/types';
import { useMutation, useSelf } from '@/liveblocks.config';
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
  const { x, y, width, height, value } = layer;
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const me = useSelf();
  const userName = me?.info?.name || '익명';

  const updateText = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get('layers');
    const layer = liveLayers.get(id);
    if (layer) {
      layer.update({
        value: newValue,
        author: userName
      });
    }
  }, [userName]);

  const handleContentChange = useCallback(
    (e: ContentEditableEvent) => {
      updateText(e.target.value);
    },
    [updateText]
  );

  return (
    <motion.g
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
    >
      <foreignObject x={x} y={y} width={width} height={height} onPointerDown={(e) => !isEditing && onPointerDown(e, id)}>
        <div className="relative h-full flex flex-col justify-between p-6">
          <ContentEditable
            innerRef={contentRef}
            html={value || ''}
            disabled={!isEditing}
            onChange={handleContentChange}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            onBlur={() => setIsEditing(false)}
            className={cn(
              'flex-1',
              'outline-none',
              'text-2xl',
              'leading-relaxed',
              'text-gray-800',
              isEditing ? 'bg-white/10' : 'bg-transparent',
              'transition-all'
            )}
            style={{
              fontFamily: "'Nanum Brush Script', cursive",
              cursor: isEditing ? 'text' : 'move',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
              boxShadow: isSelected ? `0 0 0 2px ${selectionColor}` : 'none',
            }}
          />
          
          <div className="text-right mt-4 text-gray-600" style={{ 
            fontFamily: "'Nanum Myeongjo', serif",
            fontSize: '0.9rem' 
          }}>
            - {layer.author || userName}
          </div>
        </div>
      </foreignObject>
    </motion.g>
  );
}