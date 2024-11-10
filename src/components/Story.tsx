import { useCallback, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { UserStoryLayer, Color } from '@/lib/types';
import { useMutation, useSelf } from '@/liveblocks.config';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface UserStoryProps {
  id: string;
  layer: UserStoryLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
  isSelected?: boolean;
}

export default function UserStory({
  layer,
  onPointerDown,
  id,
  selectionColor,
  isSelected,
}: UserStoryProps) {
  const {
    x,
    y,
    width,
    height,
    who,
    goal,
    action,
    task,
    borderColor,
    fontStyle,
    iconUrl,
  } = layer;
  const contentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const me = useSelf();

  // 텍스트 업데이트를 위한 mutation
  const updateContent = useMutation(
    ({ storage }, field: keyof UserStoryLayer, newValue: string) => {
      const liveLayers = storage.get('layers');
      const layer = liveLayers.get(id);

      if (layer) {
        layer.update({
          [field]: newValue,
        });
      }
    },
    [],
  );
  // 표시할 필드 결정 (who, goal, action, task 중 하나만 표시)
  const fieldToDisplay = who
    ? 'who'
    : goal
      ? 'goal'
      : action
        ? 'action'
        : 'task';
  const fieldValue = layer[fieldToDisplay];

  const handleContentChange = useCallback(
    (e: ContentEditableEvent) => {
      const newValue = e.target.value;
      updateContent(fieldToDisplay, newValue);
    },
    [updateContent, fieldToDisplay],
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

  const getBackgroundColor = (field: string) => {
    switch (field) {
      case 'who':
        return 'bg-blue-100';
      case 'goal':
        return 'bg-green-100';
      case 'action':
        return 'bg-purple-100';
      case 'task':
        return 'bg-[#FF99CB]';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <motion.g
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
    >
      <foreignObject
        x={x}
        y={y}
        width={width}
        height={height}
        onPointerDown={(e) => !isEditing && onPointerDown(e, id)} // isEditing이 true일 때 포인터 이벤트 차단
      >
        <div
          className={`h-full ${getBackgroundColor(
            fieldToDisplay,
          )} backdrop-blur-md rounded-2xl shadow-xl p-4 border border-indigo-100`}
        >
          {/* 표시할 필드에 대한 메모지 */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <span className="bg-gray-500 text-white px-2 py-1 rounded capitalize">
              {fieldToDisplay}
            </span>
            <ContentEditable
              innerRef={contentRef}
              html={fieldValue || ''}
              disabled={!isEditing} // 수정 가능 상태를 isEditing에 의해 제어
              onChange={handleContentChange}
              onDoubleClick={handleDoubleClick}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={cn(
                'flex-1 p-2 rounded-lg transition-all',
                isEditing ? 'bg-white/20' : 'bg-transparent',
              )}
              style={{
                color: '#1A202C',
                cursor: isEditing ? 'text' : 'pointer',
                // fontFamily: fontStyle || "'Poppins', 'Cute Font', sans-serif",
                fontSize: '1rem',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                boxShadow: isSelected ? `0 0 0 2px ${selectionColor}` : 'none',
              }}
            />
          </div>
        </div>
      </foreignObject>
    </motion.g>
  );
}
