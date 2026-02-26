const mockCreateObjectURL = jest.fn(() => 'blob:mock')

jest.mock('@/api/siemIntegrations', () => ({
  searchSIEMIntegrations: jest.fn(),
  exportSIEMIntegrations: jest.fn()
}))

import { exportSIEMIntegrations, searchSIEMIntegrations } from '@/api/siemIntegrations'
import SIEMIntegrationsTable from '@/components/Integrations/SIEMIntegrations/SIEMIntegrationsTable.vue'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SIEMIntegrationsTable.vue (extra)', () => {
  const { methods } = SIEMIntegrationsTable

  beforeAll(() => {
    globalThis.URL.createObjectURL = mockCreateObjectURL
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData maps server-side response values', async () => {
    searchSIEMIntegrations.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ resourceId: 'i1' }],
          totalNumberOfRecords: 5,
          totalNumberOfPages: 2,
          pageNumber: 2
        }
      }
    })

    const ctx = {
      axiosPayload: {},
      tableData: [],
      serverSideProps: {},
      setLoading: jest.fn()
    }

    methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([{ resourceId: 'i1' }])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(5)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(2)
    expect(ctx.serverSideProps.pageNumber).toBe(2)
    expect(ctx.setLoading).toHaveBeenCalledWith(true)
    expect(ctx.setLoading).toHaveBeenLastCalledWith()
  })

  it('callForData sends current axios payload to search api', async () => {
    searchSIEMIntegrations.mockResolvedValueOnce({
      data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 } }
    })
    const payload = { pageNumber: 7, filter: { FilterGroups: [] } }
    const ctx = {
      axiosPayload: payload,
      tableData: [],
      serverSideProps: {},
      setLoading: jest.fn()
    }

    methods.callForData.call(ctx)
    await flushPromises()

    expect(searchSIEMIntegrations).toHaveBeenCalledWith(payload)
  })

  it('callForData sets empty table when api rejects', async () => {
    searchSIEMIntegrations.mockRejectedValueOnce(new Error('fail'))
    const ctx = {
      axiosPayload: {},
      tableData: [{ resourceId: 'old' }],
      serverSideProps: {},
      setLoading: jest.fn()
    }

    methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
  })

  it('callForData handles missing data payload with defaults', async () => {
    searchSIEMIntegrations.mockResolvedValueOnce({ data: {} })
    const ctx = {
      axiosPayload: {},
      tableData: [{ resourceId: 'old' }],
      serverSideProps: {},
      setLoading: jest.fn()
    }

    methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBeUndefined()
    expect(ctx.serverSideProps.totalNumberOfPages).toBeUndefined()
    expect(ctx.serverSideProps.pageNumber).toBeUndefined()
  })

  it('handleSearchChange keeps only filterable columns', () => {
    const callForData = jest.fn()
    const resetPageNumber = jest.fn()
    const ctx = {
      tableOptions: {
        columns: [
          { property: 'name', filterableType: 'text' },
          { property: 'statusName', filterableType: 'select' },
          { property: 'createTime' }
        ]
      },
      axiosPayload: { filter: { FilterGroups: [{}, { FilterItems: [] }] } },
      resetPageNumber,
      callForData
    }

    methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'Name', value: 'x' },
              { FieldName: 'CreateTime', value: '2024-01-01' }
            ]
          }
        ]
      }
    })

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'Name', value: 'x' }
    ])
    expect(resetPageNumber).toHaveBeenCalledTimes(1)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('handleSearchChange matches columns case-insensitively', () => {
    const ctx = {
      tableOptions: {
        columns: [{ property: 'statusName', filterableType: 'select' }]
      },
      axiosPayload: { filter: { FilterGroups: [{}, { FilterItems: [] }] } },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }

    methods.handleSearchChange.call(ctx, {
      filter: { FilterGroups: [{ FilterItems: [{ FieldName: 'STATUSNAME', value: 'Active' }] }] }
    })

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'STATUSNAME', value: 'Active' }
    ])
  })

  it('handleSearchChange drops non-filterable items only', () => {
    const ctx = {
      tableOptions: {
        columns: [
          { property: 'name', filterableType: 'text' },
          { property: 'other' }
        ]
      },
      axiosPayload: { filter: { FilterGroups: [{}, { FilterItems: [] }] } },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }

    methods.handleSearchChange.call(ctx, {
      filter: { FilterGroups: [{ FilterItems: [{ FieldName: 'Other', value: 'x' }] }] }
    })

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([])
  })

  it('serverSidePageNumberChanged updates payload and refreshes', () => {
    const callForData = jest.fn()
    const ctx = { axiosPayload: {}, callForData }

    methods.serverSidePageNumberChanged.call(ctx, 4)

    expect(ctx.axiosPayload.pageNumber).toBe(4)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('serverSidePageNumberChanged defaults to page 1 when undefined', () => {
    const ctx = { axiosPayload: {}, callForData: jest.fn() }
    methods.serverSidePageNumberChanged.call(ctx)
    expect(ctx.axiosPayload.pageNumber).toBe(1)
  })

  it('exportIntegrationList maps XLS to xlsx and triggers downloads', async () => {
    const click = jest.fn()
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click
    })
    exportSIEMIntegrations.mockResolvedValue({ data: {} })

    const ctx = {
      axiosPayload: { filter: { FilterGroups: [] } }
    }

    methods.exportIntegrationList.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportSIEMIntegrations).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(exportSIEMIntegrations).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'CSV' })
    )
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
  })

  it('exportIntegrationList sends mapped payload with filter and pagination fields', async () => {
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: jest.fn()
    })
    exportSIEMIntegrations.mockResolvedValue({ data: {} })

    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [{ FieldName: 'Name', value: 'x' }] }] } }
    }

    methods.exportIntegrationList.call(ctx, {
      exportTypes: ['XLS'],
      reportAllPages: false,
      pageNumber: 4,
      pageSize: 50
    })
    await flushPromises()

    expect(exportSIEMIntegrations).toHaveBeenCalledWith({
      pageNumber: 4,
      pageSize: 50,
      orderBy: 'CreateTime',
      ascending: false,
      reportAllPages: false,
      exportType: 'Excel',
      filter: { FilterGroups: [{ FilterItems: [{ FieldName: 'Name', value: 'x' }] }] }
    })

    createElementSpy.mockRestore()
  })

  it('exportIntegrationList sets expected download filenames', async () => {
    const links = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { href: '', download: '', click: jest.fn() }
      links.push(link)
      return link
    })
    exportSIEMIntegrations.mockResolvedValue({ data: {} })

    const ctx = {
      axiosPayload: { filter: { FilterGroups: [] } }
    }

    methods.exportIntegrationList.call(ctx, {
      exportTypes: ['XLS', 'PDF'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(links[0].download).toBe('SIEM-Integrations.xlsx')
    expect(links[1].download).toBe('SIEM-Integrations.pdf')

    createElementSpy.mockRestore()
  })

  it('toggleAddOrEditModal, handleEdit and handleDeleteRowClick emit expected events', () => {
    const ctx = { $emit: jest.fn() }
    methods.toggleAddOrEditModal.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-open-add-or-edit-modal')

    const row = { resourceId: 'del-1' }
    methods.handleDeleteRowClick.call(ctx, row)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', row)

    methods.handleEdit.call(ctx, row)
    expect(ctx.$emit).toHaveBeenCalledWith('on-open-add-or-edit-modal', row)
  })

  it('created hook triggers initial table load', () => {
    const ctx = { callForData: jest.fn() }
    SIEMIntegrationsTable.created.call(ctx)
    expect(ctx.callForData).toHaveBeenCalledTimes(1)
  })

  it('data builds disabled actions/buttons when permissions are missing', () => {
    const data = SIEMIntegrationsTable.data.call({
      PERMISSIONS: { update: false, delete: false, export: false, create: false }
    })

    expect(data.tableOptions.rowActions[0].disabled).toBe(true)
    expect(data.tableOptions.rowActions[1].disabled).toBe(true)
    expect(data.tableOptions.downloadButton.disabled).toBe(true)
    expect(data.tableOptions.empty.disabled).toBe(true)
    expect(data.tableOptions.addButton.disabled).toBe(true)
  })

  it('data keeps actions/buttons enabled when permissions are granted', () => {
    const data = SIEMIntegrationsTable.data.call({
      PERMISSIONS: { update: true, delete: true, export: true, create: true }
    })

    expect(data.tableOptions.rowActions[0].disabled).toBe(false)
    expect(data.tableOptions.rowActions[1].disabled).toBe(false)
    expect(data.tableOptions.downloadButton.disabled).toBe(false)
    expect(data.tableOptions.empty.disabled).toBe(false)
    expect(data.tableOptions.addButton.disabled).toBe(false)
  })
})
