import React from 'react'
import { motion } from 'framer-motion'

interface PuzzlePieceProps {
  letter: string;
  color: string;
  index: number;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ letter, color, index }) => {
  return (
    <motion.div 
      style={{
        width: '60px',
        height: '60px',
        backgroundColor: color,
        borderRadius: '15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        margin: '0 5px',
      }}
      initial={{ opacity: 0, y: -50, rotate: 180 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        rotate: 0
      }}
      transition={{ 
        duration: 1,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100
      }}
    >
      {letter}
    </motion.div>
  )
}

export default PuzzlePiece