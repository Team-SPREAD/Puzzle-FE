'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Settings, LogOut, Moon, Sun, FileText, HardDrive } from 'lucide-react';
import useModalStore from '@/store/useModalStore';
import { useDarkMode } from '@/store/useDarkModeStore';

// Image imports
import star from '~/images/star.svg';
import projects from '~/images/projects.svg';
import house from '~/images/house.svg';
import arrowBottom from '~/images/arrow-bottom.svg';

// Component imports
import UserSelectModal from './Modals/UserSelectModal';
import { generateRandomColor } from '@/utils/getRandomColor';

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  avatar: string | null;
  token: string;
}

interface NavItemProps {
  isExpanded: boolean;
  icon: string | React.ComponentType<any> | any;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isDarkMode: boolean;
  showChildren?: boolean;
  closeOnClick?: boolean;
  setIsExpanded?: (value: boolean) => void;
  href?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  isExpanded,
  icon: Icon,
  label,
  isActive,
  onClick,
  isDarkMode,
  showChildren,
  closeOnClick,
  setIsExpanded,
  href,
}) => {
  const handleClick = () => {
    if (href) {
      window.open(href, '_blank');
      return;
    }

    if (
      (label === 'Teams' || label === 'Settings') &&
      !isExpanded &&
      setIsExpanded
    ) {
      setIsExpanded(true);
    }
    onClick();
    if (closeOnClick && setIsExpanded) {
      setIsExpanded(false);
    }
  };

  return (
    <motion.div
      whileHover={{ x: 10 }}
      className={`p-3 rounded-lg cursor-pointer flex items-center ${
        isActive
          ? isDarkMode
            ? 'bg-gray-700 text-white'
            : 'bg-blue-50 text-blue-600'
          : isDarkMode
            ? 'text-gray-300 hover:bg-gray-700'
            : 'text-gray-600 hover:bg-gray-100'
      }`}
      onClick={handleClick}
    >
      <div
        className={`w-10 h-10 rounded-lg ${
          isActive
            ? isDarkMode
              ? 'bg-gray-600'
              : 'bg-blue-100'
            : 'bg-gray-100'
        } flex items-center justify-center`}
      >
        {typeof Icon === 'object' && Icon.src ? (
          <Image
            src={Icon.src}
            width={20}
            height={20}
            alt={label.toLowerCase()}
          />
        ) : (
          Icon && typeof Icon === 'function' && <Icon size={20} />
        )}
      </div>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="ml-3 flex-1 flex items-center justify-between"
        >
          <span>{label}</span>
          {showChildren && (
            <motion.div
              animate={{ rotate: showChildren ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Image src={arrowBottom} width={12} height={12} alt="expand" />
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

interface SidebarProps {
  selectedTeamId: string | null;
  setSelectedTeamId: (teamId: string | null) => void;
  buttonColor: string;
  teams: { _id: string; teamName: string }[];
  userInfo: UserInfo;
  boardView: 'MyBoards' | 'FavoriteBoards';
  setBoardView: (view: 'MyBoards' | 'FavoriteBoards') => void;
  favoriteProjects: { id: string; name: string; isFavorite: boolean }[];
}

export default function Sidebar({
  selectedTeamId,
  setSelectedTeamId,
  buttonColor,
  teams,
  userInfo,
  boardView,
  setBoardView,
  favoriteProjects,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [teamInitialColors, setTeamInitialColors] = useState<{
    [key: string]: string;
  }>({});
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { openModal, closeModal, modalType } = useModalStore();

  useEffect(() => {
    const colors = teams.reduce(
      (acc, team) => {
        acc[team._id] = generateRandomColor();
        return acc;
      },
      {} as { [key: string]: string },
    );
    setTeamInitialColors(colors);
  }, [teams]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleTeamSelect = (teamId: string | null) => {
    setSelectedTeamId(teamId);
    setBoardView('MyBoards');
    closeModal();
    setIsExpanded(false);
  };

  const handleSidebarToggle = () => {
    if (isExpanded) {
      // 사이드바가 닫힐 때 모든 드롭다운 닫기
      closeModal();
    }
    setIsExpanded(!isExpanded);
  };
  return (
    <div className="relative h-screen">
      <motion.div
        initial={{ width: '64px' }}
        animate={{ width: isExpanded ? '280px' : '80px' }}
        className={`fixed left-0 h-screen shadow-lg z-40 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSidebarToggle}
          className="fixed left-[58px] top-6 w-6 h-6 rounded-full text-white flex items-center justify-center z-50"
          animate={{ left: isExpanded ? '268px' : '70px' }}
          style={{ backgroundColor: buttonColor }}
        >
          {isExpanded ? '←' : '→'}
        </motion.button>
  
        <div className="h-full pt-16 flex flex-col">
          <nav className={`px-4 flex-1 flex flex-col ${
            isExpanded ? 'overflow-y-auto' : 'overflow-visible'
          }`}>
            {/* Main Navigation */}
            <div className="flex-1 space-y-2">
              <NavItem
                isExpanded={isExpanded}
                icon={projects}
                label="Home"
                isActive={boardView === 'MyBoards'}
                onClick={() => {
                  setBoardView('MyBoards');
                  setSelectedTeamId(null);
                }}
                isDarkMode={isDarkMode}
                closeOnClick={true}
                setIsExpanded={setIsExpanded}
              />
  
              <NavItem
                isExpanded={isExpanded}
                icon={star}
                label="Favorites"
                isActive={boardView === 'FavoriteBoards'}
                onClick={() => {
                  setBoardView('FavoriteBoards');
                  setSelectedTeamId(null);
                }}
                isDarkMode={isDarkMode}
                closeOnClick={true}
                setIsExpanded={setIsExpanded}
              />
  
              <div>
                <NavItem
                  isExpanded={isExpanded}
                  icon={house}
                  label="Teams"
                  isActive={modalType === 'DROPDOWN_TEAM_SELECT'}
                  onClick={() => {
                    if (!isExpanded) {
                      setIsExpanded(true);
                    }
                    modalType === 'DROPDOWN_TEAM_SELECT'
                      ? closeModal()
                      : openModal('DROPDOWN_TEAM_SELECT');
                  }}
                  isDarkMode={isDarkMode}
                  showChildren={modalType === 'DROPDOWN_TEAM_SELECT'}
                  closeOnClick={false}
                  setIsExpanded={setIsExpanded}
                />
                {modalType === 'DROPDOWN_TEAM_SELECT' && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="ml-4 mt-2 space-y-1"
                    >
                      {teams.map((team) => (
                        <motion.button
                          key={team._id}
                          whileHover={{ x: 10 }}
                          onClick={() => handleTeamSelect(team._id)}
                          className={`w-full p-2 rounded-lg flex items-center space-x-2 ${
                            selectedTeamId === team._id
                              ? isDarkMode
                                ? 'bg-gray-700 text-white'
                                : 'bg-blue-50 text-blue-600'
                              : isDarkMode
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: teamInitialColors[team._id] }}
                          >
                            {team.teamName[0].toUpperCase()}
                          </div>
                          <span>{team.teamName}</span>
                        </motion.button>
                      ))}
                      <motion.button
                        whileHover={{ x: 10 }}
                        onClick={() => openModal('CREATE_TEAM')}
                        className={`w-full p-2 text-left rounded-lg ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        } hover:bg-gray-100`}
                      >
                        + Create Team
                      </motion.button>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
  
              <div>
                <NavItem
                  isExpanded={isExpanded}
                  icon={Settings}
                  label="Settings"
                  isActive={modalType === 'SETTINGS'}
                  onClick={() => {
                    if (!isExpanded) {
                      setIsExpanded(true);
                    }
                    modalType === 'SETTINGS' ? closeModal() : openModal('SETTINGS');
                  }}
                  isDarkMode={isDarkMode}
                  showChildren={modalType === 'SETTINGS'}
                  closeOnClick={false}
                  setIsExpanded={setIsExpanded}
                />
                {modalType === 'SETTINGS' && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="ml-4 mt-2 space-y-1"
                    >
                      <motion.button
                        whileHover={{ x: 10 }}
                        onClick={() => {
                          toggleDarkMode();
                          closeModal();
                          setIsExpanded(false);
                        }}
                        className={`w-full p-2 rounded-lg flex items-center space-x-2 ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                        </div>
                        <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                      </motion.button>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
  
            {/* Bottom Navigation */}
            <div className="pt-2 pb-4 space-y-2 border-t mt-auto">
              <NavItem
                isExpanded={isExpanded}
                icon={FileText}
                label="Notion"
                isActive={false}
                onClick={() => {}}
                isDarkMode={isDarkMode}
                href="https://www.notion.so"
              />
  
              <NavItem
                isExpanded={isExpanded}
                icon={HardDrive}
                label="Google Drive"
                isActive={false}
                onClick={() => {}}
                isDarkMode={isDarkMode}
                href="https://drive.google.com"
              />
  
              <NavItem
                isExpanded={isExpanded}
                icon={LogOut}
                label="Logout"
                isActive={false}
                onClick={handleLogout}
                isDarkMode={isDarkMode}
              />
            </div>
          </nav>
        </div>
  
        {modalType === 'USER_SELECT' && <UserSelectModal email={userInfo.email} />}
      </motion.div>
    </div>
  );
}
