import {Link} from 'react-router-dom';


export default function NavBar() {

    return (

<nav
  className="flex-no-wrap relative flex w-full items-center justify-between bg-zinc-50 py-2 shadow-dark-mild dark:bg-neutral-700 lg:flex-wrap lg:justify-start lg:py-4">
  <div className="flex w-full flex-wrap items-center justify-between px-3"> 
   
    <div className="list-style-none me-auto flex flex-col ps-0 lg:flex-row text-white space-x-2">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/1245px-Logo_of_Twitter.svg.png" alt="Logo twitter" className="h-6 w-6" />
    </div>
    
  </div>
</nav>
    );

}

