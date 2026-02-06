jest.mock('@/utils/emailThreatSimulatorRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({})
}))

import emailThreatSimulatorRequest from '@/utils/emailThreatSimulatorRequest'
import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as emailThreatSimulatorApi from '@/api/emailThreatSimlator'

// Mock APP_CONFIG and localStorage
global.APP_CONFIG = { VUE_APP_API_KEY: 'test-api-key' }
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: jest.fn((key) => {
      if (key === 'companyRequestId' || key === 'companyId') {
        return 'test-company-id'
      }
      return null
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  },
  writable: true,
  configurable: true
})

describe('emailThreatSimulator API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.getItem.mockReturnValue('test-company-id')
  })

  describe('quick scan operations', () => {
    it('should call getQuickScanList', async () => {
      const payload = { page: 1 }
      await emailThreatSimulatorApi.getQuickScanList(payload)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledWith(
        '/quick-scan/search',
        payload,
        expect.objectContaining({
          loading: false,
          headers: expect.objectContaining({
            'X-IR-API-KEY': 'test-api-key',
            'X-IR-COMPANY-ID': 'test-company-id'
          })
        })
      )
    })

    it('should call getQuickScanById', async () => {
      const resourceId = 'scan-123'
      await emailThreatSimulatorApi.getQuickScanById(resourceId)
      expect(emailThreatSimulatorRequest.get).toHaveBeenCalledWith(
        `/quick-scan/${resourceId}`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-IR-API-KEY': 'test-api-key',
            'X-IR-COMPANY-ID': 'test-company-id'
          })
        })
      )
    })

    it('should call getQuickScanCount', async () => {
      await emailThreatSimulatorApi.getQuickScanCount()
      expect(emailThreatSimulatorRequest.get).toHaveBeenCalledWith(
        '/quick-scan/continuous-scan-count',
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })

    it('should call getQuickScanCreate', async () => {
      const payload = { name: 'New Scan' }
      await emailThreatSimulatorApi.getQuickScanCreate(payload)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledWith(
        '/quick-scan',
        payload,
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })

    it('should call deleteQuickScanItem', async () => {
      const resourceId = 'scan-123'
      await emailThreatSimulatorApi.deleteQuickScanItem(resourceId)
      expect(emailThreatSimulatorRequest.delete).toHaveBeenCalledWith(
        `/quick-scan/${resourceId}`,
        expect.objectContaining({
          headers: expect.any(Object),
          snackbar: COMMON_SNACKBAR
        })
      )
    })

    it('should call getValidateContinuousScan', async () => {
      const payload = { scanId: 'scan-123' }
      await emailThreatSimulatorApi.getValidateContinuousScan(payload)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledWith(
        '/quick-scan/validate-continuous-scan',
        payload,
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })
  })

  describe('quick scan export operations', () => {
    it('should call exportQuickScan', async () => {
      const payload = { filters: {} }
      await emailThreatSimulatorApi.exportQuickScan(payload)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledWith(
        '/quick-scan/search/export',
        payload,
        expect.objectContaining({
          responseType: 'blob',
          headers: expect.any(Object)
        })
      )
    })
  })

  describe('quick scan report operations', () => {
    it('should call getQuickScanReportCountById', async () => {
      const resourceId = 'scan-123'
      await emailThreatSimulatorApi.getQuickScanReportCountById(resourceId)
      expect(emailThreatSimulatorRequest.get).toHaveBeenCalledWith(
        `/quick-scan-report/counts-and-score/${resourceId}`,
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })

    it('should call getQuickScanReportStatsById', async () => {
      const resourceId = 'scan-123'
      await emailThreatSimulatorApi.getQuickScanReportStatsById(resourceId)
      expect(emailThreatSimulatorRequest.get).toHaveBeenCalledWith(
        `/quick-scan-report/stats/${resourceId}`,
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })

    it('should call getQuickScanReportList', async () => {
      const resourceId = 'scan-123'
      const payload = { page: 1 }
      await emailThreatSimulatorApi.getQuickScanReportList(payload, resourceId)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledWith(
        `/quick-scan-item/${resourceId}/search`,
        payload,
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })

    it('should call exportQuickScanReportList', async () => {
      const resourceId = 'scan-123'
      const payload = { filters: {} }
      await emailThreatSimulatorApi.exportQuickScanReportList(payload, resourceId)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledWith(
        `/quick-scan-item/${resourceId}/search/export`,
        payload,
        expect.objectContaining({
          responseType: 'blob',
          headers: expect.any(Object)
        })
      )
    })
  })

  describe('attack vector operations', () => {
    it('should call getAttackVectorList', async () => {
      const payload = { page: 1 }
      await emailThreatSimulatorApi.getAttackVectorList(payload)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledWith(
        '/plugin/search',
        payload,
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })

    it('should call getAttackVectorById', async () => {
      const resourceId = 'vector-123'
      await emailThreatSimulatorApi.getAttackVectorById(resourceId)
      expect(emailThreatSimulatorRequest.get).toHaveBeenCalledWith(
        `/plugin/${resourceId}`,
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })

    it('should call getAttackVectorCreate', async () => {
      const payload = { name: 'New Vector' }
      await emailThreatSimulatorApi.getAttackVectorCreate(payload)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledWith(
        '/plugin',
        payload,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'multipart/form-data'
          })
        })
      )
    })

    it('should call getAttackVectorUpdate', async () => {
      const payload = { name: 'Updated Vector' }
      const resourceId = 'vector-123'
      await emailThreatSimulatorApi.getAttackVectorUpdate(payload, resourceId)
      expect(emailThreatSimulatorRequest.put).toHaveBeenCalledWith(
        `/plugin/${resourceId}`,
        payload,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'multipart/form-data'
          })
        })
      )
    })

    it('should call deleteAttackVectorItem', async () => {
      const resourceId = 'vector-123'
      await emailThreatSimulatorApi.deleteAttackVectorItem(resourceId)
      expect(emailThreatSimulatorRequest.delete).toHaveBeenCalledWith(
        `/plugin/${resourceId}`,
        expect.objectContaining({
          headers: expect.any(Object),
          snackbar: COMMON_SNACKBAR
        })
      )
    })

    it('should call disableAttackVector', async () => {
      const payload = { vectorId: 'vector-123' }
      await emailThreatSimulatorApi.disableAttackVector(payload)
      expect(emailThreatSimulatorRequest.put).toHaveBeenCalledWith(
        '/plugin/passive',
        payload,
        expect.objectContaining({
          headers: expect.any(Object),
          snackbar: COMMON_SNACKBAR
        })
      )
    })

    it('should call enableAttackVector', async () => {
      const payload = { vectorId: 'vector-123' }
      await emailThreatSimulatorApi.enableAttackVector(payload)
      expect(emailThreatSimulatorRequest.put).toHaveBeenCalledWith(
        '/plugin/active',
        payload,
        expect.objectContaining({
          headers: expect.any(Object),
          snackbar: COMMON_SNACKBAR
        })
      )
    })

    it('should call exportAttacksVector', async () => {
      const payload = { filters: {} }
      await emailThreatSimulatorApi.exportAttacksVector(payload)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledWith(
        '/plugin/search/export',
        payload,
        expect.objectContaining({
          responseType: 'blob',
          headers: expect.any(Object)
        })
      )
    })
  })

  describe('lookup operations', () => {
    it('should call getLookupNameList', async () => {
      await emailThreatSimulatorApi.getLookupNameList()
      expect(testRequest.get).toHaveBeenCalledWith('/codetypes')
    })
  })

  describe('header consistency', () => {
    it('should include API key and company ID in headers', async () => {
      const payload = { page: 1 }
      await emailThreatSimulatorApi.getQuickScanList(payload)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-IR-API-KEY': 'test-api-key',
            'X-IR-COMPANY-ID': 'test-company-id'
          })
        })
      )
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for quick scan export', async () => {
      const payload = { filters: {} }
      await emailThreatSimulatorApi.exportQuickScan(payload)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })

    it('should use blob responseType for attack vector export', async () => {
      const payload = { filters: {} }
      await emailThreatSimulatorApi.exportAttacksVector(payload)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle getQuickScanList with complex filters', async () => {
      const payload = {
        page: 1,
        filters: { status: ['completed', 'running'] }
      }
      await emailThreatSimulatorApi.getQuickScanList(payload)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalled()
    })

    it('should handle attack vector creation with multipart form data', async () => {
      const payload = { name: 'Vector', file: 'file-content' }
      await emailThreatSimulatorApi.getAttackVectorCreate(payload)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalled()
    })

    it('should handle report list with multiple scan items', async () => {
      const payload = {
        page: 1,
        filters: { type: ['email', 'link'] }
      }
      await emailThreatSimulatorApi.getQuickScanReportList(payload, 'scan-123')
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalled()
    })
  })
})
