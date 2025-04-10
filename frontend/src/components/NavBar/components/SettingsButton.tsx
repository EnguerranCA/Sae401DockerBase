import { Link } from 'react-router-dom';

const SettingsButton = () => {
  return (
    <div className="flex flex-col items-center mt-4 md:flex-row md:mt-0">
      <Link 
        to="/settings" 
        className="my-2 flex flex-col justify-center items-center space-x-2 text-lg md:flex-row md:space-x-4 md:space-y-2"
      >
        <img 
          src="/src/assets/icons/settings-icon.svg" 
          alt="Settings" 
          className="h-8 w-8" 
        />
        <span className='text-xl'>Settings</span>
      </Link>
    </div>
  );
};

export default SettingsButton; 