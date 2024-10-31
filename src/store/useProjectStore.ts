import { ProjectInfo } from '@/lib/types';
import { create } from 'zustand';

export type ProjectStoreType = {
  projects: ProjectInfo[];
  setProjectsInfo: (projects: ProjectInfo[]) => void;
};

const useProjectStore = create<ProjectStoreType>((set) => ({
  projects: [],
  setProjectsInfo: (projects) => set({ projects }),
}));

export default useProjectStore;
