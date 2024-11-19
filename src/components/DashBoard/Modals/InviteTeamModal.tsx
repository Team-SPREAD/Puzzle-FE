import React, { useState } from 'react';
import { inviteTeamMembers } from '@/app/api/dashboard-axios';
import CheckModal from '@/components/AniModals/CheckModal';
import sendMail from '~/lotties/sendMail.json';

interface InviteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  teamId: string;
  sender: string;
}

const InviteTeamModal: React.FC<InviteTeamModalProps> = ({
  isOpen,
  onClose,
  token,
  teamId,
  sender,
}) => {
  const [inviteEmails, setInviteEmails] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInviteSuccess, setIsInviteSuccess] = useState(false); // 초대 성공 상태 추가

  if (!isOpen && !isInviteSuccess) return null;

  // 모달 외부 클릭 시 모달을 닫는 함수
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (isInviteSuccess) {
        setIsInviteSuccess(false); // 초대 성공 모달 닫기
      } else {
        onClose();
      }
    }
  };

  // 이메일 입력칸 추가 핸들러
  const handleAddEmailInput = () => {
    setInviteEmails([...inviteEmails, '']);
  };

  // 이메일 입력 변경 핸들러
  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...inviteEmails];
    updatedEmails[index] = value;
    setInviteEmails(updatedEmails);
  };

  // 초대 핸들러
  const handleInviteTeam = async () => {
    if (inviteEmails.some((email) => email === '')) return; // 비어 있는 이메일이 있는 경우 요청하지 않음
    setIsSubmitting(true);

    try {
      const response = await inviteTeamMembers(inviteEmails, teamId, sender);
      if (response.status === 201) {
        console.log('Invitations sent successfully');
        setIsInviteSuccess(true); // 초대 성공 시 상태 업데이트
      } else {
        console.error('Failed to send invitations');
      }
    } catch (error) {
      console.error('Error sending invitations:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 초대 모달 */}
      {!isInviteSuccess && isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={onClose}
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-center mb-4">
              Invite Members to Team
            </h2>
            {inviteEmails.map((email, index) => (
              <input
                key={index}
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                placeholder="Invite Email"
                className="w-full p-3 border border-gray-300 rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
            <button
              className="w-full mt-4 bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400 transition duration-200"
              onClick={handleAddEmailInput}
            >
              + Add More
            </button>
            <button
              className="w-full mt-6 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
              onClick={handleInviteTeam}
              disabled={isSubmitting}
            >
              {isSubmitting ? '초대 전송 중...' : '초대 전송'}
            </button>
          </div>
        </div>
      )}

      {/* 초대 성공 모달 */}
      {isInviteSuccess && (
        <CheckModal
          onClose={() => {
            setIsInviteSuccess(false); // 초대 성공 모달 닫기
            onClose(); // InviteTeamModal도 닫기
          }}
          lottieAnimationData={sendMail}
          title={'메일 전송!'}
          description={'팀 초대가 성공적으로 전송되었습니다.'}
        />
      )}
    </>
  );
};

export default InviteTeamModal;
