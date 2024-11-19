'use client';

import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

interface PuzzleMatterProps {
  currentSection: number;
  isVisible: boolean;
}

interface PuzzlePaths {
  [key: string]: string;
}
export default function PuzzleMatter({
  currentSection,
  isVisible,
}: PuzzleMatterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);

  useEffect(() => {
    const {
      Engine,
      Render,
      Runner,
      World,
      Bodies,
      MouseConstraint,
      Mouse,
      Body,
      Events,
      Constraint,
    } = Matter;

    const engine = Engine.create({
      gravity: { x: 0, y: 2 }, // 중력 증가
    });
    engineRef.current = engine;

    const render = Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent',
      },
    });

    const runner = Runner.create();
    const letterSpacing = 160;
    const letters = ['P', 'U', 'Z', 'Z', 'L', 'E'];

    const titleY = window.innerHeight * 0.3;
    const totalWidth = letters.length * letterSpacing;
    const startX = (window.innerWidth - totalWidth) / 2.2;

    const puzzlePaths: PuzzlePaths = {
      P: '/images/puzzles/P.svg',
      U: '/images/puzzles/U.svg',
      Z: '/images/puzzles/Z.svg',
      L: '/images/puzzles/L.svg',
      E: '/images/puzzles/E.svg',
    };

    const ground = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight - 35,
      window.innerWidth * 2,
      120,
      { isStatic: true, render: { fillStyle: 'transparent' } },
    );

    const anchors = letters.map((_, i) => {
      return Bodies.circle(
        startX + letterSpacing * i + letterSpacing / 2,
        titleY - 50,
        5,
        { isStatic: true, render: { visible: false } },
      );
    });

    const pieces: Matter.Body[] = [];
    const constraints: (Matter.Constraint | null)[] = [];

    letters.forEach((letter, i) => {
      const randomOffset = {
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40,
      };

      const piece = Bodies.circle(
        startX + letterSpacing * i + letterSpacing / 2 + randomOffset.x,
        titleY + randomOffset.y,
        40,
        {
          render: { fillStyle: 'transparent' },
          friction: 0.1,
          frictionAir: 0.02,
          restitution: 0.3,
          label: letter,
        },
      );

      Body.setVelocity(piece, {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
      });

      const constraint = Constraint.create({
        bodyA: anchors[i],
        bodyB: piece,
        stiffness: 0.01,
        damping: 0.1,
        length: 50,
        render: { visible: false },
      });

      pieces.push(piece);
      constraints.push(constraint);
    });

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Events.on(mouseConstraint, 'startdrag', () => {
      const draggedBody = mouseConstraint.body;
      if (draggedBody) {
        const index = pieces.indexOf(draggedBody);
        if (index !== -1 && constraints[index]) {
          World.remove(engine.world, constraints[index]!);
          constraints[index] = null;
        }
      }
    });

    Events.on(render, 'afterRender', () => {
      const context = render.context;
      pieces.forEach((piece: Matter.Body) => {
        const pos = piece.position;
        const letter = piece.label as string;

        context.save();
        context.translate(pos.x - 24, pos.y - 27);
        context.scale(4.0, 4.0);

        const img = new Image();
        img.src = puzzlePaths[letter];
        if (img.complete) {
          context.drawImage(img, 0, 0);
        }

        context.restore();
      });
    });

    World.add(engine.world, [
      ground,
      ...anchors,
      ...pieces,
      ...constraints.filter((c): c is Matter.Constraint => c !== null),
      mouseConstraint,
    ]);

    Runner.run(runner, engine);
    Render.run(render);

    return () => {
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
      sceneRef.current.style.pointerEvents =
        currentSection === 0 ? 'auto' : 'none';
    }
  }, [currentSection]);

  return (
    <div
      ref={sceneRef}
      className="fixed inset-0 transition-opacity duration-500"
      style={{ touchAction: 'none' }}
    />
  );
}
