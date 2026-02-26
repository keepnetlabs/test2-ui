import Integrations from '@/components/Integrations/Integrations.vue'
import {
  deleteIntegration,
  disableIntegration,
  enableIntegration,
  exportReportedEmails,
  getIntegrationList
} from '@/api/integrations'

const mockBlobData = {}

jest.mock('@/api/integrations', () => ({
  getIntegrationList: jest.fn(),
  deleteIntegration: jest.fn(),
  disableIntegration: jest.fn(),
  enableIntegration: jest.fn(),
  exportReportedEmails: jest.fn(() => Promise.resolve({ data: mockBlobData }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Integrations.vue (extra)', () => {
  const { methods } = Integrations

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData sets loading false when search permission is missing', () => {
    const ctx = {
      loading: true,
      permissions: { SEARCH: { hasPermission: false } }
    }

    methods.callForData.call(ctx)

    expect(ctx.loading).toBe(false)
  })

  it('callForData stores empty table on api error', async () => {
    getIntegrationList.mockRejectedValueOnce(new Error('fail'))
    const ctx = {
      loading: false,
      permissions: { SEARCH: { hasPermission: true } },
      axiosPayload: {},
      tableData: [{ resourceId: 'old' }]
    }

    methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
    expect(ctx.loading).toBe(false)
  })

  it('callForData sends axios payload to integration list api when search is allowed', async () => {
    getIntegrationList.mockResolvedValueOnce({
      data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 } }
    })
    const ctx = {
      loading: false,
      permissions: { SEARCH: { hasPermission: true } },
      axiosPayload: { pageNumber: 3, filter: { FilterGroups: [] } },
      tableData: [],
      serverSideProps: {}
    }

    methods.callForData.call(ctx)
    await flushPromises()

    expect(getIntegrationList).toHaveBeenCalledWith({ pageNumber: 3, filter: { FilterGroups: [] } })
  })

  it('callForData maps response data and pagination on success', async () => {
    getIntegrationList.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ resourceId: 'r1' }],
          totalNumberOfRecords: 9,
          totalNumberOfPages: 3,
          pageNumber: 2
        }
      }
    })
    const ctx = {
      loading: false,
      permissions: { SEARCH: { hasPermission: true } },
      axiosPayload: {},
      tableData: [],
      serverSideProps: {}
    }

    methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([{ resourceId: 'r1' }])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(9)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(3)
    expect(ctx.serverSideProps.pageNumber).toBe(2)
    expect(ctx.loading).toBe(false)
  })

  it('handleDelete unselects row and refreshes data', async () => {
    deleteIntegration.mockResolvedValueOnce({})
    const unSelectRow = jest.fn()
    const callForData = jest.fn()
    const row = { resourceId: '1' }
    const ctx = {
      $refs: { refIntegrationsList: { unSelectRow } },
      callForData
    }

    methods.handleDelete.call(ctx, row)
    await flushPromises()

    expect(unSelectRow).toHaveBeenCalledWith(row)
    expect(deleteIntegration).toHaveBeenCalledWith('1')
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('handleDisable and handleEnable call api then refresh', async () => {
    disableIntegration.mockResolvedValueOnce({})
    enableIntegration.mockResolvedValueOnce({})
    const callForData = jest.fn()
    const ctx = { callForData }

    methods.handleDisable.call(ctx, { resourceId: '1' })
    methods.handleEnable.call(ctx, { resourceId: '2' })
    await flushPromises()

    expect(disableIntegration).toHaveBeenCalledWith('1')
    expect(enableIntegration).toHaveBeenCalledWith('2')
    expect(callForData).toHaveBeenCalledTimes(2)
  })

  it('handleSearchChange keeps non-mapped fields and triggers refresh', () => {
    const resetPageNumber = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{}, { FilterItems: [] }] } },
      resetPageNumber,
      callForData
    }

    methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [{ FieldName: 'Name', value: 'abc' }]
          }
        ]
      }
    })

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'Name', value: 'abc' }
    ])
    expect(resetPageNumber).toHaveBeenCalledTimes(1)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('handleDeleteMultiple with empty selections does not call handleDelete', () => {
    const ctx = { handleDelete: jest.fn() }
    methods.handleDeleteMultiple.call(ctx, [])
    expect(ctx.handleDelete).not.toHaveBeenCalled()
  })

  it('exportIntegrationList maps XLS and triggers downloads', async () => {
    const click = jest.fn()
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click
    })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:integration')
    const ctx = { axiosPayload: { filter: { FilterGroups: [] } } }

    methods.exportIntegrationList.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportReportedEmails).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(exportReportedEmails).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'CSV' })
    )
    expect(click).toHaveBeenCalledTimes(2)
    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    window.URL.createObjectURL = originalCreateObjectURL
  })

  it('exportIntegrationList sets expected filenames for XLS and PDF', async () => {
    const links = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { href: '', download: '', click: jest.fn() }
      links.push(link)
      return link
    })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:integration')
    const ctx = { axiosPayload: { filter: { FilterGroups: [] } } }

    methods.exportIntegrationList.call(ctx, {
      exportTypes: ['XLS', 'PDF'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(links[0].download).toBe('Integrations.xlsx')
    expect(links[1].download).toBe('Integrations.pdf')

    createElementSpy.mockRestore()
    window.URL.createObjectURL = originalCreateObjectURL
  })

  it('changeModalStatus clears id and skips refresh when restart is falsey', () => {
    const ctx = {
      integrationId: 'i-1',
      modalStatus: false,
      callForData: jest.fn()
    }

    methods.changeModalStatus.call(ctx, true, false)
    expect(ctx.integrationId).toBeNull()
    expect(ctx.modalStatus).toBe(true)
    expect(ctx.callForData).not.toHaveBeenCalled()
  })

  it('changeModalStatus triggers refresh when restart is true', () => {
    const ctx = {
      integrationId: 'i-2',
      modalStatus: false,
      callForData: jest.fn()
    }

    methods.changeModalStatus.call(ctx, false, true)
    expect(ctx.integrationId).toBeNull()
    expect(ctx.modalStatus).toBe(false)
    expect(ctx.callForData).toHaveBeenCalledTimes(1)
  })

  it('handleActionDelete sets selected integration and opens delete modal', () => {
    const ctx = {
      selectedIntegration: null,
      showDeleteModal: false
    }
    const row = { resourceId: 'r-x' }

    methods.handleActionDelete.call(ctx, row)

    expect(ctx.selectedIntegration).toEqual(row)
    expect(ctx.showDeleteModal).toBe(true)
  })

  it('checkIfCanCloseNewIntegrationModal keeps modal closed when already false', () => {
    const ctx = { modalStatus: false }
    methods.checkIfCanCloseNewIntegrationModal.call(ctx)
    expect(ctx.modalStatus).toBe(false)
  })

  it('checkIfCanCloseNewIntegrationModal closes modal when open', () => {
    const ctx = { modalStatus: true }
    methods.checkIfCanCloseNewIntegrationModal.call(ctx)
    expect(ctx.modalStatus).toBe(false)
  })

  it('handleEdit opens modal and stores integration resource id', () => {
    const ctx = { modalStatus: false, integrationId: null }
    methods.handleEdit.call(ctx, { resourceId: 'edit-1' })
    expect(ctx.modalStatus).toBe(true)
    expect(ctx.integrationId).toBe('edit-1')
  })
})
