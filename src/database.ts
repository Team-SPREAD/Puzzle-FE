const USER_INFO: Liveblocks['UserMeta'][] = [
  {
    id: 'charlie.layne@example.com',
    info: {
      name: '김태호',
      color: '#D583F0',
      avatar: 'https://liveblocks.io/avatars/avatar-1.png',
    },
  },
  {
    id: 'mislav.abha@example.com',
    info: {
      name: '김선우',
      color: '#F08385',
      avatar: 'https://liveblocks.io/avatars/avatar-2.png',
    },
  },
  {
    id: 'tatum.paolo@example.com',
    info: {
      name: '김대성',
      color: '#F0D885',
      avatar: 'https://liveblocks.io/avatars/avatar-3.png',
    },
  },
];

export function getRandomUser() {
  return USER_INFO[Math.floor(Math.random() * 10) % USER_INFO.length];
}

//현재 사용하지 않은 함수여서 주석 처리 하였음
// export function getUser(id: string) {
//   return USER_INFO.find((u) => u.id === id) || null;
// }

export function getUsers() {
  return USER_INFO;
}
