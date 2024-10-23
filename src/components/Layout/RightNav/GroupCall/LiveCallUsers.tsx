'use client';

import LiveCallUser from './LiveCallUser';
import { useStorage } from '@/liveblocks.config';

export default function LiveCallUsers() {
  const activeUsers = useStorage((root) => root.groupCall.activeUsers);
  return (
    <div className="w-full h-[180px] px-2">
      {activeUsers.map((user) => (
        <LiveCallUser key={user.id} user={user} />
      ))}
    </div>
  );
}
