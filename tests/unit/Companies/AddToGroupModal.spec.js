import { shallowMount } from '@vue/test-utils'
import AddToGroupModal from '@/components/Companies/AddToGroupModal.vue'
import { addCompanyToCompanyGroup, exportCompanyGroup, searchCompanyGroups } from '@/api/company'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'

jest.mock('@/api/company', () => ({
  addCompanyToCompanyGroup: jest.fn(() => Promise.resolve()),
  exportCompanyGroup: jest.fn(() => Promise.resolve({ data: Buffer.from('x') })),
  searchCompanyGroups: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ resourceId: 'g-1', name: 'Group 1', companyCount: 2, createTime: '2026-01-01' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  )
}))

jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(() => [{ FieldName: 'name', Operator: 'Contains', Value: 'group' }]),
  columnFilterCleared: jest.fn(() => [])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AddToGroupModal.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(AddToGroupModal, {
      propsData: {
        status: true,
        companyIdArray: ['c-1'],
        ...propsData
      },
      stubs: {
        AppDialog: true,
        Datatable: true,
        AppDialogFooter: true,
        VForm: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads table data on created', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(searchCompanyGroups).toHaveBeenCalled()
    expect(wrapper.vm.tableData).toHaveLength(1)
    expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(1)
  })

  it('computes title for single and multiple company selection', () => {
    const single = createWrapper({ companyIdArray: ['c-1'] })
    const multi = createWrapper({ companyIdArray: ['c-1', 'c-2'] })

    expect(single.vm.title).toBe('Add a company to company groups')
    expect(multi.vm.title).toBe('Add 2 companies to company groups')
  })

  it('updates payload on pagination, size and sort changes', () => {
    const wrapper = createWrapper()
    wrapper.vm.getTableData = jest.fn()

    wrapper.vm.serverSidePageNumberChanged(3)
    expect(wrapper.vm.payload.pageNumber).toBe(3)

    wrapper.vm.serverSideSizeChanged(20)
    expect(wrapper.vm.payload.pageSize).toBe(20)
    expect(wrapper.vm.serverSideProps.pageSize).toBe(20)
    expect(wrapper.vm.countRow).toBe(20)
    expect(wrapper.vm.payload.pageNumber).toBe(1)

    wrapper.vm.sortChanged({ order: 'ascending', prop: 'name' })
    expect(wrapper.vm.payload.ascending).toBe(true)
    expect(wrapper.vm.payload.orderBy).toBe('name')
  })

  it('applies search filter only for filterable columns', () => {
    const wrapper = createWrapper()
    wrapper.vm.getTableData = jest.fn()

    wrapper.vm.handleSearchChange({
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'name', Operator: 'Contains', Value: 'x' },
              { FieldName: 'companyCount', Operator: '=', Value: 1 }
            ]
          }
        ]
      }
    })

    expect(wrapper.vm.payload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'name', Operator: 'Contains', Value: 'x' }
    ])
    expect(wrapper.vm.payload.pageNumber).toBe(1)
  })

  it('applies and clears column filters', () => {
    const wrapper = createWrapper()
    wrapper.vm.getTableData = jest.fn()

    wrapper.vm.columnFilterChanged({ fieldName: 'name' })
    expect(columnFilterChanged).toHaveBeenCalled()
    expect(wrapper.vm.payload.filter.FilterGroups[0].FilterItems).toHaveLength(1)

    wrapper.vm.columnFilterCleared('name')
    expect(columnFilterCleared).toHaveBeenCalled()
    expect(wrapper.vm.payload.filter.FilterGroups[0].FilterItems).toEqual([])
  })

  it('handles confirm action for selected groups', async () => {
    const wrapper = createWrapper({ companyIdArray: ['c-1', 'c-2'] })
    wrapper.vm.selectedArray = [{ resourceId: 'g-1' }, { resourceId: 'g-2' }]
    const changeStatusSpy = jest.spyOn(wrapper.vm, 'changeStatus')

    wrapper.vm.confirm()
    await flushPromises()

    expect(addCompanyToCompanyGroup).toHaveBeenCalledTimes(2)
    expect(addCompanyToCompanyGroup).toHaveBeenCalledWith('g-1', {
      companyResourceIdArray: ['c-1', 'c-2']
    })
    expect(changeStatusSpy).toHaveBeenCalledWith(false)
    expect(wrapper.vm.saveDisable).toBe(false)
  })

  it('changes status and resets modal state when closed', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ saveDisable: true, showTable: true })

    wrapper.vm.changeStatus(false)

    expect(wrapper.emitted('changeStatus')).toEqual([[false]])
    expect(wrapper.vm.saveDisable).toBe(false)
    expect(wrapper.vm.showTable).toBe(false)
  })

  it('exports selected file types', async () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.refGroupDataList = {
      search: 'abc',
      getSearchFilterItems: jest.fn(() => [
        { FieldName: 'name', Operator: 'Contains', Value: 'g' },
        { FieldName: 'companyCount', Operator: '=', Value: 2 }
      ])
    }

    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = originalCreateElement(tagName)
      if (tagName === 'a') {
        element.click = click
      }
      return element
    })
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = jest.fn()
    }
    const objectUrlSpy = jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:test')

    wrapper.vm.handleTableDownload({
      exportTypes: ['CSV', 'XLS'],
      pageNumber: 1,
      pageSize: 5,
      reportAllPages: true
    })
    await flushPromises()

    expect(exportCompanyGroup).toHaveBeenCalledTimes(2)
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    objectUrlSpy.mockRestore()
  })

  it('adds search filters to export payload except companyCount', async () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.refGroupDataList = {
      search: 'query',
      getSearchFilterItems: jest.fn(() => [
        { FieldName: 'name', Operator: 'Contains', Value: 'group' },
        { FieldName: 'companyCount', Operator: '=', Value: 2 }
      ])
    }

    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = originalCreateElement(tagName)
      if (tagName === 'a') {
        element.click = click
      }
      return element
    })
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = jest.fn()
    }
    const objectUrlSpy = jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:test')

    wrapper.vm.handleTableDownload({
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 5,
      reportAllPages: false
    })
    await flushPromises()

    expect(exportCompanyGroup).toHaveBeenCalledTimes(1)
    const payload = exportCompanyGroup.mock.calls[0][0]
    const pushedSearchGroup = payload.filter.FilterGroups[payload.filter.FilterGroups.length - 1]
    expect(pushedSearchGroup.FilterItems).toEqual([
      { FieldName: 'name', Operator: 'Contains', Value: 'group' }
    ])

    createElementSpy.mockRestore()
    objectUrlSpy.mockRestore()
  })

  it('does not confirm when no group is selected', async () => {
    const wrapper = createWrapper({ companyIdArray: ['c-1'] })
    wrapper.vm.selectedArray = []

    wrapper.vm.confirm()
    await flushPromises()

    expect(addCompanyToCompanyGroup).not.toHaveBeenCalled()
  })

  it('confirm keeps saveDisable false after close flow and request completion', async () => {
    const wrapper = createWrapper({ companyIdArray: ['c-1'] })
    wrapper.vm.selectedArray = [{ resourceId: 'g-10' }]
    let resolveRequest
    const pendingRequest = new Promise((resolve) => {
      resolveRequest = resolve
    })
    addCompanyToCompanyGroup.mockReturnValueOnce(pendingRequest)

    wrapper.vm.confirm()
    expect(wrapper.vm.saveDisable).toBe(false)

    resolveRequest()
    await flushPromises()
    expect(wrapper.vm.saveDisable).toBe(false)
  })

  it('updates selectedArray on selection change', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleSelectionChange([{ resourceId: 'g-1' }])

    expect(wrapper.vm.selectedArray).toEqual([{ resourceId: 'g-1' }])
  })

  it('resets page number helper explicitly', () => {
    const wrapper = createWrapper()
    wrapper.vm.payload.pageNumber = 5
    wrapper.vm.serverSideProps.pageNumber = 5

    wrapper.vm.resetPageNumber()

    expect(wrapper.vm.payload.pageNumber).toBe(1)
    expect(wrapper.vm.serverSideProps.pageNumber).toBe(1)
  })
})
