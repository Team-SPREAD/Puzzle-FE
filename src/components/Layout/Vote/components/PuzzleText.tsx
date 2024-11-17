// components/Layout/Vote/components/PuzzleText.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface PuzzleTextProps {
  color: string;
}

export const PuzzleText: React.FC<PuzzleTextProps> = ({ color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.5,
          type: 'spring',
          stiffness: 200,
          damping: 20,
        },
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div
        style={{ color }}
        className="text-2xl font-bold tracking-wider"
      >
        PUZZLE!
      </div>
    </motion.div>
  );
};