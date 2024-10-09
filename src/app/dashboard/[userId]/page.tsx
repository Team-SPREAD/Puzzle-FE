"use client";

import { useState, useEffect } from 'react';
import useUserInfoStore from "@/hooks/useUserInfoStore";
import useAuth from "@/hooks/useAuth";
import Sidebar from '@/components/DashBoard/SideBar';
import Header from '@/components/DashBoard/Header';
import ProjectGrid from '@/components/DashBoard/ProjectGrid';
import TeamMembersBar from '@/components/DashBoard/TeamMembersBar';
import { generateRandomColor } from '@/utils/getRandomColor';

export default function DashboardPage() {
    const userInfo = useUserInfoStore();
    useAuth();

    const [isDashboardPersonal, setIsDashboardPersonal] = useState(true);
    const [buttonColor, setButtonColor] = useState('');

    useEffect(() => {
        setButtonColor(generateRandomColor());
    }, []);

    const personalProjects = userInfo.projects.filter(p => !p.teamId);
    const teamProjects = userInfo.projects.filter(p => p.teamId);

    return (
        <div className="flex h-screen bg-gray-100">
            <TeamMembersBar
                teamMembers={userInfo.teams.flatMap(t => t.members)}
                buttonColor={buttonColor}
            />
            <Sidebar
                setIsDashboardPersonal={setIsDashboardPersonal}
                buttonColor={buttonColor}
            />
            <div className="flex flex-col flex-1">
                <Header
                    isDashboardPersonal={isDashboardPersonal}
                    buttonColor={buttonColor}
                    userName={userInfo.name}
                />
                <main className="flex-1 p-6 overflow-auto">
                    <h1 className="text-2xl font-bold mb-4">
                        {isDashboardPersonal ? "개인 대시보드" : "팀 대시보드"}
                    </h1>
                    <ProjectGrid
                        projects={isDashboardPersonal ? personalProjects : teamProjects}
                        buttonColor={buttonColor}
                        rooms={[...userInfo.hostingRooms, ...userInfo.joinedRooms]}
                    />
                </main>
            </div>

        </div>
    );
}