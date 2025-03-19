import { Link } from 'react-router-dom';
import Users from '../../data/data-users';

import ProfileButton from '../ProfileButton';

import { useEffect, useState } from 'react';

// Load the data for the current user
export default function NavBar() {
  // Test with the user with ID 1
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    Users.getUserInfo(1).then(user => setCurrentUser(user));
  }, []);
  
  return (
    <nav className="fixed top-0 left-0 h-full flex flex-col items-center bg-white shadow-lg w-96">
      <div className="my-4">
        <Link to="/home">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/1245px-Logo_of_Twitter.svg.png" alt="Logo twitter" className="h-8 w-8" />
        </Link>
        
      </div>
      <div className="flex flex-col items-center mt-4">
        <Link to="/home" className="my-2 flex justify-center items-center space-x-2 text-lg">
          <img src="../src/assets/icons/home-icon.svg" alt="Home" className="h-8 w-8" />
          <span className='text-xl'>Accueil</span>
        </Link>
      </div>
      <div className="flex flex-col items-center mt-4">
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

