import React from 'react';

interface ProcessAvatarProps {
    user: {
        _id: string;
        name: string;
        avatar: string;
    };
}

const ProcessAvatar: React.FC<ProcessAvatarProps> = ({ user }) => {
    return (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-2 border-white overflow-hidden">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        </div>
    );
};

export default ProcessAvatar;