'use client';
import { useState, useRef, useCallback } from 'react';
import { useMutation } from '@liveblocks/react/suspense';
import { ActiveUserInfo } from '@/liveblocks.config';
import phoneIcon from '~/images/phone.svg';
import phoneSlash from '~/images/phone-slash.svg';
import headPhone from '~/images/headPhone.svg';
import microPhone from '~/images/microphone.svg';
import Image from 'next/image';
import testUserIcon from '~/images/testUserIcon.jpeg';
import useUserInfoStore from '@/hooks/useUserInfoStore';
import SendBirdCall from 'sendbird-calls';
import { useSendBirdInit } from '@/hooks/useSendBirdCalls';

interface TypeGroupCallId {
  roomId: string;
}

export default function GroupCallController(groupCallId: TypeGroupCallId) {
  const [isCalling, setIsCalling] = useState(false);
  const userInfo = useUserInfoStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  const roomParams = {
    roomType: SendBirdCall.RoomType.LARGE_ROOM_FOR_AUDIO_ONLY,
  };

  const enterParams = {
    videoEnabled: false, // 비디오 미사용
    audioEnabled: true, // 오디오만 출력
  };
  const updateRoomId = useMutation(({ storage }, roomId: string) => {
    const groupCallId = storage.get('groupCall');
    groupCallId.set('roomId', roomId);
  }, []);
  const addToActiveUsers = useMutation(({ storage }, user: ActiveUserInfo) => {
    const groupCallActiveUsers = storage.get('groupCall')!.get('activeUsers');
    groupCallActiveUsers.push(user);
  }, []);

  const exitFromActiveUsers = useMutation(({ storage }) => {
    const groupCallActiveUsers = storage.get('groupCall')!.get('activeUsers');
    const userIndex = groupCallActiveUsers.findIndex(
      (user: ActiveUserInfo) => user.id === userInfo._id,
    );
    if (userIndex !== -1) {
      groupCallActiveUsers.delete(userIndex);
    } else {
      console.log('삭제할 유저를 찾을 수 없습니다.');
    }
  }, []);

  //sendbird 초기화 및 유저 인증 과정
  const authToken = localStorage.getItem('authToken');
  const authOption = { userId: userInfo._id, accessToken: authToken! }; // Authentication options using user information
  useSendBirdInit(authOption);

  const GroupCallIn = async () => {
    // 아직 프로젝트 내에 그룹 콜이 진행되지 않은 경우, 새로운 방 생성
    if (!groupCallId.roomId) {
      SendBirdCall.createRoom(roomParams).then((room) => {
        updateRoomId(room.roomId); // 프로젝트 내 그룹 콜 ID 설정
      });
    }
    SendBirdCall.fetchRoomById(groupCallId.roomId).then((room) => {
      if (
        room.participants.filter(
          (participant) => participant.user.userId === userInfo._id,
        ).length > 0
      ) {
        console.log('이미 참여한 방입니다.');
        return;
      } else {
        room
          .enter(enterParams)
          .then(() => {
            if (!audioRef.current) return;

            room.setAudioForLargeRoom(audioRef.current); // 오디오 설정
            audioRef.current!.muted = false; // 음소거 설정

            setIsCalling(true);
            addToActiveUsers({
              name: userInfo.name,
              id: userInfo._id,
              avatar: userInfo.avatar,
              email: userInfo.email,
              enteredAt: Date.now(),
            });
          })
          .catch((error) => {
            console.error('입장 실패: ', error);
          });

        room.addEventListener('remoteParticipantEntered', (participant) => {
          console.log('다른 참가자가 입장했습니다. 참가자:', participant);
        });
      }
    });
  };
  const GroupCallOut = useCallback(() => {
    const room = SendBirdCall.getCachedRoomById(groupCallId.roomId);
    try {
      if (!room) {
        console.log('방이 존재하지 않습니다.');
        return;
      }
      room.exit();
      setIsCalling(false);
      exitFromActiveUsers();
    } catch (error) {
      console.log('방에 참여하지 않은 상태입니다.');
    }
  }, [groupCallId.roomId, exitFromActiveUsers]);

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
