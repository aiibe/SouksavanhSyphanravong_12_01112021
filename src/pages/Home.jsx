import { Link } from "react-router-dom";
import "../css/Home.css";

/**
 * Display home page
 * @returns {JSX.Element}
 */
function Home() {
  return (
    <div className="landing">
      <h1 className="landing__title">Choose a profile :</h1>
      <ul className="landing__list">
        <li className="landing__link">
          <Link to="/user/12">See profile 12</Link>
        </li>
        <li className="landing__link">
          <Link to="user/18">See profile 18</Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;
