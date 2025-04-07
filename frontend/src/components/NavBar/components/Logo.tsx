import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div className="my-4 md:my-0">
      <Link to="/home">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/1245px-Logo_of_Twitter.svg.png" 
          alt="Logo twitter" 
          className="h-8 w-8" 
        />
      </Link>
    </div>
  );
};

export default Logo; 