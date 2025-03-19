import {Link} from 'react-router-dom';

import NavBar from '../components/NavBar/index';
import SignInForm from '../components/SignInForm/index';

export default function SignIn() {
  
    return (
      <>
        <NavBar />
        <div className="flex flex-col space-y-5 items-center my-20">
          <SignInForm />
          <Link to="/about"><button className="bg-gray-500/50 px-3 rounded-full">Home</button></Link>
        </div>
      </>
    );
  }