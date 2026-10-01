import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import logo from "../assets/github-mark-white.svg";
import "./navbar.css";

const Navbar = () => {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    navigate("/auth");
  };

  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        <Link className="brand-link" to="/" aria-label="GitHub home">
          <img src={logo} alt="" />
          <span>GitHub</span>
        </Link>

        <nav className="site-nav-links" aria-label="Main navigation">
          <NavLink to="/" end>
            Overview
          </NavLink>
          <NavLink to="/starred">Starred</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>

        <div className="site-nav-actions">
          <Link className="nav-create-button" to="/create">
            <span aria-hidden="true">+</span>
            <span>Create repository</span>
          </Link>
          {localStorage.getItem("userId") && (
            <button className="nav-logout-button" onClick={handleLogout} type="button">
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
