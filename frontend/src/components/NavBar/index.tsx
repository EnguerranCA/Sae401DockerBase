import { Link } from 'react-router-dom';
import Users from '../../data/data-users';

import ProfileButton from '../ProfileButton';

import { useEffect, useState } from 'react';

import { config } from '../../config/config';

const { API_URL } = config;

// Load the data for the current user
export default function NavBar() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    Users.getCurrentUserInfo().then(user => setCurrentUser(user));
  }, []);
  
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around bg-white p-2 md:top-0 md:left-0 md:gap-4 md:h-full md:flex-col md:justify-start md:items-center md:w-1/3">
      <div className="my-4 md:my-0">
      <Link to="/home">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/1245px-Logo_of_Twitter.svg.png" alt="Logo twitter" className="h-8 w-8" />
      </Link>
      </div>
      <div className="flex flex-col items-center mt-4 md:flex-row md:mt-0">
      <Link to="/home" className="my-2 flex flex-col justify-center items-center space-x-2 text-lg md:flex-row md:space-x-4 md:space-y-2">
        <img src="../src/assets/icons/home-icon.svg" alt="Home" className="h-8 w-8" />
        <span className='text-xl'>Home</span>
      </Link>
      </div>
      <div className="flex items-center mt-4 md:flex-col md:mt-0">
      <button
        onClick={() => {
        Users.logout();
        setCurrentUser(null);
        window.location.href = `/~caroalquier1/SAE4.DWeb-DI.01/frontendA/dist/login`;
        }}
        className="my-2 flex flex-col justify-center items-center space-x-2 text-lg md:flex-row md:space-x-4 md:space-y-2"
      >
        <img src="../src/assets/icons/logout-icon.svg" alt="Logout" className="h-8 w-8" />
        <span className='text-xl'>Logout</span>
      </button>
      </div>
      <div className="flex flex-col items-center mt-4 md:flex-row md:mt-0">
      {currentUser && (
        <ProfileButton
        user={currentUser}
        className="w-10 h-10"
        />
      )}
      </div>
    </nav>
  );
}
