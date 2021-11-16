import { API_URL } from "./config";

/**
 * Find a user by id
 * @param {number} id User ID
 * @returns Promise
 */
export async function findUserById(id) {
  return fetch(API_URL + "/user/" + id);
}

/**
 * Get user activity by id
 * @param {number} id User ID
 * @returns Promise
 */
export async function getUserActivity(id) {
  return fetch(API_URL + "/user/" + id + "/activity");
}

/**
 * Get user average sessions by id
 * @param {number} id User ID
 * @returns Promise
 */
export async function getUserSession(id) {
  return fetch(API_URL + "/user/" + id + "/average-sessions");
}

/**
 * Get user performance stats
 * @param {number} id User Id
 * @returns Promise
 */
export async function getUserPerformance(id) {
  return fetch(API_URL + "/user/" + id + "/performance");
}
