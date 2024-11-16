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
    <div className="flex items-center">
      {processes.map((process, index) => {
        // 각 단계의 상태 확인
        const isCompleted = completedSteps.includes(process.step);
        const isAccessible = isStepAccessible(boardId as string, process.step);
        const isCurrent = process.step === currentStep;

        return (
          <React.Fragment key={process.step}>
            {index > 0 && <div className="w-4 h-[1px] bg-gray-300 mx-1" />}
            <div className="relative group">
              {isCurrent && (
                <Image
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-2 border-white"
                />
              )}
              <button
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                  ${
                    isCompleted
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : isCurrent
                      ? 'bg-blue-500 text-white'
                      : isAccessible
                      ? 'bg-gray-200 text-gray-600 hover:bg-blue-600 hover:text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                onClick={() => handleStepClick(process)}
                disabled={!isCompleted && !isAccessible}
                title={process.title}
              >
                {React.createElement(icons[index], { size: 20 })}
              </button>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {process.title}
                  {isCompleted && " (완료됨)"}
                  {!isCompleted && !isAccessible && " (잠김)"}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProcessBar;