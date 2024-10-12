import React from 'react';
import ProcessBar from './ProcessBar';
import { Process } from "@/lib/types";
import { HelpCircle, Plus } from 'lucide-react';
import Avatar from '@/components/Avatar';

interface ProcessNavProps {
  userInfo: {
    id: string;
    name: string;
    avatar: string;
  };
  setCamera: (position: { x: number; y: number; zoom: number }) => void;
  currentStep: number;
  processes: Process[];
}

const ProcessNav: React.FC<ProcessNavProps> = ({ userInfo, setCamera, currentStep, processes }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 px-4 py-3 ">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <span className="text-2xl font-bold">
          <span className="text-blue-600">P</span>
          <span className="text-red-500">u</span>
          <span className="text-yellow-500">z</span>
          <span className="text-green-500">z</span>
          <span className="text-purple-500">l</span>
          <span className="text-pink-500">e</span>
        </span>
        <ProcessBar 
          processes={processes}
          currentStep={currentStep}
          setCamera={setCamera}
          userInfo={userInfo}
        />
        <div className="flex items-center space-x-2">
          {/* <Avatar /> */}
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