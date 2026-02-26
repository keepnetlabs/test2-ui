import AdvancedReports from '@/views/AdvancedReports.vue'
import ReportsService from '@/api/reports'

jest.mock('@/api/reports', () => ({
  __esModule: true,
  default: {
    getReports: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AdvancedReports.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('created hook calls callForData', () => {
    const callForData = jest.fn()
    AdvancedReports.created.call({ callForData })
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('userRole watcher keeps current tab when no role/permission condition matches', () => {
    const ctx = {
      tab: 'reseller',
      $store: { getters: { 'permissions/getAdvancedReportsSearchPermissions': false } }
    }

    AdvancedReports.watch.userRole.handler.call(ctx, 'Viewer')
    expect(ctx.tab).toBe('reseller')
  })

  it('callForData handles empty api response with default array', async () => {
    ReportsService.getReports.mockResolvedValueOnce({})
    const ctx = {
      reports: [{ id: 'old' }],
      setLoading: jest.fn()
    }

    AdvancedReports.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.reports).toEqual([])
    expect(ctx.setLoading).toHaveBeenCalledWith(true)
  })

  it('getReportsByGroup returns undefined when reports is undefined', () => {
    const result = AdvancedReports.methods.getReportsByGroup.call({ reports: undefined }, 1)
    expect(result).toBeUndefined()
  })

  it('canRenderCompanyTab returns true for Root and Reseller roles', () => {
    expect(
      AdvancedReports.computed.canRenderCompanyTab.call({
        userRole: 'Root',
        $store: { getters: { 'permissions/getAdvancedReportsSearchPermissions': false } }
      })
    ).toBe(true)

    expect(
      AdvancedReports.computed.canRenderCompanyTab.call({
        userRole: 'Reseller',
        $store: { getters: { 'permissions/getAdvancedReportsSearchPermissions': false } }
      })
    ).toBe(true)
  })
})
