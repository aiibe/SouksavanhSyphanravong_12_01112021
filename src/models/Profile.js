import KeyData from "./KeyData";
import UserInfo from "./UserInfo";

class Profile {
  /**
   * Profile constructor
   * @param {number} id User ID
   * @param {UserInfo} userInfos UserInfo instance
   * @param {KeyData} keyData KeyData instance
   * @param {number} todayScore Score
   */
  constructor(id, userInfos, keyData, todayScore) {
    this.id = id;
    this.userInfos = userInfos;
    this.keyData = keyData;
    this.todayScore = todayScore;
  }

  getFirstName() {
    return this.userInfos.firstName;
  }

  getCaloriesCount() {
    return this.keyData.calorieCount;
  }

  getProteinCount() {
    return this.keyData.proteinCount;
  }

  getCarbohydrateCount() {
    return this.keyData.carbohydrateCount;
  }

  getLipidCount() {
    return this.keyData.lipidCount;
  }
}

export default Profile;
