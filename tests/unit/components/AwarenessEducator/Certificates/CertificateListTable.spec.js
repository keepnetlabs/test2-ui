jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchCertificate: jest.fn(),
    makeDefaultCertificate: jest.fn(),
    exportCertificates: jest.fn()
  }
}))

import CertificateListTable from '@/components/AwarenessEducator/Certificates/CertificateListTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('CertificateListTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData sets server-side values and table data', async () => {
    AwarenessEducatorService.searchCertificate.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ id: 1 }],
          totalNumberOfRecords: 10,
          totalNumberOfPages: 2,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      axiosPayload: { pageNumber: 1 },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    CertificateListTable.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(10)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(2)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.tableData).toEqual([{ id: 1 }])
  })

  it('handleMakeDefault calls API and refreshes list', async () => {
    AwarenessEducatorService.makeDefaultCertificate.mockResolvedValueOnce({})
    const ctx = {
      callForData: jest.fn()
    }
    CertificateListTable.methods.handleMakeDefault.call(ctx, { id: 'cert-1' })
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.makeDefaultCertificate).toHaveBeenCalledWith('cert-1')
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('exportCertificateList downloads each selected format', async () => {
    AwarenessEducatorService.exportCertificates.mockResolvedValue({
      data: new Blob(['x'], { type: 'application/octet-stream' })
    })
    const click = jest.fn()
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      click,
      set href(v) {},
      set download(v) {}
    })
    const originalCreateObjectURL = globalThis.URL?.createObjectURL
    if (!globalThis.URL) globalThis.URL = {}
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:test')
    const ctx = {
      axiosPayload: { orderBy: 'name', ascending: true, filter: [] }
    }

    CertificateListTable.methods.exportCertificateList.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 1,
      pageSize: 25,
      reportAllPages: false
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.exportCertificates).toHaveBeenCalledTimes(2)
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })
})
