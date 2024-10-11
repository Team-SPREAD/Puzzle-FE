import { NextResponse, NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

// db.json 파일 읽기
const dbPath = path.join(process.cwd(), 'db.json')
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { userId } = await request.json() as { userId: string };

  return new Promise<NextResponse>((resolve) => {
    setTimeout(() => {
      const user = dbData.users.find((u: any) => u._id === userId);

      if (user) {
        const token = 'mock_token_' + user._id;
        const userProjects = dbData.projects.filter((p: any) => user.projects.includes(p.id));
        const userTeams = dbData.teams.filter((t: any) => user.teams.includes(t.id));

        resolve(NextResponse.json({
          ...user,
          token,
          projects: userProjects,
          teams: userTeams,
        }));
      } else {
        resolve(NextResponse.json({ error: 'User not found' }, { status: 404 }));
      }
    }, 300);
  });
}