class KeyData {
  /**
   * KeyData constructor
   * @param {{calorieCount: number, proteinCount: number, carbohydrateCount: number, lipidCount: number }} param0 keyData
   */
  constructor({ calorieCount, proteinCount, carbohydrateCount, lipidCount }) {
    this.calorieCount = calorieCount;
    this.proteinCount = proteinCount;
    this.carbohydrateCount = carbohydrateCount;
    this.lipidCount = lipidCount;
  }
}

export default KeyData;
