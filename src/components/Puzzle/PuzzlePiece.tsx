'use client';

interface PuzzlePieceProps {
  className?: string;
  color?: string;
  rotate?: number;
  scale?: number;
  type?: number;
  style?: React.CSSProperties;
}

const PUZZLE_PATHS = [
  "M76.7844 24.5C82.6543 23.0186 82.1504 34.2016 76.7844 32.5V39H69.447C72.0991 32.5038 61.5085 32.2936 63.9926 39H57V31.9333C62.3749 33.6349 62.8699 23.245 57 24.7264V18H76.7844V24.5Z",
  "M106.784 27.5C112.654 26.0186 112.15 37.2016 106.784 35.5V42H99.447C102.099 35.5038 91.5085 35.2936 93.9926 42H87V34.9333C92.3749 36.6349 92.8699 26.245 87 27.7264V21H106.784V27.5Z",
  "M76.7844 55.5C82.6543 54.0186 82.1504 65.2016 76.7844 63.5V70H69.447C72.0991 63.5038 61.5085 63.2936 63.9926 70H57V62.9333C62.3749 64.6349 62.8699 54.245 57 55.7264V49H76.7844V55.5Z",
  "M104.784 55.5C110.654 54.0186 110.15 65.2016 104.784 63.5V70H97.447C100.099 63.5038 89.5085 63.2936 91.9926 70H85V62.9333C90.3749 64.6349 90.8699 54.245 85 55.7264V49H104.784V55.5Z",
  "M76.7844 86.5C82.6543 85.0186 82.1504 96.2016 76.7844 94.5V101H69.447C72.0991 94.5038 61.5085 94.2936 63.9926 101H57V93.9333C62.3749 95.6349 62.8699 85.245 57 86.7264V80H76.7844V86.5Z",
  "M108.784 86.5C114.654 85.0186 114.15 96.2016 108.784 94.5V101H101.447C104.099 94.5038 93.5085 94.2936 95.9926 101H89V93.9333C94.3749 95.6349 94.8699 85.245 89 86.7264V80H108.784V86.5Z"
];

const COLORS = ['#C9CACA', '#00A0E9', '#009944', '#EA5514', '#231815'];

export function PuzzlePiece({ 
  className = "", 
  color,
  rotate = 0,
  scale = 1,
  type,
  style
}: PuzzlePieceProps) {
  const pathIndex = type ?? Math.floor(Math.random() * PUZZLE_PATHS.length);
  const fillColor = color ?? COLORS[Math.floor(Math.random() * COLORS.length)];

  const combinedStyle: React.CSSProperties = {
    transform: `rotate(${rotate}deg) scale(${scale})`,
    ...style
  };

  return (
    <svg 
      className={`absolute pointer-events-none ${className}`}
      style={combinedStyle}
      width="50" 
      height="50" 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={PUZZLE_PATHS[pathIndex]} fill={fillColor} />
    </svg>
  );
}