jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({})
}))

jest.mock('@/services/authentication', () => ({
  getToken: jest.fn().mockReturnValue('mock-token')
}))

import axios from 'axios'
import AuthenticationService from '@/services/authentication'
import { sendAutonomous, sendBatchAutonomous, retryAutonomous } from '@/api/agenticAIService'

// jsdom sets hostname to 'localhost', so BASE_URL resolves to local endpoint
const BASE_URL = 'http://localhost:4111'
const headers = { 'Content-Type': 'application/json' }

const retryParams = {
  targetUserResourceId: 'usr-retry-1',
  firstName: 'Ahmet',
  lastName: 'Yılmaz',
  departmentName: 'Finance',
  actions: ['phishing'],
  preferredLanguage: 'tr',
  batchResourceId: 'batch-001',
  rejectingReason: 'Scenario too aggressive',
  rejectedScenarioResourceId: 'scn-789'
}

describe('agenticAIService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('companyRequestId', 'company-request-1')
    localStorage.setItem('companyId', 'company-fallback-1')
  })

  describe('sendAutonomous', () => {
    it('should call axios.post with correct endpoint and payload', async () => {
      const params = {
        preferredLanguage: 'tr',
        targetUserResourceId: 'usr-123',
        departmentName: 'Finance',
        actions: ['phishing', 'training'],
        sendAfterPhishingSimulation: true
      }

      await sendAutonomous(params)

      expect(axios.post).toHaveBeenCalledWith(
        `${BASE_URL}/autonomous`,
        {
          token: 'mock-token',
          preferredLanguage: 'tr',
          targetUserResourceId: 'usr-123',
          departmentName: 'Finance',
          actions: ['phishing', 'training'],
          sendAfterPhishingSimulation: true,
          companyId: 'company-request-1'
        },
        { headers }
      )
    })

    it('should default sendAfterPhishingSimulation to false', async () => {
      await sendAutonomous({
        preferredLanguage: 'en',
        targetUserResourceId: 'usr-456',
        departmentName: 'IT',
        actions: ['training']
      })

      expect(axios.post).toHaveBeenCalledWith(
        `${BASE_URL}/autonomous`,
        expect.objectContaining({
          sendAfterPhishingSimulation: false,
          companyId: 'company-request-1'
        }),
        { headers }
      )
    })

    it('should call AuthenticationService.getToken', async () => {
      await sendAutonomous({
        preferredLanguage: 'en',
        targetUserResourceId: 'usr-789',
        departmentName: 'HR',
        actions: ['phishing']
      })

      expect(AuthenticationService.getToken).toHaveBeenCalled()
    })

    it('should return a thenable', () => {
      const result = sendAutonomous({
        preferredLanguage: 'en',
        targetUserResourceId: 'usr-1',
        departmentName: 'Sales',
        actions: ['phishing']
      })

      expect(result).toBeDefined()
      expect(typeof result.then).toBe('function')
    })

    it('should propagate errors', async () => {
      const error = new Error('Network error')
      axios.post.mockRejectedValueOnce(error)

      await expect(
        sendAutonomous({
          preferredLanguage: 'en',
          targetUserResourceId: 'usr-err',
          departmentName: 'IT',
          actions: ['phishing']
        })
      ).rejects.toThrow('Network error')
    })

    it('should send single phishing action', async () => {
      await sendAutonomous({
        preferredLanguage: 'en',
        targetUserResourceId: 'usr-p1',
        departmentName: 'IT',
        actions: ['phishing']
      })

      const payload = axios.post.mock.calls[0][1]
      expect(payload.actions).toEqual(['phishing'])
      expect(payload.actions).toHaveLength(1)
    })

    it('should send single training action', async () => {
      await sendAutonomous({
        preferredLanguage: 'de',
        targetUserResourceId: 'usr-t1',
        departmentName: 'Legal',
        actions: ['training']
      })

      const payload = axios.post.mock.calls[0][1]
      expect(payload.actions).toEqual(['training'])
    })

    it('should send both phishing and training actions', async () => {
      await sendAutonomous({
        preferredLanguage: 'fr',
        targetUserResourceId: 'usr-both',
        departmentName: 'Marketing',
        actions: ['phishing', 'training'],
        sendAfterPhishingSimulation: true
      })

      const payload = axios.post.mock.calls[0][1]
      expect(payload.actions).toEqual(['phishing', 'training'])
      expect(payload.sendAfterPhishingSimulation).toBe(true)
      expect(payload.companyId).toBe('company-request-1')
    })

    it('should always use POST method', async () => {
      await sendAutonomous({
        preferredLanguage: 'en',
        targetUserResourceId: 'usr-method',
        departmentName: 'IT',
        actions: ['phishing']
      })

      expect(axios.post).toHaveBeenCalledTimes(1)
    })

    it('should always include Content-Type header', async () => {
      await sendAutonomous({
        preferredLanguage: 'en',
        targetUserResourceId: 'usr-header',
        departmentName: 'IT',
        actions: ['training']
      })

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        { headers: { 'Content-Type': 'application/json' } }
      )
    })

    it('should pass fresh token on each call', async () => {
      AuthenticationService.getToken.mockReturnValueOnce('token-1')
      await sendAutonomous({
        preferredLanguage: 'en',
        targetUserResourceId: 'usr-a',
        departmentName: 'IT',
        actions: ['phishing']
      })

      AuthenticationService.getToken.mockReturnValueOnce('token-2')
      await sendAutonomous({
        preferredLanguage: 'en',
        targetUserResourceId: 'usr-b',
        departmentName: 'IT',
        actions: ['phishing']
      })

      expect(axios.post.mock.calls[0][1].token).toBe('token-1')
      expect(axios.post.mock.calls[1][1].token).toBe('token-2')
    })
  })

  describe('sendBatchAutonomous', () => {
    it('should call axios.post with batch-autonomous endpoint and payload', async () => {
      const params = {
        targetGroupResourceId: 'grp-123',
        actions: ['training', 'phishing'],
        sendAfterPhishingSimulation: true
      }

      await sendBatchAutonomous(params)

      expect(axios.post).toHaveBeenCalledWith(
        `${BASE_URL}/batch-autonomous`,
        {
          token: 'mock-token',
          targetGroupResourceId: 'grp-123',
          actions: ['training', 'phishing'],
          sendAfterPhishingSimulation: true,
          companyId: 'company-request-1'
        },
        { headers }
      )
    })

    it('should default sendAfterPhishingSimulation to false', async () => {
      await sendBatchAutonomous({
        targetGroupResourceId: 'grp-456',
        actions: ['training']
      })

      expect(axios.post).toHaveBeenCalledWith(
        `${BASE_URL}/batch-autonomous`,
        expect.objectContaining({
          sendAfterPhishingSimulation: false,
          companyId: 'company-request-1'
        }),
        { headers }
      )
    })

    it('should return a thenable', () => {
      const result = sendBatchAutonomous({
        targetGroupResourceId: 'grp-1',
        actions: ['phishing']
      })

      expect(result).toBeDefined()
      expect(typeof result.then).toBe('function')
    })

    it('should propagate errors', async () => {
      const error = new Error('Server error')
      axios.post.mockRejectedValueOnce(error)

      await expect(
        sendBatchAutonomous({
          targetGroupResourceId: 'grp-err',
          actions: ['training']
        })
      ).rejects.toThrow('Server error')
    })

    it('should use /batch-autonomous endpoint not /autonomous', async () => {
      await sendBatchAutonomous({
        targetGroupResourceId: 'grp-endpoint',
        actions: ['phishing']
      })

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/batch-autonomous'),
        expect.any(Object),
        expect.any(Object)
      )
    })

    it('should not include targetUserResourceId in payload', async () => {
      await sendBatchAutonomous({
        targetGroupResourceId: 'grp-no-user',
        actions: ['training']
      })

      const payload = axios.post.mock.calls[0][1]
      expect(payload.targetGroupResourceId).toBe('grp-no-user')
      expect(payload).not.toHaveProperty('targetUserResourceId')
    })

    it('should pass fresh token on each call', async () => {
      AuthenticationService.getToken.mockReturnValueOnce('batch-token-1')
      await sendBatchAutonomous({ targetGroupResourceId: 'grp-a', actions: ['phishing'] })

      AuthenticationService.getToken.mockReturnValueOnce('batch-token-2')
      await sendBatchAutonomous({ targetGroupResourceId: 'grp-b', actions: ['training'] })

      expect(axios.post.mock.calls[0][1].token).toBe('batch-token-1')
      expect(axios.post.mock.calls[1][1].token).toBe('batch-token-2')
    })

    it('should send both actions with sendAfterPhishingSimulation', async () => {
      await sendBatchAutonomous({
        targetGroupResourceId: 'grp-both',
        actions: ['phishing', 'training'],
        sendAfterPhishingSimulation: true
      })

      const payload = axios.post.mock.calls[0][1]
      expect(payload.actions).toEqual(['phishing', 'training'])
      expect(payload.sendAfterPhishingSimulation).toBe(true)
      expect(payload.companyId).toBe('company-request-1')
    })

    it('should fallback to companyId when companyRequestId is missing', async () => {
      localStorage.removeItem('companyRequestId')
      localStorage.removeItem('companyResourceId')

      await sendBatchAutonomous({
        targetGroupResourceId: 'grp-fallback',
        actions: ['training']
      })

      const payload = axios.post.mock.calls[0][1]
      expect(payload.companyId).toBe('company-fallback-1')
    })

    it('should fallback to companyResourceId before companyId', async () => {
      localStorage.removeItem('companyRequestId')
      localStorage.setItem('companyResourceId', 'company-resource-1')

      await sendBatchAutonomous({
        targetGroupResourceId: 'grp-resource',
        actions: ['training']
      })

      const payload = axios.post.mock.calls[0][1]
      expect(payload.companyId).toBe('company-resource-1')
    })
  })

  describe('retryAutonomous', () => {
    it('should call axios.post with correct endpoint and full payload', async () => {
      await retryAutonomous(retryParams)

      expect(axios.post).toHaveBeenCalledWith(
        `${BASE_URL}/autonomous`,
        {
          token: 'mock-token',
          baseApiUrl: expect.any(String),
          targetUserResourceId: 'usr-retry-1',
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          departmentName: 'Finance',
          actions: ['phishing'],
          sendAfterPhishingSimulation: false,
          preferredLanguage: 'tr',
          batchResourceId: 'batch-001',
          rejectingReason: 'Scenario too aggressive',
          rejectedScenarioResourceId: 'scn-789',
          companyId: 'company-request-1'
        },
        { headers }
      )
    })

    it('should include baseApiUrl in payload', async () => {
      await retryAutonomous(retryParams)

      const payload = axios.post.mock.calls[0][1]
      expect(payload.baseApiUrl).toBeDefined()
      expect(typeof payload.baseApiUrl).toBe('string')
    })

    it('should strip trailing /api from baseApiUrl to avoid double /api', async () => {
      await retryAutonomous(retryParams)

      const payload = axios.post.mock.calls[0][1]
      expect(payload.baseApiUrl).not.toMatch(/\/api\/?$/)
    })

    it('should default sendAfterPhishingSimulation to false', async () => {
      await retryAutonomous(retryParams)

      expect(axios.post).toHaveBeenCalledWith(
        `${BASE_URL}/autonomous`,
        expect.objectContaining({
          sendAfterPhishingSimulation: false,
          companyId: 'company-request-1'
        }),
        { headers }
      )
    })

    it('should allow overriding sendAfterPhishingSimulation', async () => {
      await retryAutonomous({ ...retryParams, sendAfterPhishingSimulation: true })

      expect(axios.post).toHaveBeenCalledWith(
        `${BASE_URL}/autonomous`,
        expect.objectContaining({ sendAfterPhishingSimulation: true }),
        { headers }
      )
    })

    it('should support training action type', async () => {
      await retryAutonomous({ ...retryParams, actions: ['training'] })

      expect(axios.post).toHaveBeenCalledWith(
        `${BASE_URL}/autonomous`,
        expect.objectContaining({ actions: ['training'] }),
        { headers }
      )
    })

    it('should call AuthenticationService.getToken', async () => {
      await retryAutonomous(retryParams)

      expect(AuthenticationService.getToken).toHaveBeenCalled()
    })

    it('should return a thenable', () => {
      const result = retryAutonomous(retryParams)

      expect(result).toBeDefined()
      expect(typeof result.then).toBe('function')
    })

    it('should propagate errors', async () => {
      const error = new Error('Retry failed')
      axios.post.mockRejectedValueOnce(error)

      await expect(retryAutonomous(retryParams)).rejects.toThrow('Retry failed')
    })

    it('should use /autonomous endpoint same as sendAutonomous', async () => {
      await retryAutonomous(retryParams)

      expect(axios.post).toHaveBeenCalledWith(
        `${BASE_URL}/autonomous`,
        expect.any(Object),
        expect.any(Object)
      )
    })

    it('should include all retry-specific fields not present in sendAutonomous', async () => {
      await retryAutonomous(retryParams)

      const payload = axios.post.mock.calls[0][1]
      expect(payload).toHaveProperty('baseApiUrl')
      expect(payload).toHaveProperty('firstName', 'Ahmet')
      expect(payload).toHaveProperty('lastName', 'Yılmaz')
      expect(payload).toHaveProperty('batchResourceId', 'batch-001')
      expect(payload).toHaveProperty('rejectingReason', 'Scenario too aggressive')
      expect(payload).toHaveProperty('rejectedScenarioResourceId', 'scn-789')
      expect(payload).toHaveProperty('companyId', 'company-request-1')
    })

    it('should pass rejectingReason with special characters', async () => {
      const reason = 'Senaryo çok agresif, "invoice" temalı olmasın & IT support temalı olsun.'
      await retryAutonomous({ ...retryParams, rejectingReason: reason })

      const payload = axios.post.mock.calls[0][1]
      expect(payload.rejectingReason).toBe(reason)
    })

    it('should pass fresh token on each call', async () => {
      AuthenticationService.getToken.mockReturnValueOnce('retry-token-1')
      await retryAutonomous(retryParams)

      AuthenticationService.getToken.mockReturnValueOnce('retry-token-2')
      await retryAutonomous(retryParams)

      expect(axios.post.mock.calls[0][1].token).toBe('retry-token-1')
      expect(axios.post.mock.calls[1][1].token).toBe('retry-token-2')
    })

    it('should handle empty string fields gracefully', async () => {
      await retryAutonomous({
        ...retryParams,
        firstName: '',
        lastName: '',
        preferredLanguage: '',
        rejectedScenarioResourceId: ''
      })

      const payload = axios.post.mock.calls[0][1]
      expect(payload.firstName).toBe('')
      expect(payload.lastName).toBe('')
      expect(payload.preferredLanguage).toBe('')
      expect(payload.rejectedScenarioResourceId).toBe('')
    })

    it('should not alter the original params object', async () => {
      const original = { ...retryParams }
      await retryAutonomous(retryParams)

      expect(retryParams).toEqual(original)
    })
  })

  describe('endpoint resolution', () => {
    it('should use localhost URL when hostname is localhost', async () => {
      await sendAutonomous({
        preferredLanguage: 'en',
        targetUserResourceId: 'usr-url',
        departmentName: 'IT',
        actions: ['phishing']
      })

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('localhost:4111'),
        expect.any(Object),
        expect.any(Object)
      )
    })
  })

  describe('cross-function consistency', () => {
    it('should use same Content-Type header across all functions', async () => {
      await sendAutonomous({
        preferredLanguage: 'en',
        targetUserResourceId: 'usr-h1',
        departmentName: 'IT',
        actions: ['phishing']
      })
      await sendBatchAutonomous({
        targetGroupResourceId: 'grp-h1',
        actions: ['training']
      })
      await retryAutonomous({
        ...retryParams,
        targetUserResourceId: 'usr-h2'
      })

      const expectedHeaders = { headers: { 'Content-Type': 'application/json' } }
      expect(axios.post.mock.calls[0][2]).toEqual(expectedHeaders)
      expect(axios.post.mock.calls[1][2]).toEqual(expectedHeaders)
      expect(axios.post.mock.calls[2][2]).toEqual(expectedHeaders)
    })

    it('should include token in all function payloads', async () => {
      await sendAutonomous({
        preferredLanguage: 'en',
        targetUserResourceId: 'usr-tok',
        departmentName: 'IT',
        actions: ['phishing']
      })
      await sendBatchAutonomous({
        targetGroupResourceId: 'grp-tok',
        actions: ['training']
      })
      await retryAutonomous({
        ...retryParams,
        targetUserResourceId: 'usr-tok2'
      })

      expect(axios.post.mock.calls[0][1]).toHaveProperty('token')
      expect(axios.post.mock.calls[1][1]).toHaveProperty('token')
      expect(axios.post.mock.calls[2][1]).toHaveProperty('token')
    })

    it('sendAutonomous and retryAutonomous should use same /autonomous endpoint', async () => {
      await sendAutonomous({
        preferredLanguage: 'en',
        targetUserResourceId: 'usr-ep1',
        departmentName: 'IT',
        actions: ['phishing']
      })
      await retryAutonomous({
        ...retryParams,
        targetUserResourceId: 'usr-ep2'
      })

      const sendUrl = axios.post.mock.calls[0][0]
      const retryUrl = axios.post.mock.calls[1][0]
      expect(sendUrl).toBe(retryUrl)
    })

    it('sendBatchAutonomous should use different endpoint than sendAutonomous', async () => {
      await sendAutonomous({
        preferredLanguage: 'en',
        targetUserResourceId: 'usr-diff',
        departmentName: 'IT',
        actions: ['phishing']
      })
      await sendBatchAutonomous({
        targetGroupResourceId: 'grp-diff',
        actions: ['training']
      })

      const singleUrl = axios.post.mock.calls[0][0]
      const batchUrl = axios.post.mock.calls[1][0]
      expect(singleUrl).not.toBe(batchUrl)
      expect(singleUrl).toContain('/autonomous')
      expect(batchUrl).toContain('/batch-autonomous')
    })
  })

  describe('parallel requests', () => {
    it('should handle concurrent sendAutonomous calls', async () => {
      const call1 = sendAutonomous({
        preferredLanguage: 'en',
        targetUserResourceId: 'usr-par-1',
        departmentName: 'IT',
        actions: ['phishing']
      })
      const call2 = sendAutonomous({
        preferredLanguage: 'tr',
        targetUserResourceId: 'usr-par-2',
        departmentName: 'HR',
        actions: ['training']
      })

      await Promise.all([call1, call2])
      expect(axios.post).toHaveBeenCalledTimes(2)
    })

    it('should handle concurrent calls across different functions', async () => {
      const call1 = sendAutonomous({
        preferredLanguage: 'en',
        targetUserResourceId: 'usr-mix-1',
        departmentName: 'IT',
        actions: ['phishing']
      })
      const call2 = sendBatchAutonomous({
        targetGroupResourceId: 'grp-mix-1',
        actions: ['training']
      })
      const call3 = retryAutonomous({
        ...retryParams,
        targetUserResourceId: 'usr-mix-2'
      })

      await Promise.all([call1, call2, call3])
      expect(axios.post).toHaveBeenCalledTimes(3)
    })

    it('should isolate errors in concurrent calls', async () => {
      axios.post
        .mockResolvedValueOnce({ data: 'ok' })
        .mockRejectedValueOnce(new Error('fail'))

      const call1 = sendAutonomous({
        preferredLanguage: 'en',
        targetUserResourceId: 'usr-iso-1',
        departmentName: 'IT',
        actions: ['phishing']
      })
      const call2 = sendAutonomous({
        preferredLanguage: 'tr',
        targetUserResourceId: 'usr-iso-2',
        departmentName: 'HR',
        actions: ['training']
      })

      const results = await Promise.allSettled([call1, call2])
      expect(results[0].status).toBe('fulfilled')
      expect(results[1].status).toBe('rejected')
    })
  })
})
