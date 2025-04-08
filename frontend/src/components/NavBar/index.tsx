import { useEffect, useState } from 'react';
import Users from '../../data/data-users';
import Logo from './components/Logo';
import HomeButton from './components/HomeButton';
import LogoutButton from './components/LogoutButton';
import ProfileSection from './components/ProfileSection';
import SettingsButton from './components/SettingsButton';

export default function NavBar() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await Users.getCurrentUserInfo();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setCurrentUser(null);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around bg-white p-2 md:top-0 md:left-0 md:gap-4 md:h-full md:flex-col md:justify-start md:items-center md:w-1/3">
      <Logo />
      <HomeButton />
      <SettingsButton />
      <LogoutButton onLogout={handleLogout} />
      <ProfileSection currentUser={currentUser} />
    </nav>
  );
}
