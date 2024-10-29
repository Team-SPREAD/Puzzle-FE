import { useCallback, useRef, useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { TextLayer } from "@/lib/types";
import { cn, colorToCss } from "@/lib/utils";
import { useMutation } from "@/liveblocks.config";

interface TextProps {
  id: string;
  layer: TextLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
  isSelected?: boolean;
}

export default function Text({ 
  layer, 
  onPointerDown, 
  id, 
  selectionColor 
}: TextProps) {
  const { x, y, width, height, fill, value } = layer;
  const contentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const updateText = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get('layers');
    const layer = liveLayers.get(id);
    
    if (layer) {
      layer.update({
        value: newValue
      });
    }
  }, []);

  const handleContentChange = useCallback((e: ContentEditableEvent) => {
    const newValue = e.target.value;
    updateText(newValue);
  }, [updateText]);

  // 더블클릭으로만 편집 모드 진입
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    contentRef.current?.focus();
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isEditing) {
      e.stopPropagation(); // 편집 중일 때만 이벤트 전파 중단
    }
  }, [isEditing]);

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => !isEditing && onPointerDown(e, id)} // 편집 중이 아닐 때만 선택 가능
      style={{
        outline: selectionColor ? `2px solid ${selectionColor}` : "none",
      }}
    >
      <ContentEditable
        innerRef={contentRef}
        html={value || ""}
        disabled={!isEditing} // 편집 중이 아닐 때는 비활성화
        onChange={handleContentChange}
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full h-full",
          "outline-none",
          "whitespace-pre-wrap",
          isEditing ? "bg-white/50" : "bg-transparent",
          "transition-colors",
          "p-2"
        )}
        style={{
          color: colorToCss(fill),
          cursor: isEditing ? "text" : "move",
        }}
      />
    </foreignObject>
  );
}