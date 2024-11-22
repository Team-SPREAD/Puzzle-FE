// import React, { useMemo } from 'react';
// import { useOthersMapped, useSelf } from '@liveblocks/react';
// import { AnimatePresence, motion } from 'framer-motion';
// import { Avatar } from './Avater';
// import useUserStore from '@/store/useUserStore';

// const MAX_OTHERS = 5;

// const animationProps = {
//   initial: { width: 0, transformOrigin: 'left' },
//   animate: { width: 'auto', height: 'auto' },
//   exit: { width: 0 },
//   transition: {
//     type: 'spring',
//     damping: 15,
//     mass: 1,
//     stiffness: 200,
//     restSpeed: 0.01,
//   },
// };

// const avatarProps = {
//   style: { marginLeft: '-0.45rem' },
//   size: 48,
//   outlineWidth: 3,
//   outlineColor: 'white',
// };

// export default function LiveAvatars() {
//   const others = useOthersMapped((other) => other.info);
//   const currentUser = useSelf();
//   const userInfo = useUserStore((state) => state.userInfo);

//   const hasMoreUsers = others.length > MAX_OTHERS;

//   // Generate a consistent color for users without an avatar
//   const generateUserColor = (name: string): [string, string] => {
//     const hashCode = (str: string) => {
//       let hash = 0;
//       for (let i = 0; i < str.length; i++) {
//         hash = (hash << 5) - hash + str.charCodeAt(i);
//         hash = hash & hash; // Convert to 32-bit integer
//       }
//       return Math.abs(hash);
//     };

//     const hue = hashCode(name) % 360;
//     return [`hsl(${hue}, 70%, 60%)`, `hsl(${hue}, 70%, 50%)`];
//   };

//   return (
//     <div className="flex items-center">
//       <AnimatePresence>
//         {hasMoreUsers && (
//           <motion.div {...animationProps}>
//             <Avatar
//               variant="more"
//               count={others.length - MAX_OTHERS}
//               {...avatarProps}
//             />
//           </motion.div>
//         )}

//         {others
//           .slice(0, MAX_OTHERS)
//           .reverse()
//           .map(([key, info]) => {
//             if (!info) return null; // info가 undefined인 경우를 처리
//             return (
//               <motion.div key={key} {...animationProps}>
//                 <Avatar
//                   variant="avatar"
//                   src={info.avatar ?? undefined} // undefined 처리
//                   name={info.name ?? 'Unknown'} // 이름이 없을 경우 기본값 제공
//                   color={generateUserColor(info.name ?? 'Unknown')}
//                   {...avatarProps}
//                 />
//               </motion.div>
//             );
//           })}

//         {currentUser && (
//           <motion.div {...animationProps}>
//             <Avatar
//               variant="avatar"
//               src={userInfo.avatar}
//               name={userInfo.name}
//               color={generateUserColor(userInfo.name)}
//               {...avatarProps}
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
import React, { useMemo } from 'react';
import { useOthersMapped, useSelf } from '@liveblocks/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { Avatar } from './Avater';
import useUserStore from '@/store/useUserStore';

const MAX_OTHERS = 5;

const animationProps = {
  initial: { width: 0, transformOrigin: 'left' },
  animate: { width: 'auto', height: 'auto' },
  exit: { width: 0 },
  transition: {
    type: 'spring',
    damping: 15,
    mass: 1,
    stiffness: 200,
    restSpeed: 0.01,
  },
};

const avatarProps = {
  style: { marginLeft: '-0.45rem' },
  size: 48,
  outlineWidth: 3,
  outlineColor: 'white',
};

export default function LiveAvatars() {
  const others = useOthersMapped((other) => other.info);
  const currentUser = useSelf();
  const userInfo = useUserStore((state) => state.userInfo);

  const totalUsers = others.length + (currentUser ? 1 : 0);
  const hasMoreUsers = others.length > MAX_OTHERS;

  const generateUserColor = (name: string): [string, string] => {
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash;
      }
      return Math.abs(hash);
    };

    const hue = hashCode(name) % 360;
    return [`hsl(${hue}, 70%, 60%)`, `hsl(${hue}, 70%, 50%)`];
  };

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center mb-1">
        <Users size={16} className="mr-2 text-gray-500" />
        <span className="text-xs text-gray-600">
          현재 접속자 {totalUsers}명
        </span>
      </div>
      <div className="flex items-center">
        <AnimatePresence>
          {hasMoreUsers && (
            <motion.div {...animationProps}>
              <Avatar
                variant="more"
                count={others.length - MAX_OTHERS}
                {...avatarProps}
              />
            </motion.div>
          )}

          {others
            .slice(0, MAX_OTHERS)
            .reverse()
            .map(([key, info]) => {
              if (!info) return null;
              return (
                <motion.div key={key} {...animationProps}>
                  <Avatar
                    variant="avatar"
                    src={info.avatar ?? undefined}
                    name={info.name ?? 'Unknown'}
                    color={generateUserColor(info.name ?? 'Unknown')}
                    {...avatarProps}
                  />
                </motion.div>
              );
            })}

          {currentUser && (
            <motion.div {...animationProps}>
              <Avatar
                variant="avatar"
                src={userInfo.avatar}
                name={userInfo.name}
                color={generateUserColor(userInfo.name)}
                {...avatarProps}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
