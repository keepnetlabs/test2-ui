jest.mock('@/api/reports', () => ({
  getExecutiveReportLogo: jest.fn().mockResolvedValue({ data: '', type: 'image/png' })
}))

import ScheduledExecutiveReport from '@/views/ScheduledExecutiveReport.vue'

describe('ScheduledExecutiveReport.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const { getExecutiveReportLogo } = require('@/api/reports')
    getExecutiveReportLogo.mockResolvedValue({ data: '', type: 'image/png' })
  })

  it('has expected component name', () => {
    expect(ScheduledExecutiveReport.name).toBe('PreviewExecutiveReport')
  })

  it('registers ExecutiveReportNewCard', () => {
    expect(ScheduledExecutiveReport.components.ExecutiveReportNewCard).toBeDefined()
  })

  it('created fetches logo when token and companyResourceId present', async () => {
    const { getExecutiveReportLogo } = require('@/api/reports')
    const ctx = {
      $route: {
        params: { id: 'rep-1' },
        query: { token: 't1', companyResourceId: 'c1' }
      },
      defaultCompanyLogo: null
    }
    ScheduledExecutiveReport.created.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(getExecutiveReportLogo).toHaveBeenCalledWith('rep-1', 't1', 'c1')
  })

  it('created does not fetch logo when token is missing', () => {
    const { getExecutiveReportLogo } = require('@/api/reports')
    const ctx = {
      $route: {
        params: { id: 'rep-1' },
        query: { companyResourceId: 'c1' }
      },
      defaultCompanyLogo: null
    }
    ScheduledExecutiveReport.created.call(ctx)
    expect(getExecutiveReportLogo).not.toHaveBeenCalled()
  })

  it('created does not fetch logo when companyResourceId is missing', () => {
    const { getExecutiveReportLogo } = require('@/api/reports')
    const ctx = {
      $route: {
        params: { id: 'rep-1' },
        query: { token: 't1' }
      },
      defaultCompanyLogo: null
    }
    ScheduledExecutiveReport.created.call(ctx)
    expect(getExecutiveReportLogo).not.toHaveBeenCalled()
  })

  it('created does not fetch logo when token or companyResourceId is empty string', () => {
    const { getExecutiveReportLogo } = require('@/api/reports')
    const ctxEmptyToken = {
      $route: {
        params: { id: 'rep-1' },
        query: { token: '', companyResourceId: 'c1' }
      },
      defaultCompanyLogo: null
    }
    ScheduledExecutiveReport.created.call(ctxEmptyToken)
    expect(getExecutiveReportLogo).not.toHaveBeenCalled()

    const ctxEmptyCompany = {
      $route: {
        params: { id: 'rep-1' },
        query: { token: 't1', companyResourceId: '' }
      },
      defaultCompanyLogo: null
    }
    ScheduledExecutiveReport.created.call(ctxEmptyCompany)
    expect(getExecutiveReportLogo).not.toHaveBeenCalled()
  })

  it('created sets defaultCompanyLogo as File when logo resolves', async () => {
    const { getExecutiveReportLogo } = require('@/api/reports')
    const bytes = new Uint8Array([137, 80])
    getExecutiveReportLogo.mockResolvedValueOnce({ data: bytes, type: 'image/png' })
    const ctx = {
      $route: {
        params: { id: 'rep-2' },
        query: { token: 't2', companyResourceId: 'c2' }
      },
      defaultCompanyLogo: null
    }
    ScheduledExecutiveReport.created.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(ctx.defaultCompanyLogo).toBeInstanceOf(File)
    expect(ctx.defaultCompanyLogo.name).toBe('Executive Report Logo')
    expect(ctx.defaultCompanyLogo.type).toBe('image/png')
  })
})
