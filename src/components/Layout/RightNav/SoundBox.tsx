'use client';
import { useRef } from 'react';
import Image from 'next/image';
import {
  useBroadcastEvent,
  useEventListener,
} from '@liveblocks/react/suspense';

interface SoundBoxProps {
  name: string;
  imgUrl: string;
  url: string;
  id: number;
}

export default function SoundBox({ url, id, name, imgUrl }: SoundBoxProps) {
  const broadcast = useBroadcastEvent();

  useEventListener(({ event }) => {
    if (event.type === 'PLAY' && event.soundId === id) {
      playAudio();
    }
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };
  return (
    <div>
      <button
        onClick={() => {
          broadcast({ type: 'PLAY', soundId: id });
          playAudio();
        }}
        className="w-[96px] h-[24px] rounded-[4px] flex-1 flex-shrink-1  bg-[#EBEBEB] flex items-center justify-center"
      >
        <Image
          src={imgUrl}
          alt={name}
          width={24}
          height={24}
          className="h-[12px] w-[14.66px]"
        />
        <p className="text-[8px]">{name}</p>
      </button>
      <audio ref={audioRef} src={url}></audio>
    </div>
  );
}
