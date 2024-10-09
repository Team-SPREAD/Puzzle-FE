import { NextResponse } from 'next/server'

// 프로젝트 데이터를 모방합니다.
const mockProjects = [
  { id: 'proj1', name: 'Spread A', teamId: 'Spread', isFavorite: true },
  { id: 'proj2', name: 'Dopamain B', teamId: 'Dopamain', isFavorite: false },
  { id: 'proj3', name: 'Personal Project 1', teamId: null, isFavorite: true },
  { id: 'proj4', name: 'RentIt C', teamId: 'RentIt', isFavorite: false },
  { id: 'proj5', name: 'Personal Project 2', teamId: null, isFavorite: false },
];

// 팀 데이터를 모방합니다.
const mockTeams = [
  { id: 'Spread', name: 'Spread Team', members: ['user1', 'user2', 'user3'] },
  { id: 'Dopamain', name: 'Dopamain Team', members: ['user1', 'user2'] },
  { id: 'RentIt', name: 'RentIt Team', members: ['user1', 'user3'] },
];

// 사용자 데이터베이스를 모방합니다.
const mockUsers = [
  { 
    _id: 'user1', 
    name: '김태호', 
    email: 'taeho.kim@example.com',
    color: '#FF5733', 
    hostingRooms: ['room1'], 
    joinedRooms: ['room2'],
    teams: ['Spread', 'Dopamain', 'RentIt'],
    projects: ['proj1', 'proj2', 'proj3', 'proj4', 'proj5'],
  },
  { 
    _id: 'user2', 
    name: '김대성', 
    email: 'daesung.kim@example.com',
    color: '#33FF57', 
    hostingRooms: ['room2'], 
    joinedRooms: ['room1'],
    teams: ['Spread', 'Dopamain'],
    projects: ['proj1', 'proj2'],
  },
  { 
    _id: 'user3', 
    name: '김선우', 
    email: 'sunwoo.kim@example.com',
    color: '#FF2233', 
    hostingRooms: ['room3'], 
    joinedRooms: ['room1'],
    teams: ['Spread', 'RentIt'],
    projects: ['proj1', 'proj4'],
  },
];

export async function POST(request: Request) {
  const { userId } = await request.json()

  // 비동기 처리를 모방하기 위해 setTimeout을 사용합니다.
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u._id === userId);

      if (user) {
        // 사용자를 찾았다면, 토큰을 생성하고 사용자 정보와 함께 반환합니다.
        const token = 'mock_token_' + user._id; // 실제 구현에서는 더 안전한 방식으로 토큰을 생성해야 합니다.
        
        // 사용자의 프로젝트와 팀 정보를 가져옵니다.
        const userProjects = mockProjects.filter(p => user.projects.includes(p.id));
        const userTeams = mockTeams.filter(t => user.teams.includes(t.id));

        resolve(NextResponse.json({
          ...user,
          token,
          projects: userProjects,
          teams: userTeams,
        }));
      } else {
        // 사용자를 찾지 못했다면 에러를 반환합니다.
        resolve(NextResponse.json({ error: 'User not found' }, { status: 404 }));
      }
    }, 300); // 300ms의 지연을 추가하여 실제 API 호출을 모방합니다.
  });
}