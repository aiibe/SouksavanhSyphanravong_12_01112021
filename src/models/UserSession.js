import Session from "./Session";

class UserSession {
  /**
   * Constructor
   * @param {number} userId User ID
   * @param {Array<Session>} sessions User sessions
   */
  constructor(userId, sessions) {
    this.userId = userId;
    this.sessions = sessions;
    this.days = ["L", "M", "M", "J", "V", "S", "D"];
  }

  /**
   * Get all user sessions
   * @returns Array of sessions
   */
  getSessions() {
    return this.sessions.map((s, i) => ({ ...s, letter: this.days[i] }));
  }

  /**
   * Get only session durations
   * @returns Array of session duration
   */
  getDurations() {
    return this.sessions.map(({ sessionLength }) => sessionLength);
  }

  /**
   * Get over sessions with fake data added on left and right
   * @returns Array of over sessions data
   */
  getOverSessions() {
    const sessions = this.getSessions();
    const { sessionLength } = sessions[0];
    return [
      new Session(0, sessionLength), // fake data
      ...this.getSessions(),
      new Session(10, sessionLength), // fake data
    ];
  }
}

export default UserSession;
