import React from 'react';
import { Process } from '@/lib/types';
import {
  Star,
  Flag,
  Pencil,
  Cloud,
  UserCircle,
  Users,
  FileText,
  UserPlus,
  CheckSquare,
} from 'lucide-react';
import Image from 'next/image';
import useProcessStore from '@/store/useProcessStore';
import { useToast } from '@/components/ui/use-toast';
import { useParams } from 'next/navigation';
import { 
  TooltipProvider, 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent,
  TooltipPortal 
} from "@/components/ui/tooltip";
import { motion } from 'framer-motion';

const icons = [
  Star, Flag, Pencil, Star, Cloud, UserCircle, Users, FileText, UserPlus, CheckSquare,
];

interface ProcessBarProps {
  processes: Process[];
  currentStep: number;
  setCamera: (position: { x: number; y: number }) => void;
  userInfo: {
    _id: string;
    name: string;
    avatar: string;
  };
  updateCurrentProcess: (step: number) => void;
}

// components/Layout/ProcessNav/ProcessBar.tsx
const ProcessBar: React.FC<ProcessBarProps> = ({
  processes,
  currentStep,
  setCamera,
  userInfo,
  updateCurrentProcess,
}) => {
  const params = useParams();
  const boardId = Array.isArray(params.boardId) 
    ? params.boardId[0] 
    : params.boardId;

  const { getCompletedSteps, isStepAccessible, setCurrentStep } = useProcessStore();
  const { toast } = useToast();
  const completedSteps = boardId ? getCompletedSteps(boardId) : [];

  const handleStepClick = async (process: { step: number; title: string; camera: { x: number; y: number } }) => {
    if (!boardId) {
      toast({
        variant: "destructive",
        title: "오류 발생",
        description: "보드 정보를 찾을 수 없습니다.",
      });
      return;
    }

    // 완료된 단계이거나 현재 접근 가능한 단계인지 확인
    const isCompleted = completedSteps.includes(process.step);
    const isAccessible = isStepAccessible(boardId, process.step);
    
    if (!isCompleted && !isAccessible) {
      toast({
        variant: "destructive",
        title: "접근할 수 없는 단계입니다",
        description: "이전 단계를 먼저 완료해주세요.",
      });
      return;
    }

    try {
      await setCurrentStep(boardId, process.step);

      // 이전 단계로 이동하는 경우
      if (process.step < currentStep) {
        toast({
          title: "이전 단계로 이동합니다",
          description: `${process.title} 단계로 이동합니다.`,
          duration: 2000,
        });
      }

      setCamera({
        x: process.camera.x,
        y: process.camera.y,
      });
      updateCurrentProcess(process.step);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "단계 이동 실패",
        description: "서버와의 통신 중 오류가 발생했습니다.",
      });
    }
  };
  return (
    <div className="flex items-center px-6 py-3">
      {processes.map((process, index) => {
        const isCompleted = completedSteps.includes(process.step);
        const isAccessible = isStepAccessible(boardId as string, process.step);
        const isCurrent = process.step === currentStep;

        return (
          <React.Fragment key={process.step}>
            {/* 단계 연결선 */}
            {index > 0 && (
              <div className="relative w-8 mx-2">
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-200" />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: isCompleted ? '100%' : '0%'
                  }}
                  className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-green-500"
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {/* 단계 버튼 그룹 */}
            <div className="relative group">
              {/* 현재 단계 아바타 */}
              {isCurrent && (
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: -24, opacity: 1 }}
                  className="absolute left-1/2 -translate-x-1/2 z-10"
                >
                  <div className="relative">
                    {/* <Image
                      src={userInfo.avatar}
                      alt={userInfo.name}
                      width={28}
                      height={28}
                      className="rounded-full border-2 border-white"
                    /> 이미지 오류 때문에 주석처리*/}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 
                      border-l-[6px] border-l-transparent 
                      border-t-[6px] border-t-white 
                      border-r-[6px] border-r-transparent"
                    />
                  </div>
                </motion.div>
              )}

              {/* 단계 버튼 */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={isAccessible ? { scale: 1.05 } : {}}
                      whileTap={isAccessible ? { scale: 0.95 } : {}}
                      className={`
                        relative w-10 h-10 rounded-full flex items-center justify-center 
                        transition-all duration-200
                        ${isCompleted
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : isCurrent
                          ? 'bg-indigo-500 text-white'  // 현재 단계 색상 변경
                          : isAccessible
                          ? 'bg-white text-gray-600 hover:bg-blue-500 hover:text-white'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                      `}
                      onClick={() => handleStepClick(process)}
                      disabled={!isCompleted && !isAccessible}
                    >
                      {React.createElement(icons[index], { 
                        size: 18,
                        className: 'transform transition-transform group-hover:scale-110' 
                      })}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center px-2 py-1">
                      <p className="font-medium text-sm">{process.title}</p>
                      <p className="text-xs mt-0.5">
                        {isCompleted && "✓ 완료됨"}
                        {!isCompleted && !isAccessible && "🔒 잠김"}
                        {!isCompleted && isAccessible && "👉 진행 가능"}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* 단계 번호 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`
                  absolute -bottom-6 left-1/2 transform -translate-x-1/2
                  text-xs font-medium
                  ${isCompleted 
                    ? 'text-green-600' 
                    : isCurrent 
                    ? 'text-indigo-600'  // 현재 단계 번호 색상도 변경
                    : 'text-gray-500'
                  }
                `}
              >
                {process.step}
              </motion.div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProcessBar;