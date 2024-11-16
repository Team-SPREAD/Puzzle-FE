import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Camera } from '@/lib/types';
import { useMutation, useStorage, useSelf } from '@/liveblocks.config';
import { LiveObject } from '@liveblocks/client';
import useProcessStore from '@/store/useProcessStore';
import { useParams } from 'next/navigation';
// import { toast } from '@/components/ui/use-toast';

interface IceBreakingAreaProps {
 camera: Camera;
}

export default function IceBreakingArea({ camera }: IceBreakingAreaProps) {
 const [showGameModal, setShowGameModal] = useState(false);
 const [showHostModal, setShowHostModal] = useState(false);
 const [isCollapsed, setIsCollapsed] = useState(false);
 
 const params = useParams();
 const boardId = Array.isArray(params.boardId) ? params.boardId[0] : params.boardId;
 const storage = useStorage((root) => ({
   host: root.host
 }));
 const self = useSelf();
 const isHost = storage?.host?.userId === self?.id;

 const setHost = useMutation(({ storage }) => {
   if (boardId && self.id) {
     storage.set('host', new LiveObject({ userId: self.id }));
     useProcessStore.getState().setHost(boardId, self.id);
    //  toast({
    //    title: "호스트로 설정되었습니다",
    //    description: "이제 단계 진행을 관리할 수 있습니다."
    //  });
     console.log('Host set to:', self.id);
   }
 }, [self.id, boardId]);

 const handleHostButtonClick = () => {
   setHost();
   setShowHostModal(false);
 };

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
         className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-lg pointer-events-auto overflow-hidden"
       >
         <AnimatePresence mode="wait">
           {!isCollapsed ? (
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="p-4 pr-12"
             >
               <div className="mb-4">
                 <div className="flex items-center gap-2 mb-1">
                   <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full font-medium">
                     Step 1
                   </span>
                   <h2 className="font-semibold text-gray-800">
                     아이스브레이킹
                   </h2>
                 </div>
                 <p className="text-xs text-gray-500">
                   팀원들과 함께 자유롭게 자신을 표현하며 서로를 알아가는
                   시간을 가져보세요
                 </p>
               </div>

               <div className="grid grid-cols-3 gap-3">
                 <div
                   className="bg-blue-50 rounded-lg p-3 hover:bg-blue-100 transition-colors cursor-pointer"
                   onClick={() => setShowHostModal(true)}
                 >
                   <h3 className="font-medium text-blue-800 mb-1 text-sm flex items-center gap-1">
                     <span>👑</span> 호스트 되기
                   </h3>
                   <p className="text-xs text-blue-600">팀 리더 되기</p>
                 </div>
                 <div className="bg-purple-50 rounded-lg p-3 hover:bg-purple-100 transition-colors cursor-pointer">
                   <h3 className="font-medium text-purple-800 mb-1 text-sm flex items-center gap-1">
                     <span>✍️</span> 텍스트
                   </h3>
                   <p className="text-xs text-purple-600">글로 표현하기</p>
                 </div>
                 <div
                   className="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors cursor-pointer"
                   onClick={() => setShowGameModal(true)}
                 >
                   <h3 className="font-medium text-green-800 mb-1 text-sm flex items-center gap-1">
                     <span>🎮</span> 게임
                   </h3>
                   <p className="text-xs text-green-600">함께 즐기기</p>
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
                <div className="flex flex-col items-center gap-1">
                  <span className="text-orange-500">
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
                  <span className="text-xs font-medium text-orange-600">
                    Step 1
                  </span>
                </div>
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
                className="absolute right-0 top-0 h-full w-12 hover:bg-gray-100/50 transition-colors flex items-center justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.2 }} // hover 시 아이콘 크기 증가
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }} // 부드러운 스프링 효과
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-400"
                  >
                    <path
                      d="M14 4L8 10L14 16" // 화살표 방향을 왼쪽으로 변경
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              </motion.button>
            )}
          </AnimatePresence>

          {isCollapsed && (
           <motion.button
             onClick={() => setIsCollapsed(false)}
             className="absolute inset-0 w-full h-full"
           />
         )}
       </motion.div>
     </motion.div>

     {/* 호스트 상태 표시 */}
     <div className="absolute right-5 top-24 bg-white/90 p-4 rounded-lg shadow-lg z-30">
       <div className="text-sm font-medium">
         {isHost ? (
           <div className="flex items-center gap-2 text-green-600">
             <span>👑</span>
             <span>호스트</span>
           </div>
         ) : (
           <div className="flex items-center gap-2 text-gray-600">
             <span>팀원</span>
           </div>
         )}
       </div>
     </div>

     {/* 호스트 설정 모달 */}
     {showHostModal && (
       <div className="fixed inset-0 z-[9999] flex items-center justify-center">
         <div
           className="absolute inset-0 bg-black/20 backdrop-blur-sm"
           onClick={() => setShowHostModal(false)}
         />
         <motion.div
           initial={{ scale: 0.95, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="relative bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4"
           onClick={(e) => e.stopPropagation()}
         >
           <div className="space-y-6">
             <h2 className="text-xl font-bold">호스트 되기</h2>
             <p className="text-sm text-gray-600">
               호스트가 되면 팀을 이끌고 단계 진행을 관리할 수 있습니다.
             </p>
             <button
               onClick={handleHostButtonClick}
               className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
             >
               호스트 되기
             </button>
             <button
               onClick={() => setShowHostModal(false)}
               className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
             >
               취소
             </button>
           </div>
         </motion.div>
       </div>
     )}

     {/* 게임 모달 */}
     {showGameModal && (
       <DrawingGame onClose={() => setShowGameModal(false)} />
     )}
   </>
 );
}

function DrawingGame({ onClose }: { onClose: () => void }) {
  const drawingPrompts = [
    {
      topic: '나의 취미',
      description: '자신의 취미를 간단한 그림으로 표현해보세요!',
      hints: ['운동', '요리', '게임', '독서', '음악'],
    },
    {
      topic: '나의 장점',
      description: '자신의 가장 큰 장점을 상징하는 것을 그려보세요!',
      hints: ['성실함', '창의력', '리더십', '친화력', '꼼꼼함'],
    },
    {
      topic: '최근 관심사',
      description: '요즘 가장 관심있는 것을 그림으로 표현해보세요!',
      hints: ['새로운 기술', '자기계발', '취미', '학습', '프로젝트'],
    },
    {
      topic: '미래의 목표',
      description: '이루고 싶은 목표를 상징적으로 그려보세요!',
      hints: ['커리어', '기술', '자기발전', '팀워크', '도전'],
    },
  ];

  const [currentPrompt, setCurrentPrompt] = useState(
    () => drawingPrompts[Math.floor(Math.random() * drawingPrompts.length)],
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">🎨 그림으로 표현하기</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-blue-800">{currentPrompt.topic}</h3>
        <p className="text-blue-700">{currentPrompt.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {currentPrompt.hints.map((hint, index) => (
            <span
              key={index}
              className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded"
            >
              {hint}
            </span>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>❗ 팁: 펜 툴을 사용해서 자유롭게 그려보세요!</p>
        <p>👥 팀원들과 함께 그림을 맞춰보세요</p>
      </div>

      <button
        onClick={() =>
          setCurrentPrompt(
            drawingPrompts[Math.floor(Math.random() * drawingPrompts.length)],
          )
        }
        className="w-full py-2 px-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
      >
        다음 주제 보기
      </button>
    </div>
  );
}
