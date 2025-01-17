import { useCallback, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { UserStoryLayer } from '@/lib/types';
import { useMutation, useSelf } from '@/liveblocks.config';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
  const { x, y, width, height, who, goal, action, task, iconUrl } = layer;
  const contentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const getStylesByType = (field: string) => {
    const styles = {
      who: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
        border: 'border-blue-200',
        text: 'text-blue-800',
        badge: 'bg-blue-500',
        shadow: 'shadow-blue-100',
      },
      goal: {
        bg: 'bg-gradient-to-br from-green-50 to-green-100',
        border: 'border-green-200',
        text: 'text-green-800',
        badge: 'bg-green-500',
        shadow: 'shadow-green-100',
      },
      action: {
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
        border: 'border-purple-200',
        text: 'text-purple-800',
        badge: 'bg-purple-500',
        shadow: 'shadow-purple-100',
      },
      task: {
        bg: 'bg-gradient-to-br from-pink-50 to-pink-100',
        border: 'border-pink-200',
        text: 'text-pink-800',
        badge: 'bg-pink-500',
        shadow: 'shadow-pink-100',
      },
    };
    return styles[field as keyof typeof styles] || styles.who;
  };

  const currentStyles = getStylesByType(fieldToDisplay);

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
        onPointerDown={(e) => !isEditing && onPointerDown(e, id)}
      >
        <div
          className={cn(
            'h-full w-full rounded-xl shadow-lg backdrop-blur-md border-2',
            'transition-all duration-200',
            currentStyles.bg,
            currentStyles.border,
            currentStyles.shadow,
            isSelected ? 'ring-2 ring-offset-2 ring-violet-400' : '',
          )}
        >
          <div className="flex flex-col h-full p-3 gap-2">
            <div className="flex justify-between items-center">
              <span
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium text-white capitalize',
                  currentStyles.badge,
                )}
              >
                {fieldToDisplay}
              </span>

              {iconUrl && (
                <div className="relative w-6 h-6">
                  <Image
                    src={iconUrl}
                    alt="User"
                    fill
                    sizes="24px"
                    className="rounded-full border-2 border-white shadow-sm object-cover"
                    priority
                  />
                </div>
              )}
            </div>

            <ContentEditable
              innerRef={contentRef}
              html={fieldValue || ''}
              disabled={!isEditing}
              onChange={handleContentChange}
              onDoubleClick={handleDoubleClick}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={cn(
                'flex-1 p-2 rounded-lg transition-all text-sm',
                currentStyles.text,
                isEditing ? 'bg-white/50 backdrop-blur-sm' : 'bg-transparent',
                'focus:outline-none',
              )}
              style={{
                minHeight: '2.5rem',
                cursor: isEditing ? 'text' : 'pointer',
                wordBreak: 'break-word',
              }}
            />
          </div>
        </div>
      </foreignObject>
    </motion.g>
  );
}
