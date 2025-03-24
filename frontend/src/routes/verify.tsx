import {Link} from 'react-router-dom';

import VerificationForm from '../components/VerificationForm/index';

export default function Verify() {
    
  
    return (
      <>
        <div className="flex flex-col space-y-5 items-center my-20">
          <VerificationForm />
        </div>
      </>
    );
  }