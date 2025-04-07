import Users from '../../../data/data-users';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  return (
    <div className="flex items-center mt-4 md:flex-col md:mt-0">
      <button
        onClick={() => {
          Users.logout();
          onLogout();
          window.location.href = '/login';
        }}
        className="my-2 flex flex-col justify-center items-center space-x-2 text-lg md:flex-row md:space-x-4 md:space-y-2"
      >
        <img 
          src="../src/assets/icons/logout-icon.svg" 
          alt="Logout" 
          className="h-8 w-8" 
        />
        <span className='text-xl'>Logout</span>
      </button>
    </div>
  );
};

export default LogoutButton; 