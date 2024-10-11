'use client';
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense';
import { useSearchParams } from 'next/navigation';
import { ReactNode, useMemo } from 'react';
import { LiveObject, LiveList } from '@liveblocks/client';
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
        groupCall: new LiveObject({
          roomId: '',
          activeUsers: new LiveList([]),
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
