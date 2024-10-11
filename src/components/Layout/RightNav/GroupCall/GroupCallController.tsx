'use client';
import { useState, useRef } from 'react';
import { useMutation } from '@liveblocks/react/suspense';
import { ActiveUserInfo } from '@/liveblocks.config';
import phoneIcon from '~/images/phone.svg';
import phoneSlash from '~/images/phone-slash.svg';
import headPhone from '~/images/headPhone.svg';
import microPhone from '~/images/microphone.svg';
import Image from 'next/image';
import testUserIcon from '~/images/testUserIcon.jpeg';
import useUserInfoStore from '@/store/useUserInfoStore';

export default function GroupCallController() {
  const [isCalling, setIsCalling] = useState(true);
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const audioRef = useRef<HTMLAudioElement>(null);

  const addToActiveUsers = useMutation(({ storage }, user: ActiveUserInfo) => {
    const groupCallActiveUsers = storage.get('groupCall').get('activeUsers');
    groupCallActiveUsers.push(user);
  }, []);

  const exitFromActiveUsers = useMutation(({ storage }) => {
    const groupCallActiveUsers = storage.get('groupCall').get('activeUsers');

    groupCallActiveUsers.delete(
      groupCallActiveUsers.findIndex(
        (user: ActiveUserInfo) => user.id === userInfo.id,
      ),
    );
  }, []);

  const GroupCallIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      setIsCalling(true);
    }
  };
  const GroupCallOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      setIsCalling(false);
    }
  };

  return (
    <div className="flex w-full h-8 items-center justify-center px-1 rounded-[4px] border border-[#E9E9E9]">
      <audio ref={audioRef} autoPlay />
      <div className="flex w-full justify-between">
        <div className="flex">
          <Image
            src={testUserIcon}
            alt="userIcon"
            className="w-6 h-6 bg-gray-300 rounded-full mr-1"
          />
          <div className="">{'김대성'}</div>
        </div>
        {isCalling ? (
          <div className="flex ">
            <div className="flex mr-3">
              <button className="mx-1">
                <Image src={microPhone} alt="phoneIcon" />
              </button>
              <button className="mx-1">
                <Image src={headPhone} alt="headPhone" />
              </button>
            </div>
            <button onClick={GroupCallOut}>
              <Image src={phoneSlash} alt="phoneSlash" />
            </button>
          </div>
        ) : (
          <button onClick={GroupCallIn}>
            <Image src={phoneIcon} alt="phoneIcon" />
          </button>
        )}
      </div>
    </div>
  );
}
