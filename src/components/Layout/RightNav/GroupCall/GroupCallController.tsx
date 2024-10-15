'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@liveblocks/react/suspense';
import { ActiveUserInfo } from '@/liveblocks.config';
import phoneIcon from '~/images/phone.svg';
import phoneSlash from '~/images/phone-slash.svg';
import headPhone from '~/images/headPhone.svg';
import microPhone from '~/images/microphone.svg';
import Image from 'next/image';
import testUserIcon from '~/images/testUserIcon.jpeg';
import useUserInfoStore from '@/hooks/useUserInfoStore';
import SendBirdCall, { Room } from 'sendbird-calls';
import { useSendBirdInit } from '@/hooks/useSendBirdCalls';
import { LiveObject, LiveList } from '@liveblocks/client';
import { addActiveUser, removeActiveUser } from '@/utils/activeUserUtils';

export default function GroupCallController() {
  const userInfo = useUserInfoStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isCalling, setIsCalling] = useState(false);

  const roomParams = {
    roomType: SendBirdCall.RoomType.LARGE_ROOM_FOR_AUDIO_ONLY,
  };

  const enterParams = {
    videoEnabled: false, // 비디오 미사용
    audioEnabled: true, // 오디오만 출력
  };

  //sendbird 초기화 및 유저 인증 과정
  const authToken = localStorage.getItem('authToken');
  const authOption = { userId: userInfo._id, accessToken: authToken! };
  useSendBirdInit(authOption);

  //필요시 사용
  // const updateRoomId = useMutation(({ storage }, roomId: string) => {
  //   const groupCallId = storage.get('groupCall') as
  //     | LiveObject<{ roomId: string; activeUsers: LiveList<ActiveUserInfo> }>
  //     | undefined;
  //   if (!groupCallId) {
  //     console.error('groupCall 객체를 찾을 수 없습니다.');
  //     return;
  //   }
  //   groupCallId.set('roomId', roomId);
  // }, []);

  //그룹에 참가한 유저를 liveblocks storage에 추가
  const addToActiveUsers = useMutation(({ storage }, user: ActiveUserInfo) => {
    const groupCall = storage.get('groupCall') as
      | LiveObject<{ roomId: string; activeUsers: LiveList<ActiveUserInfo> }>
      | undefined;
    if (!groupCall) {
      console.error('groupCall 객체를 찾을 수 없습니다.');
      return;
    }
    addActiveUser(groupCall, user);
  }, []);
  //그룹에서 나간 유저를 liveblocks storage에 제거
  const exitFromActiveUsers = useMutation(({ storage }) => {
    const groupCall = storage.get('groupCall') as
      | LiveObject<{ roomId: string; activeUsers: LiveList<ActiveUserInfo> }>
      | undefined;
    if (!groupCall) {
      console.error('groupCall 객체를 찾을 수 없습니다.');
      return;
    }
    removeActiveUser(groupCall, userInfo._id);
  }, []);

  //GroupCall에 참가하는 함수
  const GroupCallIn = useMutation(async ({ storage }) => {
    const groupCall = storage.get('groupCall') as
      | LiveObject<{ roomId: string; activeUsers: LiveList<ActiveUserInfo> }>
      | undefined;

    if (!groupCall) {
      console.error('groupCall 객체가 존재하지 않습니다.');
      return;
    }

    const roomId = groupCall.get('roomId'); // 스토리지에서 roomId 가져오기

    // roomId가 없을 경우 방 생성
    if (!roomId) {
      try {
        const createNewRoom = async () => {
          const room = await SendBirdCall.createRoom(roomParams);
          console.log('방 생성 성공:', room);

          // 방 생성 후 roomId를 업데이트
          groupCall.set('roomId', room.roomId);

          // 방 입장
          const fetchedRoom = await SendBirdCall.fetchRoomById(room.roomId);
          await enterRoom(fetchedRoom);
        };

        createNewRoom();
      } catch (error) {
        console.error('방 생성 실패: ', error);
      }
    } else {
      // roomId가 이미 있을 경우 방 입장
      try {
        const room = SendBirdCall.getCachedRoomById(roomId);

        if (!room) {
          const fetchedRoom = await SendBirdCall.fetchRoomById(roomId);
          await enterRoom(fetchedRoom);
        } else {
          await enterRoom(room);
        }
      } catch (error) {
        console.error('방 입장 실패: ', error);
      }
    }
  }, []);

  const enterRoom = async (room: Room) => {
    try {
      if (
        room.participants.filter(
          (participant) => participant.user.userId === userInfo._id,
        ).length > 0
      ) {
        console.log('이미 참여한 방입니다.');
        setIsCalling(true);
        return;
      }

      await room.enter(enterParams);
      if (!audioRef.current) return;

      room.setAudioForLargeRoom(audioRef.current);
      audioRef.current!.muted = false;

      setIsCalling(true);

      addToActiveUsers({
        name: userInfo.name,
        id: userInfo._id,
        avatar: userInfo.avatar,
        email: userInfo.email,
        enteredAt: Date.now(),
      });
    } catch (error) {
      console.error('입장 실패: ', error);
    }
  };

  const GroupCallOut = useMutation(
    ({ storage }) => {
      const groupCall = storage.get('groupCall') as
        | LiveObject<{ roomId: string; activeUsers: LiveList<ActiveUserInfo> }>
        | undefined;

      if (!groupCall) {
        console.log('groupCall 객체가 존재하지 않습니다.');
        return;
      }

      const roomId = groupCall.get('roomId'); // 스토리지에서 roomId 가져오기
      const room = SendBirdCall.getCachedRoomById(roomId); // 수정된 부분

      try {
        if (!roomId) {
          console.log('방이 존재하지 않습니다.');
          return;
        }
        room.exit();
        setIsCalling(false);
        exitFromActiveUsers();
      } catch (error) {
        console.log('방에 참여하지 않은 상태입니다.');
        setIsCalling(false);
      }
    },
    [exitFromActiveUsers],
  );

  // 브라우저가 닫히거나 페이지가 떠날 때 유저를 ActiveUser에서 제거
  useEffect(() => {
    const handleBeforeUnload = () => {
      exitFromActiveUsers();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [exitFromActiveUsers]);

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
          <div className="">{userInfo.name}</div>
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
