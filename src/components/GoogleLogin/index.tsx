'use client';

import Image from 'next/image';
import googleIcon from '~/images/logo/google-logo.svg';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://kim-sun-woo.com/auth/google/';
  };
  return (
    <div
      onClick={handleGoogleLogin}
      className="flex h-[4rem] w-[30rem] cursor-pointer items-center justify-center rounded-full bg-white border border-[#DCDCDC]"
    >
      <Image src={googleIcon} alt="Google Logo" width={24} height={24} />
      <span className="ml-[1rem] text-[1.6rem] font-bold text-div-text">
        Sign in with Google
      </span>
    </div>
  );
};

export default GoogleLoginButton;
