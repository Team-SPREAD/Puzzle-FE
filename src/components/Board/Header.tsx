import React from 'react';
import Image from 'next/image';


interface HeaderProps {
  projectName: string;
}

const Header: React.FC<HeaderProps> = ({ projectName }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      {/* <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Image src="/images/logo/logo.svg" alt="Logo" width={100} height={40} />
          <h1 className='ml-4'>{projectName}</h1>
        </div>
        여기에 아바타 부르고 싶어
      </div> 
      안쓰는 헤더. 241013
      */}
    </header>
  );
};

export default Header;