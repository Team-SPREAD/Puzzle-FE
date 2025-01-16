import { useState } from 'react';
import { useMarkdownStore } from '@/store/useMarkdownStore';
import MarkdownEditor from '../Canvas/MarkdownEditor';

interface ModalContentProps {
  onClose: () => void;
}

export default function ModalContent({ onClose }: ModalContentProps) {
  const { markdown, setMarkdown } = useMarkdownStore();
  const [copied, setCopied] = useState(false);

  // 클립보드 복사 함수
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="p-6 pt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">단계 결과</h2>
      <div className="flex gap-2 mb-2">
        <button
          onClick={handleCopyMarkdown}
          className={`text-white px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-1 ${
            copied
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {copied ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              복사됨
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              복사
            </>
          )}
        </button>
      </div>
      <MarkdownEditor
        value={markdown}
        onChange={(value) => setMarkdown(value || '')}
        height={500}
        placeholder="요구사항을 입력하세요..."
        className="markdown-editor"
      />
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-800 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}
