import React from 'react';
import PencilButton from './PencilButton';
import RectangleButton from './RectangleButton';
import EllipseButton from './EllipseButton';
import UndoButton from './UndoButton';
import RedoButton from './RedoButton';
import SelectionButton from './SelectionButton';
import { CanvasMode, LayerType, CanvasState, Color } from '@/lib/types';
import TextButton from './TextButton';
import NoteButton from './NoteButton';

type Props = {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  penSize: number;
  setPenSize: (size: number) => void;
  currentColor: Color;
  onColorChange: (color: Color) => void;
};

export default function ToolsBar({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
  penSize,
  setPenSize,
  currentColor,
  onColorChange,
}: Props) {
  const handlePencilClick = () => {
    setCanvasState({ mode: CanvasMode.Pencil });
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col gap-3 bg-white rounded-xl shadow-lg p-3 border border-gray-200">
        {/* Main Tools Section */}
        <div className="flex flex-col gap-2">
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
            onClick={handlePencilClick}
            size={penSize}
            onSizeChange={setPenSize}
            currentColor={currentColor}
            onColorChange={onColorChange}
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
            currentColor={currentColor}
            onColorChange={onColorChange}
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

        {/* Divider */}
        <div className="h-[1px] bg-gray-200 w-full" />

        {/* Undo/Redo Section */}
        <div className="flex flex-col gap-2">
          <UndoButton onClick={undo} disabled={!canUndo} />
          <RedoButton onClick={redo} disabled={!canRedo} />
        </div>
      </div>
    </div>
  );
}
