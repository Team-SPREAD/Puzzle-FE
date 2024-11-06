import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface PayloadType {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  userId: number;
  iat: number;
  exp: number;
}

// 미들웨어 함수
export function middleware(req: NextRequest) {
  // NextRequest에서 쿠키 수동으로 가져오기
  const cookie = req.headers.get('cookie') || '';
  const cookies = cookie.split(';').reduce(
    (acc, current) => {
      const [name, value] = current.trim().split('=');
      acc[name] = value;
      return acc;
    },
    {} as Record<string, string>,
  );

  const token = cookies['token'];

  if (!token) {
    // 토큰이 없을 경우 리다이렉트
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 토큰 검증 추가 (옵션)
  try {
    const decoded = jwtDecode<PayloadType>(token);

    // req.url에서 userId 추출하기 (/dashboard/123)
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const userIdFromUrl = pathSegments[2]; // /dashboard/[userId]에서 [userId] 추출

    if (decoded.userId.toString() !== userIdFromUrl) {
      console.log('URL의 ID와 토큰의 userId가 일치하지 않음');
      return NextResponse.redirect(new URL('/', req.url));
    }

    // 토큰의 만료 시간 검증
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.log('토큰 만료됨');
      return NextResponse.redirect(new URL('/', req.url));
    }
  } catch (error) {
    console.error('JWT 디코딩 에러:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 토큰이 유효할 경우 계속 진행
  return NextResponse.next();
}

// 적용할 경로 설정
export const config = {
  matcher: ['/dashboarddddd/:path*'], // /dashboard 하위 모든 경로에 대해 미들웨어 적용
};
