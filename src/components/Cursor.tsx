import { memo, useState, useEffect } from "react";
import { getContrastingColor } from "@/utils/getRandomColor";

type Props = {
  x: number;
  y: number;
  color: [string, string];
  name: string;
};

function Cursor({ x, y, color = ["", ""], name = "" }: Props) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const textColor = getContrastingColor(color[1]);

  useEffect(() => {
    setPosition({ x, y });
  }, [x, y]);

  return (
    <div
      className="pointer-events-none absolute left-0 top-0 select-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="relative">
        {/* 커서 주변 효과 */}
        <div 
          className="absolute -left-1 -top-1 opacity-40"
          style={{ animation: 'ripple 2s linear infinite' }}
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
          >
            <circle
              cx="4"
              cy="4"
              r="3"
              fill={color[0]}
            />
          </svg>
        </div>

        {/* 메인 커서 */}
        <svg
          className="absolute left-0 top-0"
          width="32"
          height="44"
          viewBox="0 0 24 36"
          fill="none"
        >
          <defs>
            <linearGradient 
              id={`gradient-${name}`} 
              x1="0%" 
              y1="0%" 
              x2="100%" 
              y2="100%"
            >
              <stop offset="0%" stopColor={color[0]} />
              <stop offset="100%" stopColor={color[1]} />
            </linearGradient>
            <filter id="cursor-shadow">
              <feDropShadow 
                dx="0" 
                dy="1" 
                stdDeviation="1" 
                floodOpacity="0.3"
              />
            </filter>
          </defs>
          <path
            fill={`url(#gradient-${name})`}
            filter="url(#cursor-shadow)"
            d="M0.928548 2.18278C0.619075 1.37094 1.42087 0.577818 2.2293 0.896107L14.3863 5.68247C15.2271 6.0135 15.2325 7.20148 14.3947 7.54008L9.85984 9.373C9.61167 9.47331 9.41408 9.66891 9.31127 9.91604L7.43907 14.4165C7.09186 15.2511 5.90335 15.2333 5.58136 14.3886L0.928548 2.18278Z"
          />
        </svg>

        {/* 이름 태그 */}
        <div
          className="absolute left-6 top-5 overflow-hidden whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${color[0]}, ${color[1]})`,
            color: textColor,
            border: '1.5px solid rgba(255,255,255,0.2)',
            transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div className="relative z-10 flex items-center gap-1.5">
            <div 
              className="h-1.5 w-1.5 rounded-full bg-white/80"
              style={{ animation: 'pulse 2s ease-in-out infinite' }}
            />
            <span>{name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 애니메이션 키프레임 스타일 추가
const styles = `
  @keyframes ripple {
    0% {
      transform: scale(1);
      opacity: 0.4;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

// 스타일 태그 생성 및 추가
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default memo(Cursor);