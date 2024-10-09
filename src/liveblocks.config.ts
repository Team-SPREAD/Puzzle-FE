import { LiveObject } from '@liveblocks/core';

declare global {
  interface Liveblocks {
    // Each user's Presence, for room.getPresence, room.subscribe("others"), etc.
    Presence: {};
    Storage: {
      time: LiveObject<{ time: number }>;
    };
    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string; // Accessible through `user.id`
      info: {
        name: string;
        color: string;
        avatar: string;
      }; // Accessible through `user.info`
    };
    RoomEvent:
      | { type: 'PLAY'; soundId: number }
      | { type: 'AUDIO_PLAY' }
      | { type: 'AUDIO_PAUSE' }
      | { type: 'START_TIMER'; time: number }
      | { type: 'STOP_TIMER' };
  }
}
