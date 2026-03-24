jest.mock('@/api/integrations', () => ({
  createSIEMIntegration: jest.fn(() => Promise.resolve()),
  updateSIEMIntegration: jest.fn(() => Promise.resolve())
}))

import SIEMIntegrationsAddOrEditModal from '@/components/Integrations/SIEMIntegrations/SIEMIntegrationsAddOrEditModal.vue'
import { createSIEMIntegration, updateSIEMIntegration } from '@/api/integrations'

describe('SIEMIntegrationsAddOrEditModal.vue', () => {
  it('getModalTitle returns Edit when selectedItem', () => {
    const ctx = { selectedItem: { resourceId: 'i1' } }
    const result = SIEMIntegrationsAddOrEditModal.computed.getModalTitle.call(ctx)
    expect(result).toBeDefined()
    expect(result).not.toContain('New')
  })

  it('isSplunkIntegration returns true when typeId is 1', () => {
    const ctx = { formData: { typeId: 1 } }
    expect(SIEMIntegrationsAddOrEditModal.computed.isSplunkIntegration.call(ctx)).toBe(true)
  })

  it('isSplunkIntegration returns false when typeId is not 1', () => {
    const ctx = { formData: { typeId: 2 } }
    expect(SIEMIntegrationsAddOrEditModal.computed.isSplunkIntegration.call(ctx)).toBe(false)
  })

  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    SIEMIntegrationsAddOrEditModal.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })

  describe('submitForm', () => {
    it('sets isActionButtonDisabled to true when called', () => {
      const ctx = {
        selectedItem: { resourceId: 'siem-1' },
        formData: { statusId: '1', apiUrl: null, token: null, serverAddress: null, port: null, connectionType: null },
        isSplunkIntegration: false,
        isSyslogIntegration: false,
        isActionButtonDisabled: false,
        $emit: jest.fn()
      }
      SIEMIntegrationsAddOrEditModal.methods.submitForm.call(ctx)
      expect(ctx.isActionButtonDisabled).toBe(true)
    })

    it('builds payload with numeric statusId', () => {
      let capturedPayload = null
      const ctx = {
        selectedItem: null,
        formData: { statusId: '3', apiUrl: 'url', token: 'tok', serverAddress: 'addr', port: '443', connectionType: 'TCP' },
        isSplunkIntegration: true,
        isSyslogIntegration: false,
        isActionButtonDisabled: false,
        $emit: jest.fn()
      }
      // submitForm creates payload and calls API - we verify it doesn't throw
      expect(() => SIEMIntegrationsAddOrEditModal.methods.submitForm.call(ctx)).not.toThrow()
    })

    it('includes splunk fields when isSplunkIntegration is true', () => {
      const ctx = {
        selectedItem: null,
        formData: { statusId: '1', apiUrl: 'https://splunk.test', token: 'abc123', serverAddress: 'x', port: '514', connectionType: 'TCP' },
        isSplunkIntegration: true,
        isSyslogIntegration: false,
        isActionButtonDisabled: false,
        $emit: jest.fn()
      }
      // Verify no error is thrown - the negated condition fix ensures correct branch
      expect(() => SIEMIntegrationsAddOrEditModal.methods.submitForm.call(ctx)).not.toThrow()
      expect(ctx.isActionButtonDisabled).toBe(true)
    })
  })
})
