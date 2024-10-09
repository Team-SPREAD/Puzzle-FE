import Link from 'next/link';

interface HeaderProps {
    isDashboardPersonal: boolean;
    buttonColor: string;
    userName: string;
}

export default function Header({ isDashboardPersonal, buttonColor, userName }: HeaderProps) {
    return (
        <header className="bg-white shadow-sm">
            <div className="flex items-center justify-between px-6 py-3">
                <input
                    type="text"
                    placeholder="프로젝트 검색..."
                    className="px-4 py-2 border rounded-md "
                />
                <div className="flex items-center space-x-4">

                    <button
                        style={{ backgroundColor: buttonColor }}
                        className="px-4 py-2 text-white rounded-md"
                    >
                        {isDashboardPersonal ? "랜덤 매칭" : "멤버 초대"}
                    </button>
                    <span className="text-sm">안녕하세요, {userName}님!</span>
                </div>
            </div>
        </header>
    );
}