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

const icons = [
  Star, // 1단계: 아이스브레이킹
  Flag, // 2단계: 비전 설정
  Pencil, // 3단계: 주제 선정
  Star, // 4단계: 스프레드
  Cloud, // 5단계: 토론하기
  UserCircle, // 6단계: 페르소나
  Users, // 7단계: 문제해결
  FileText, // 8단계: 사용자 스토리
  UserPlus, // 9단계: 역할분담
  CheckSquare, // 10단계: 마무리
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
  return (
    <div className="flex items-center">
      {processes.map((process, index) => (
        <React.Fragment key={process.step}>
          {index > 0 && <div className="w-4 h-[1px] bg-gray-300 mx-1" />}
          <div className="relative group">
            {process.step === currentStep && (
              <Image
                src={userInfo.avatar}
                alt={userInfo.name}
                className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-2 border-white"
              />
            )}
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                process.step <= currentStep
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              } transition-colors duration-200 hover:bg-blue-600`}
              onClick={() => {
                setCamera({
                  x: process.camera.x,
                  y: process.camera.y,
                });
                updateCurrentProcess(process.step);
              }}
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
