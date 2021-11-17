import PerformanceData from "./PerformanceData";

class Performance {
  /**
   * Constructor
   * @param {Array<PerformanceData>} data Stat data
   */
  constructor(data) {
    this.data = data;
    this.labels = [
      "Cardio",
      "Energie",
      "Endurance",
      "Force",
      "Vitesse",
      "Intensité",
    ];
  }

  /**
   * Get performance stats in French labels
   * @returns {Object[]} Performance stats
   */
  getStats() {
    return this.data.map((session, index) => ({
      ...session,
      kind: this.labels[index], // Map kind with new label in French
    }));
  }
}

export default Performance;
