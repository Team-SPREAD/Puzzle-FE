'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  useBroadcastEvent,
  useEventListener,
  useStorage,
  useMutation,
} from '@/liveblocks.config';
import playIcon from '~/images/play.svg';
import stopIcon from '~/images/stop.svg';

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false); // 타이머 상태
  const broadcast = useBroadcastEvent();

  // 오디오 태그를 참조할 ref 생성
  const audioRef = useRef<HTMLAudioElement>(null);

  // 타이머 시간을 Storage에서 가져옴
  const time = useStorage((root) => root.time ?? { time: 300 }).time;

  // 타이머 시간을 업데이트하는 Mutation
  const setTime = useMutation(({ storage }, newTime) => {
    const timeObject = storage.get('time');
    if (timeObject) {
      timeObject.set('time', newTime);
    }
  }, []);

  // 타이머 시작 및 중지 핸들러
  const toggleTimer = () => {
    if (isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  // 타이머 시작
  const startTimer = () => {
    setIsRunning(true);
    broadcast({ type: 'START_TIMER', time });
  };

  // 타이머 중지
  const stopTimer = () => {
    setIsRunning(false);
    broadcast({ type: 'STOP_TIMER' });
  };

  // 시간 추가
  const addTime = () => {
    setTime(time + 60); // 1분 추가
  };

  // 시간 감소
  const subtractTime = () => {
    setTime(Math.max(0, time - 60)); // 1분 감소, 최소 0초
  };

  const resetTime = () => {
    setIsRunning(false);
    setTime(300);
  };

  // 다른 클라이언트의 타이머 상태를 수신
  useEventListener(({ event }) => {
    if (event.type === 'START_TIMER') {
      setTime(event.time);
      setIsRunning(true);
    } else if (event.type === 'STOP_TIMER') {
      setIsRunning(false);
    }
  });

  // 로컬 타이머 업데이트
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        if (time > 0) {
          setTime(time - 1);
        } else if (time === 0) {
          // 시간이 0이 되면 종료 소리 재생 및 타이머 초기화
          if (audioRef.current) {
            audioRef.current.play();
          }
          setTime(300); // 5분으로 초기화
          setIsRunning(false); // 타이머 멈추기
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, setTime]);

  // 분과 초로 변환
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="flex flex-col border-b border-[#E9E9E9]">
      <h1 className="text-3xl text-[#FF2323] text-center my-1">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </h1>
      <div className="w-full flex justify-between items-center my-1 ">
        <div className="flex">
          <button
            onClick={addTime}
            className="w-[24px] h-[24px] mr-2 bg-white text-[#FF2323] border border-[#FF2323] rounded-full flex justify-center items-center"
          >
            +
          </button>
          <button
            onClick={subtractTime}
            className="w-[24px] h-[24px] bg-white text-[#FF2323] border border-[#FF2323] rounded-full flex justify-center items-center"
          >
            -
          </button>
        </div>
        {/* 리셋 버튼 */}
        <button
          onClick={resetTime}
          className="w-[50px] h-[24px] text-[8px] text-[#FF2323] border border-[#FF2323] rounded-xl"
        >
          Reset
        </button>
        {/* 시작/중지 토글 버튼 */}
        <button
          onClick={toggleTimer}
          className={
            'w-[64px] h-[24px] bg-[#FF2323] rounded-xl flex justify-center items-center'
          }
        >
          {isRunning ? (
            <Image src={stopIcon} alt="stopIcon" />
          ) : (
            <Image src={playIcon} alt="playIcon" />
          )}
        </button>
      </div>

      {/* 종료 소리 재생을 위한 audio 태그 */}
      <audio
        ref={audioRef}
        src="https://aws-file-uploder.s3.ap-northeast-2.amazonaws.com/alarm.mp3"
      />
    </div>
  );
}
