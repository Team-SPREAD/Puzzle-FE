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
    const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter;

    // 엔진 생성
    const engine = Engine.create();
    engineRef.current = engine;
    worldRef.current = engine.world;
    
    // 렌더러 설정
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

    // 퍼즐 조각 생성 함수
    const createPuzzlePiece = (x: number, y: number, letter: string, color: string) => {
      const scale = 1.5;
      const width = 60 * scale;
      const height = 100 * scale;

      return Bodies.rectangle(x, y, width, height, {
        render: {
          fillStyle: color,
          strokeStyle: '#fff',
          lineWidth: 2
        },
        density: 0.001,
        frictionAir: 0.01,
        restitution: 0.5,
        friction: 0.1,
        chamfer: { radius: 5 },
        label: letter
      });
    };

    // PUZZLE 문자 퍼즐 조각 생성
    const letters = 'PUZZLE'.split('');
    const colors = ['#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899'];
    const pieces = letters.map((letter, i) => {
      const x = window.innerWidth / 2 + (i - letters.length / 2) * 100;
      const y = -200 - (Math.random() * 300);
      return createPuzzlePiece(x, y, letter, colors[i % colors.length]);
    });

    // 바닥 위치를 첫 번째 섹션의 끝으로 조정
    const ground = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight - 100, // 첫 번째 섹션의 바닥
      window.innerWidth,
      60,
      { 
        isStatic: true,
        render: {
          fillStyle: 'transparent'
        }
      }
    );

    // 좌우 벽 추가
    const leftWall = Bodies.rectangle(
      0,
      window.innerHeight / 2,
      60,
      window.innerHeight,
      {
        isStatic: true,
        render: { fillStyle: 'transparent' }
      }
    );

    const rightWall = Bodies.rectangle(
      window.innerWidth,
      window.innerHeight / 2,
      60,
      window.innerHeight,
      {
        isStatic: true,
        render: { fillStyle: 'transparent' }
      }
    );

    // 마우스 컨트롤 추가
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    // 글자 렌더링
    Matter.Events.on(render, 'afterRender', () => {
      const context = render.context;
      pieces.forEach((piece) => {
        const pos = piece.position;
        const label = piece.label;
        
        context.font = 'bold 40px Arial';
        context.fillStyle = '#FFFFFF';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(label, pos.x, pos.y);
      });
    });

    // 월드에 객체 추가
    World.add(engine.world, [...pieces, ground, leftWall, rightWall, mouseConstraint]);

    // 렌더러 실행
    Render.run(render);
    Runner.run(runner, engine);

    // 리사이즈 핸들러
    const handleResize = () => {
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
      
      // 벽과 바닥 위치 업데이트
      Matter.Body.setPosition(ground, {
        x: window.innerWidth / 2,
        y: window.innerHeight - 100
      });
      Matter.Body.setPosition(leftWall, {
        x: 0,
        y: window.innerHeight / 2
      });
      Matter.Body.setPosition(rightWall, {
        x: window.innerWidth,
        y: window.innerHeight / 2
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

  // currentSection이 변경될 때 opacity 조절
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