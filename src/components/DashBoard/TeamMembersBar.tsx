'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getTeamMembers } from '@/app/api/dashboard-axios';

interface TeamMembersBarProps {
  teamId: string | null;
  buttonColor: string;
  token: string;
}

interface TeamMember {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
}

export default function TeamMembersBar({
  teamId,
  buttonColor,
  token,
}: TeamMembersBarProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // 팀 멤버 정보 로드
  useEffect(() => {
    if (teamId) {
      // 팀 ID가 null이 아닐 때만 데이터 가져오기
      const fetchTeamMembers = async () => {
        try {
          const response = await getTeamMembers(teamId, token);
          if (response.status === 200) {
            setTeamMembers(response.data);
          } else {
            console.error('Failed to fetch team members');
          }
        } catch (error) {
          console.error('Error fetching team members:', error);
          setTeamMembers([]);
        }
      };

      fetchTeamMembers();
    } else {
      // 개인 대시보드일 경우 팀 멤버 정보를 빈 배열로 설정
      setTeamMembers([]);
    }
  }, [teamId, token]);

  return (
    <div
      className="w-[4%] shadow-md flex flex-col items-center py-4"
      style={{ backgroundColor: buttonColor }}
    >
      {teamMembers.map((member, index) => (
        <div
          key={index}
          className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mb-2"
        >
          {member.avatar && member.avatar !== 'null' ? (
            <Image
              src={member.avatar}
              width={40}
              height={40}
              alt={`${member.firstName} ${member.lastName}`}
              className="w-full h-full rounded-md object-cover"
            />
          ) : (
            <div></div>
          )}
        </div>
      ))}
    </div>
  );
}
