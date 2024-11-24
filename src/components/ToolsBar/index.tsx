import React from 'react';
import { motion } from 'framer-motion';
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
  const isToolActive = (mode: CanvasMode, checkLayerType?: LayerType) => {
    if (mode === CanvasMode.None) {
      return (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Translating ||
        canvasState.mode === CanvasMode.SelectionNet ||
        canvasState.mode === CanvasMode.Pressing ||
        canvasState.mode === CanvasMode.Resizing
      );
    }

    if (mode === CanvasMode.Pencil) {
      return canvasState.mode === CanvasMode.Pencil;
    }

    if (mode === CanvasMode.Inserting && typeof checkLayerType === 'number') {
      return (
        canvasState.mode === mode &&
        'layerType' in canvasState &&
        canvasState.layerType === checkLayerType
      );
    }

    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed left-6 top-[30%] z-50 flex flex-col items-center gap-3"
    >
      {/* Undo/Redo Tools */}
      <motion.div
        className="flex justify-center items-center bg-white rounded-xl shadow-lg border border-zinc-200/80"
        layout
      >
        <motion.div
          className={`p-1 ${!canUndo ? 'opacity-50' : ''}`}
          whileHover={{ scale: 1.1 }}
        >
          <UndoButton onClick={undo} disabled={!canUndo} />
        </motion.div>
        <motion.div className="w-px h-6 bg-zinc-200 mx-1" layout />
        <motion.div
          className={`p-1 ${!canRedo ? 'opacity-50' : ''}`}
          whileHover={{ scale: 1.1 }}
        >
          <RedoButton onClick={redo} disabled={!canRedo} />
        </motion.div>
      </motion.div>
      {/* Main Tools */}
      <motion.div
        className="flex flex-col bg-white rounded-xl shadow-lg py-3 px-2.5 border border-zinc-200/80 w-[52px]"
        layout
      >
        <div className="space-y-3">
          <ToolButton
            active={isToolActive(CanvasMode.None)}
            onClick={() => setCanvasState({ mode: CanvasMode.None })}
          >
            <SelectionButton
              isActive={isToolActive(CanvasMode.None)}
              onClick={() => {}}
            />
          </ToolButton>

          <ToolButton
            active={isToolActive(CanvasMode.Pencil)}
            onClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
          >
            <PencilButton
              isActive={isToolActive(CanvasMode.Pencil)}
              onClick={() => {}}
              size={penSize}
              onSizeChange={setPenSize}
              currentColor={currentColor}
              onColorChange={onColorChange}
            />
          </ToolButton>

          <ToolButton
            active={isToolActive(CanvasMode.Inserting, LayerType.Text)}
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Text,
              })
            }
          >
            <TextButton
              isActive={isToolActive(CanvasMode.Inserting, LayerType.Text)}
              onClick={() => {}}
              currentColor={currentColor}
              onColorChange={onColorChange}
            />
          </ToolButton>

          <ToolButton
            active={isToolActive(CanvasMode.Inserting, LayerType.Rectangle)}
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Rectangle,
              })
            }
          >
            <RectangleButton
              isActive={isToolActive(CanvasMode.Inserting, LayerType.Rectangle)}
              onClick={() => {}}
            />
          </ToolButton>

          <ToolButton
            active={isToolActive(CanvasMode.Inserting, LayerType.Ellipse)}
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Ellipse,
              })
            }
          >
            <EllipseButton
              isActive={isToolActive(CanvasMode.Inserting, LayerType.Ellipse)}
              onClick={() => {}}
            />
          </ToolButton>

          <ToolButton
            active={isToolActive(CanvasMode.Inserting, LayerType.Note)}
            onClick={() =>
              setCanvasState({
                mode: CanvasMode.Inserting,
                layerType: LayerType.Note,
              })
            }
          >
            <NoteButton
              isActive={isToolActive(CanvasMode.Inserting, LayerType.Note)}
              onClick={() => {}}
            />
          </ToolButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ToolButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      onClick={onClick}
      className="relative w-full flex items-center justify-center cursor-pointer"
      role="button"
      whileHover={{ scale: 1.1 }}
    >
      <div className="w-7 h-7 flex items-center justify-center">
        {active && (
          <motion.div
            layoutId="activeToolHighlight"
            className="absolute inset-0 bg-black rounded-md"
            initial={false}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
        <div
          className={`relative z-10 ${active ? 'text-white' : 'text-black'}`}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}
