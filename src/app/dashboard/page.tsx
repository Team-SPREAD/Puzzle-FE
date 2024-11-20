'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loading } from '@/components/Loading';
import { setCookie } from 'nookies';
const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      if (token) {
        //로컬에 엑세스 토큰 저장
        localStorage.setItem('token', token);
        //쿠키에 엑세스 토큰 저장
        setCookie(null, 'accessToken', token, {
          maxAge: 3600, // 1시간
          path: '/',
        });
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.userId;

          if (userId) {
            router.push(`/dashboard/${userId}`);
          }
        } catch (error) {
          console.error('JWT 파싱 중 오류 발생:', error);
        }
      }
    }
  }, [router]);

  return <Loading />;
};

export default Dashboard;
