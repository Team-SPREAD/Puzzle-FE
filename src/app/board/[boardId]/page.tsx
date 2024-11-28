'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Room from '@/components/Room';
import axiosInstance from '@/app/api/axiosInstance';
import { Loading } from '@/components/Loading';
const BoardPage = ({
  params,
}: {
  params: {
    boardId: string;
  };
}) => {
  const router = useRouter();
  const [roomToken, setRoomToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoomToken = async () => {
      try {
        const tokenKey = `roomToken:${params.boardId}`;
        let token = localStorage.getItem(tokenKey);

        if (!token) {
          // axios로 roomToken 요청
          const response = await axiosInstance.post('/api/board/token', {
            roomId: params.boardId,
          });

          token = response.data.roomToken;

          if (!token) {
            throw new Error('Token is invalid or missing');
          }

          // 로컬 스토리지에 저장
          localStorage.setItem(tokenKey, token);
        }

        setRoomToken(token);
      } catch (error) {
        console.error('Error fetching room token:', error);
        // 토큰 요청 실패 시 404로 리다이렉트
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomToken();
  }, [params.boardId, router]);

  if (loading) {
    // 로딩 중 표시
    return <Loading />;
  }

  return (
    <main className="relative h-full w-full touch-none bg-surface-canvas">
      <Room roomId={params.boardId} />
    </main>
  );
};

export default BoardPage;
