import React from 'react';

interface ProcessAvatarProps {
    user: {
        id: string;
        name: string;
        avatar: string;
    };
}

const ProcessAvatar: React.FC<ProcessAvatarProps> = ({ user }) => {
    return (
        <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white overflow-hidden">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />?
        </div>
    );
};

export default ProcessAvatar;