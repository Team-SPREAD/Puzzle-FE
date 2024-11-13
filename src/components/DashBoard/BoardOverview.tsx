'use client';
import BoardGrid from '@/components/DashBoard/BoardGrid';
import Image from 'next/image';
import { useState } from 'react';
import useModalStore from '@/store/useModalStore';
import arrowBottom from '~/images/arrow-bottom.svg';
import TeamSettingModal from '@/components/DashBoard/Modal/TeamSettingsModal';

interface BoardOverviewProps {
  dashboardTitle: string;
  filteredProjects: any[];
  buttonColor: string;
}

export default function BoardOverview({
  dashboardTitle,
  filteredProjects,
  buttonColor,
}: BoardOverviewProps) {
  const { modalType, openModal, closeModal } = useModalStore();
  const [isThrottled, setIsThrottled] = useState(false);

  const handleArrowClick = () => {
    if (isThrottled) return;
    setIsThrottled(true);

    modalType === 'TEAM_SETTING' ? closeModal() : openModal('TEAM_SETTING');

    setTimeout(() => {
      setIsThrottled(false);
    }, 1000);
  };

  return (
    <div className="flex flex-grow flex-col p-5">
      <div className="flex items-center mb-5 relative">
        <h1 className="text-[32px] font-bold">{dashboardTitle}</h1>

        {!(dashboardTitle === '개인 대시보드') && (
          <div className="ml-5 relative">
            <div
              className="w-[20px] h-[20px] rounded-full bg-[#EDEDED] flex justify-center items-center cursor-pointer"
              onClick={handleArrowClick}
            >
              <Image
                src={arrowBottom}
                width={12}
                height={7}
                alt="arrowBottom"
              />
            </div>

            {/* 팀 세팅 모달창 */}
            {modalType === 'TEAM_SETTING' && (
              <TeamSettingModal onClose={closeModal} />
            )}
          </div>
        )}
      </div>
      <BoardGrid boards={filteredProjects} buttonColor={buttonColor} />
    </div>
  );
}
