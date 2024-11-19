'use client';

interface DoodleProps {
  className?: string;
}

export function Doodle({ className = '' }: DoodleProps) {
  return (
    <div className={`absolute w-full h-full pointer-events-none ${className}`}>
      {/* 기본 도형들 */}
      <svg
        className="absolute top-10 left-10 opacity-10"
        width="200"
        height="200"
        viewBox="0 0 200 200"
      >
        <path
          d="M20,50 Q40,20 60,50 T100,50"
          stroke="#2c2c2c"
          fill="none"
          strokeWidth="2"
        />
        <circle
          cx="150"
          cy="50"
          r="20"
          stroke="#2c2c2c"
          fill="none"
          strokeWidth="2"
        />
      </svg>
      
      {/* 지그재그 패턴 */}
      <svg
        className="absolute top-20 right-20 opacity-15"
        width="300"
        height="150"
        viewBox="0 0 300 150"
      >
        <path
          d="M10,10 L50,50 L90,10 L130,50 L170,10 L210,50"
          stroke="#2c2c2c"
          strokeWidth="4"
          fill="none"
        />
      </svg>

      {/* 굵은 원형 패턴 */}
      <svg
        className="absolute bottom-40 left-20 opacity-20"
        width="250"
        height="250"
        viewBox="0 0 250 250"
      >
        <circle
          cx="125"
          cy="125"
          r="60"
          stroke="#2c2c2c"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="125"
          cy="125"
          r="40"
          stroke="#2c2c2c"
          strokeWidth="3"
          fill="none"
        />
      </svg>

      {/* 불규칙한 곡선 */}
      <svg
        className="absolute top-1/3 right-40 opacity-15"
        width="400"
        height="200"
        viewBox="0 0 400 200"
      >
        <path
          d="M10,100 C50,30 90,150 130,70 S200,150 250,50 S350,150 390,100"
          stroke="#2c2c2c"
          strokeWidth="3"
          fill="none"
        />
      </svg>

      {/* 점선 패턴 */}
      <svg
        className="absolute bottom-20 right-30 opacity-10"
        width="300"
        height="100"
        viewBox="0 0 300 100"
      >
        <path
          d="M10,50 L290,50"
          stroke="#2c2c2c"
          strokeWidth="4"
          strokeDasharray="10,10"
          fill="none"
        />
      </svg>

      {/* 스케치 스타일 사각형들 */}
      <svg
        className="absolute top-1/2 left-40 opacity-20"
        width="200"
        height="200"
        viewBox="0 0 200 200"
      >
        <path
          d="M50,50 L150,50 L150,150 L50,150 Z"
          stroke="#2c2c2c"
          strokeWidth="5"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ strokeDasharray: "1,5" }}
        />
      </svg>

      {/* 불규칙한 별 모양 */}
      <svg
        className="absolute bottom-1/3 right-1/4 opacity-15"
        width="150"
        height="150"
        viewBox="0 0 150 150"
      >
        <path
          d="M75,10 L90,60 L140,60 L100,90 L120,140 L75,110 L30,140 L50,90 L10,60 L60,60 Z"
          stroke="#2c2c2c"
          strokeWidth="3"
          fill="none"
        />
      </svg>

      {/* 나선형 패턴 */}
      <svg
        className="absolute top-1/4 left-1/3 opacity-10"
        width="200"
        height="200"
        viewBox="0 0 200 200"
      >
        <path
          d="M100,100 m0,0 c30,0 50,20 50,50 s-20,50 -50,50 s-50,-20 -50,-50 s20,-50 50,-50"
          stroke="#2c2c2c"
          strokeWidth="4"
          fill="none"
        />
      </svg>

      {/* 굵은 교차선 */}
      <svg
        className="absolute top-2/3 right-1/3 opacity-20"
        width="150"
        height="150"
        viewBox="0 0 150 150"
      >
        <line
          x1="0"
          y1="0"
          x2="150"
          y2="150"
          stroke="#2c2c2c"
          strokeWidth="6"
        />
        <line
          x1="150"
          y1="0"
          x2="0"
          y2="150"
          stroke="#2c2c2c"
          strokeWidth="6"
        />
      </svg>

      {/* 동심원 패턴 */}
      <svg
        className="absolute bottom-10 left-1/4 opacity-15"
        width="300"
        height="300"
        viewBox="0 0 300 300"
      >
        <circle cx="150" cy="150" r="100" stroke="#2c2c2c" strokeWidth="1" fill="none" />
        <circle cx="150" cy="150" r="80" stroke="#2c2c2c" strokeWidth="2" fill="none" />
        <circle cx="150" cy="150" r="60" stroke="#2c2c2c" strokeWidth="3" fill="none" />
        <circle cx="150" cy="150" r="40" stroke="#2c2c2c" strokeWidth="4" fill="none" />
      </svg>

      {/* 불규칙한 다각형 */}
      <svg
        className="absolute top-1/3 left-2/3 opacity-20"
        width="200"
        height="200"
        viewBox="0 0 200 200"
      >
        <path
          d="M20,50 L60,20 L120,40 L180,30 L160,90 L180,150 L120,160 L60,140 L30,160 Z"
          stroke="#2c2c2c"
          strokeWidth="5"
          fill="none"
        />
      </svg>
    </div>
  );
}