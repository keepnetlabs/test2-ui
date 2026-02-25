jest.mock('@/api/emailThreatSimlator', () => ({
  __esModule: true,
  getQuickScanList: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [{ quickScanResourceId: 'q1', status: 'Completed' }]
        }
      }
    })
  ),
  getQuickScanById: jest.fn(() =>
    Promise.resolve({ data: { data: { quickScanResourceId: 'q1', domain: 'a.com' } } })
  ),
  exportQuickScan: jest.fn(() => Promise.resolve({ data: 'mock-file' }))
}))

import Scans from '@/components/EmailThreatSmulator/Scans.vue'
import { getQuickScanList, getQuickScanById, exportQuickScan } from '@/api/emailThreatSimlator'

describe('Scans.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(Scans.name).toBe('Scans')
  })

  it('callForData fills table when permission exists', async () => {
    const ctx = {
      isLoading: false,
      getEtsQuickScanPermissionSearch: true,
      axiosPayload: { filter: {} },
      serverSideProps: {},
      tableData: [],
      $router: { push: jest.fn() }
    }
    Scans.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(getQuickScanList).toHaveBeenCalled()
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData).toEqual([{ quickScanResourceId: 'q1', status: 'Completed' }])
  })

  it('callForData redirects when permission does not exist', () => {
    const ctx = {
      isLoading: false,
      getEtsQuickScanPermissionSearch: false,
      $router: { push: jest.fn() }
    }
    Scans.methods.callForData.call(ctx)
    expect(ctx.$router.push).toHaveBeenCalledWith('/')
  })

  it('handleDuplicateScan loads details and opens modal', async () => {
    const row = { quickScanResourceId: 'q1' }
    const ctx = {
      isDuplicate: false,
      scanDetails: {},
      modalStatus: false,
      selectedScan: {}
    }
    Scans.methods.handleDuplicateScan.call(ctx, row)
    await Promise.resolve()
    await Promise.resolve()
    expect(getQuickScanById).toHaveBeenCalledWith('q1')
    expect(ctx.isDuplicate).toBe(true)
    expect(ctx.modalStatus).toBe(true)
    expect(ctx.selectedScan).toBe(row)
  })

  it('changeNewScanModalStatus resets duplicate state and refreshes on restart', () => {
    const ctx = {
      modalStatus: false,
      isDuplicate: true,
      scanDetails: { x: 1 },
      selectedScan: { quickScanResourceId: 'q1' },
      callForData: jest.fn()
    }
    Scans.methods.changeNewScanModalStatus.call(ctx, true, true)
    expect(ctx.modalStatus).toBe(true)
    expect(ctx.isDuplicate).toBe(false)
    expect(ctx.scanDetails).toEqual({})
    expect(ctx.selectedScan).toEqual({})
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('exportTableData creates downloadable file', async () => {
    const link = { click: jest.fn() }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
    const prevCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:url')
    const ctx = { axiosPayload: { filter: {} } }

    Scans.methods.exportTableData.call(ctx, {
      exportTypes: ['XLS'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 10
    })
    await Promise.resolve()
    await Promise.resolve()
    expect(exportQuickScan).toHaveBeenCalled()
    expect(link.download).toBe('Scans.xlsx')

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = prevCreateObjectURL
  })

  it('handleActionDelete selects row and opens delete modal', () => {
    const row = { quickScanResourceId: 'q2' }
    const ctx = { selectedScan: {}, showDeleteModal: false }
    Scans.methods.handleActionDelete.call(ctx, row)
    expect(ctx.selectedScan).toBe(row)
    expect(ctx.showDeleteModal).toBe(true)
  })
})
