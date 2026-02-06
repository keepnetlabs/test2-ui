jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as whitelabelApi from '@/api/whitelabel'

describe('whitelabel API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('white label retrieval operations', () => {
    it('should call getWhiteLabel', async () => {
      const config = { loading: true }
      await whitelabelApi.getWhiteLabel(config)
      expect(testRequest.get).toHaveBeenCalledWith('/whitelabeling', config)
    })

    it('should call getWhiteLabel with empty config', async () => {
      await whitelabelApi.getWhiteLabel()
      expect(testRequest.get).toHaveBeenCalledWith('/whitelabeling', {})
    })

    it('should call resolveWhiteLabel', async () => {
      const config = { loading: true }
      await whitelabelApi.resolveWhiteLabel(config)
      expect(testRequest.get).toHaveBeenCalledWith(
        '/whitelabeling/resolve-whitelabeling',
        config
      )
    })

    it('should call resolveWhiteLabel with empty config', async () => {
      await whitelabelApi.resolveWhiteLabel()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/whitelabeling/resolve-whitelabeling',
        {}
      )
    })
  })

  describe('white label URL operations', () => {
    it('should call getWhiteLabelByUrl', async () => {
      const payload = { url: 'https://example.com' }
      await whitelabelApi.getWhiteLabelByUrl(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/whitelabeling/by-url',
        payload,
        { loading: true }
      )
    })

    it('should call getWhiteLabelByUrl with empty payload', async () => {
      await whitelabelApi.getWhiteLabelByUrl()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/whitelabeling/by-url',
        {},
        { loading: true }
      )
    })
  })

  describe('DNS operations', () => {
    it('should call checkDNS', async () => {
      const payload = { domain: 'example.com' }
      await whitelabelApi.checkDNS(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/whitelabeling/check-dns',
        payload
      )
    })

    it('should call checkDNS with empty payload', async () => {
      await whitelabelApi.checkDNS()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/whitelabeling/check-dns',
        {}
      )
    })
  })

  describe('white label management operations', () => {
    it('should call updateWhiteLabel', async () => {
      const payload = { name: 'Updated Brand' }
      const id = 'brand-123'
      const config = {}
      await whitelabelApi.updateWhiteLabel(payload, id, config)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/whitelabeling/${id}`,
        payload,
        { ...config, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateWhiteLabel with custom config', async () => {
      const payload = { name: 'Updated Brand' }
      const id = 'brand-123'
      const config = { loading: true }
      await whitelabelApi.updateWhiteLabel(payload, id, config)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/whitelabeling/${id}`,
        payload,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteWhiteLabel', async () => {
      const resourceId = 'brand-123'
      await whitelabelApi.deleteWhiteLabel(resourceId)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/whitelabeling/${resourceId}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteWhiteLabel with empty resourceId', async () => {
      await whitelabelApi.deleteWhiteLabel()
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/whitelabeling/',
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('system information operations', () => {
    it('should call getSystemVersion', async () => {
      await whitelabelApi.getSystemVersion()
      expect(testRequest.get).toHaveBeenCalledWith('/system-info/version')
    })

    it('should call callForSystemInfoSummary', async () => {
      await whitelabelApi.callForSystemInfoSummary()
      expect(testRequest.get).toHaveBeenCalledWith('/system-info/summary')
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await whitelabelApi.getWhiteLabel()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for URL and DNS checks', async () => {
      const payload = { url: 'https://example.com' }
      await whitelabelApi.getWhiteLabelByUrl(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { name: 'Updated' }
      await whitelabelApi.updateWhiteLabel(payload, 'brand-123')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await whitelabelApi.deleteWhiteLabel('brand-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for updates', async () => {
      const payload = { name: 'Updated' }
      await whitelabelApi.updateWhiteLabel(payload, 'brand-123')
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for deletes', async () => {
      await whitelabelApi.deleteWhiteLabel('brand-123')
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('loading state', () => {
    it('should support custom loading state in updateWhiteLabel', async () => {
      const payload = { name: 'Updated' }
      const config = { loading: true }
      await whitelabelApi.updateWhiteLabel(payload, 'brand-123', config)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ loading: true })
      )
    })

    it('should support loading in getWhiteLabelByUrl', async () => {
      const payload = { url: 'https://example.com' }
      await whitelabelApi.getWhiteLabelByUrl(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ loading: true })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle white label retrieval with config options', async () => {
      const config = { loading: true, headers: { 'X-Custom': 'value' } }
      await whitelabelApi.getWhiteLabel(config)
      expect(testRequest.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining(config)
      )
    })

    it('should handle white label resolution for domain', async () => {
      const config = { domain: 'subdomain.example.com' }
      await whitelabelApi.resolveWhiteLabel(config)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should handle URL-based white label retrieval', async () => {
      const payload = {
        url: 'https://subdomain.example.com/app'
      }
      await whitelabelApi.getWhiteLabelByUrl(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle DNS check for domain', async () => {
      const payload = {
        domain: 'subdomain.example.com',
        expectedCNAME: 'target.example.com'
      }
      await whitelabelApi.checkDNS(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle white label update with branding details', async () => {
      const payload = {
        name: 'Company Branding',
        logo: 'logo-url',
        primaryColor: '#FF0000',
        secondaryColor: '#00FF00'
      }
      await whitelabelApi.updateWhiteLabel(payload, 'brand-123')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle white label deletion', async () => {
      await whitelabelApi.deleteWhiteLabel('brand-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })

    it('should retrieve system version information', async () => {
      await whitelabelApi.getSystemVersion()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should retrieve system info summary', async () => {
      await whitelabelApi.callForSystemInfoSummary()
      expect(testRequest.get).toHaveBeenCalled()
    })
  })
})
