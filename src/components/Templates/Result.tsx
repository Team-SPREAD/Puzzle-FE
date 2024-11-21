'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Camera, UserInfo } from '@/lib/types';
import { useBroadcastEvent, useEventListener } from '@/liveblocks.config';
import MarkdownEditor from '../MarkdownEditor';
import '@/styles/markdown.css';
import { stepResult } from '@/app/api/canvas-axios';
// import jsPDF from 'jspdf';
// import { marked } from 'marked';

interface ResultProps {
  camera: Camera;
  boardId: string;
}

export default function Result({ camera, boardId }: ResultProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const broadcast = useBroadcastEvent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [markdown, setMarkdown] = useState<string>('# 요구사항 명세서');
  const [copied, setCopied] = useState(false);

  // Liveblocks 이벤트 수신
  useEventListener(({ event }) => {
    if (event.type === 'FINAL_MODAL') {
      setIsModalOpen(true); // FINAL_MODAL 이벤트로 모달 열기
    }
  });

  // 컴포넌트 마운트 시 결과를 가져옴
  const fetchResult = async () => {
    try {
      const liveblocksToken = localStorage.getItem('roomToken'); // Liveblocks 토큰 가져오기

      const resultResponse = await stepResult(boardId, liveblocksToken);

      if (resultResponse) {
        setMarkdown(resultResponse.data.result); // 결과 데이터를 MarkdownEditor에 설정
        console.log('결과 데이터 가져오기 성공');
      }
    } catch (error) {
      console.error('Failed to fetch result:', error);
    }
  };

  // 클립보드 복사 함수
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // PDF 내보내기 함수
  // const handleExportPDF = () => {
  //   // HTML로 변환
  //   const htmlContent = `
  //   <style>
  //   @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap');
  //     body { font-family: 'Noto Sans KR', sans-serif; }
  //     h1, h2, h3 { font-weight: bold; color: #333; }
  //     ul { padding-left: 20px; }
  //     li { margin-bottom: 8px; }
  //     img { max-width: 100%; height: auto; display: block; margin-bottom: 8px; }
  //     pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
  //   </style>
  //   ${marked.parse(markdown)}
  // `;

  //   // PDF 생성
  //   const doc = new jsPDF({
  //     orientation: 'p',
  //     unit: 'mm',
  //     format: 'a4',
  //   });

  //   // // 폰트 설정 (기본 폰트)
  //   doc.setFont('helvetica');

  //   // HTML을 PDF로 변환 (마진 설정)
  //   doc.html(htmlContent, {
  //     callback: function (doc) {
  //       console.log(doc);
  //       doc.save('puzzle_result.pdf');
  //     },
  //     x: 10,
  //     y: 10,
  //     width: 190, // A4 페이지 폭에 맞춤
  //     windowWidth: 190,
  //   });
  // };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-5 top-20 z-30"
      >
        <motion.div
          animate={{ width: isCollapsed ? '48px' : '500px' }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          className="relative bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg pointer-events-auto overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 pr-12"
              >
                {/* 단계 설명 */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full font-medium">
                      final
                    </span>
                    <h2 className="font-semibold text-white">결과 마무리</h2>
                  </div>
                  <p className="text-xs text-gray-400">
                    프로젝트 마무리를 위해 요구사항 명세성과 확인 작업을
                    진행하세요
                  </p>
                </div>

                {/* 카드 그리드 */}
                <div className="grid grid-cols-3 gap-3">
                  <div
                    className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => {
                      broadcast({ type: 'FINAL_MODAL' });
                      setIsModalOpen(true);
                      setIsCollapsed(true);
                      (() => fetchResult())();
                    }}
                  >
                    <h3 className="font-medium text-white mb-1 text-sm flex items-center gap-1">
                      <span>📝</span> 요구사항 명세서
                    </h3>
                    <p className="text-xs text-gray-400">요구사항 확인하기</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors cursor-pointer">
                    <h3 className="font-medium text-white mb-1 text-sm flex items-center gap-1">
                      <span>🔍</span> 마무리 검토
                    </h3>
                    <p className="text-xs text-gray-400">결과물을 점검하세요</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors cursor-pointer">
                    <h3 className="font-medium text-white mb-1 text-sm flex items-center gap-1">
                      <span>✅</span> 최종 확인
                    </h3>
                    <p className="text-xs text-gray-400">완료되었는지 확인</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center py-3"
              >
                <motion.div
                  className="flex flex-col items-center gap-1"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <span className="text-gray-400">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </span>
                  <span className="text-xs font-medium text-gray-400">
                    Step 9
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 접기/펼치기 버튼 - 펼쳐진 상태에서만 보임 */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCollapsed(true)}
                className="absolute right-0 top-0 h-full w-12 hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-500"
                >
                  <path
                    d="M14 4L8 10L14 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          {/* 접힌 상태에서는 전체 영역이 클릭 가능 */}
          {isCollapsed && (
            <motion.button
              onClick={() => setIsCollapsed(false)}
              className="absolute inset-0 w-full h-full"
            />
          )}
        </motion.div>
      </motion.div>
      {/* 모달 */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
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

              {/* Modal Content */}
              <div className="p-6 pt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  단계 결과
                </h2>
                {/* 버튼들 */}
                <div className="flex gap-2 mb-2">
                  {/* PDF 내보내기 버튼 */}
                  {/* <button
                    onClick={handleExportPDF}
                    className="bg-[#E20001] text-white px-3 py-1 rounded-md text-sm hover:bg-[#BD0000] transition-colors flex items-center gap-1"
                  >
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
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    PDF
                  </button> */}

                  {/* 클립보드 복사 버튼 */}
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
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          />
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
