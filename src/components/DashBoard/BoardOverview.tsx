// 'use client';

// import React from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Plus, Info } from 'lucide-react';
// import { useDarkMode } from '@/store/useDarkModeStore';
// import useModalStore from '@/store/useModalStore';
// import { BoardInfo } from '@/lib/types';
// import BoardCard from './BoardCard';
// import CreateBoardModal from './Modals/CreateBoardModal';

// interface BoardGridProps {
//   boards: BoardInfo[];
//   buttonColor: string;
//   teamId: string | null;
// }

// export default function BoardGrid({
//   boards = [],
//   buttonColor,
//   teamId,
// }: BoardGridProps) {
//   const { modalType, openModal, closeModal } = useModalStore();
//   const { isDarkMode } = useDarkMode();

//   const getBoardUrl = (boardName: string) => {
//     return `/board/${boardName.toLowerCase().replace(/ /g, '-')}`;
//   };

//   const handleNewBoardClick = () => {
//     openModal('CREATE_BOARD');
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     show: { y: 0, opacity: 1 }
//   };

//   return (
//     <motion.div 
//       variants={containerVariants}
//       initial="hidden"
//       animate="show"
//       className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-6 ${
//         isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
//       }`}
//     >
//       {teamId && (
//         <motion.div
//           variants={itemVariants}
//           className="relative aspect-[3/4]"
//         >
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={handleNewBoardClick}
//             className={`w-full h-full rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 ${
//               isDarkMode 
//                 ? 'bg-gradient-to-br from-blue-600/80 to-purple-700/80'
//                 : 'bg-gradient-to-br from-blue-500 to-purple-600'
//             } text-white group`}
//           >
//             <motion.div
//               whileHover={{ rotate: 90 }}
//               transition={{ duration: 0.3 }}
//               className="mb-4 p-3 rounded-full bg-white/10"
//             >
//               <Plus size={32} />
//             </motion.div>
//             <h3 className="text-xl font-semibold">새 보드 만들기</h3>
//             <p className="text-sm mt-2 opacity-80 text-center">
//               새로운 프로젝트를 시작해보세요
//             </p>
//           </motion.button>
//         </motion.div>
//       )}

//       {!teamId && boards.length === 0 && (
//         <motion.div
//           variants={itemVariants} 
//           className="col-span-full"
//         >
//           <div className={`rounded-xl ${
//             isDarkMode ? 'bg-gray-800' : 'bg-white'
//           } p-8 text-center shadow-lg border ${
//             isDarkMode ? 'border-gray-700' : 'border-gray-200'
//           }`}>
//             <div className="flex flex-col items-center gap-4">
//               <div className={`p-4 rounded-full ${
//                 isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
//               }`}>
//                 <Info size={32} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
//               </div>
//               <h3 className={`text-xl font-semibold ${
//                 isDarkMode ? 'text-gray-200' : 'text-gray-700'
//               }`}>
//                 아직 생성된 보드가 없습니다
//               </h3>
//               <p className={`max-w-md ${
//                 isDarkMode ? 'text-gray-400' : 'text-gray-500'
//               }`}>
//                 새로운 팀을 만들고 첫 프로젝트를 시작해보세요!
//               </p>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {boards.map((board) => (
//         <motion.div
//           key={board._id}
//           variants={itemVariants}
//         >
//           <BoardCard
//             board={board}
//             buttonColor={buttonColor}
//             TOTAL_STEPS={10}
//             getBoardUrl={getBoardUrl}
//           />
//         </motion.div>
//       ))}

//       <AnimatePresence>
//         {modalType === 'CREATE_BOARD' && (
//           <CreateBoardModal
//             isOpen={true}
//             onClose={closeModal}
//             teamId={teamId}
//           />
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }