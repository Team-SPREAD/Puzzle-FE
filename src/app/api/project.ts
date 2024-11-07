import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface Team {
  id: string;
  name: string;
  members: string[];
}

interface Project {
  id: string;
  name: string;
  teamId: string | null;
  isFavorite: boolean;
  currentStep: number;
}

const dbPath = path.join(process.cwd(), 'db.json');
let dbData: {
  users: any[];
  teams: Team[];
  projects: Project[];
} = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const saveDb = () => fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  const { id, name, teamId, isFavorite, currentStep } = req.body;

  switch (method) {
    case 'POST': // 프로젝트 생성
      const newProject: Project = {
        id: `proj_${Date.now()}`,
        name,
        teamId: teamId || null,
        isFavorite: isFavorite || false,
        currentStep: currentStep || 0,
      };
      dbData.projects.push(newProject);
      saveDb();
      res.status(201).json(newProject);
      break;

    case 'PUT': // 프로젝트 이름 수정
      const project = dbData.projects.find(
        (project: Project) => project.id === id,
      );
      if (project) {
        project.name = name || project.name;
        saveDb();
        res.status(200).json(project);
      } else {
        res.status(404).json({ error: 'Project not found' });
      }
      break;

    case 'DELETE': // 프로젝트 삭제
      dbData.projects = dbData.projects.filter(
        (project: Project) => project.id !== id,
      );
      saveDb();
      res.status(200).json({ message: 'Project deleted successfully' });
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
