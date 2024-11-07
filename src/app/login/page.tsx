'use client';

import { useState } from 'react';
import useUserInfoStore from '@/store/useUserInfoStore';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      alert('ID를 입력해주세요.');
      return;
    }

    try {
      // 로그인 처리
      const response = await fetch(`/api/mock-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다.');
      }

      const userInfo = await response.json();
      setUserInfo(userInfo);

      window.localStorage.setItem('authToken', userInfo.token);

      router.push(`/dashboard/${userInfo._id}`);
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={onSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="ID를 입력해주세요."
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
