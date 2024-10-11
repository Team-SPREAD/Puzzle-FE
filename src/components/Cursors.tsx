import { useOthersMapped, useUpdateMyPresence } from "@/liveblocks.config";
import Cursor from "./Cursor";
import { MutableRefObject, useEffect, useCallback } from "react";
import { shallow } from "@liveblocks/client";
import { useBoundingClientRectRef } from "@/utils/useBoundingClientRectRef";

type Props = {
  cursorPanel: MutableRefObject<HTMLElement | null>;
};

const Cursors = ({ cursorPanel }: Props) => {
  const updateMyPresence = useUpdateMyPresence();
  const others = useOthersMapped(
    (other) => ({
      cursor: other.presence.cursor,
      info: other.info,
    }),
    shallow
  );
  const rectRef = useBoundingClientRectRef(cursorPanel);

  const updateCursor = useCallback((event: PointerEvent) => {
    if (!cursorPanel.current) return;

    const x = event.clientX - rectRef.current.x + cursorPanel.current.scrollLeft;
    const y = event.clientY - rectRef.current.y + cursorPanel.current.scrollTop;

    updateMyPresence({
      cursor: {
        x: Math.round(x),
        y: Math.round(y),
      },
    });
  }, [updateMyPresence, cursorPanel, rectRef]);

  const removeCursor = useCallback(() => {
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

  useEffect(() => {
    const currentPanel = cursorPanel.current;
    if (!currentPanel) return;

    currentPanel.addEventListener("pointermove", updateCursor);
    currentPanel.addEventListener("pointerleave", removeCursor);

    return () => {
      currentPanel.removeEventListener("pointermove", updateCursor);
      currentPanel.removeEventListener("pointerleave", removeCursor);
    };
  }, [cursorPanel, updateCursor, removeCursor]);

  return (
    <>
      {others.map(([id, other]) => (
        other.cursor && (
          <Cursor
            key={id}
            name={other.info.name}
            color={other.info.color}
            x={other.cursor.x}
            y={other.cursor.y}
          />
        )
      ))}
    </>
  );
};

export default Cursors;