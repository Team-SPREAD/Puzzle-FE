'use client';

import { Headset } from 'lucide-react';
import { useStorage } from '@/liveblocks.config';
import GroupCallButton from './GroupCallController';
import LiveCallUsers from './LiveCallUsers';

type GroupCallProps = {
  roomId: string;
};

const GroupCall = (props: GroupCallProps) => {
  const activeUsers = useStorage((root) => root.groupCall.activeUsers);

  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
      <div className="flex flex-col">
        <div className="flex items-center mb-1">
          <Headset size={16} className="mr-2 text-gray-500" />
          <span className="text-xs text-gray-600">
            참가자 {activeUsers.length}명
          </span>
        </div>

        <div className="w-full space-y-4 mt-2">
          <LiveCallUsers />
          <GroupCallButton roomId={props.roomId} />
        </div>
      </div>
    </div>
  );
};

export default GroupCall;
