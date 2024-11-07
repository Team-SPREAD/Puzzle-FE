import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface Team {
  id: string;
  name: string;
  members: string[];
}

const dbPath = path.join(process.cwd(), 'db.json');
let dbData: {
  users: any[];
  teams: Team[];
  projects: any[];
} = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const saveDb = () => fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  const { id, name, members } = req.body;

  switch (method) {
    case 'POST': // 팀 생성
      const newTeam: Team = {
        id: `team_${Date.now()}`,
        name,
        members: members || [],
      };
      dbData.teams.push(newTeam);
      saveDb();
      res.status(201).json(newTeam);
      break;

    case 'PUT': // 팀 이름 수정
      const team = dbData.teams.find((team: Team) => team.id === id);
      if (team) {
        team.name = name || team.name;
        saveDb();
        res.status(200).json(team);
      } else {
        res.status(404).json({ error: 'Team not found' });
      }
      break;

    case 'DELETE': // 팀 삭제
      dbData.teams = dbData.teams.filter((team: Team) => team.id !== id);
      saveDb();
      res.status(200).json({ message: 'Team deleted successfully' });
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
