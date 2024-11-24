import React, { useState } from "react";
import IconButton from "../IconButton";
import { motion, AnimatePresence } from 'framer-motion';
import { Color } from "@/lib/types";

type Props = {
  isActive: boolean;
  onClick: () => void;
  currentColor?: Color;
  onColorChange?: (color: Color) => void;
  onBringForward?: () => void;
  onSendBackward?: () => void;
};

export default function TextButton({ 
  isActive, 
  onClick, 
  currentColor = { r: 0, g: 0, b: 0 },
  onColorChange,
  onBringForward,
  onSendBackward 
}: Props) {
  const [showControl, setShowControl] = useState(false);

  const handleClick = () => {
    if (isActive) {
      setShowControl(!showControl);
    } else {
      onClick();
    }
  };

  const colorToHex = (color: Color) => {
    return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`;
  };

  const hexToColor = (hex: string): Color => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const colorPresets = [
    { r: 0, g: 0, b: 0 },        // Black
    { r: 255, g: 0, b: 0 },      // Red
    { r: 0, g: 255, b: 0 },      // Green
    { r: 0, g: 0, b: 255 },      // Blue
    { r: 252, g: 142, b: 42 },   // Orange
    { r: 255, g: 255, b: 0 },    // Yellow
  ];

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 't' && !e.metaKey && !e.ctrlKey) {
        onClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClick]);

  return (
    <div className="relative group">
      <IconButton isActive={isActive} onClick={handleClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="-7 -7 38 38"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" x2="15" y1="20" y2="20" />
          <line x1="12" x2="12" y1="4" y2="20" />
        </svg>
      </IconButton>

      <AnimatePresence>
        {isActive && showControl && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 0 }}
            animate={{ opacity: 1, scale: 1, x: 20 }}
            exit={{ opacity: 0, scale: 0.95, x: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-11 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-4 w-[220px] z-50 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Color Selection */}
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">텍스트 색상</span>
                <input
                  type="color"
                  value={colorToHex(currentColor)}
                  onChange={(e) => onColorChange?.(hexToColor(e.target.value))}
                  className="w-8 h-8 rounded-lg cursor-pointer"
                />
              </div>

              {/* Color Presets */}
              <div className="flex flex-wrap gap-2">
                {colorPresets.map((color, index) => (
                  <motion.button
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => onColorChange?.(color)}
                    className="w-6 h-6 rounded-full border border-gray-200 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    style={{ backgroundColor: colorToHex(color) }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Layer Controls */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 space-y-2"
            >
              <span className="text-sm font-medium text-gray-700">레이어 순서</span>
              <div className="flex gap-2">
                <button
                  onClick={onBringForward}
                  className="flex-1 px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  앞으로
                </button>
                <button
                  onClick={onSendBackward}
                  className="flex-1 px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  뒤로
                </button>
              </div>
            </motion.div>

            {/* Keyboard Shortcuts */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>텍스트 추가</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded">T</kbd>
                </div>
                <div className="flex justify-between mt-1">
                  <span>줄바꿈</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}