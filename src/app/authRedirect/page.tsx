'use client';

import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import nookies from 'nookies';
import { useRouter } from 'next/navigation';
import useUserInfoStore from '@/store/useUserStore';
import { UserInfo } from '@/lib/types';
import { Loading } from '@/components/Loading';

interface payloadType {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  userId: number;
  iat: number;
  exp: number;
}
export default function Page(props: any) {
  const router = useRouter();
  const token = props.searchParams.token;
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode<payloadType>(token);
        // 디코딩된 정보에서 userId 추출
        const userId = decodedToken.userId;

        nookies.set(props, 'token', token, {
          maxAge: 3600, // 1시간 (3600초)
          path: '/',
        });

        const userInfo: UserInfo = {
          id: `${decodedToken.userId}`,
          name: `${decodedToken.firstName + decodedToken.lastName}`,
          avatar: decodedToken.avatar,
          email: decodedToken.email,
        };

        setUserInfo(userInfo);

        // 디코딩된 정보를 로컬 스토리지에 저장하거나 상태로 관리 가능
        window.localStorage.setItem('authToken', token);

        // userId에 따라 리다이렉션
        router.push(`/dashboard/${userId}`);
      } catch (error) {
        console.error('JWT 디코딩 오류:', error);
        router.push('/');
      }
    }
  }, [router, token, setUserInfo, props]);

  return <Loading />;
}
