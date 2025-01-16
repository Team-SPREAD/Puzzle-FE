import React from 'react';
import { useOthers, useSelf } from '../../liveblocks.config';
import Image from 'next/image';

const Avatar: React.FC = () => {
  const users = useOthers();
  const currentUser = useSelf();

  return (
    <div className="w-40 h-20 absolute right-0 z-10 flex flex-wrap justify-end">
      {currentUser && (
        <Image
          src={currentUser.info.avatar}
          alt={currentUser.info.name}
          className="w-10 h-10 rounded-full border-2 border-white"
          title={`${currentUser.info.name} (You)`}
        />
      )}
      {users.map(({ connectionId, info }) => (
        <Image
          key={connectionId}
          src={info.avatar}
          alt={info.name}
          className="w-10 h-10 rounded-full border-2 border-white -ml-2"
          title={info.name}
        />
      ))}
    </div>
  );
};

export default Avatar;
