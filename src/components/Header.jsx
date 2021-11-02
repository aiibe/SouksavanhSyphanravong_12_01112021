import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../css/Header.css";

function Header() {
  return (
    <header>
      <nav className="nav">
        <Link to="/" className="nav__logo">
          <img src={logo} alt="SportSee Logo" />
        </Link>
        <div className="menu">
          <Link className="menu__link" to="/">
            Accueil
          </Link>
          <Link className="menu__link" to="/">
            Profil
          </Link>
          <Link className="menu__link" to="/">
            Réglage
          </Link>
          <Link className="menu__link" to="/">
            Communauté
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
