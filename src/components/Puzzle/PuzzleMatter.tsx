'use client';

import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

interface PuzzleMatterProps {
  currentSection: number;
}

export default function PuzzleMatter({ currentSection }: PuzzleMatterProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const worldRef = useRef<Matter.World | null>(null);

  useEffect(() => {
    const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse, Body, Events } = Matter;

    const engine = Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 } // 중력 약하게 조정
    });
    engineRef.current = engine;
    worldRef.current = engine.world;
    
    const render = Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent',
      }
    });

    const runner = Runner.create();

    // 목표 위치 생성 (투명한 정적 사각형)
    const targetPositions = Array(6).fill(null).map((_, i) => {
      const x = window.innerWidth / 2 + (i - 2.5) * 100;
      const y = window.innerHeight - 200;
      
      const target = Bodies.circle(x, y, 5, {
        isStatic: true,
        render: {
          fillStyle: 'rgba(255, 255, 255, 0.2)',
        },
        label: `target_${i}`,
      });

      return target;
    });

    // 알파벳 퍼즐 조각 생성 함수
    const createPuzzlePiece = (x: number, y: number, letter: string, targetX: number, targetY: number) => {
      const piece = Bodies.circle(x, y, 40, {
        render: {
          fillStyle: 'transparent',
        },
        density: 0.001,
        frictionAir: 0.05,
        restitution: 0.3,
        friction: 0.1,
        label: letter,
        plugin: {
          targetX,
          targetY,
        }
      });

      return piece;
    };

    // PUZZLE 문자 생성
    const letters = 'PUZZLE'.split('');
    const pieces = letters.map((letter, i) => {
      const x = window.innerWidth / 2 + (i - letters.length / 2) * 100;
      const y = -200 - (Math.random() * 300);
      return createPuzzlePiece(x, y, letter, targetPositions[i].position.x, targetPositions[i].position.y);
    });

    // 바닥과 벽
    const ground = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight - 100,
      window.innerWidth,
      60,
      { 
        isStatic: true,
        render: { fillStyle: 'transparent' }
      }
    );

    const leftWall = Bodies.rectangle(0, window.innerHeight / 2, 60, window.innerHeight, {
      isStatic: true,
      render: { fillStyle: 'transparent' }
    });

    const rightWall = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 60, window.innerHeight, {
      isStatic: true,
      render: { fillStyle: 'transparent' }
    });

    // 마우스 컨트롤
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    // 자석 효과 구현
    Events.on(engine, 'beforeUpdate', () => {
      pieces.forEach((piece) => {
        const targetX = (piece as any).plugin.targetX;
        const targetY = (piece as any).plugin.targetY;
        const distance = Matter.Vector.magnitude(Matter.Vector.sub(piece.position, { x: targetX, y: targetY }));

        if (distance < 100 && !mouseConstraint.body) { // 마우스로 드래그 중이 아닐 때만
          const force = Matter.Vector.mult(
            Matter.Vector.normalise(
              Matter.Vector.sub({ x: targetX, y: targetY }, piece.position)
            ),
            0.002 * piece.mass
          );
          Body.applyForce(piece, piece.position, force);
          
          // 가까이 갔을 때 고정
          if (distance < 5) {
            Body.setPosition(piece, { x: targetX, y: targetY });
            Body.setVelocity(piece, { x: 0, y: 0 });
          }
        }
      });
    });

    // 글자 렌더링
    Events.on(render, 'afterRender', () => {
      const context = render.context;
      pieces.forEach((piece) => {
        const pos = piece.position;
        context.font = 'bold 48px Arial';
        context.fillStyle = '#4A90E2'; // 파란색 계열
        context.strokeStyle = '#2171CD'; // 테두리 색
        context.lineWidth = 2;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.strokeText(piece.label, pos.x, pos.y);
        context.fillText(piece.label, pos.x, pos.y);
      });

      // 목표 위치 표시 (가이드라인)
      targetPositions.forEach((target) => {
        const pos = target.position;
        context.beginPath();
        context.arc(pos.x, pos.y, 45, 0, 2 * Math.PI);
        context.strokeStyle = 'rgba(74, 144, 226, 0.2)';
        context.lineWidth = 2;
        context.stroke();
      });
    });

    World.add(engine.world, [
      ...pieces, 
      ...targetPositions,
      ground, 
      leftWall, 
      rightWall, 
      mouseConstraint
    ]);

    Render.run(render);
    Runner.run(runner, engine);

    const handleResize = () => {
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
      
      Matter.Body.setPosition(ground, {
        x: window.innerWidth / 2,
        y: window.innerHeight - 100
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Render.stop(render);
      Runner.stop(runner);
      render.canvas.remove();
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.style.opacity = currentSection === 0 ? '1' : '0';
      sceneRef.current.style.pointerEvents = currentSection === 0 ? 'auto' : 'none';
    }
  }, [currentSection]);

  return (
    <div 
      ref={sceneRef} 
      className="fixed inset-0 transition-opacity duration-500"
      style={{ 
        touchAction: 'none',
        pointerEvents: currentSection === 0 ? 'auto' : 'none',
      }}
    />
  );
}