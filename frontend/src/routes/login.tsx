import {Link} from 'react-router-dom';

import NavBar from '../components/NavBar/index';
import LoginForm from '../components/LoginForm/index';

export default function Login() {
    
  
    return (
      <>
        <NavBar />
        <div className="flex flex-col space-y-5 items-center my-20">
          <LoginForm />
          <Link to="/about"><button className="bg-gray-500/50 px-3 rounded-full">Home</button></Link>
        </div>
      </>
    );
  }