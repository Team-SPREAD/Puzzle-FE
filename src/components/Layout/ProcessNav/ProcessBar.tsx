import React from 'react';
import { Process } from "@/lib/types";
import { Star, Flag, Pencil, Cloud, UserCircle, Users, FileText } from 'lucide-react';

const icons = [Star, Flag, Pencil, Star, Cloud, UserCircle, Users, FileText];

interface ProcessBarProps {
  processes: Process[];
  currentStep: number;
  setCamera: (position: { x: number; y: number; zoom: number }) => void;
  userInfo: {
    id: string;
    name: string;
    avatar: string;
  };
}

const ProcessBar: React.FC<ProcessBarProps> = ({ processes, currentStep, setCamera, userInfo }) => {
  return (
    <div className="flex items-center">
      {processes.map((process, index) => (
        <React.Fragment key={process.step}>
          {index > 0 && <div className="w-4 h-[1px] bg-gray-300 mx-1" />}
          <div className="relative group">
            {process.step === currentStep && (
              <img
                src={userInfo.avatar}
                alt={userInfo.name}
                className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-2 border-white"
              />
            )}
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center ${process.step <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                } transition-colors duration-200 hover:bg-blue-600`}
              onClick={() => setCamera({ x: process.camera.x, y: process.camera.y, zoom: 1 })}
              title={process.title}
            >
              {React.createElement(icons[index], { size: 20 })}
            </button>
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs whitespace-nowrap bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {process.title}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProcessBar;