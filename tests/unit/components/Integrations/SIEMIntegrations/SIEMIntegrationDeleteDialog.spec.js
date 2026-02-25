jest.mock('@/api/siemIntegrations', () => ({
  deleteSIEMIntegration: jest.fn(() => Promise.resolve())
}))

import SIEMIntegrationDeleteDialog from '@/components/Integrations/SIEMIntegrations/SIEMIntegrationDeleteDialog.vue'

describe('SIEMIntegrationDeleteDialog.vue', () => {
  it('getContent returns single item message when not multiple', () => {
    const ctx = { isMultiple: false, item: { name: 'SIEM 1' } }
    expect(SIEMIntegrationDeleteDialog.computed.getContent.call(ctx)).toBe(
      'SIEM 1 will be deleted.'
    )
  })

  it('getContent returns count message when multiple', () => {
    const ctx = { isMultiple: true, userCount: 3 }
    expect(SIEMIntegrationDeleteDialog.computed.getContent.call(ctx)).toBe(
      '3 integration(s) will be deleted'
    )
  })

  it('getSubTitle returns multiple message', () => {
    const ctx = { isMultiple: true, userCount: 2 }
    expect(SIEMIntegrationDeleteDialog.computed.getSubTitle.call(ctx)).toContain('2 integration(s)')
  })

  it('closeModal emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    SIEMIntegrationDeleteDialog.methods.closeModal.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })

  it('data returns CONSTANTS', () => {
    const data = SIEMIntegrationDeleteDialog.data()
    expect(data.CONSTANTS.title).toBe('Delete Integration?')
  })
})
