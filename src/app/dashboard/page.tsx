'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loading } from '@/components/Loading';
const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      if (token) {
        localStorage.setItem('token', token);

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
