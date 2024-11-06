import React, { useState } from 'react';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [teamName, setTeamName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // 모달 외부 클릭 시 모달을 닫는 함수
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 팀 생성 핸들러
  const handleCreateTeam = async () => {
    if (!teamName) return; // 팀 이름이 비어 있는 경우 요청하지 않음
    setIsSubmitting(true);

    try {
      const response = await fetch('http://kim-sun-woo.com/puzzle/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamName,
          userId,
        }),
      });
      if (response.ok) {
        console.log('Team created successfully');
        window.location.reload();
        onClose(); // 팀 생성 후 모달 닫기
      } else {
        console.error('Failed to create team');
      }
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
          Create New Team
        </h2>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Team Name"
          className="w-full p-3 border border-gray-300 rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="w-full mt-6 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
          onClick={handleCreateTeam}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Team'}
        </button>
      </div>
    </div>
  );
};

export default CreateTeamModal;
