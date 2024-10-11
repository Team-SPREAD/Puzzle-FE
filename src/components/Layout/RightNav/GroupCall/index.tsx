'use client';

import GroupCallButton from './GroupCallController';
import LiveCallUsers from './LiveCallUsers';
import Image from 'next/image';
import audioIcon from '~/images/audio.svg';

type GroupCallProps = {
  roomId: string;
};

const GroupCall = (props: GroupCallProps) => {
  return (
    <div className="flex h-fit w-full flex-col items-start ">
      <div className="flex text-sm">
        <Image src={audioIcon} alt="audioIcon" className="mr-2" />
        <p>음성 채팅</p>
      </div>
      <LiveCallUsers />
      <GroupCallButton roomId="test" />
    </div>
  );
};

export default GroupCall;
