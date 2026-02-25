jest.mock('@/api/sandbox', () => ({
  getSandboxLog: jest.fn(() => Promise.resolve({ data: { data: { results: [] }, totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 } })),
  exportSandboxLog: jest.fn(() => Promise.resolve({ data: new Blob() }))
}))

import SandboxLog from '@/components/Sandbox/SandboxLog.vue'

describe('SandboxLog.vue', () => {
  it('handleSandboxLogDownloadButtonClick sets isSandboxLogDownloadModal to true', () => {
    const ctx = { isSandboxLogDownloadModal: false }
    SandboxLog.methods.handleSandboxLogDownloadButtonClick.call(ctx)
    expect(ctx.isSandboxLogDownloadModal).toBe(true)
  })

  it('tableOptions has columns', () => {
    const data = SandboxLog.data()
    expect(data.tableOptions.columns).toBeDefined()
    expect(data.tableOptions.columns.length).toBeGreaterThan(0)
  })
})
