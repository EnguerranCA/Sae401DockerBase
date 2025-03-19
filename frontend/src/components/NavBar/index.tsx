import {Link} from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="flex-no-wrap relative flex w-full items-center justify-center py-2 shadow-dark-mild bg-white lg:flex-wrap lg:justify-center lg:py-4">
      <div className="flex w-full flex-wrap items-center justify-center px-3">
        <div className="flex items-center ">
          <Link to="/home">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/1245px-Logo_of_Twitter.svg.png" alt="Logo twitter" className="h-6" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
