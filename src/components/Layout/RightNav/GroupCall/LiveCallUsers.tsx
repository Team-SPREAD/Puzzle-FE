'use client';

import LiveCallUser from './LiveCallUser';
import { useStorage } from '@/liveblocks.config';

export default function LiveCallUsers() {
  const activeUsers = useStorage((root) => root.groupCall.activeUsers);
  return (
    <div className="h-32 overflow-y-auto px-1">
      {activeUsers.map((user) => (
        <LiveCallUser key={user._id} user={user} />
      ))}
    </div>
  );
}
