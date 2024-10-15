import { LiveObject, LiveList } from '@liveblocks/client';
import { ActiveUserInfo } from '@/liveblocks.config';

/**
 * activeUser를 추가하는 함수
 */
export function addActiveUser(
  groupCall: LiveObject<{
    roomId: string;
    activeUsers: LiveList<ActiveUserInfo>;
  }>,
  user: ActiveUserInfo,
) {
  const groupCallActiveUsers = groupCall.get('activeUsers');

  if (!groupCallActiveUsers) {
    console.error('activeUsers 리스트를 찾을 수 없습니다.');
    return;
  }

  const existingUserIndex = groupCallActiveUsers.findIndex(
    (activeUser) => activeUser.id === user.id,
  );

  if (existingUserIndex !== -1) {
    groupCallActiveUsers.delete(existingUserIndex);
    console.log('중복된 사용자 삭제:', user.id);
  }

  groupCallActiveUsers.push(user);
  console.log('새로운 사용자 추가:', user);
}

/**
 * activeUser를 제거하는 함수
 */
export function removeActiveUser(
  groupCall: LiveObject<{
    roomId: string;
    activeUsers: LiveList<ActiveUserInfo>;
  }>,
  userId: string,
) {
  const groupCallActiveUsers = groupCall.get('activeUsers');

  if (!groupCallActiveUsers) {
    console.error('activeUsers 리스트를 찾을 수 없습니다.');
    return;
  }

  const userIndex = groupCallActiveUsers.findIndex(
    (user) => user.id === userId,
  );

  if (userIndex !== -1) {
    groupCallActiveUsers.delete(userIndex);
    console.log('사용자 삭제:', userId);
  } else {
    console.log('삭제할 유저를 찾을 수 없습니다.');
  }
}
