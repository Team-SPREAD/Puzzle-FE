import React, { useEffect } from 'react';
import { Process } from '@/lib/types';
import { HelpCircle, Plus } from 'lucide-react';
import Image from 'next/image';
import { useUpdateMyPresence } from '@/liveblocks.config';
import puzzleLogo from '~/images/logo/logo.svg';
import { useProcessStore } from '@/store/vote/processStore';
import { useParams, useRouter } from 'next/navigation';
import useModalStore from '@/store/useModalStore';
import ProcessBar from './ProcessBar';

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
  const { openModal } = useModalStore();
  const updateMyPresence = useUpdateMyPresence();
  const { isStepAccessible, getCompletedSteps } = useProcessStore();
  const { boardId } = useParams();
  const router = useRouter();




  useEffect(() => {
    openModal('GUIDE_MODAL');
  }, [openModal]);

  const updateCurrentProcess = (step: number) => {
    const completedSteps = boardId ? getCompletedSteps(boardId as string) : [];
    const canAccess = completedSteps.includes(step) || isStepAccessible(boardId as string, step);
    if (!canAccess) return;
    updateMyPresence({ currentProcess: step });
  };


  useEffect(() => {
    
    openModal('GUIDE_MODAL');
  }, [openModal]);
  
  const handleGuideClick = () => {
    
    openModal('GUIDE_MODAL');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 px-4 py-3">
    <div className="max-w-[1400px] mx-auto flex items-center justify-between">
      <div className="flex-1"> {/* 왼쪽 정렬을 위한 컨테이너 */}
        <span
          className="text-2xl font-bold cursor-pointer"
          onClick={() => router.back()}
        >
          <Image src={puzzleLogo} alt="Logo" width={100} height={40} />
        </span>
      </div>
      
      <ProcessBar
        processes={processes}
        currentStep={currentStep}
        setCamera={setCamera}
        updateCurrentProcess={updateCurrentProcess}
        userInfo={userInfo}
      />
      
      <div className="flex-1 flex justify-end"> {/* 오른쪽 정렬을 위한 컨테이너 */}
        <button 
          className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white"
          onClick={handleGuideClick}
        >
          <HelpCircle size={20} />
        </button>
      </div>
    </div>
  </nav>
  );
};

export default ProcessNav;