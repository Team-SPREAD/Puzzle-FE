'use client';
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense';
import { useSearchParams } from 'next/navigation';
import { ReactNode, useMemo } from 'react';
import { LiveObject } from '@liveblocks/core';
import { Loading } from '@/components/Loading';
import Canvas from './Canvas';

interface RoomProps {
  roomId: string;
}

const Room = ({ roomId }: RoomProps) => {
  const exampleRoomId = useExampleRoomId(roomId);

  return (
    <RoomProvider
      id={exampleRoomId}
      initialStorage={{
        time: new LiveObject({ time: 300 }),
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
