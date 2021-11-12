/**
 * By default, user data comes from mockServer.js
 * which mocks our real API response
 */

import {
  mockFindUserById,
  mockGetUserActivity,
  mockGetUserPerformance,
  mockGetUserSession,
} from "./mockServer";

// Set API url and port if any
const API_URL = "http://localhost:3000";

// Should load data from local API ?
// Set to true will get data from local server
// at API_URL configured above
const CALL_FROM_API = false;

/**
 * Find auser by id
 * @param {number} id User ID
 * @returns Promise
 */
export async function findUserById(id) {
  const res = CALL_FROM_API
    ? await fetch(API_URL + "/user/" + id)
    : await mockFindUserById(id);
  const { data } = await res.json();
  return data;
}

/**
 * Get user activity by id
 * @param {number} id User ID
 * @returns Promise
 */
export async function getUserActivity(id) {
  const res = CALL_FROM_API
    ? await fetch(API_URL + "/user/" + id + "/activity")
    : await mockGetUserActivity(id);
  const { data } = await res.json();
  return data;
}

/**
 * Get user average sessions by id
 * @param {number} id User ID
 * @returns Promise
 */
export async function getUserSession(id) {
  const res = CALL_FROM_API
    ? await fetch(API_URL + "/user/" + id + "/average-sessions")
    : await mockGetUserSession(id);
  const { data } = await res.json();
  return data;
}

/**
 * Get user performance stats
 * @param {number} id User Id
 * @returns Promise
 */
export async function getUserPerformance(id) {
  const res = CALL_FROM_API
    ? await fetch(API_URL + "/user/" + id + "/performance")
    : await mockGetUserPerformance(id);
  const { data } = await res.json();
  return data;
}
