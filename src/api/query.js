const BASE_URL = "http://localhost:3000";

/**
 * Find auser by id
 * @param {number} id User ID
 * @returns Promise
 */
export async function findUserById(id = 12) {
  const res = await fetch(BASE_URL + "/user/" + id);
  const data = await res.json();
  return data;
}
