import React  from 'react';
import ProcessBar from './ProcessBar';
import { Process } from '@/lib/types';
import { HelpCircle, Plus } from 'lucide-react';
import Avatar from '@/components/Avatar';
import Image from 'next/image';
import { useUpdateMyPresence } from '@/liveblocks.config';
import puzzleLogo from '~/images/logo/logo.svg';
import useProcessStore from '@/store/useProcessStore';
import { useParams } from 'next/navigation';


interface ProcessNavProps {
  userInfo: {
    _id: string;
    name: string;
    avatar: string;
  };
  setCamera: (position: { x: number; y: number }) => void;
  currentStep: number;
  processes: Process[];
}
const ProcessNav: React.FC<ProcessNavProps> = ({
  userInfo,
  setCamera,
  currentStep,
  processes,
}) => {
  const updateMyPresence = useUpdateMyPresence();
  const { isStepAccessible, getCompletedSteps } = useProcessStore();
  const { boardId } = useParams();

  const updateCurrentProcess = (step: number) => {
    // 이전 단계 이동을 위한 조건 수정
    const completedSteps = boardId ? getCompletedSteps(boardId as string) : [];
    const canAccess = completedSteps.includes(step) || isStepAccessible(boardId as string, step);

    if (!canAccess) return;
    
    updateMyPresence({
      currentProcess: step,
    });
  };


  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 px-4 py-3">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <span className="text-2xl font-bold">
          <Image src={puzzleLogo} alt="Logo" width={100} height={40} />
        </span>
        <ProcessBar
          processes={processes}
          currentStep={currentStep}
          setCamera={setCamera}
          updateCurrentProcess={updateCurrentProcess}
          userInfo={userInfo}
        />
        <div className="flex items-center space-x-2">
          <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
            <Plus size={20} />
          </button>
          <button className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white">
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ProcessNav;
