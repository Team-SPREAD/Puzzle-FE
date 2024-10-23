'use client';
import { useEffect, useRef, useState } from 'react';
import { useBroadcastEvent } from '@liveblocks/react/suspense';
import { useEventListener } from '@/liveblocks.config';
import Image from 'next/image';
import WaveSurfer from 'wavesurfer.js';
import playIcon from '~/images/play_red.svg';
import stopIcon from '~/images/stop_red.svg';

export default function AudioPlayer() {
  const broadcast = useBroadcastEvent();
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ABABAB',
        progressColor: '#FF2323',
        url: 'https://aws-file-uploder.s3.ap-northeast-2.amazonaws.com/yourname_ost.mp3',
        dragToSeek: true,
        height: 30,
        hideScrollbar: true,
        normalize: true,
        barGap: 1,
        barHeight: 20,
        barRadius: 20,
        barWidth: 4,
      });
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, []);

  // Play/Pause 버튼이 눌렸을 때 동작
  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      if (wavesurferRef.current.isPlaying()) {
        wavesurferRef.current.pause(); // 재생 중이면 일시정지
        setIsPlaying(false); // 재생 상태 업데이트
        broadcast({ type: 'AUDIO_PAUSE' }); // 이벤트 브로드캐스트 (정지)
      } else {
        wavesurferRef.current.play(); // 일시정지 중이면 재생
        setIsPlaying(true); // 재생 상태 업데이트
        broadcast({ type: 'AUDIO_PLAY' }); // 이벤트 브로드캐스트 (재생)
      }
    }
  };

  // 다른 사용자가 Play/Pause 이벤트를 발생시켰을 때 동작
  useEventListener(({ event }) => {
    if (event.type === 'AUDIO_PLAY') {
      wavesurferRef.current?.play(); // 다른 사용자가 재생하면 재생
      setIsPlaying(true);
    } else if (event.type === 'AUDIO_PAUSE') {
      wavesurferRef.current?.pause(); // 다른 사용자가 정지하면 정지
      setIsPlaying(false);
    }
  });

  return (
    <div className="border-b border-[#E9E9E9]">
      <div className="flex mt-6 items-center">
        <button
          onClick={handlePlayPause}
          className="w-[24px] h-[24px] bg-white text-[#FF2323] border border-[#FF2323] rounded-full flex justify-center items-center mr-3 "
        >
          {isPlaying ? (
            <Image src={stopIcon} alt="stopIcon" />
          ) : (
            <Image src={playIcon} alt="playIcon" />
          )}
        </button>
        <div>
          <h2 className="text-xs">{'너의 이름은 (君の名は) OST'}</h2>
          <p className="text-[8px]">
            {'이토모리 고등학교 | 피아노 커버 Piano cover'}
          </p>
        </div>
      </div>
      <div ref={waveformRef} className="my-4 " />
    </div>
  );
}
