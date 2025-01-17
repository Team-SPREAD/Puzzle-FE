import { getSvgPathFromStroke } from '@/lib/utils';
import getStroke from 'perfect-freehand';

interface PathProps {
  x: number;
  y: number;
  points: number[][];
  fill: string;
  onPointerDown?: (e: React.PointerEvent) => void;
  stroke?: string;
  strokeOptions?: {
    size: number;
    thinning: number;
    smoothing: number;
    streamline: number;
  };
}

export default function Path({
  x,
  y,
  onPointerDown,
  stroke,
  fill,
  points,
  strokeOptions = {
    size: 8,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  },
}: PathProps) {
  return (
    <path
      onPointerDown={onPointerDown}
      d={getSvgPathFromStroke(getStroke(points, strokeOptions))}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      x={0}
      y={0}
      fill={fill}
      stroke={stroke}
      strokeWidth={1}
    />
  );
}
