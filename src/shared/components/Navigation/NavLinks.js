import { NavLink } from "react-router-dom";
import { useContext } from "react";
import "./NavLinks.css";

import { AuthContext } from "../../contex/auth-context";

function NavLinks() {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/">ALL BLOGS</NavLink>
      </li>
      {/* <li>
        <NavLink to="/u1/posts">My Posts</NavLink>{" "}
      </li> */}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/posts/new">New Posts</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTH</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
}

export default NavLinks;
