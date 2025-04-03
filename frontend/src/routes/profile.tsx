
import React from 'react';
import ProfilePage from '../components/Profile/index';
import Users from '../data/data-users';
import { useParams } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = React.useState<{
    id: number;
    username: string;
    name: string;
    bio: string;
    avatar: string;
    banner: string;
    isFollowed: boolean;
  } | null>(null);
  const { handle } = useParams<{ handle: string }>();

  React.useEffect(() => {
    if (handle) {
      Users.getUserInfoByUsername(handle)
        .then(setUser)
        .catch(console.error);
    }
  }, [handle]);

  return (
    <>
      <div className="content flex flex-col space-y-5 items-center">
        {user ? <ProfilePage user={user} /> : <p>Loading...</p>}
      </div>
    </>
  );
}