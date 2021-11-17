import ActivitySession from "./ActivitySession";

class Activity {
  /**
   * Constructor
   * @param {number} userId User ID
   * @param {Array.<ActivitySession>} sessions User activity sessions
   */
  constructor(userId, sessions) {
    this.sessions = sessions;
    this.userId = userId;
  }

  /**
   * Get all activity sessions
   * @returns Array of all activity sessions
   */
  getSessions() {
    return this.sessions;
  }

  /**
   * Get only activity weights
   * @returns Array of weights
   */
  getWeights() {
    return this.sessions.map(({ kilogram }) => parseInt(kilogram));
  }

  /**
   * Get only activity calories
   * @returns Array of calories
   */
  getCalories() {
    return this.sessions.map(({ calories }) => parseInt(calories));
  }
}

export default Activity;
