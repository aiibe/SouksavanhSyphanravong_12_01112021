import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import ActivityChart from "../components/ActivityChart";
import KeyData from "../components/KeyData";
import NotFound from "../components/NotFound";
import PerformanceChart from "../components/PerformanceChart";
import ScoreChart from "../components/ScoreChart";
import SessionChart from "../components/SessionChart";
import "../css/User.css";
import Apple from "../icons/Apple";
import Burger from "../icons/Burger";
import Fire from "../icons/Fire";
import Potion from "../icons/Potion";
import UserService from "../service";
import { API_URL } from "../service/config";

/**
 * Display user page
 * @returns {JSX.Element}
 */
function User() {
  // Fetch data from mock by default
  const Service = useRef(new UserService());

  // Enable request from Express server by commenting out line below instead.
  // const Service = useRef(new UserService(API_URL));

  // States
  const [currentUser, setCurrentUser] = useState(null);
  const [fetched, setFetched] = useState(false);

  // Get user id from url params
  const { id } = useParams();

  useEffect(async () => {
    // Fetch all user data
    const user = await Service.current.fetchUserData(id);

    // Update states
    setFetched(true);
    setCurrentUser(user);
  }, []);

  /**
   * Data is loading...
   */
  if (!fetched) return <p>Loading...</p>;

  /**
   * User has not been found
   */
  if (!currentUser) return <NotFound />;

  return (
    <>
      <div className="announce">
        <h1 className="announce__title">
          Bonjour <span>{currentUser.profile.getFirstName()}</span>
        </h1>
        <p className="announce__body">
          Félicitation ! Vous avez explosé vos objectifs hier 👏
        </p>
      </div>

      <div className="chart">
        <div className="chart__main">
          <ActivityChart activity={currentUser.activity} />
          <div className="chart__misc">
            <SessionChart session={currentUser.sessions} />
            <PerformanceChart stats={currentUser.performance.getStats()} />
            <ScoreChart score={currentUser.profile.todayScore} />
          </div>
        </div>

        <div className="chart__aside">
          <KeyData
            title="Calories"
            unit="kCal"
            count={currentUser.profile.getCaloriesCount()}
            bgColor="rgba(255, 0, 0, 0.06)"
          >
            <Fire />
          </KeyData>
          <KeyData
            title="Proteines"
            unit="g"
            count={currentUser.profile.getProteinCount()}
            bgColor="rgba(74, 184, 255, 0.06)"
          >
            <Potion />
          </KeyData>
          <KeyData
            title="Glucides"
            unit="g"
            count={currentUser.profile.getCarbohydrateCount()}
            bgColor="rgba(253, 204, 12, 0.06)"
          >
            <Apple />
          </KeyData>
          <KeyData
            title="Lipides"
            unit="g"
            count={currentUser.profile.getLipidCount()}
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
