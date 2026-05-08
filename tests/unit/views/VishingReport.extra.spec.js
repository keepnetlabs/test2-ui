import VishingReport from '@/views/VishingReport.vue'
import { getTargetUserCustomFieldsByCompanyId } from '@/api/targetUsers'

jest.mock('@/api/targetUsers', () => ({
  getTargetUserCustomFieldsByCompanyId: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('VishingReport.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getVishingName falls back to default label', () => {
    const ctx = { $store: { state: {} } }
    expect(VishingReport.computed.getVishingName.call(ctx)).toBe('Vishing Name')
  })

  it('getVishingName uses store common activePageRouterName when set', () => {
    const ctx = {
      $store: {
        state: { common: { activePageRouterName: 'Q4 Vishing Report' } }
      }
    }
    expect(VishingReport.computed.getVishingName.call(ctx)).toBe('Q4 Vishing Report')
  })

  it('computed id returns campaign id from route params', () => {
    const ctx = { $route: { params: { id: 'campaign-resource-42' } } }
    expect(VishingReport.computed.id.call(ctx)).toBe('campaign-resource-42')
  })

  it('callForCustomFields maps response into customFields', async () => {
    getTargetUserCustomFieldsByCompanyId.mockResolvedValueOnce({ data: { data: [{ key: 'x' }] } })
    const ctx = { customFields: [] }

    VishingReport.methods.callForCustomFields.call(ctx)
    await flushPromises()

    expect(ctx.customFields).toEqual([{ key: 'x' }])
  })

  it('callForCustomFields supports empty api payload', async () => {
    getTargetUserCustomFieldsByCompanyId.mockResolvedValueOnce({})
    const ctx = { customFields: ['initial'] }

    VishingReport.methods.callForCustomFields.call(ctx)
    await flushPromises()

    expect(ctx.customFields).toBeUndefined()
  })

  it('created calls custom field loader', () => {
    const callForCustomFields = jest.fn()
    VishingReport.created.call({ callForCustomFields })
    expect(callForCustomFields).toHaveBeenCalledTimes(1)
  })

  it('data maps tab item visibility from permission getters', () => {
    const vm = {
      $store: {
        getters: {
          'permissions/getVishingReportsSummParyPermissions': true,
          'permissions/getVishingRepPortsUsersPermissions': false,
          'permissions/getVishingRePportsAnsweredPermissions': true,
          'permissions/getVishingRPeportsDialedNumberPermissions': false,
          'permissions/getVishingRePportsNoResponsePermissions': true
        }
      }
    }

    const data = VishingReport.data.call(vm)

    expect(data.tabItems[0].isVisible).toBe(true)
    expect(data.tabItems[1].isVisible).toBe(false)
    expect(data.tabItems[3].isVisible).toBe(false)
  })

  it('computed id returns undefined when route params are missing', () => {
    const ctx = { $route: {} }
    expect(VishingReport.computed.id.call(ctx)).toBeUndefined()
  })
})
