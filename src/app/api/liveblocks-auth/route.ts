// app/api/liveblocks-auth/route.ts
import { Liveblocks } from '@liveblocks/node';
import { NextRequest } from 'next/server';

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

const COLORS: [string, string][] = [
  ['#FF0099', '#FF7A00'], // 핑크 -> 오렌지
  ['#002A95', '#00A0D2'], // 네이비 -> 스카이블루
  ['#6116FF', '#E32DD1'], // 보라 -> 핑크
  ['#0EC4D1', '#1BCC00'], // 청록 -> 그린
  ['#FF00C3', '#FF3333'], // 마젠타 -> 레드
  ['#4A90E2', '#50E3C2'], // 블루 -> 민트
  ['#FF6B6B', '#FFE66D'], // 코랄 -> 레몬
  ['#45B7D1', '#A6FFCB'], // 터콰이즈 -> 라이트그린
  ['#614385', '#516395'], // 딥퍼플 -> 슬레이트블루
  ['#FF8008', '#FFC837'], // 오렌지 -> 골드
  ['#00C6FF', '#0072FF'], // 라이트블루 -> 블루
  ['#F857A6', '#FF5858'], // 핫핑크 -> 레드
  ['#4776E6', '#8E54E9'], // 일렉트릭블루 -> 퍼플
  ['#FFD200', '#FF9100'], // 옐로우 -> 오렌지
  ['#00B09B', '#96C93D'], // 틸 -> 라임
  ['#4B6CB7', '#182848'], // 스틸블루 -> 다크블루
  ['#FF416C', '#FF4B2B'], // 로즈 -> 선셋
  ['#8A2387', '#E94057'], // 퍼플 -> 핑크
  ['#1FA2FF', '#12D8FA'], // 오션블루 -> 아쿠아
  ['#FF928B', '#FFAC81'], // 피치 -> 살몬
];

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('No authorization header');
    }

    const token = authHeader.split(' ')[1];

    // Base64로 디코딩
    const [, payload] = token.split('.');
    const decodedData = JSON.parse(Buffer.from(payload, 'base64').toString());

    // 유저 ID 기반으로 고유한 색상 선택
    const colorIndex =
      Math.abs(
        decodedData.userId
          .split('')
          .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0),
      ) % COLORS.length;

    const session = liveblocks.prepareSession(`user-${decodedData.userId}`, {
      userInfo: {
        name: `${decodedData.firstName}${decodedData.lastName}`,
        color: COLORS[colorIndex],
        avatar: decodedData.avatar || '',
      },
    });

    session.allow('*', session.FULL_ACCESS);

    const { status, body } = await session.authorize();

    return new Response(body, {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Auth error:', error);
    return new Response(
      JSON.stringify({
        error: 'Authentication failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
