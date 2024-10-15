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
    <div className="flex my-2 items-center justify-between">
      <div className="flex items-center">
        <Image
          src={user.avatar}
          alt="userIcon"
          width={24}
          height={24}
          className="w-6 h-6 bg-gray-300 rounded-full mr-1"
        />
        <span className="text-base font-semibold text-div-text mr-3">
          {user.name}
        </span>
      </div>
      <div className=" flex  items-center justify-end">
        <span className="text-base font-normal text-time text-[#989898]">
          {formatDuration(time)}
        </span>
      </div>
    </div>
  );
}
