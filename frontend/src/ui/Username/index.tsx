import React from 'react';

interface UsernameProps {
    name: string;
    username: string;
}

const Username = ({ name, username }: UsernameProps) => {
    return (
        <div className="flex ">
            <div className=" flex flex gap-2">
                <div className='font-bold'>{name}</div>
                <div className="text-gray-500">@{username}</div>
            </div>
        </div>
    );
};

export default Username;
