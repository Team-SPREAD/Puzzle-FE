'use client';

import Link from 'next/link';
import useUserInfoStore from '@/hooks/useUserInfoStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PuzzlePiece from '@/components/Puzzle/PuzzlePiece';
import GoogleLoginButton from '@/components/GoogleLogin';

const PUZZLE_TEXT = 'PUZZLE';

export default function Home() {
  const router = useRouter();
  const { _id, token } = useUserInfoStore();
  const [isClient, setIsClient] = useState(false);
  const [puzzlePieces, setPuzzlePieces] = useState<
    { letter: string; color: string }[]
  >([]);

  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem('token');
    if (storedToken && _id) {
      router.push(`/dashboard/${_id}`);
    }

    const newPieces = PUZZLE_TEXT.split('').map((letter) => ({
      letter,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }));

    setPuzzlePieces(newPieces);
  }, [_id, router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-4xl mx-auto px-4">
        <motion.div
          className="flex justify-center mb-1 h-24"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {isClient &&
            puzzlePieces.map((piece, index) => (
              <PuzzlePiece
                key={index}
                letter={piece.letter}
                color={piece.color}
                index={index}
              />
            ))}
        </motion.div>
        <motion.h1
          className="text-5xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          프로젝트 개발을 위한 가이드라인 단계 플랫폼
        </motion.h1>
        <motion.p
          className="mb-8 text-xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          다양한 아이디어를 하나로 모아 혁신적인 프로젝트를 만들어보세요. 우리의
          플랫폼은 당신의 창의성을 극대화합니다.
        </motion.p>
        {!token && (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            {/* <Link href="/login" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition duration-300 hover:scale-105">
              시작하기
            </Link> */}
            <GoogleLoginButton />
          </motion.div>
        )}
      </div>
    </main>
  );
}
