import usersDashboardRequest from '@/utils/usersDashboardRequest'
import authTestRequest from '@/utils/authTestRequest'
import { getDefaultAxiosPayload } from '@/utils/functions'

/**
 * Login to security growth dashboard
 * @param {string} username - The user's email address
 * @returns {Promise} API response with authentication token
 */
export const login = (username) => {
  return usersDashboardRequest.post(
    '/securitygrowthauth/login',
    {
      username
    },
    {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  )
}

/**
 * Login with SAML for security growth dashboard
 * @param {Object} payload - The payload containing authcode and username
 * @returns {Promise} API response with authentication token
 */
export const loginWithSaml = (payload) => {
  const { username, authcode } = payload
  const params = new URLSearchParams()
  params.append('grant_type', 'security_growth_oauth')
  params.append('username', username)
  params.append('scope', 'security_growth')
  params.append('client_secret', 'SiZl6JK2jy')
  params.append('client_id', 'security_growth_client')
  params.append('authcode', authcode)
  return authTestRequest.post('connect/token', params, {
    loading: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * Send Magic Link email for security growth dashboard
 * @param {string} email - The user's email address
 * @returns {Promise} API response
 */
export const sendMagicLink = (email) => {
  return usersDashboardRequest.post(
    '/securitygrowthauth/send-magic-link',
    {
      email
    },
    {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json-patch+json'
      }
    }
  )
}

/**
 * Login with Magic Link for security growth dashboard
 * @param {string} magicLinkToken - The magic link token from URL
 * @returns {Promise} API response with authentication token
 */
export const loginWithMagicLink = (magicLinkToken) => {
  const params = new URLSearchParams()
  params.append('grant_type', 'security_growth_oauth')
  params.append('scope', 'security_growth')
  params.append('client_secret', 'SiZl6JK2jy')
  params.append('client_id', 'security_growth_client')
  params.append('magic_link_token', magicLinkToken)
  return authTestRequest.post('connect/token', params, {
    loading: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * Get phishing result data for security growth dashboard
 * @returns {Promise} API response with phishing result data
 */
export const getPhishingResult = () => {
  return usersDashboardRequest.get(`/securitygrowthdashboard/phishing-result`, {
    headers: {
      accept: 'application/json'
    }
  })
}

/**
 * Get top performance data for security growth dashboard
 * @returns {Promise} API response with top performance data
 */
export const getTopPerformance = () => {
  return usersDashboardRequest.get(`/securitygrowthdashboard/top-performance`, {
    headers: {
      accept: 'application/json'
    }
  })
}

/**
 * Get my learning data for security growth dashboard
 * @returns {Promise} API response with learning data
 */
export const getMyLearning = () => {
  const defaultPayload = getDefaultAxiosPayload({ orderBy: 'StartDate' })
  const payload = {
    pagination: {
      pageNumber: defaultPayload.pageNumber || 1,
      pageSize: 1000,
      orderBy: 'StartDate',
      ascending: defaultPayload.ascending ?? false
    }
  }
  return usersDashboardRequest.post(`/securitygrowthdashboard/my-learning`, payload, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json-patch+json'
    }
  })
}

/**
 * Get user info for security growth dashboard
 * @returns {Promise} API response with user info data
 */
export const getUserInfo = () => {
  return usersDashboardRequest.get(`/securitygrowthdashboard/user-info`, {
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
  return usersDashboardRequest.post(`/securitygrowthdashboard/user-timeline`, payload, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json-patch+json'
    }
  })
}

/**
 * Get my certificates data for security growth dashboard
 * @returns {Promise} API response with certificates data
 */
export const getMyCertificates = () => {
  const payload = {
    pagination: {
      pageNumber: 1,
      pageSize: 1000,
      orderBy: 'StartDate',
      ascending: false
    }
  }
  return usersDashboardRequest.post(`/securitygrowthdashboard/my-certificates`, payload, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json-patch+json'
    }
  })
}

/**
 * Get my badges data for security growth dashboard
 * @returns {Promise} API response with badges data
 */
export const getMyBadges = () => {
  return usersDashboardRequest.get(`/securitygrowthdashboard/my-badges`, {
    headers: {
      accept: 'application/json'
    }
  })
}

/**
 * Download certificate PDF for security growth dashboard
 * @param {string} enrollmentId - The enrollment ID of the certificate
 * @returns {Promise} API response with PDF blob
 */
export const downloadCertificate = (enrollmentId) => {
  return usersDashboardRequest.get(
    `/securitygrowthdashboard/certificate-download/${enrollmentId}`,
    {
      responseType: 'blob',
      headers: {
        accept: 'application/pdf'
      }
    }
  )
}
