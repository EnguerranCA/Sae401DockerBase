import React from 'react';

interface UsernameProps {
    name: string;
    username: string;
}

const Username = ({ name, username }: UsernameProps) => {
    return (
        <div className="flex ">
            
            <div className=" flex gap-2 flex-col md:flex-row">
                <div className='font-bold'>{name}</div>
                <div className="text-gray-500">@{username}</div>
            </div>
        </div>
    );
};

export default Username;
