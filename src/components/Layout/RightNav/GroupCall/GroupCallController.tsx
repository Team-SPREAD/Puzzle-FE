'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@liveblocks/react/suspense';
import { ActiveUserInfo } from '@/liveblocks.config';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import useUserStore from '@/store/useUserStore';
import SendBirdCall, { Room } from 'sendbird-calls';
import { useSendBirdInit } from '@/hooks/useSendBirdCalls';
import { LiveObject, LiveList } from '@liveblocks/client';
import { addActiveUser, removeActiveUser } from '@/utils/activeUserUtils';

interface TypeGroupCallId {
  roomId: string;
}

export default function GroupCallController(groupCallId: TypeGroupCallId) {
  const userInfo = useUserStore((state) => state.userInfo);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const roomParams = {
    roomType: SendBirdCall.RoomType.LARGE_ROOM_FOR_AUDIO_ONLY,
  };

  const enterParams = {
    videoEnabled: false, // 비디오 미사용
    audioEnabled: true, // 오디오만 출력
  };

  //sendbird 초기화 및 유저 인증 과정
  const authOption = { userId: userInfo._id, accessToken: userInfo.token };
  useSendBirdInit(authOption);

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
        _id: userInfo._id,
        name: userInfo.name,
        avatar: userInfo.avatar,
        email: userInfo.email,
        token: userInfo.token,
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

  const toggleMute = () => {
    const room = SendBirdCall.getCachedRoomById(groupCallId.roomId) as
      | Room
      | undefined;

    if (!room) {
      console.error('방 정보를 찾을 수 없습니다.');
      return;
    }

    if (isMuted) {
      try {
        room.localParticipant.unmuteMicrophone();
        setIsMuted(false);
      } catch (error) {
        console.error('오디오 활성화 실패: ', error);
      }
    } else {
      try {
        room.localParticipant.muteMicrophone();
        setIsMuted(true);
      } catch (error) {
        console.error('오디오 비활성화 실패: ', error);
      }
    }
  };

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
    <div className="flex gap2">
      <audio ref={audioRef} autoPlay />
      {isCalling && (
        <button
          onClick={toggleMute}
          className={`
            w-1/2 h-8 flex items-center justify-center 
            rounded-lg transition-all duration-300 mr-3
            ${
              isMuted
                ? 'bg-gray-500 hover:bg-gray-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
          `}
        >
          {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
      )}
      <button
        onClick={isCalling ? GroupCallOut : GroupCallIn}
        className={`
          w-full h-8 flex items-center justify-center 
          rounded-lg transition-all duration-300 
          ${
            isCalling
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }
        `}
      >
        {isCalling ? <PhoneOff size={16} /> : <Phone size={16} />}
      </button>
    </div>
  );
}
