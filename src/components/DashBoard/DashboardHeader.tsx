'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Settings } from 'lucide-react';
import useModalStore from '@/store/useModalStore';
import { useDarkMode } from '@/store/useDarkModeStore';
import { getTeamMembers } from '@/app/api/dashboard-axios';
import arrowBottom from '~/images/arrow-bottom.svg';
import TeamSettingModal from './Modals/TeamSettingsModal';

interface DashboardHeaderProps {
  title: string;
  teamId: string | null;
  buttonColor: string;
  token: string;
}

interface TeamMember {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
}

export default function DashboardHeader({
  title,
  teamId,
  buttonColor,
  token,
}: DashboardHeaderProps) {
  const { modalType, openModal, closeModal } = useModalStore();
  const { isDarkMode } = useDarkMode();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isThrottled, setIsThrottled] = useState(false);

  useEffect(() => {
    if (teamId) {
      const fetchTeamMembers = async () => {
        try {
          const response = await getTeamMembers(teamId, token);
          if (response.status === 200) {
            setTeamMembers(response.data);
          }
        } catch (error) {
          console.error('Error fetching team members:', error);
          setTeamMembers([]);
        }
      };
      fetchTeamMembers();
    } else {
      setTeamMembers([]);
    }
  }, [teamId, token]);
  const handleArrowClick = () => {
    if (isThrottled) return;
    setIsThrottled(true);
    modalType === 'TEAM_SETTING' ? closeModal() : openModal('TEAM_SETTING');
    setTimeout(() => setIsThrottled(false), 1000);
  };

  return (
    <motion.div
      className={`p-6 border-b relative ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        {/* Left Section: Title and Team Members */}
        <div className="flex items-center gap-4">
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {title}
          </h1>

          {teamId && teamMembers.length > 0 && (
            <div className="flex -space-x-2">
              {teamMembers.slice(0, 4).map((member, index) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                  style={{ zIndex: teamMembers.length - index }}
                >
                  {member.avatar && member.avatar !== 'null' ? (
                    <Image
                      src={member.avatar}
                      width={32}
                      height={32}
                      alt={`${member.firstName} ${member.lastName}`}
                      className="rounded-full border-2 border-white"
                    />
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm font-medium ${
                        isDarkMode
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {member.firstName[0]}
                    </div>
                  )}
                </motion.div>
              ))}
              {teamMembers.length > 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm font-medium relative z-0 ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  +{teamMembers.length - 4}
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Settings Button */}
        {title !== '개인 대시보드' && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleArrowClick}
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Settings
                size={18}
                className={`${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                } transition-transform duration-200 ${
                  modalType === 'TEAM_SETTING' ? 'rotate-180' : ''
                }`}
              />
            </motion.button>

            <AnimatePresence>
              {modalType === 'TEAM_SETTING' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-8 -mt-6 z-50 transform-gpu"
                  style={{ minWidth: '200px' }} 
                >
                  <TeamSettingModal onClose={closeModal} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
