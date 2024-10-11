import Image from 'next/image';
interface LiveCallUser {
  userAvatar: string;
  userName: string;
}
export default function LiveCallUser({ userAvatar, userName }: LiveCallUser) {
  return (
    <div className="flex my-2">
      <Image
        src={userAvatar}
        alt="userIcon"
        width={24}
        height={24}
        className="w-6 h-6 bg-gray-300 rounded-full mr-1"
      />
      <div>{userName}</div>
    </div>
  );
}
