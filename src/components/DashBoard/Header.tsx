import Link from 'next/link';
import logo from '~/images/logo/logo.svg';
import Image from 'next/image';
interface HeaderProps {
  isDashboardPersonal: boolean;
  buttonColor: string;
  userName: string;
}

export default function Header({
  isDashboardPersonal,
  buttonColor,
  userName,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm w-full h-[8%] flex">
      <div id="a" className="w-[16%] h-full flex justify-center items-center">
        <Link href="/" className="flex justify-center items-center p-5">
          <Image src={logo} width={148} height={36} alt="puzzle_logo" />
        </Link>
      </div>

      <div id="b" className="flex flex-grow justify-between items-center px-5">
        <input
          type="text"
          placeholder="프로젝트 검색..."
          className="px-4 py-2 border rounded-md "
        />
        <div className="flex items-center space-x-4">
          {isDashboardPersonal ? (
            <div></div>
          ) : (
            <button
              style={{ backgroundColor: buttonColor }}
              className="px-4 py-2 text-white rounded-md"
            >
              + 멤버 초대
            </button>
          )}
          <span className="text-sm">안녕하세요, {userName}님!</span>
        </div>
      </div>
    </header>
  );
}
