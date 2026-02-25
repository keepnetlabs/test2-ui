jest.mock('@/api/integrations', () => ({
  createSIEMIntegration: jest.fn(() => Promise.resolve()),
  updateSIEMIntegration: jest.fn(() => Promise.resolve())
}))

import SIEMIntegrationsAddOrEditModal from '@/components/Integrations/SIEMIntegrations/SIEMIntegrationsAddOrEditModal.vue'

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
})
