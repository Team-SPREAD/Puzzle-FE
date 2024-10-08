import { NextResponse } from 'next/server'

// 간단한 사용자 데이터베이스를 모방합니다.
const mockUsers = [
  { _id: 'user1', name: '김태호', color: '#FF5733', hostingRooms: ['room1'], joinedRooms: ['room2'] },
  { _id: 'user2', name: '김대성', color: '#33FF57', hostingRooms: ['room2'], joinedRooms: ['room1'] },
  { _id: 'user3', name: '김선우', color: '#FF2233', hostingRooms: ['room2'], joinedRooms: ['room1'] },
  // 필요에 따라 더 많은 사용자를 추가할 수 있습니다.
];

export async function POST(request: Request) {
  const { userId } = await request.json()

  // 사용자 ID로 사용자를 찾습니다.
  const user = mockUsers.find(u => u._id === userId);

  if (user) {
    // 사용자를 찾았다면, 토큰을 생성하고 사용자 정보와 함께 반환합니다.
    const token = 'mock_token_' + user._id; // 실제 구현에서는 더 안전한 방식으로 토큰을 생성해야 합니다.
    return NextResponse.json({
      ...user,
      token
    })
  } else {
    // 사용자를 찾지 못했다면 에러를 반환합니다.
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
}