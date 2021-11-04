import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { findUserById } from "../api/query";
import KeyData from "../components/KeyData";
import "../css/User.css";
import Apple from "../icons/Apple";
import Burger from "../icons/Burger";
import Fire from "../icons/Fire";
import Potion from "../icons/Potion";

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
    setUser(user ? user : null);
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

        <div className="chart__aside">
          <KeyData
            title="Calories"
            unit="kCal"
            count={currentUser.keyData.calorieCount}
            bgColor="rgba(255, 0, 0, 0.06)"
          >
            <Fire />
          </KeyData>
          <KeyData
            title="Proteines"
            unit="g"
            count={currentUser.keyData.proteinCount}
            bgColor="rgba(74, 184, 255, 0.06)"
          >
            <Potion />
          </KeyData>
          <KeyData
            title="Glucides"
            unit="g"
            count={currentUser.keyData.carbohydrateCount}
            bgColor="rgba(253, 204, 12, 0.06)"
          >
            <Apple />
          </KeyData>
          <KeyData
            title="Lipides"
            unit="g"
            count={currentUser.keyData.lipidCount}
            bgColor="rgba(253, 81, 129, 0.06)"
          >
            <Burger />
          </KeyData>
        </div>
      </div>
    </>
  );
}

export default User;
