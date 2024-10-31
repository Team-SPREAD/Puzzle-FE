import React from 'react';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // 모달 외부 클릭 시 모달을 닫는 함수
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleOutsideClick} // 외부 클릭 시 onClose 호출
    >
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose} // 닫기 버튼 클릭 시 onClose 호출
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold text-center mb-4">
          Create New Team
        </h2>
        <input
          type="text"
          placeholder="Team Name"
          className="w-full p-3 border border-gray-300 rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="w-full mt-6 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
          onClick={() => {
            // 팀 생성 로직을 여기에 추가합니다.
            onClose(); // 팀 생성 후 모달을 닫습니다.
          }}
        >
          Create Team
        </button>
      </div>
    </div>
  );
};

export default CreateTeamModal;
