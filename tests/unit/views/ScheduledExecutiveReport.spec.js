jest.mock('@/api/reports', () => ({
  getExecutiveReportLogo: jest.fn().mockResolvedValue({ data: '', type: 'image/png' })
}))

import ScheduledExecutiveReport from '@/views/ScheduledExecutiveReport.vue'

describe('ScheduledExecutiveReport.vue', () => {
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
})
