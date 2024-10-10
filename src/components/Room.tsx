'use client';

import { ReactNode, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { Layer } from "@/lib/types";
import { Loading } from '@/components/Loading';
import Canvas from '@/components/Canvas/Canvas';

interface RoomProps {
  roomId: string;
}

const Room = ({ roomId }: RoomProps) => {
  const exampleRoomId = useExampleRoomId(roomId);

  return (
    <RoomProvider
      id={exampleRoomId}
      initialPresence={{
        selection: [],
        cursor: null,
        pencilDraft: null,
        penColor: null,
        currentProcess: 1,
      }}
      initialStorage={{
        time: new LiveObject({ time: 300 }),
        layers: new LiveMap<string, LiveObject<Layer>>(),
        layerIds: new LiveList([]),
        person: new LiveObject({ name: "Marie", age: 30 }),
      }}

    >
      <ClientSideSuspense fallback={<Loading />}>
        {() => <Canvas />}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default Room;

/**
 * This function is used when deploying an example on liveblocks.io.
 * You can ignore it completely if you run the example locally.
 */
function useExampleRoomId(roomId: string) {
  const params = useSearchParams();
  const exampleId = params?.get('exampleId');

  const exampleRoomId = useMemo(() => {
    return exampleId ? `${roomId}-${exampleId}` : roomId;
  }, [roomId, exampleId]);

  return exampleRoomId;
}
