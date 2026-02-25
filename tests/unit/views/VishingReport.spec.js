jest.mock('@/api/targetUsers', () => ({
  getTargetUserCustomFieldsByCompanyId: jest.fn().mockResolvedValue({ data: { data: [] } })
}))

import VishingReport from '@/views/VishingReport.vue'
import labels from '@/model/constants/labels'

describe('VishingReport.vue', () => {
  it('has correct component name', () => {
    expect(VishingReport.name).toBe('VishingReport')
  })

  it('computed id returns route params id', () => {
    const ctx = { $route: { params: { id: 'vish-1' } } }
    expect(VishingReport.computed.id.call(ctx)).toBe('vish-1')
  })

  it('computed getVishingName returns activePageRouterName', () => {
    const ctx = {
      $store: { state: { common: { activePageRouterName: 'Vishing X' } } }
    }
    expect(VishingReport.computed.getVishingName.call(ctx)).toBe('Vishing X')
  })

  it('default tab is Summary', () => {
    const data = VishingReport.data.call({
      $store: {
        getters: {
          'permissions/getVishingReportsSummParyPermissions': true,
          'permissions/getVishingRepPortsUsersPermissions': true,
          'permissions/getVishingRePportsAnsweredPermissions': true,
          'permissions/getVishingRPeportsDialedNumberPermissions': true,
          'permissions/getVishingRePportsNoResponsePermissions': true
        }
      }
    })
    expect(data.tab).toBe(labels.Summary)
  })
})
