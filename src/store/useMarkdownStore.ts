import { create } from 'zustand';

interface MarkdownStore {
  markdown: string;
  setMarkdown: (markdown: string) => void;
}

export const useMarkdownStore = create<MarkdownStore>((set) => ({
  markdown: '# 요구사항 명세서', // 초기 값
  setMarkdown: (markdown) => set({ markdown }), // markdown 상태 업데이트
}));
