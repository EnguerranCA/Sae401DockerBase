import React, { useEffect, useState } from 'react';
import ProfileCell from './ProfileCell';
import Users from '../../data/data-users';

const UserList = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await Users.getAllUsers();
            if (response && response.users) {
                if (response.users.length === 0) {
                    setError('No users found');
                    return;
                }
                setUsers(response.users);
            } else {
                setError('No users found');
            }
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        }
    };

    console.log(users);

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="flex flex-col items-center w-full border">
            {error && <div className="text-red-500">{error}</div>}
            {users.map((user) => (
                <ProfileCell key={user.id} user={user} />
            ))}
        </div>
    );
};

export default UserList;