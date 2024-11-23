import Image from 'next/image';
import { ActiveUserInfo } from '@/liveblocks.config';
import { useEffect, useState } from 'react';
import { formatDuration } from '@/utils/formatDuration';

export default function LiveCallUser({ user }: { user: ActiveUserInfo }) {
  const [time, setTime] = useState(
    user.enteredAt ? user.enteredAt : Date.now(),
  );

  useEffect(() => {
    setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  }, []);

  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center">
        <Image
          src={user.avatar}
          alt="userIcon"
          width={20}
          height={20}
          className=" bg-gray-300 rounded-full mr-1"
        />
        <span className="text-sm text-gray-700">{user.name}</span>
      </div>
      <span className="text-xs text-gray-500">{formatDuration(time)}</span>
    </div>
  );
}
