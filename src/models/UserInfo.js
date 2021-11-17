class UserInfo {
  /**
   * Constructor
   * @param {{age: number, lastName: string, firstName: string}} param0 User infos
   */
  constructor({ age, lastName, firstName }) {
    this.age = age;
    this.lastName = lastName;
    this.firstName = firstName;
  }
}

export default UserInfo;
