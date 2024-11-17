import React from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => void;
  color: string;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ onClick, color }) => {
  return (
    <motion.button
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      onClick={onClick}
      style={{ backgroundColor: color }}
      className="px-6 py-2.5 rounded-lg flex items-center gap-2 text-white font-medium hover:brightness-110 transition-all shadow-lg mb-4"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <Save className="w-4 h-4" />
      <span>저장하기</span>
    </motion.button>
  );
};
