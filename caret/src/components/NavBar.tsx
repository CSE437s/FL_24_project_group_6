import { NavLink } from 'react-router-dom';

export const NavBar= () =>{
return(
    <nav className=" flex justify-between items-center">
      <ul className="w-full grid grid-flow-col text-center border-b border-gray-200 text-gray-500 z-50 ">
        <li>
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
            `flex justify-center border-b-2 py-2 ${
              isActive 
                ? 'text-customOrangeDark border-customOrangeDark'
                : 'border-transparent hover:text-customOrangeDark hover:border-customOrangeDark'
            }`
          }
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/home" 
            className={({ isActive }) => 
              `flex justify-center border-b-2 py-2 ${
                isActive 
                  ? 'text-customOrangeDark border-customOrangeDark'
                  : 'border-transparent hover:text-customOrangeDark hover:border-customOrangeDark'
              }`
            }
          >
            Feed
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/my_comments" 
            className={({ isActive }) => 
            `flex justify-center border-b-2 py-2 ${
              isActive 
                ? 'text-customOrangeDark border-customOrangeDark'
                : 'border-transparent hover:text-customOrangeDark hover:border-customOrangeDark'
            }`
          }
          >
            My Comments
          </NavLink>
        </li>
      </ul>
    </nav>
)
};