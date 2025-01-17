'use client';

import { useEffect, useRef, useState } from 'react';
import { RoomProvider } from '@/liveblocks.config';
import { ClientSideSuspense } from '@liveblocks/react';
import { LiveList, LiveMap, LiveObject } from '@liveblocks/client';
import { Layer } from '@/lib/types';
import { Loading } from '@/components/Loading';
import { steps } from '@/lib/process-data';
import { SerializableNode } from '@/lib/types';
import { getCurrentStep } from '@/app/api/dashboard-axios';
import { useProcessProgress } from '@/hooks/vote/useProcessProgress';
import Canvas from './Canvas';

interface RoomProps {
  roomId: string;
}

const Room = ({ roomId }: RoomProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [initialStep, setInitialStep] = useState<number>(1);
  const { initializeBoardProgress } = useProcessProgress(roomId);
  const isInitialized = useRef(false); // 초기화 상태 추적

  useEffect(() => {
    if (isInitialized.current) return; // 이미 초기화된 경우 함수 실행 방지
    isInitialized.current = true; // 초기화 상태 설정

    const init = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) return;

      setToken(storedToken);

      try {
        const currentStep = await getCurrentStep(roomId, storedToken);

        // currentStep이 유효한 숫자인지 확인
        if (typeof currentStep === 'number') {
          const adjustedStep = Math.max(1, currentStep - 1); // 음수가 되지 않도록 보호
          setInitialStep(adjustedStep);
          initializeBoardProgress(adjustedStep);
        }
      } catch (error) {
        if (error instanceof Error) {
          // 404 에러인 경우 기본값 사용
          if (error.message.includes('찾을 수 없습니다')) {
            console.warn('보드를 찾을 수 없어 초기 단계를 1로 설정합니다.');
            setInitialStep(1);
            initializeBoardProgress(1);
          } else {
            console.error('단계 조회 중 오류 발생:', error.message);
          }
        }
      }
    };

    init();
  }, [roomId, initializeBoardProgress]);

  if (!token) return <Loading />;

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        selection: [],
        cursor: null,
        pencilDraft: null,
        penColor: null,
        currentProcess: initialStep,
      }}
      initialStorage={{
        time: new LiveObject({ time: 300 }),
        process: new LiveList(steps),
        groupCall: new LiveObject({
          roomId: '',
          activeUsers: new LiveList([]),
        }),
        layers: new LiveMap<string, LiveObject<Layer>>(),
        layerIds: new LiveList([]),
        person: new LiveObject({ name: '' }),
        nodes: new LiveMap<string, LiveObject<SerializableNode>>(),
        edges: [],
        host: new LiveObject({ userId: '' }),
        voting: new LiveObject({
          votes: {},
          currentStep: initialStep,
          isCompleted: false,
          showCompletionModal: false,
        }),
      }}
    >
      <ClientSideSuspense fallback={<Loading />}>
        {() => <Canvas />}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default Room;
