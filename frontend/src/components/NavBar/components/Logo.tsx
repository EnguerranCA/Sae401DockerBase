import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div className="my-4 md:my-0">
      <Link to="/home">
        <img 
          src="./src/assets/icons/Logo-text.svg"
          alt="Logo twitter"
          className="h-8 hidden md:block"
        />
        <img
          src="./src/assets/icons/Logo.svg"
          alt="Logo twitter"
          className="h-8 block md:hidden" 
        />
      </Link>
    </div>
  );
};

export default Logo;