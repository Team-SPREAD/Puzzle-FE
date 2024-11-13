'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import logo from '~/images/logo/logo.svg';
import { acceptInvitation } from '@/app/api/dashboard-axios';
import { Loading } from '@/components/Loading';

export default function InviteAcceptPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isAccepting, setIsAccepting] = useState(false);
  const [decodedSender, setDecodedSender] = useState('');
  const [decodedTeamName, setDecodedTeamName] = useState('');

  const resolveParam = (param: string | string[] | undefined) => {
    if (!param) return '';
    return Array.isArray(param) ? param[0] : param;
  };

  useEffect(() => {
    const resolvedSender = resolveParam(id[1]);
    const resolvedTeamName = resolveParam(id[2]);
    setDecodedSender(decodeURIComponent(resolvedSender));
    setDecodedTeamName(decodeURIComponent(resolvedTeamName));
  }, [id]);

  // 초대 수락 핸들러
  const handleAcceptInvitation = async () => {
    if (!id) return;
    const resolvedId = resolveParam(id[0]);
    setIsAccepting(true);
    try {
      const response = await acceptInvitation(resolvedId);
      if (response.status === 200) {
        console.log('Invitation accepted successfully');
        router.push(`/`);
      } else {
        console.error('Failed to accept invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col justify-center items-center">
        <Image
          src={logo}
          width={160}
          height={80}
          alt="puzzle_logo"
          className="mb-10"
        />
        <h1 className="text-2xl font-bold mb-3">
          {decodedSender && decodedTeamName
            ? `${decodedSender}님이 ${decodedTeamName} 팀에 초대했습니다!`
            : '초대 정보를 불러오는 중입니다...'}
        </h1>
        <h1 className="text-xl font-bold">
          {decodedTeamName} 팀에 초대를 수락하시겠습니까?
        </h1>
        {isAccepting ? (
          <Loading />
        ) : (
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handleAcceptInvitation}
          >
            초대 수락
          </button>
        )}
      </div>
    </div>
  );
}
