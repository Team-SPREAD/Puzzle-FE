import React from 'react';
import { motion } from 'framer-motion';

interface PuzzlePieceProps {
  isVoted: boolean;
  color: string;
  onClick: () => void;
  disabled: boolean;
  shouldMerge?: boolean;
  index: number;
  totalUsers: number;
}

export const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  isVoted,
  color,
  onClick,
  disabled,
  shouldMerge = false,
  index,
  totalUsers,
}) => {
  const centerOffset = (totalUsers - 1) / 2;
  const xOffset = shouldMerge ? 0 : (index - centerOffset) * 35;

  return (
    <div className="relative">
      <motion.svg
        width="25"
        height="21"
        viewBox="0 0 25 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`cursor-pointer transition-transform ${
          disabled ? 'cursor-not-allowed' : ''
        }`}
        onClick={onClick}
        whileHover={disabled ? undefined : { scale: 1.1 }}
        animate={{
          x: xOffset,
          scale: shouldMerge ? 0.6 : 1,
          opacity: shouldMerge ? 0 : 1,
          transition: {
            x: {
              duration: 0.8,
              ease: 'easeInOut',
              delay: index * 0.15,
            },
            scale: {
              duration: 0.6,
              delay: 0.6 + index * 0.15,
            },
            opacity: {
              duration: 0.6,
              delay: 0.6 + index * 0.15,
            },
          },
        }}
        initial={{ scale: 0.9, opacity: 0 }}
      >
        <path
          d="M20.5 6.5C26.3699 5.01859 25.866 16.2016 20.5 14.5V21H13.1626C15.8147 14.5038 5.2241 14.2936 7.7082 21H0.715588V13.9333C6.09044 15.6349 6.58549 5.24499 0.715588 6.7264V0H20.5V6.5Z"
          fill={isVoted ? color : '#C9CACA'}
          className="transition-colors duration-300"
        />
      </motion.svg>
    </div>
  );
};
