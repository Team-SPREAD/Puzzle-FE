'use client';

import { ReactNode, useEffect, useState } from 'react';
import { RoomProvider } from '@/liveblocks.config';
import { ClientSideSuspense } from '@liveblocks/react';
import { LiveList, LiveMap, LiveObject } from '@liveblocks/client';
import { Layer } from '@/lib/types';
import { Loading } from '@/components/Loading';
import Canvas from '@/components/Canvas/Canvas';
import { steps } from '@/lib/process-data';
import { SerializableNode } from '@/lib/types';
import { getCurrentStep } from '@/app/api/dashboard-axios';
import { useProcessProgress } from '@/hooks/vote/useProcessProgress';

interface RoomProps {
  roomId: string;
}

const Room = ({ roomId }: RoomProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [initialStep, setInitialStep] = useState<number>(1);
  const { initializeBoardProgress } = useProcessProgress(roomId);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken || !isMounted) return;
      
      setToken(storedToken);

      try {
        const currentStep = await getCurrentStep(roomId, storedToken);
        if (currentStep && currentStep !== initialStep && isMounted) {
          setInitialStep(currentStep-1); // 초기 단계에 -1을 해야지 단계 완료되는 오류 해결
          initializeBoardProgress(currentStep-1);
        }
      } catch (error) {
        console.error('Error fetching initial step:', error);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [roomId, initializeBoardProgress, initialStep]);

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
        // Storage 타입에 맞게 person 객체 추가
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