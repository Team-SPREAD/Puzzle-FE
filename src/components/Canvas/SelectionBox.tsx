import { memo } from 'react';
import { useSelf, useStorage } from '@/liveblocks.config';
import useSelectionBounds from '@/hooks/useSelectionBounds';
import { LayerType, Side, XYWH } from '@/lib/types';

type SelectionBoxProps = {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
};

// 핸들의 크기
const HANDLE_WIDTH = 8;

const SelectionBox = memo(
  ({ onResizeHandlePointerDown }: SelectionBoxProps) => {
    // 단일 선택된 레이어 확인
    const soleLayerId = useSelf((me) =>
      me.presence.selection.length === 1 ? me.presence.selection[0] : null,
    );

    // Path 타입이 아닐 때만 핸들 표시
    const isShowingHandles = useStorage(
      (root) =>
        soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path,
    );

    const bounds = useSelectionBounds();
    if (!bounds) {
      return null;
    }

    // 선택 영역 핸들 위치 정보
    const handles = [
      { cursor: 'nwse-resize', position: Side.Top + Side.Left, x: 0, y: 0 },
      { cursor: 'ns-resize', position: Side.Top, x: '50%', y: 0 },
      {
        cursor: 'nesw-resize',
        position: Side.Top + Side.Right,
        x: '100%',
        y: 0,
      },
      { cursor: 'ew-resize', position: Side.Right, x: '100%', y: '50%' },
      {
        cursor: 'nwse-resize',
        position: Side.Bottom + Side.Right,
        x: '100%',
        y: '100%',
      },
      { cursor: 'ns-resize', position: Side.Bottom, x: '50%', y: '100%' },
      {
        cursor: 'nesw-resize',
        position: Side.Bottom + Side.Left,
        x: 0,
        y: '100%',
      },
      { cursor: 'ew-resize', position: Side.Left, x: 0, y: '50%' },
    ];

    return (
      <>
        {/* 선택 영역 테두리 */}
        <rect
          className="fill-transparent pointer-events-none"
          style={{
            transform: `translate(${bounds.x}px, ${bounds.y}px)`,
            stroke: '#2563eb', // 파란색
            strokeWidth: 1,
            strokeDasharray: '4 4', // 점선 패턴
          }}
          x={0}
          y={0}
          width={bounds.width}
          height={bounds.height}
        />

        {isShowingHandles &&
          handles.map((handle, index) => (
            <rect
              key={index}
              className="fill-black stroke-1 stroke-primary"
              x={0}
              y={0}
              style={{
                cursor: handle.cursor,
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${
                  bounds.x +
                  (typeof handle.x === 'string'
                    ? (parseInt(handle.x) * bounds.width) / 100
                    : handle.x) -
                  HANDLE_WIDTH / 2
                }px, ${
                  bounds.y +
                  (typeof handle.y === 'string'
                    ? (parseInt(handle.y) * bounds.height) / 100
                    : handle.y) -
                  HANDLE_WIDTH / 2
                }px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(handle.position, bounds);
              }}
            />
          ))}
      </>
    );
  },
);

SelectionBox.displayName = 'SelectionBox';

export default SelectionBox;
