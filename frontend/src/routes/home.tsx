import { Link } from 'react-router-dom';

import NavBar from '../components/NavBar/index';
import MainPage from '../components/Feed';

export default function Home() {


  return (
    <>
      <div className="content flex flex-col space-y-5 items-center">
        <MainPage />
      </div>
    </>
  );
}