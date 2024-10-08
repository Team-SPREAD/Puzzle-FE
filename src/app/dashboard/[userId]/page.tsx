"use client";

import useUserInfoStore from "@/hooks/useUserInfoStore";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";


export default function DashboardPage() {
    const userInfo = useUserInfoStore();
    useAuth();
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">대시보드</h1>
            <h1>안녕하세요, {userInfo.name}!</h1>
            <h2>색상:<span style={{ color: userInfo.color }}> </span>{userInfo.color}입니다.</h2>
            <h3 className="text-2xl font-bold mt-8 mb-2">호스팅 중인 방</h3>
            <ul>
                {userInfo.hostingRooms.map((room) => (
                    <Link key={room} href={`/board/${room}`}>
                        <li className="text-violet-800 " key={room}>{room}</li>
                    </Link>
                ))}
            </ul>
            <h3 className="text-2xl font-bold mt-4 mb-2">참여 중인 방</h3>
            <ul>
                {userInfo.joinedRooms.map((room) => (
                    <Link key={room} href={`/board/${room}`}>
                        <li className="text-red-500" key={room}>{room}</li>
                    </Link>
                ))}
            </ul>
        </div>
    );
}



