import React, { useEffect } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { useParams } from 'next/navigation';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { useColorStore } from '@/store/vote/colorStore';
import { useProcessStore } from '@/store/vote/processStore';
import { ColorState } from '@/store/vote/types';

const icons = [
  Star,
  Flag,
  Pencil,
  Star,
  Cloud,
  UserCircle,
  Users,
  FileText,
  UserPlus,
  CheckSquare,
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

  // useColorStore를 타입과 함께 사용
  const progressColor = useColorStore(
    (state: ColorState) => state.progressColor,
  );
  const setProgressColor = useColorStore(
    (state: ColorState) => state.setProgressColor,
  );

  // ProcessStore 사용
  const { getCompletedSteps, isStepAccessible, setCurrentStep } =
    useProcessStore();
  const { toast } = useToast();

  useEffect(() => {
    setProgressColor();
  }, [setProgressColor]);

  const completedSteps = boardId ? getCompletedSteps(boardId) : [];

  const handleStepClick = async (process: {
    step: number;
    title: string;
    camera: { x: number; y: number };
  }) => {
    if (!boardId) {
      toast({
        variant: 'destructive',
        title: '오류 발생',
        description: '보드 정보를 찾을 수 없습니다.',
      });
      return;
    }

    const isCompleted = completedSteps.includes(process.step);
    const isAccessible = isStepAccessible(boardId, process.step);

    if (!isCompleted && !isAccessible) {
      toast({
        variant: 'destructive',
        title: '접근할 수 없는 단계입니다',
        description: '이전 단계를 먼저 완료해주세요.',
      });
      return;
    }

    try {
      await setCurrentStep(boardId, process.step);

      if (process.step < currentStep) {
        toast({
          title: '이전 단계로 이동합니다',
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
        variant: 'destructive',
        title: '단계 이동 실패',
        description: '서버와의 통신 중 오류가 발생했습니다.',
      });
    }
  };

  return (
    <div className="flex items-center px-6 py-2">
      {processes.map((process, index) => {
        const isCompleted = completedSteps.includes(process.step);
        const isAccessible = isStepAccessible(boardId as string, process.step);
        const isCurrent = process.step === currentStep;

        return (
          <React.Fragment key={process.step}>
            {index > 0 && (
              <div className="relative w-8 mx-2">
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-200" />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: isCompleted ? '100%' : '0%',
                  }}
                  className="absolute top-1/2 -translate-y-1/2 h-[2px]"
                  style={{ backgroundColor: progressColor }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            <div className="relative group">
              {isCurrent && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 rounded-full bg-slate-400 -m-1"
                />
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={isAccessible ? { scale: 1.05 } : {}}
                      whileTap={isAccessible ? { scale: 0.95 } : {}}
                      style={
                        isCompleted
                          ? {
                              backgroundColor: progressColor,
                              color: 'white',
                            }
                          : undefined
                      }
                      className={`
                       relative w-9 h-9 rounded-full flex items-center justify-center 
                       transition-all duration-200
                       ${
                         isCompleted
                           ? 'hover:brightness-110'
                           : isCurrent
                             ? 'bg-indigo-500 text-white'
                             : isAccessible
                               ? 'bg-white text-gray-600 hover:bg-blue-500 hover:text-white'
                               : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                       }
                     `}
                      onClick={() => handleStepClick(process)}
                      disabled={!isCompleted && !isAccessible}
                    >
                      {React.createElement(icons[index], {
                        size: 16,
                        className:
                          'transform transition-transform group-hover:scale-110',
                      })}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center px-2 py-1">
                      <p className="font-medium text-sm">{process.title}</p>
                      <p className="text-xs mt-0.5">
                        {isCompleted && '✓ 완료됨'}
                        {!isCompleted && !isAccessible && '🔒 잠김'}
                        {!isCompleted && isAccessible && '👉 진행 가능'}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProcessBar;
