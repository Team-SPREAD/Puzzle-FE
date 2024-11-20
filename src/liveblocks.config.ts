import {
  LiveList,
  LiveMap,
  LiveObject,
  createClient,
} from '@liveblocks/client';
import { createRoomContext } from '@liveblocks/react';
import { Color, Layer, Point, UserInfo, Process } from '@/lib/types';

const client = createClient({
  authEndpoint: async (room) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch('/api/liveblocks-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ room }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Auth failed');
    }

    return response.json();
  },
  throttle: 16,
});
// Presence represents the properties that will exist on every User in the Room
type Presence = {
  selection: string[];
  cursor: Point | null;
  pencilDraft: [x: number, y: number, pressure: number][] | null;
  penColor: Color | null;
  currentProcess: number;
};

export type Vote = {
  userId: string;
  timestamp: number;
};

export type VotingState = {
  votes: Record<string, Vote>;
  currentStep: number;
  isCompleted: boolean;
};

export type ModalType = 'VOTE_COMPLETE' | 'NEXT_STEP' | 'OTHER_MODAL_TYPES';

export type MusicStates = 'playing' | 'seeking' | 'paused';

export type ActiveUserInfo = UserInfo & {
  enteredAt: number;
};
// Storage represents the shared document that persists in the Room
type Storage = {
  layers: LiveMap<string, LiveObject<Layer>>;
  layerIds: LiveList<string>;
  person: LiveObject<{
    name: string;
  }>;
  time: LiveObject<{ time: number }>;
  groupCall: LiveObject<{
    roomId: string;
    activeUsers: LiveList<ActiveUserInfo>;
  }>;
  process: LiveList<Process>;
  nodes: any; //gimic9 테스트
  edges: any; //gimic9 테스트

  // 투표 상태 추가
  voting: LiveObject<{
    votes: Record<string, Vote>;
    currentStep: number;
    isCompleted: boolean;
    showCompletionModal?: boolean;
    moveToNextStep?: boolean;
  }>;
  // 호스트 정보 추가
  host: LiveObject<{
    userId: string;
  }>;
};

// UserMeta represents static/readonly metadata on each User
export type UserMeta = {
  id: string;
  info: {
    name: string;
    color: [string, string];
    avatar: string;
  };
};

// RoomEvent types

export type RoomEvent =
  | { type: 'TOAST'; message: string }
  | { type: 'PLAY'; soundId: number }
  | { type: 'AUDIO_PLAY' }
  | { type: 'AUDIO_PAUSE' }
  | { type: 'START_TIMER'; time: number }
  | { type: 'STOP_TIMER' }
  // 투표 관련 이벤트 추가
  | { type: 'VOTE_COMPLETE' }
  | { type: 'NEXT_STEP'; nextStep: number }
  | { type: 'RESET_VOTES' }
  | { type: 'SHOW_COMPLETION_MODAL' }
  | { type: 'OPEN_MODAL' }
  //결과 도출 모달
  | { type: 'FINAL_MODAL' };

export interface RoomEventMessage {
  event: any;
  type: string;
  data: RoomEvent;
}

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    // useObject,
    // useMap,
    // useList,
    // useBatch,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);
