import { useState } from 'react';
import Link from 'next/link';
import useUserInfoStore from "@/hooks/useUserInfoStore";

interface SidebarProps {
    setIsDashboardPersonal: (isPersonal: boolean) => void;
    buttonColor: string;
}

export default function Sidebar({ setIsDashboardPersonal, buttonColor }: SidebarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const userInfo = useUserInfoStore();
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

    const handleTeamSelect = (teamId: string | null) => {
        setSelectedTeam(teamId);
        setIsDashboardPersonal(teamId === null);
        setIsDropdownOpen(false);
    };

    const toggleFavorite = (projectId: string) => {
        // 즐겨찾기 토글 로직을 구현합니다.
        // 예: userInfo.toggleProjectFavorite(projectId);
        console.log(`Toggle favorite for project ${projectId}`);
    };

    const favoriteProjects = userInfo.projects.filter(project => project.isFavorite);

    return (
        <div className="w-64 bg-white shadow-md flex flex-col">
            <Link href="/" className="text-xl font-bold p-4">Logo</Link>
            
            {/* 팀 만들기 버튼 */}
            <div className="p-4">
                <button 
                    style={{backgroundColor: buttonColor}}
                    className="w-full px-4 py-2 text-white rounded-md"
                >
                    팀 만들기
                </button>
            </div>

            {/* 드롭다운 메뉴 */}
            <div className="p-4">
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full text-left px-4 py-2 bg-gray-200 rounded-md"
                >
                    {selectedTeam ? userInfo.teams.find(t => t.id === selectedTeam)?.name : 'Home'}
                </button>
                {isDropdownOpen && (
                    <div className="mt-2 bg-white rounded-md shadow-lg">
                        <button 
                            onClick={() => handleTeamSelect(null)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            Home
                        </button>
                        {userInfo.teams.map(team => (
                            <button 
                                key={team.id}
                                onClick={() => handleTeamSelect(team.id)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                {team.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 즐겨찾기 프로젝트 토글 섹션 */}
            <div className="p-4 flex-1">
                <button 
                    onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
                    className="w-full text-left font-semibold mb-2 flex items-center"
                >
                    <span className="mr-2">{isFavoritesOpen ? '▼' : '▶'}</span>
                    즐겨찾기 프로젝트 ({favoriteProjects.length})
                </button>
                {isFavoritesOpen && (
                    <ul className="mt-2">
                        {favoriteProjects.map(project => (
                            <li key={project.id} className="mb-2 flex items-center">
                                <button 
                                    onClick={() => toggleFavorite(project.id)}
                                    className="mr-2 text-yellow-500"
                                >
                                    ★
                                </button>
                                <Link href={`/project/${project.id}`} className="text-blue-600 hover:underline">
                                    {project.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}