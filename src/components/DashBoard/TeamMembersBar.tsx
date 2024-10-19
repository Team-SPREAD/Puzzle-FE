'use client';
import { destroyCookie } from 'nookies';
import { useRouter } from 'next/navigation';
interface TeamMembersBarProps {
  teamMembers: string[];
  buttonColor: string;
}

export default function TeamMembersBar({
  teamMembers,
  buttonColor,
}: TeamMembersBarProps) {
  const router = useRouter();
  const handleLogout = () => {
    destroyCookie(null, 'token');
    // 로컬 스토리지에 저장된 'authToken'을 삭제하는 코드
    localStorage.removeItem('authToken');

    // 로그아웃 후 리다이렉트 (예: 메인 페이지로)
    router.push('/');
  };
  return (
    <div className="w-16 bg-white shadow-md flex flex-col items-center py-4">
      {teamMembers.map((member, index) => (
        <div
          key={index}
          className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mb-2"
        >
          {member[0].toUpperCase()}
        </div>
      ))}
      <div className="mt-auto">
        <button
          style={{ backgroundColor: buttonColor }}
          className="w-10 h-10 rounded-full text-white flex items-center justify-center"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
