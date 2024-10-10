import { memo } from "react";
import { getContrastingColor } from "@/utils/getRandomColor";

type Props = {
  x: number;
  y: number;
  color: [string, string];
  name: string;
};

const Cursor = ({ x, y, color, name }: Props) => {
  const [startColor, endColor] = color;
  const textColor = getContrastingColor(endColor);

  return (
    <div
      className="absolute top-0 left-0 pointer-events-none select-none"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="relative">
        <svg
          className="absolute top-0 left-0"
          width="32"
          height="44"
          viewBox="0 0 24 36"
          fill="none"
        >
          <defs>
            <linearGradient id={`gradient-${name}`} x1="0%" y1="0%" x2="500%" y2="0%">
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>
          <path
            fill={`url(#gradient-${name})`}
            d="M0.928548 2.18278C0.619075 1.37094 1.42087 0.577818 2.2293 0.896107L14.3863 5.68247C15.2271 6.0135 15.2325 7.20148 14.3947 7.54008L9.85984 9.373C9.61167 9.47331 9.41408 9.66891 9.31127 9.91604L7.43907 14.4165C7.09186 15.2511 5.90335 15.2333 5.58136 14.3886L0.928548 2.18278Z"
          />
        </svg>
        <div
          className="absolute overflow-hidden top-4 left-4 py-1 px-2 font-medium text-sm whitespace-nowrap rounded-lg"
          style={{
            backgroundImage: `linear-gradient(to bottom right, ${startColor}, ${endColor})`,
            color: textColor,
          }}
        >
          <div className="z-10 relative">{name}</div>
        </div>
      </div>
    </div>
  );
};

export default memo(Cursor);