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

interface RoomProps {
  roomId: string;
}

const Room = ({ roomId }: RoomProps) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  if (!token) {
    return <Loading />;
  }

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        selection: [],
        cursor: null,
        pencilDraft: null,
        penColor: null,
        currentProcess: 1,
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
        person: new LiveObject({ name: 'Marie', age: 30 }),
        nodes: new LiveMap<string, LiveObject<SerializableNode>>(),
        edges: [],
        host: new LiveObject({ userId: '' }),
        voting: new LiveObject({
          votes: {},
          currentStep: 1,
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