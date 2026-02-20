import AdvancedReports from '@/views/AdvancedReports.vue'
import ReportsService from '@/api/reports'

jest.mock('@/api/reports', () => ({
  __esModule: true,
  default: {
    getReports: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AdvancedReports.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed userRole resolves role name safely', () => {
    expect(AdvancedReports.computed.userRole.call({ getUser: { role: { name: 'Root' } } })).toBe('Root')
    expect(AdvancedReports.computed.userRole.call({ getUser: null })).toBeUndefined()
  })

  it('computed tab visibility checks roles and permissions', () => {
    expect(AdvancedReports.computed.canRenderSystemTab.call({ userRole: 'Root' })).toBe(true)
    expect(AdvancedReports.computed.canRenderSystemTab.call({ userRole: 'Reseller' })).toBe(false)

    expect(AdvancedReports.computed.canRenderResellerTab.call({ userRole: 'Root' })).toBe(true)
    expect(AdvancedReports.computed.canRenderResellerTab.call({ userRole: 'Reseller' })).toBe(true)
    expect(AdvancedReports.computed.canRenderResellerTab.call({ userRole: 'Company Admin' })).toBe(false)

    expect(
      AdvancedReports.computed.canRenderCompanyTab.call({
        userRole: 'Company Admin',
        $store: { getters: { 'permissions/getAdvancedReportsSearchPermissions': false } }
      })
    ).toBe(true)

    expect(
      AdvancedReports.computed.canRenderCompanyTab.call({
        userRole: 'Other',
        $store: { getters: { 'permissions/getAdvancedReportsSearchPermissions': true } }
      })
    ).toBe(true)

    expect(
      AdvancedReports.computed.canRenderCompanyTab.call({
        userRole: 'Other',
        $store: { getters: { 'permissions/getAdvancedReportsSearchPermissions': false } }
      })
    ).toBe(false)
  })

  it('userRole watcher sets tab for Root, Reseller and Company Admin/permission', () => {
    const ctxRoot = {
      tab: 'company',
      $store: { getters: { 'permissions/getAdvancedReportsSearchPermissions': false } }
    }
    AdvancedReports.watch.userRole.handler.call(ctxRoot, 'Root')
    expect(ctxRoot.tab).toBe('system')

    const ctxReseller = {
      tab: 'system',
      $store: { getters: { 'permissions/getAdvancedReportsSearchPermissions': false } }
    }
    AdvancedReports.watch.userRole.handler.call(ctxReseller, 'Reseller')
    expect(ctxReseller.tab).toBe('reseller')

    const ctxCompany = {
      tab: 'system',
      $store: { getters: { 'permissions/getAdvancedReportsSearchPermissions': false } }
    }
    AdvancedReports.watch.userRole.handler.call(ctxCompany, 'Company Admin')
    expect(ctxCompany.tab).toBe('company')

    const ctxPermission = {
      tab: 'system',
      $store: { getters: { 'permissions/getAdvancedReportsSearchPermissions': true } }
    }
    AdvancedReports.watch.userRole.handler.call(ctxPermission, 'Other')
    expect(ctxPermission.tab).toBe('company')
  })

  it('callForData loads and sorts reports by orderNumber', async () => {
    ReportsService.getReports.mockResolvedValueOnce({
      data: {
        data: [
          { id: 'r2', orderNumber: 2, reportGroup: 2 },
          { id: 'r1', orderNumber: 1, reportGroup: 1 }
        ]
      }
    })

    const setLoading = jest.fn()
    const ctx = {
      reports: [],
      setLoading
    }

    AdvancedReports.methods.callForData.call(ctx)
    await flushPromises()

    expect(setLoading).toHaveBeenCalledWith(true)
    expect(ReportsService.getReports).toHaveBeenCalled()
    expect(ctx.reports).toEqual([
      { id: 'r1', orderNumber: 1, reportGroup: 1 },
      { id: 'r2', orderNumber: 2, reportGroup: 2 }
    ])
    expect(setLoading).toHaveBeenCalledTimes(2)
  })

  it('getReportsByGroup filters reports by group id', () => {
    const ctx = {
      reports: [
        { id: 'r1', reportGroup: 1 },
        { id: 'r2', reportGroup: 2 },
        { id: 'r3', reportGroup: 1 }
      ]
    }

    const result = AdvancedReports.methods.getReportsByGroup.call(ctx, 1)
    expect(result).toEqual([
      { id: 'r1', reportGroup: 1 },
      { id: 'r3', reportGroup: 1 }
    ])
  })
})
