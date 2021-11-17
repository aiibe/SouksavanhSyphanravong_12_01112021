class ActivitySession {
  /**
   * Activity session constructor
   * @param {number} day Day number
   * @param {number} kilogram Weight
   * @param {number} calories Calorie
   */
  constructor(day, kilogram, calories) {
    this.day = day;
    this.kilogram = kilogram;
    this.calories = calories;
  }
}

export default ActivitySession;
