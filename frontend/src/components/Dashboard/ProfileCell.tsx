import React, { useState, useEffect } from 'react';
import Avatar from '../../ui/Avatar';
import Username from '../../ui/Username';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface ProfileCellProps {
    user: {
        avatar: string;
        name: string;
        username: string;
    };
}

const ProfileCell = ({ user }: ProfileCellProps) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate a loading delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);


    if (loading) {
        return (
            <div className="p-4 rounded-lg bg-white w-full flex gap-4 border animate-pulse">
                <div className="bg-gray-300 rounded-full h-16 w-16"></div>
                <div className="flex mb-2 flex-col gap-2">
                    <div className="bg-gray-300 h-4 w-24 rounded"></div>
                    <div className="bg-gray-300 h-4 w-full rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white w-full flex gap-4 border rounded-lg shadow-md">
            <Avatar src={user.avatar} alt="User Avatar" size={64} />
            <div className="flex flex-col justify-center">
                <Username name={user.name} username={user.username} />
                <Link 
                    to={`/admin/edit/${user.username}`} 
                    className="mt-2 bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                >
                    Edit
                </Link>
            </div>
        </div>
    );
};

export default ProfileCell;