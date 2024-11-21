import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Menu, X, LogOut, Settings, User } from 'lucide-react';
import useModalStore from '@/store/useModalStore';
import { useDarkMode } from '@/store/useDarkModeStore';

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  avatar: string | null;
  token: string;
}

interface HeaderProps {
  isDashboardPersonal: boolean;
  buttonColor: string;
  userInfo: UserInfo;
  onSearch: (searchTerm: string) => void;
}

export default function Header({
  isDashboardPersonal,
  buttonColor,
  userInfo,
  onSearch,
}: HeaderProps) {
  const { openModal } = useModalStore();
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { isDarkMode } = useDarkMode();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    exit: { 
      opacity: 0, 
      y: -5,
      transition: {
        duration: 0.2,
        ease: 'easeIn'
      }
    }
  };

  return (
    <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
      <div className="max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <Link href="/" className="flex items-center">
              <div className="relative w-32 h-8">
                <Image
                  src="/images/logo/logo.svg"
                  alt="logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </motion.div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                placeholder="프로젝트 검색..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode ? 'focus:ring-gray-500' : 'focus:ring-gray-200'
                }`}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`md:hidden p-2 rounded-full ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => setShowSearch(!showSearch)}
            >
              {showSearch ? <X size={20} /> : <Search size={20} />}
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-full hover:bg-gray-100"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} className={isDarkMode ? 'text-white' : 'text-gray-600'} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`absolute right-0 mt-2 w-80 ${
                      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } rounded-lg shadow-lg py-2 border`}
                  >
                    <div className={`px-4 py-2 border-b ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>알림</h3>
                    </div>
                    <div className="px-4 py-4 text-center text-gray-500">
                      새로운 알림이 없습니다
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Invite Button */}
            {!isDashboardPersonal && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openModal('INVITE_TEAM')}
                className="hidden sm:flex px-4 py-2 rounded-lg text-white font-medium transition-colors"
                style={{ backgroundColor: buttonColor }}
              >
                + 멤버 초대
              </motion.button>
            )}

            {/* User Menu */}
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <Image
                  src={userInfo.avatar || '/images/testUserIcon.jpeg'}
                  alt={userInfo.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className={`hidden md:block font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                  {userInfo.name}
                </span>
              </motion.button>
              
              {/* User Dropdown Menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`absolute right-0 mt-2 w-72 ${
                      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } rounded-lg shadow-lg py-1 border`}
                  >
                    <div className={`px-4 py-3 border-b ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <Image
                          src={userInfo.avatar || '/images/testUserIcon.jpeg'}
                          alt={userInfo.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userInfo.name}</p>
                          <p className="text-sm text-gray-500 truncate w-48">{userInfo.email}</p>
                        </div>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ backgroundColor: isDarkMode ? '#374151' : '#F3F4F6' }}
                      className={`w-full px-4 py-2 text-left flex items-center space-x-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <User size={16} />
                      <span>프로필</span>
                    </motion.button>
                    <motion.button 
                      whileHover={{ backgroundColor: isDarkMode ? '#374151' : '#F3F4F6' }}
                      className={`w-full px-4 py-2 text-left flex items-center space-x-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <Settings size={16} />
                      <span>설정</span>
                    </motion.button>
                    <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <motion.button 
                        whileHover={{ backgroundColor: isDarkMode ? '#374151' : '#F3F4F6' }}
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left flex items-center space-x-2 text-red-600"
                      >
                        <LogOut size={16} />
                        <span>로그아웃</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Search - Expandable */}
        <AnimatePresence>
          {showSearch && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden px-4 pb-4"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="프로젝트 검색..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200'
                  } border focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isDarkMode ? 'focus:ring-gray-500' : 'focus:ring-gray-200'
                  }`}
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}