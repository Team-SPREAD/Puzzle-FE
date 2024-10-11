import {
  LiveList,
  LiveMap,
  LiveObject,
  createClient,
} from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { Color, Layer, Point } from "@/lib/types";

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
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

export type MusicStates = "playing" | "seeking" | "paused";

// Storage represents the shared document that persists in the Room
type Storage = {
 
  layers: LiveMap<string, LiveObject<Layer>>;
  layerIds: LiveList<string>;
  person: LiveObject<{
    name: string;
  }>;
  time: LiveObject<{ time: number }>;
};

// UserMeta represents static/readonly metadata on each User
export type UserMeta = {
  id: string;
  info: {
    name: string;
    color: [string, string];
    avatar?: string;
  };
};

// RoomEvent types
export type RoomEvent =
  | { type: "TOAST"; message: string }
  | { type: "PLAY"; soundId: number }
  | { type: "AUDIO_PLAY" }
  | { type: "AUDIO_PAUSE" }
  | { type: "START_TIMER"; time: number }
  | { type: "STOP_TIMER" };

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
    useObject,
    useMap,
    useList,
    useBatch,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);



