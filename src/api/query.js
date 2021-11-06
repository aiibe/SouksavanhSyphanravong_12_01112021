const BASE_URL = "http://localhost:3000";

/**
 * Find auser by id
 * @param {number} id User ID
 * @returns Promise
 */
export async function findUserById(id) {
  const res = await fetch(BASE_URL + "/user/" + id);
  const { data } = await res.json();
  return data;
}

/**
 * Get user activity by id
 * @param {number} id User ID
 */
export async function getUserActivity(id) {
  const res = await fetch(BASE_URL + "/user/" + id + "/activity");
  const { data } = await res.json();
  return data;
}
