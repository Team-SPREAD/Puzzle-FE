import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { userId } = await request.json() as { userId: string };

  const user = mockUsers.find(u => u._id === userId);

  if (user) {
    const token = 'mock_token_' + user._id;
    const userProjects = mockProjects.filter(p => user.projects.includes(p.id));
    const userTeams = mockTeams.filter(t => user.teams.includes(t.id));

    return NextResponse.json({
      ...user,
      token,
      projects: userProjects,
      teams: userTeams,
    });
  } else {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}