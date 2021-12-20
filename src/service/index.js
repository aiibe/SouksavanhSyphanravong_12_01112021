import {
  getUserActivity,
  getUserById,
  getUserPerformance,
  getUserSession,
} from "../mock/server";
import Activity from "../models/Activity";
import ActivitySession from "../models/ActivitySession";
import KeyData from "../models/KeyData";
import Performance from "../models/Performance";
import PerformanceData from "../models/PerformanceData";
import Profile from "../models/Profile";
import Session from "../models/Session";
import UserInfo from "../models/UserInfo";
import UserSession from "../models/UserSession";

/**
 * Service requests data
 */
class UserService {
  /**
   * User service constructor
   * @param {string} apiUrl API url, otherwise data from mock server
   */
  constructor(apiUrl) {
    this.apiUrl = apiUrl || undefined;
  }

  /**
   * Get user by ID
   * @param {number} userId User ID
   * @returns {Promise.<Profile>} Profile instance
   */
  async getUserById(userId) {
    const res = this.apiUrl
      ? await fetch(this.apiUrl + "/user/" + userId)
      : await getUserById(userId);
    const { data } = await res.json();
    if (!data) return null;

    // Serialize data
    const keyData = new KeyData(data.keyData);
    const userInfos = new UserInfo(data.userInfos);
    const todayScore = data.todayScore || data.score;
    return new Profile(data.id, userInfos, keyData, todayScore);
  }

  /**
   * Get user activity by ID
   * @param {number} id User ID
   * @returns {Promise<Activity>} Activity instance
   */
  async getUserActivity(id) {
    const res = this.apiUrl
      ? await fetch(this.apiUrl + "/user/" + id + "/activity")
      : await getUserActivity(id);
    const { data } = await res.json();
    if (!data) return null;

    // Serialize data
    const userId = data.userId;
    const sessions = data.sessions.map(
      ({ day, kilogram, calories }) =>
        new ActivitySession(day, kilogram, calories)
    );
    return new Activity(userId, sessions);
  }

  /**
   * Get user average sessions by id
   * @param {number} id User ID
   * @returns {Promise<UserSession>} UserSession instance
   */
  async getUserSession(id) {
    const res = this.apiUrl
      ? await fetch(this.apiUrl + "/user/" + id + "/average-sessions")
      : await getUserSession(id);
    const { data } = await res.json();
    if (!data) return null;

    // Serialize data
    const sessions = data.sessions.map(
      ({ day, sessionLength }) => new Session(day, sessionLength)
    );

    return new UserSession(data.userId, sessions);
  }

  /**
   * Get user performance stats
   * @param {number} id User Id
   * @returns {Promise<Performance>} Performance instance
   */
  async getUserPerformance(id) {
    const res = this.apiUrl
      ? await fetch(this.apiUrl + "/user/" + id + "/performance")
      : await getUserPerformance(id);
    const json = await res.json();
    if (!json) return null;

    // Serialize data
    const { data } = json.data;
    const stats = data.map(
      ({ value, kind }) => new PerformanceData(value, kind)
    );
    return new Performance(stats);
  }

  /**
   * Get all user data including details, activity, sessions and performance stats
   * @param {number} id User ID
   * @returns {Promise<{profile: Profile, activity: Activity, sessions: UserSession, performance: Performance}>} All user instances
   */
  async fetchUserData(id) {
    try {
      const [profile, activity, sessions, performance] = await Promise.all([
        this.getUserById(id),
        this.getUserActivity(id),
        this.getUserSession(id),
        this.getUserPerformance(id),
      ]);
      return {
        profile,
        activity,
        sessions,
        performance,
      };
    } catch (error) {
      console.log(error);
    }
  }
}

export default UserService;
