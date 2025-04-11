import {Link} from 'react-router-dom';

import NavBar from '../components/NavBar/index';
import SignInForm from '../components/SignInForm/index';

export default function SignIn() {
  
    return (
      <>
        <div className="flex flex-col space-y-5 items-center my-20">
          <SignInForm />
        </div>
      </>
    );
  }