import testRequest from '@/utils/testRequest'
import { getDefaultAxiosPayload } from '@/utils/functions'

/**
 * Get phishing result data for security growth dashboard
 * @param {string} targetUserResourceId - The resource ID of the target user
 * @returns {Promise} API response with phishing result data
 */
export const getPhishingResult = (targetUserResourceId) => {
  return testRequest.get(`/securitygrowthdashboard/phishing-result/${targetUserResourceId}`, {
    headers: {
      accept: 'application/json'
    }
  })
}

/**
 * Get top performance data for security growth dashboard
 * @param {string} targetUserResourceId - The resource ID of the target user
 * @returns {Promise} API response with top performance data
 */
export const getTopPerformance = (targetUserResourceId) => {
  return testRequest.get(`/securitygrowthdashboard/top-performance/${targetUserResourceId}`, {
    headers: {
      accept: 'application/json'
    }
  })
}

/**
 * Get my learning data for security growth dashboard
 * @param {string} targetUserResourceId - The resource ID of the target user
 * @returns {Promise} API response with learning data
 */
export const getMyLearning = (targetUserResourceId) => {
  const defaultPayload = getDefaultAxiosPayload({ orderBy: 'StartDate' })
  const payload = {
    pagination: {
      pageNumber: defaultPayload.pageNumber || 1,
      pageSize: 1000,
      orderBy: 'StartDate',
      ascending: defaultPayload.ascending !== undefined ? defaultPayload.ascending : false
    }
  }
  return testRequest.post(`/securitygrowthdashboard/my-learning/${targetUserResourceId}`, payload, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json-patch+json'
    }
  })
}

/**
 * Get user info for security growth dashboard
 * @param {string} targetUserResourceId - The resource ID of the target user
 * @returns {Promise} API response with user info data
 */
export const getUserInfo = (targetUserResourceId) => {
  return testRequest.get(`/securitygrowthdashboard/user-info/${targetUserResourceId}`, {
    headers: {
      accept: 'application/json'
    }
  })
}

/**
 * Get user timeline data for security growth dashboard
 * @param {Object} payload - The payload containing filters and pagination
 * @returns {Promise} API response with timeline data
 */
export const getUserTimeline = (payload) => {
  return testRequest.post(`/securitygrowthdashboard/user-timeline/${payload.targetUserResourceId}`, payload, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json-patch+json'
    }
  })
}
