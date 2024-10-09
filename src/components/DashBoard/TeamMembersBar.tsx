interface TeamMembersBarProps {
    teamMembers: string[];
    buttonColor: string;
}

export default function TeamMembersBar({ teamMembers, buttonColor }: TeamMembersBarProps) {
    return (
        <div className="w-16 bg-white shadow-md flex flex-col items-center py-4">
            {teamMembers.map((member, index) => (
                <div key={index} className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mb-2">
                    {member[0].toUpperCase()}
                </div>
            ))}
            <div className="mt-auto">
                <button style={{ backgroundColor: buttonColor }} className="w-10 h-10 rounded-full text-white flex items-center justify-center">
                    로그아웃
                </button>
            </div>
        </div>
    );
}