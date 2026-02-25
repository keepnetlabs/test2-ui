import NewIntegration from '@/components/Integrations/NewIntegration.vue'
import { INTEGRATION_TYPES } from '@/model/constants/commonConstants'

describe('NewIntegration.vue', () => {
  describe('computed', () => {
    it('isVirusTotal returns true when selectedIntegrationType is VirusTotal', () => {
      const ctx = { selectedIntegrationType: { name: INTEGRATION_TYPES.VIRUSTOTAL } }
      expect(NewIntegration.computed.isVirusTotal.call(ctx)).toBe(true)
    })

    it('isVirusTotal returns false when selectedIntegrationType is not VirusTotal', () => {
      const ctx = { selectedIntegrationType: { name: 'Other' } }
      expect(NewIntegration.computed.isVirusTotal.call(ctx)).toBe(false)
    })

    it('isFortiNet returns true when selectedIntegrationType is FortiNet', () => {
      const ctx = { selectedIntegrationType: { name: INTEGRATION_TYPES.FORTINET } }
      expect(NewIntegration.computed.isFortiNet.call(ctx)).toBe(true)
    })

    it('isVmrayVirusTotalOrAnyRun returns true for VirusTotal', () => {
      const ctx = { selectedIntegrationType: { name: INTEGRATION_TYPES.VIRUSTOTAL } }
      expect(NewIntegration.computed.isVmrayVirusTotalOrAnyRun.call(ctx)).toBe(true)
    })

    it('isVmrayVirusTotalOrAnyRun returns true for VMRay', () => {
      const ctx = { selectedIntegrationType: { name: INTEGRATION_TYPES.VMRAY } }
      expect(NewIntegration.computed.isVmrayVirusTotalOrAnyRun.call(ctx)).toBe(true)
    })

    it('isVmrayVirusTotalOrAnyRun returns true for AnyRun', () => {
      const ctx = { selectedIntegrationType: { name: INTEGRATION_TYPES.ANYRUN } }
      expect(NewIntegration.computed.isVmrayVirusTotalOrAnyRun.call(ctx)).toBe(true)
    })

    it('isVmrayVirusTotalOrAnyRun returns false for other types', () => {
      const ctx = { selectedIntegrationType: { name: 'Other' } }
      expect(NewIntegration.computed.isVmrayVirusTotalOrAnyRun.call(ctx)).toBe(false)
    })

    it('isFortiNetConnectionDisabled returns true when userName, password, apiUrl missing', () => {
      const ctx = { formValues: { userName: '', password: '', apiUrl: '' } }
      expect(NewIntegration.computed.isFortiNetConnectionDisabled.call(ctx)).toBe(true)
    })

    it('isFortiNetConnectionDisabled returns false when all present', () => {
      const ctx = {
        formValues: { userName: 'u', password: 'p', apiUrl: 'https://u.com' }
      }
      expect(NewIntegration.computed.isFortiNetConnectionDisabled.call(ctx)).toBe(false)
    })

    it('isCustomIntegration returns true when custom', () => {
      const ctx = { selectedIntegrationType: { name: INTEGRATION_TYPES.CUSTOMINTEGRATION } }
      expect(NewIntegration.computed.isCustomIntegration.call(ctx)).toBe(true)
    })

    it('isIbmXForce returns true when IBMXForce', () => {
      const ctx = { selectedIntegrationType: { name: INTEGRATION_TYPES.IBMXFORCE } }
      expect(NewIntegration.computed.isIbmXForce.call(ctx)).toBe(true)
    })
  })

  describe('methods', () => {
    it('handleCacheDurationChange sets formValues.cacheDuration when valid', () => {
      const ctx = {
        formValues: { cacheDuration: 0 },
        $refs: { refInputCacheDuration: {} }
      }
      NewIntegration.methods.handleCacheDurationChange.call(ctx, '123')
      expect(ctx.formValues.cacheDuration).toBe(123)
    })

    it('handleCacheDurationChange sets formValues.cacheDuration when empty', () => {
      const ctx = {
        formValues: { cacheDuration: 60 },
        $refs: { refInputCacheDuration: {} }
      }
      NewIntegration.methods.handleCacheDurationChange.call(ctx, '')
      expect(ctx.formValues.cacheDuration).toBe(0)
    })

    it('handleApiKeyDelete removes apiKey at index', () => {
      const ctx = {
        formValues: { apiKeys: [{ value: 'a' }, { value: 'b' }] },
        showPasswords: [],
        isIbmXForce: false
      }
      NewIntegration.methods.handleApiKeyDelete.call(ctx, 0)
      expect(ctx.formValues.apiKeys).toHaveLength(1)
      expect(ctx.formValues.apiKeys[0].value).toBe('b')
    })

    it('handlePasswordToggle toggles showPasswords at index', () => {
      const ctx = {
        showPasswords: [false, false],
        $set: jest.fn((obj, key, val) => { obj[key] = val })
      }
      NewIntegration.methods.handlePasswordToggle.call(ctx, 0)
      expect(ctx.$set).toHaveBeenCalledWith(ctx.showPasswords, 0, true)
    })
  })
})
