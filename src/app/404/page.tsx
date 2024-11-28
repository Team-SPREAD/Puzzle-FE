'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white shadow-2xl rounded-2xl p-10 text-center max-w-md w-full"
      >
        <div className="flex justify-center mb-6">
          <AlertTriangle
            size={100}
            className="text-red-500 animate-pulse"
            strokeWidth={1.5}
          />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          접근 권한 없음
        </h1>

        <p className="text-gray-600 mb-6">
          해당 보드에 접근할 수 있는 권한이 없습니다. 올바른 초대 링크나
          토큰으로 다시 시도해주세요.
        </p>

        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            메인으로 돌아가기
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
