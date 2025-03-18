import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

import NavBar from '../components/NavBar/index';

export default function Root() {
  return (
    <>
      <NavBar />
      <section>
        <Outlet />
      </section>
    </>
  );
}
