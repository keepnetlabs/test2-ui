jest.mock('@/api/phishingReporter', () => ({
  searchGeneratedApplicationHistory: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [] } } })
  ),
  exportPhishingReporterDownloadHistory: jest.fn(() => Promise.resolve({ data: 'mock-file' }))
}))

import VersionHistoryModal from '@/components/PhishingReporter/Settings/VersionHistoryModal.vue'

describe('VersionHistoryModal.vue', () => {
  it('handleDetails emits handleHistoryRow', () => {
    const ctx = { $emit: jest.fn() }
    const row = { version: '1.0' }
    VersionHistoryModal.methods.handleDetails.call(ctx, row)
    expect(ctx.$emit).toHaveBeenCalledWith('handleHistoryRow', row)
  })

  it('table has columns', () => {
    const data = VersionHistoryModal.data()
    expect(data.table.columns).toBeDefined()
    expect(data.table.columns.length).toBeGreaterThan(0)
    expect(data.table.columns[0].property).toBe('applicationType')
  })
})
