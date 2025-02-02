'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { useBroadcastEvent, useEventListener } from '@/liveblocks.config';

interface SoundBoxProps {
  name: string;
  imgUrl: string;
  url: string;
  id: number;
}

export default function SoundBlock({ url, id, name, imgUrl }: SoundBoxProps) {
  const broadcast = useBroadcastEvent();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEventListener(({ event }) => {
    if (event.type === 'PLAY' && event.soundId === id) {
      playAudio();
    }
  });

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-purple-100 opacity-0 group-hover:opacity-50 rounded-lg transition-all duration-300 blur-sm"></div>
      <button
        onClick={() => {
          broadcast({ type: 'PLAY', soundId: id });
          playAudio();
        }}
        className="relative z-10 w-full aspect-square flex flex-col items-center justify-center space-y-1 p-2 
        bg-white border border-gray-100 rounded-lg 
        hover:shadow-sm transition-all duration-300 
        focus:outline-none focus:ring-1 focus:ring-purple-300"
      >
        <div className="relative w-6 h-6">
          <Image
            src={imgUrl}
            alt={name}
            fill
            className="object-contain group-hover:scale-110 transition-transform"
          />
        </div>
        <span className="text-[10px] text-gray-700 text-center truncate max-w-full group-hover:text-purple-600 transition-colors">
          {name}
        </span>
      </button>
      <audio ref={audioRef} src={url} />
    </div>
  );
}
