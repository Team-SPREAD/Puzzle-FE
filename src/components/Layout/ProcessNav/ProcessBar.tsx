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
import { useOthers, useSelf } from '@/liveblocks.config';
import Image from 'next/image';

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

interface StepUsersProps {
  step: number;
  userInfo: {
    _id: string;
    name: string;
    avatar: string;
  };
}const StepUsers: React.FC<StepUsersProps> = ({ step, userInfo }) => {
  const others = useOthers();
  const currentUser = useSelf();
 
  const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiNFNUU3RUIiLz48Y2lyY2xlIGN4PSI4IiBjeT0iNiIgcj0iMyIgZmlsbD0iI0E0QTdBRiIvPjxwYXRoIGQ9Ik0xNSAxNlY5QzE1IDkgMTEuODY2IDExIDggMTFDNC4xMzQwMSAxMSAxIDkgMSA5VjE2SDE1WiIgZmlsbD0iI0E0QTdBRiIvPjwvc3ZnPg==";
  
  const usersInStep = others.filter(
    (user) => user.presence?.currentProcess === step
  );
  
  const isSelfInStep = currentUser?.presence?.currentProcess === step;
  const totalCount = (isSelfInStep ? 1 : 0) + usersInStep.length;

  if (!isSelfInStep && usersInStep.length === 0) return null;

  return (
    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 flex -space-x-1">
      {/* 현재 사용자가 있을 경우 첫 번째로 표시 */}
      {isSelfInStep && (
        <div className="relative">
          <div className="relative w-4 h-4 rounded-full overflow-hidden border border-white shadow-sm">
            <Image
              src={userInfo.avatar || DEFAULT_AVATAR}
              alt={userInfo.name}
              width={16}
              height={16}
              className="object-cover"
              unoptimized
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-white" />
          </div>
        </div>
      )}

      {/* 다른 사용자들 (최대 1명 또는 현재 사용자가 없는 경우 2명) */}
      {usersInStep.slice(0, isSelfInStep ? 1 : 2).map((user) => (
        <div key={user.connectionId} className="relative">
          <div className="relative w-4 h-4 rounded-full overflow-hidden border border-white shadow-sm">
            <Image
              src={user.info?.avatar || DEFAULT_AVATAR}
              alt={user.info?.name || 'Unknown user'}
              width={16}
              height={16}
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      ))}

      {/* 추가 인원이 있는 경우 +N 표시 */}
      {totalCount > (isSelfInStep ? 2 : 2) && (
        <div className="relative">
          <div className="w-4 h-4 rounded-full bg-gray-100 border border-white shadow-sm flex items-center justify-center">
            <span className="text-[8px] font-medium text-gray-600">
              +{totalCount - (isSelfInStep ? 2 : 2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

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

  const progressColor = useColorStore(
    (state: ColorState) => state.progressColor,
  );
  const setProgressColor = useColorStore(
    (state: ColorState) => state.setProgressColor,
  );

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
            {/* 연결선 */}
            {index > 0 && (
              <div className="relative w-8 mx-2">
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-200" />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  className="absolute top-1/2 -translate-y-1/2 h-[2px]"
                  style={{ backgroundColor: progressColor }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {/* 단계 버튼과 사용자 아바타들 */}
            <div className="relative group">
              <StepUsers step={process.step} userInfo={userInfo} />

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
