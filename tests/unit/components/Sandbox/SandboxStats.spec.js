jest.mock('@/api/sandbox', () => ({
  getSandboxStats: jest.fn(() => Promise.resolve({ data: { data: { results: [] }, totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 } })),
  exportSandboxStats: jest.fn(() => Promise.resolve({ data: 'mock-file' }))
}))

import SandboxStats from '@/components/Sandbox/SandboxStats.vue'

describe('SandboxStats.vue', () => {
  it('handleSandboxStatsDownloadButtonClick sets isSandboxStatsDownloadModal to true', () => {
    const ctx = { isSandboxStatsDownloadModal: false }
    SandboxStats.methods.handleSandboxStatsDownloadButtonClick.call(ctx)
    expect(ctx.isSandboxStatsDownloadModal).toBe(true)
  })

  it('tableOptions has empty message', () => {
    const data = SandboxStats.data()
    expect(data.tableOptions.empty.message).toBe('No stats available')
  })
})
