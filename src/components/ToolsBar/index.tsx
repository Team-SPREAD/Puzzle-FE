import React from "react";
import PencilButton from "./PencilButton";
import RectangleButton from "./RectangleButton";
import EllipseButton from "./EllipseButton";
import UndoButton from "./UndoButton";
import RedoButton from "./RedoButton";
import SelectionButton from "./SelectionButton";
import { CanvasMode, LayerType, CanvasState } from "@/lib/types";
import TextButton from "./TextButton";
import NoteButton from "./NoteButton";

type Props = {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export default function ToolsBar({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
}: Props) {

  return (
    <div className="fixed left-6 top-1/2 transform -translate-y-1/2 flex items-center z-50"> {/* fixed로 변경하고 z-index 추가 */}
      <div className="shadow-popup rounded-xl bg-surface-panel flex flex-col items-center justify-center"> {/* flex-col 추가 */}
        <div className="flex flex-col items-center justify-center p-3"> {/* flex-col 추가 */}
          <SelectionButton
            isActive={
              canvasState.mode === CanvasMode.None ||
              canvasState.mode === CanvasMode.Translating ||
              canvasState.mode === CanvasMode.SelectionNet ||
              canvasState.mode === CanvasMode.Pressing ||
              canvasState.mode === CanvasMode.Resizing
            }
            onClick={() => setCanvasState({ mode: CanvasMode.None })}
          />

          <PencilButton
            isActive={canvasState.mode === CanvasMode.Pencil}
            onClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
          />
          <TextButton
            isActive={
              canvasState.mode === CanvasMode.Inserting &&
              canvasState.layerType === LayerType.Text
            }
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Text,
              })
            }
          />
          <RectangleButton
            isActive={
              canvasState.mode === CanvasMode.Inserting &&
              canvasState.layerType === LayerType.Rectangle
            }
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Rectangle,
              })
            }
          />
          <EllipseButton
            isActive={
              canvasState.mode === CanvasMode.Inserting &&
              canvasState.layerType === LayerType.Ellipse
            }
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Ellipse,
              })
            }
          />
          <NoteButton
            isActive={
              canvasState.mode === CanvasMode.Inserting &&
              canvasState.layerType === LayerType.Note
            }
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Note,
              })
            }
          />
        </div>
        <div className="h-[1px] w-full bg-black bg-opacity-10"></div> {/* 가로 구분선으로 변경 */}
        <div className="flex flex-col items-center justify-center p-3"> {/* flex-col 추가 */}
          <UndoButton onClick={undo} disabled={!canUndo} />
          <RedoButton onClick={redo} disabled={!canRedo} />
        </div>
      </div>
    </div>
  );
}
