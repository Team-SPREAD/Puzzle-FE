'use client';
import { useEffect, useRef, useState } from 'react';
import { useBroadcastEvent } from '@liveblocks/react/suspense';
import { useEventListener } from '@/liveblocks.config';
import WaveSurfer from 'wavesurfer.js';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

export default function AudioPlayer() {
  const broadcast = useBroadcastEvent();
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#E0E0E0',
        progressColor: '#FF4D4D',
        url: 'https://aws-file-uploder.s3.ap-northeast-2.amazonaws.com/yourname_ost.mp3',
        dragToSeek: true,
        height: 40,
        hideScrollbar: true,
        normalize: true,
        barGap: 2,
        barHeight: 25,
        barRadius: 10,
        barWidth: 3,
      });

      wavesurferRef.current = wavesurfer;
      wavesurfer.setVolume(volume);
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (wavesurferRef.current) {
      const newVolume = isMuted ? 0 : volume;
      wavesurferRef.current.setVolume(newVolume);
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      if (wavesurferRef.current.isPlaying()) {
        wavesurferRef.current.pause();
        setIsPlaying(false);
        broadcast({ type: 'AUDIO_PAUSE' });
      } else {
        wavesurferRef.current.play();
        setIsPlaying(true);
        broadcast({ type: 'AUDIO_PLAY' });
      }
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  useEventListener(({ event }) => {
    if (event.type === 'AUDIO_PLAY') {
      wavesurferRef.current?.play();
      setIsPlaying(true);
    } else if (event.type === 'AUDIO_PAUSE') {
      wavesurferRef.current?.pause();
      setIsPlaying(false);
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-4 max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-grow">
          <h2 className="text-sm font-semibold text-gray-800">
            너의 이름은 (君の名は) OST
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            이토모리 고등학교 | Piano cover
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={handlePlayPause}
          className="bg-red-50 text-red-500 p-2.5 rounded-full hover:bg-red-100 transition-colors"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <div className="flex items-center space-x-2 flex-grow">
          <button
            onClick={handleMute}
            className="text-gray-500 hover:text-gray-700"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-grow h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer 
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-4 
              [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:bg-red-500 
              [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>
      </div>

      <div
        ref={waveformRef}
        className="w-full h-10 rounded-lg overflow-hidden mt-4"
      />
    </div>
  );
}
