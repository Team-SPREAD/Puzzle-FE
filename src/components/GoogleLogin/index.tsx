'use client';

import Image from 'next/image';
import googleIcon from '~/images/logo/google-logo.svg';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://kim-sun-woo.com:3000/auth/google/';
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="group relative flex h-12 w-80 items-center justify-center rounded-lg bg-white 
                 border border-gray-200 shadow-sm transition-all duration-200 
                 hover:shadow-md hover:border-gray-300 active:scale-[0.99]"
    >
      {/* Hover Effect Background */}
      <div className="absolute inset-0 rounded-lg bg-gray-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      
      {/* Content */}
      <div className="relative flex items-center justify-center space-x-3">
        <Image 
          src={googleIcon} 
          alt="Google Logo" 
          width={18} 
          height={18}
          className="transition-transform duration-200 group-hover:scale-105" 
        />
        <span className="text-[15px] font-medium text-gray-600 transition-colors duration-200 group-hover:text-gray-800">
          Continue with Google
        </span>
      </div>
    </button>
  );
};

export default GoogleLoginButton;