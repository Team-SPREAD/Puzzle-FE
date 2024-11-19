'use client';

import { useEffect, useRef } from 'react';

export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    class Line {
      x: number;
      y: number;
      direction: 'horizontal' | 'vertical';
      progress: number;
      tailProgress: number;
      speed: number;
      dotSpacing: number;
      opacity: number;
      maxWidth: number;
      maxHeight: number;
      tailLength: number;
      dotSize: number;

      constructor(direction: 'horizontal' | 'vertical') {
        this.direction = direction;
        this.progress = 0;
        this.tailProgress = 0;
        this.speed = 2 + Math.random() * 2; // 속도 범위 조정
        this.dotSpacing = 20; // 도트 간격 증가
        this.opacity = 0.2 + Math.random() * 0.15; // 투명도 증가
        this.maxWidth = window.innerWidth;
        this.maxHeight = window.innerHeight;
        this.tailLength = 800; // 테일 길이 증가
        this.dotSize = 3; // 도트 크기 증가

        if (direction === 'horizontal') {
          this.x = 0;
          this.y = Math.random() * this.maxHeight;
        } else {
          this.x = Math.random() * this.maxWidth;
          this.y = 0;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        
        if (this.direction === 'horizontal') {
          for (let x = this.tailProgress; x < this.progress; x += this.dotSpacing) {
            // 페이드 인/아웃 거리 증가
            const dotOpacity = this.opacity * 
              Math.min(1, (this.progress - x) / 200) * // 앞쪽 페이드 인 거리 증가
              Math.min(1, (x - this.tailProgress) / 200); // 뒤쪽 페이드 아웃 거리 증가
            
            ctx.fillStyle = `rgba(100, 100, 100, ${dotOpacity})`; // 더 진한 회색
            ctx.beginPath();
            ctx.arc(x, this.y, this.dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          for (let y = this.tailProgress; y < this.progress; y += this.dotSpacing) {
            const dotOpacity = this.opacity * 
              Math.min(1, (this.progress - y) / 200) *
              Math.min(1, (y - this.tailProgress) / 200);
            
            ctx.fillStyle = `rgba(100, 100, 100, ${dotOpacity})`;
            ctx.beginPath();
            ctx.arc(this.x, y, this.dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      update(): boolean {
        this.progress += this.speed;
        
        // 테일 시작 위치 업데이트 - 더 천천히 사라지도록 조정
        if (this.progress > this.tailLength) {
          this.tailProgress = this.progress - this.tailLength;
        }

        const maxDistance = this.direction === 'horizontal' ? this.maxWidth + this.tailLength : this.maxHeight + this.tailLength;
        
        return this.tailProgress < maxDistance;
      }
    }

    let lines: Line[] = [];
    const maxLines = 30;
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (lines.length < maxLines && Math.random() < 0.05) {
        lines.push(new Line(Math.random() < 0.5 ? 'horizontal' : 'vertical'));
      }

      lines = lines.filter(line => {
        line.draw(ctx);
        return line.update();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-50" // opacity 증가
    />
  );
}