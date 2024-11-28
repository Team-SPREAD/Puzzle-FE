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
        progressColor: '#9333EA', // Changed to purple
        url: 'https://aws-file-uploder.s3.ap-northeast-2.amazonaws.com/yourname_ost.mp3',
        dragToSeek: true,
        height: 32, // Reduced height
        hideScrollbar: true,
        normalize: true,
        barGap: 2,
        barHeight: 20, // Reduced bar height
        barRadius: 8, // Reduced bar radius
        barWidth: 2, // Reduced bar width
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
    <div className="bg-white rounded-lg shadow-sm p-2 max-w-sm mx-auto border border-gray-100">
      <div className="flex items-center space-x-3 mb-2">
        <div className="flex-grow">
          <h2 className="text-xs font-semibold text-gray-800">
            너의 이름은 (君の名は) OST
          </h2>
          <p className="text-xs text-gray-500">
            이토모리 고등학교 | Piano cover
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handlePlayPause}
          className="bg-purple-100 text-purple-600 p-1.5 rounded-full hover:bg-purple-200 transition-colors"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <div className="flex items-center space-x-2 flex-grow">
          <button
            onClick={handleMute}
            className="text-purple-600 hover:text-purple-700"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-grow h-1 bg-gray-200 rounded-full appearance-none cursor-pointer 
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-3 
              [&::-webkit-slider-thumb]:h-3 
              [&::-webkit-slider-thumb]:bg-purple-600 
              [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:shadow-sm"
          />
        </div>
      </div>

      <div
        ref={waveformRef}
        className="w-full h-8 rounded-lg overflow-hidden mt-2"
      />
    </div>
  );
}
