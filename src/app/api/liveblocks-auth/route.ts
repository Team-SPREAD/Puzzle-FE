import { Liveblocks } from '@liveblocks/node';
import { NextRequest } from 'next/server';

const API_KEY = process.env.LIVEBLOCKS_SECRET_KEY!;

const liveblocks = new Liveblocks({
  secret: API_KEY,
});

export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return new Response(noKeyWarning(), { status: 403 });
  }
  const userIndex = Math.floor(Math.random() * NAMES.length);
  const colorIndex = Math.floor(Math.random() * COLORS.length);
  const avatarIndex = Math.floor(Math.random() * AVATARS.length);

  const session = liveblocks.prepareSession(`user-${userIndex}`, {
    userInfo: {
      name: NAMES[userIndex],
      color: COLORS[colorIndex],
      avatar: AVATARS[avatarIndex],
    },
  });

  const { room } = await request.json();

  session.allow(room, session.FULL_ACCESS);

  const { status, body } = await session.authorize();

  return new Response(body, { status });
}

const NAMES = [
  '멋쟁이',
  '고양이',
  '오리',
  '고릴라',
  '오소리',
  '너구리',
  '강아지',
];

const COLORS = [
  ['#FF0099', '#FF7A00'],
  ['#002A95', '#00A0D2'],
  ['#6116FF', '#E32DD1'],
  ['#0EC4D1', '#1BCC00'],
  ['#FF00C3', '#FF3333'],
  ['#00C04D', '#00FFF0'],
  ['#5A2BBE', '#C967EC'],
  ['#46BE2B', '#67EC86'],
  ['#F49300', '#FFE600'],
  ['#F42900', '#FF9000'],
  ['#00FF94', '#0094FF'],
  ['#00FF40', '#1500FF'],
  ['#00FFEA', '#BF00FF'],
  ['#FFD600', '#BF00FF'],
  ['#484559', '#282734'],
  ['#881B9A', '#1D051E'],
];

const AVATARS = [
  'https://liveblocks.io/avatars/avatar-1.png',
  'https://liveblocks.io/avatars/avatar-2.png',
  'https://liveblocks.io/avatars/avatar-3.png',
  'https://liveblocks.io/avatars/avatar-4.png',
  'https://liveblocks.io/avatars/avatar-5.png',
];

// Just checking you have your liveblocks.io API key added, can be removed
function noKeyWarning() {
  return process.env.CODESANDBOX_SSE
    ? `Add your secret key from https://liveblocks.io/dashboard/apikeys as the \`LIVEBLOCKS_SECRET_KEY\` secret in CodeSandbox.\n` +
        `Learn more: https://github.com/liveblocks/liveblocks/tree/main/examples/nextjs-live-cursors-advanced#codesandbox.\n`
    : `Create an \`.env.local\` file and add your secret key from https://liveblocks.io/dashboard/apikeys as the \`LIVEBLOCKS_SECRET_KEY\` environment variable.\n` +
        `Learn more: https://github.com/liveblocks/liveblocks/tree/main/examples/nextjs-live-cursors-advanced#getting-started.\n`;
}
