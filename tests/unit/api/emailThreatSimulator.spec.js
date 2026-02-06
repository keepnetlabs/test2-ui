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

    it('should handle numeric and string IDs', async () => {
      await emailThreatSimulatorApi.getQuickScanById(123)
      expect(emailThreatSimulatorRequest.get).toHaveBeenCalled()

      emailThreatSimulatorRequest.get.mockClear()
      await emailThreatSimulatorApi.getQuickScanById('scan-xyz')
      expect(emailThreatSimulatorRequest.get).toHaveBeenCalled()
    })

    it('should handle localStorage variation', async () => {
      localStorage.getItem.mockReturnValue('different-company-id')
      const payload = { page: 1 }
      await emailThreatSimulatorApi.getQuickScanList(payload)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-IR-COMPANY-ID': 'different-company-id'
          })
        })
      )
    })
  })

  describe('return values', () => {
    it('all functions should return thenable objects', () => {
      const results = [
        emailThreatSimulatorApi.getQuickScanList({}),
        emailThreatSimulatorApi.getQuickScanById('id'),
        emailThreatSimulatorApi.getQuickScanCount(),
        emailThreatSimulatorApi.getQuickScanCreate({}),
        emailThreatSimulatorApi.deleteQuickScanItem('id'),
        emailThreatSimulatorApi.getValidateContinuousScan({}),
        emailThreatSimulatorApi.exportQuickScan({}),
        emailThreatSimulatorApi.getQuickScanReportCountById('id'),
        emailThreatSimulatorApi.getQuickScanReportStatsById('id'),
        emailThreatSimulatorApi.getQuickScanReportList({}, 'id'),
        emailThreatSimulatorApi.exportQuickScanReportList({}, 'id'),
        emailThreatSimulatorApi.getAttackVectorList({}),
        emailThreatSimulatorApi.getAttackVectorById('id'),
        emailThreatSimulatorApi.getAttackVectorCreate({}),
        emailThreatSimulatorApi.getAttackVectorUpdate({}, 'id'),
        emailThreatSimulatorApi.deleteAttackVectorItem('id'),
        emailThreatSimulatorApi.disableAttackVector({}),
        emailThreatSimulatorApi.enableAttackVector({}),
        emailThreatSimulatorApi.exportAttacksVector({}),
        emailThreatSimulatorApi.getLookupNameList()
      ]

      results.forEach(result => {
        expect(typeof result.then).toBe('function')
      })
    })
  })

  describe('All Exported Functions', () => {
    it('should export all required functions', () => {
      expect(typeof emailThreatSimulatorApi.getQuickScanList).toBe('function')
      expect(typeof emailThreatSimulatorApi.getQuickScanById).toBe('function')
      expect(typeof emailThreatSimulatorApi.getQuickScanCount).toBe('function')
      expect(typeof emailThreatSimulatorApi.getQuickScanCreate).toBe('function')
      expect(typeof emailThreatSimulatorApi.deleteQuickScanItem).toBe('function')
      expect(typeof emailThreatSimulatorApi.getValidateContinuousScan).toBe('function')
      expect(typeof emailThreatSimulatorApi.exportQuickScan).toBe('function')
      expect(typeof emailThreatSimulatorApi.getQuickScanReportCountById).toBe('function')
      expect(typeof emailThreatSimulatorApi.getQuickScanReportStatsById).toBe('function')
      expect(typeof emailThreatSimulatorApi.getQuickScanReportList).toBe('function')
      expect(typeof emailThreatSimulatorApi.exportQuickScanReportList).toBe('function')
      expect(typeof emailThreatSimulatorApi.getAttackVectorList).toBe('function')
      expect(typeof emailThreatSimulatorApi.getAttackVectorById).toBe('function')
      expect(typeof emailThreatSimulatorApi.getAttackVectorCreate).toBe('function')
      expect(typeof emailThreatSimulatorApi.getAttackVectorUpdate).toBe('function')
      expect(typeof emailThreatSimulatorApi.deleteAttackVectorItem).toBe('function')
      expect(typeof emailThreatSimulatorApi.disableAttackVector).toBe('function')
      expect(typeof emailThreatSimulatorApi.enableAttackVector).toBe('function')
      expect(typeof emailThreatSimulatorApi.exportAttacksVector).toBe('function')
      expect(typeof emailThreatSimulatorApi.getLookupNameList).toBe('function')
    })

    it('should export at least 20 functions', () => {
      const functions = Object.values(emailThreatSimulatorApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThanOrEqual(20)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle quick scan full workflow', async () => {
      await emailThreatSimulatorApi.getQuickScanList({})
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledTimes(1)

      emailThreatSimulatorRequest.post.mockClear()
      await emailThreatSimulatorApi.getQuickScanCreate({ name: 'Scan' })
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledTimes(1)

      emailThreatSimulatorRequest.get.mockClear()
      await emailThreatSimulatorApi.getQuickScanById('scan-1')
      expect(emailThreatSimulatorRequest.get).toHaveBeenCalledTimes(1)

      emailThreatSimulatorRequest.delete.mockClear()
      await emailThreatSimulatorApi.deleteQuickScanItem('scan-1')
      expect(emailThreatSimulatorRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle attack vector full workflow', async () => {
      await emailThreatSimulatorApi.getAttackVectorList({})
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledTimes(1)

      emailThreatSimulatorRequest.post.mockClear()
      await emailThreatSimulatorApi.getAttackVectorCreate({ name: 'Vector' })
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledTimes(1)

      emailThreatSimulatorRequest.put.mockClear()
      await emailThreatSimulatorApi.enableAttackVector({ vectorId: 'vector-1' })
      expect(emailThreatSimulatorRequest.put).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel quick scan operations', async () => {
      const results = await Promise.all([
        emailThreatSimulatorApi.getQuickScanList({}),
        emailThreatSimulatorApi.getQuickScanCount(),
        emailThreatSimulatorApi.getLookupNameList()
      ])

      expect(results).toHaveLength(3)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle scan list with pagination', async () => {
      const payload = { page: 2, pageSize: 50 }
      await emailThreatSimulatorApi.getQuickScanList(payload)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledWith(
        '/quick-scan/search',
        payload,
        expect.any(Object)
      )
    })

    it('should handle report list with resourceId and payload', async () => {
      const payload = { page: 1 }
      const resourceId = 'scan-123'
      await emailThreatSimulatorApi.getQuickScanReportList(payload, resourceId)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledWith(
        `/quick-scan-item/${resourceId}/search`,
        payload,
        expect.any(Object)
      )
    })

    it('should handle vector update with payload and ID', async () => {
      const payload = { name: 'Updated Vector' }
      const resourceId = 'vector-123'
      await emailThreatSimulatorApi.getAttackVectorUpdate(payload, resourceId)
      expect(emailThreatSimulatorRequest.put).toHaveBeenCalledWith(
        `/plugin/${resourceId}`,
        payload,
        expect.any(Object)
      )
    })

    it('should handle export with complex filters', async () => {
      const payload = {
        filters: {
          status: ['completed'],
          dateRange: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await emailThreatSimulatorApi.exportQuickScan(payload)
      expect(emailThreatSimulatorRequest.post).toHaveBeenCalledWith(
        '/quick-scan/search/export',
        payload,
        expect.any(Object)
      )
    })
  })

  describe('Error Handling', () => {
    it('should propagate quick scan list errors', async () => {
      const error = new Error('Scan list fetch failed')
      emailThreatSimulatorRequest.post.mockRejectedValueOnce(error)
      await expect(emailThreatSimulatorApi.getQuickScanList({})).rejects.toThrow('Scan list fetch failed')
    })

    it('should propagate scan creation errors', async () => {
      const error = new Error('Scan creation failed')
      emailThreatSimulatorRequest.post.mockRejectedValueOnce(error)
      await expect(emailThreatSimulatorApi.getQuickScanCreate({})).rejects.toThrow('Scan creation failed')
    })

    it('should propagate attack vector errors', async () => {
      const error = new Error('Vector operation failed')
      emailThreatSimulatorRequest.post.mockRejectedValueOnce(error)
      await expect(emailThreatSimulatorApi.getAttackVectorList({})).rejects.toThrow('Vector operation failed')
    })

    it('should propagate report fetch errors', async () => {
      const error = new Error('Report fetch failed')
      emailThreatSimulatorRequest.get.mockRejectedValueOnce(error)
      await expect(emailThreatSimulatorApi.getQuickScanReportCountById('id')).rejects.toThrow('Report fetch failed')
    })

    it('should propagate delete errors', async () => {
      const error = new Error('Deletion failed')
      emailThreatSimulatorRequest.delete.mockRejectedValueOnce(error)
      await expect(emailThreatSimulatorApi.deleteQuickScanItem('id')).rejects.toThrow('Deletion failed')
    })

    it('should propagate export errors', async () => {
      const error = new Error('Export failed')
      emailThreatSimulatorRequest.post.mockRejectedValueOnce(error)
      await expect(emailThreatSimulatorApi.exportQuickScan({})).rejects.toThrow('Export failed')
    })

    it('should propagate lookup errors', async () => {
      const error = new Error('Lookup fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(emailThreatSimulatorApi.getLookupNameList()).rejects.toThrow('Lookup fetch failed')
    })
  })
})
