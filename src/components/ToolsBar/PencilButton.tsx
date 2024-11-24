import React, { useState } from 'react';
import IconButton from '../IconButton';
import { Color } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  isActive: boolean;
  onClick: () => void;
  size?: number;
  onSizeChange?: (size: number) => void;
  currentColor?: Color;
  onColorChange?: (color: Color) => void;
};

export default function PencilButton({
  isActive,
  onClick,
  size = 8,
  onSizeChange,
  currentColor = { r: 252, g: 142, b: 42 },
  onColorChange,
}: Props) {
  const [showControl, setShowControl] = useState(false);

  const handleClick = () => {
    if (isActive) {
      setShowControl(!showControl);
    } else {
      onClick();
    }
  };

  // RGB를 16진수 색상 코드로 변환
  const colorToHex = (color: Color) => {
    return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`;
  };

  // 16진수 색상 코드를 RGB로 변환
  const hexToColor = (hex: string): Color => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const colorPresets = [
    { r: 0, g: 0, b: 0 }, // Black
    { r: 255, g: 0, b: 0 }, // Red
    { r: 0, g: 255, b: 0 }, // Green
    { r: 0, g: 0, b: 255 }, // Blue
    { r: 252, g: 142, b: 42 }, // Orange
    { r: 255, g: 255, b: 0 }, // Yellow
  ];

  return (
    <div className="relative group">
      <IconButton isActive={isActive} onClick={handleClick}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path
            d="M22.8538 10.1464C22.76 10.0527 22.6329 10 22.5003 10C22.3677 10 22.2406 10.0527 22.1468 10.1464L20.4998 11.7934L24.2068 15.5004L25.8538 13.8544C25.9004 13.8079 25.9373 13.7528 25.9625 13.692C25.9877 13.6313 26.0007 13.5662 26.0007 13.5004C26.0007 13.4346 25.9877 13.3695 25.9625 13.3088C25.9373 13.248 25.9004 13.1928 25.8538 13.1464L22.8538 10.1464ZM23.4998 16.2074L19.7928 12.5004L13.2928 19.0004H13.4998C13.6324 19.0004 13.7596 19.0531 13.8534 19.1468C13.9471 19.2406 13.9998 19.3678 13.9998 19.5004V20.0004H14.4998C14.6324 20.0004 14.7596 20.0531 14.8534 20.1468C14.9471 20.2406 14.9998 20.3678 14.9998 20.5004V21.0004H15.4998C15.6324 21.0004 15.7596 21.0531 15.8534 21.1468C15.9471 21.2406 15.9998 21.3678 15.9998 21.5004V22.0004H16.4998C16.6324 22.0004 16.7596 22.0531 16.8534 22.1468C16.9471 22.2406 16.9998 22.3678 16.9998 22.5004V22.7074L23.4998 16.2074ZM16.0318 23.6754C16.0108 23.6194 15.9999 23.5602 15.9998 23.5004V23.0004H15.4998C15.3672 23.0004 15.24 22.9477 15.1463 22.8539C15.0525 22.7602 14.9998 22.633 14.9998 22.5004V22.0004H14.4998C14.3672 22.0004 14.24 21.9477 14.1463 21.8539C14.0525 21.7602 13.9998 21.633 13.9998 21.5004V21.0004H13.4998C13.3672 21.0004 13.24 20.9477 13.1463 20.8539C13.0525 20.7602 12.9998 20.633 12.9998 20.5004V20.0004H12.4998C12.44 20.0003 12.3808 19.9895 12.3248 19.9684L12.1458 20.1464C12.0982 20.1944 12.0607 20.2515 12.0358 20.3144L10.0358 25.3144C9.99944 25.4053 9.99053 25.5048 10.0102 25.6007C10.0299 25.6966 10.0772 25.7845 10.1464 25.8538C10.2157 25.923 10.3036 25.9703 10.3995 25.99C10.4954 26.0097 10.5949 26.0008 10.6858 25.9644L15.6858 23.9644C15.7487 23.9395 15.8058 23.902 15.8538 23.8544L16.0318 23.6764V23.6754Z"
            fill="currentColor"
          />
        </svg>
      </IconButton>

      {/* Control Popup with Framer Motion */}
      <AnimatePresence>
        {isActive && showControl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 0 }}
            animate={{ opacity: 1, scale: 1, x: 20 }}
            exit={{ opacity: 0, scale: 0.95, x: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-11 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-4 w-[220px] z-50 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pen Size Slider */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">크기</span>
                <span className="text-sm text-gray-500">{size}px</span>
              </div>

              <input
                type="range"
                min="1"
                max="32"
                value={size}
                onChange={(e) => onSizeChange?.(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-primary
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:transition-all
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-white
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:hover:scale-110"
              />
            </motion.div>

            {/* Color Selection */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">색상</span>
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
                    transition={{ delay: 0.2 + index * 0.05 }}
                    onClick={() => onColorChange?.(color)}
                    className="w-6 h-6 rounded-full border border-gray-200 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    style={{ backgroundColor: colorToHex(color) }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
