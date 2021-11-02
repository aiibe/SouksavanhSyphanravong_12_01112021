import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { findUserById } from "../api/query";
import "../css/User.css";

function User() {
  const [currentUser, setUser] = useState(null);
  const [fetched, setFetched] = useState(false);
  const { id } = useParams();

  useEffect(async () => {
    /**
     * Find user and get infos
     */
    const user = await findUserById(id);
    setFetched(true);
    setUser(currentUser ? user : null);
  }, []);

  /**
   * Loading while getting user from API
   */
  if (!fetched) return <p>Loading...</p>;

  /**
   * User has not been found
   */
  if (!currentUser) return <p>404 - No user found</p>;

  return (
    <>
      <div className="announce">
        <h1 className="announce__title">
          Bonjour <span>{currentUser.userInfos.firstName}</span>
        </h1>
        <p className="announce__body">
          Félicitation ! Vous avez explosé vos objectifs hier 👏
        </p>
      </div>

      <div className="chart">
        <div className="chart__main">
          <div className="activity"></div>
          <div className="misc"></div>
        </div>
        <div className="chart__aside"></div>
      </div>
    </>
  );
}

export default User;
