import {Link} from 'react-router-dom';

import LoginForm from '../components/LoginForm/index';

export default function Login() {
    
  
    return (
      <>
        <div className="flex flex-col space-y-5 items-center my-20">
          <LoginForm />
        </div>
      </>
    );
  }