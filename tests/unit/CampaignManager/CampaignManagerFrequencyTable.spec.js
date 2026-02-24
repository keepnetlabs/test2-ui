import { shallowMount } from '@vue/test-utils'
import CampaignManagerFrequencyTable from '@/components/CampaignManager/CampaignManagerFrequencyTable.vue'
import { COLUMNS, ACTION_STATUSES, getStatusBadgeProps } from '@/components/CampaignManager/utils'

jest.mock('@/api/phishingsimulator', () => ({
  deletePhishingCampaignJob: jest.fn(() => Promise.resolve()),
  exportCampaignManagerItem: jest.fn(() => Promise.resolve({ data: new Uint8Array([120]) })),
  searchCampaignPhishingJob: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [
            {
              instanceGroup: 'grp-1',
              status: 'Scheduled',
              totalTargetUserCount: 12,
              jobResultMessage: ''
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  )
}))

const {
  deletePhishingCampaignJob,
  exportCampaignManagerItem,
  searchCampaignPhishingJob
} = require('@/api/phishingsimulator')

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerFrequencyTable.vue', () => {
  const DataTableStub = {
    name: 'DataTable',
    template: '<div><slot name="table-search-left-side" /><slot name="table-all-records" /></div>'
  }

  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerFrequencyTable, {
      propsData: {
        item: {
          frequencyGroup: 'fg-1',
          frequencyDescription: 'Weekly',
          instanceGroup: 'ig-parent'
        },
        statusItems: [],
        parentResourceId: 'parent-1',
        parentCampaignType: 1,
        ...propsData
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getCampaignReportsPausePermissions': true,
            'permissions/getCampaignReportsDeletePermissions': true
          }
        }
      },
      stubs: {
        CampaignManagerItemDeleteDialog: true,
        CampaignManagerItemRowActions: true,
        DataTable: DataTableStub,
        Badge: true,
        VBtn: true,
        VIcon: true,
        VTooltip: true
      }
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders FrequencyType label with frequencyDescription in table-all-records', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Frequency Type:')
    expect(wrapper.text()).toContain('Weekly')
  })

  it('loads data on created with frequencyGroup payload', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(searchCampaignPhishingJob).toHaveBeenCalledWith(
      expect.objectContaining({ phishingCampaignFrequencyGroup: 'fg-1' }),
      'parent-1'
    )
    expect(wrapper.vm.tableData).toHaveLength(1)
    expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(1)
  })

  it('maps status filter values in watcher', async () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.refTable = { reRenderFilters: jest.fn() }

    await wrapper.setProps({ statusItems: [{ text: 'Scheduled' }, { text: 'Error' }] })

    const statusCol = wrapper.vm.tableOptions.columns.find((col) => col.property === COLUMNS.STATUS.property)
    expect(statusCol.filterableItems).toEqual([
      { text: 'Scheduled', value: 'Scheduled' },
      { text: 'Error', value: 'Error' }
    ])
    expect(wrapper.vm.$refs.refTable.reRenderFilters).toHaveBeenCalled()
  })

  it('uses value fallback in status watcher and does not throw without refTable', async () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs = {}

    await wrapper.setProps({ statusItems: [{ value: 'Paused' }] })

    const statusCol = wrapper.vm.tableOptions.columns.find((col) => col.property === COLUMNS.STATUS.property)
    expect(statusCol.filterableItems).toEqual([{ value: 'Paused' }])
  })

  it('does nothing in status watcher when status column is missing or list is empty', async () => {
    const wrapper = createWrapper()
    const statusCol = wrapper.vm.tableOptions.columns.find((col) => col.property === COLUMNS.STATUS.property)
    wrapper.vm.tableOptions.columns = wrapper.vm.tableOptions.columns.filter(
      (col) => col.property !== COLUMNS.STATUS.property
    )

    await wrapper.setProps({ statusItems: [{ text: 'Scheduled' }] })
    expect(statusCol.filterableItems).toBeUndefined()

    await wrapper.setProps({ statusItems: [] })
    expect(wrapper.vm.tableOptions.columns.find((col) => col.property === COLUMNS.STATUS.property)).toBeUndefined()
  })

  it('supports delete flow and refresh', async () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.refTable = { unSelectRow: jest.fn() }
    wrapper.vm.callForData = jest.fn()

    await wrapper.vm.handleOnDelete({ instanceGroup: 'grp-1' })
    await flushPromises()

    expect(deletePhishingCampaignJob).toHaveBeenCalledWith('parent-1', 'grp-1')
    expect(wrapper.vm.$refs.refTable.unSelectRow).toHaveBeenCalled()
    expect(wrapper.vm.callForData).toHaveBeenCalled()
    expect(wrapper.vm.isDeleteDialogActionButtonDisabled).toBe(false)
  })

  it('handles empty API data with defaults in callForData', async () => {
    searchCampaignPhishingJob.mockResolvedValueOnce({ data: { data: {} } })
    const wrapper = createWrapper()
    await flushPromises()

    searchCampaignPhishingJob.mockResolvedValueOnce({ data: { data: {} } })
    wrapper.vm.callForData()
    await flushPromises()

    expect(wrapper.vm.tableData).toEqual([])
    expect(wrapper.vm.serverSideProps.pageNumber).toBeUndefined()
  })

  it('exports rows with frequency group', async () => {
    const wrapper = createWrapper()
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = originalCreateElement(tagName)
      if (tagName === 'a') {
        element.click = click
      }
      return element
    })
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = jest.fn()
    }
    jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:test')

    wrapper.vm.exportCampaignManagerItemList({
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(exportCampaignManagerItem).toHaveBeenCalledWith(
      expect.objectContaining({ phishingCampaignFrequencyGroup: 'fg-1', exportType: 'CSV' }),
      'parent-1'
    )
    expect(click).toHaveBeenCalled()
  })

  it('maps PDF export type to PDF payload and pdf extension', async () => {
    const wrapper = createWrapper()
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = originalCreateElement(tagName)
      if (tagName === 'a') {
        element.click = click
      }
      return element
    })
    jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:test-pdf')

    wrapper.vm.exportCampaignManagerItemList({
      exportTypes: ['PDF'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(exportCampaignManagerItem).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'PDF', phishingCampaignFrequencyGroup: 'fg-1' }),
      'parent-1'
    )
    expect(click).toHaveBeenCalled()
  })

  it('maps XLS export type to Excel payload and xlsx extension', async () => {
    const wrapper = createWrapper()
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = originalCreateElement(tagName)
      if (tagName === 'a') {
        element.click = click
      }
      return element
    })
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = jest.fn()
    }
    jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:test-xls')

    wrapper.vm.exportCampaignManagerItemList({
      exportTypes: ['XLS'],
      pageNumber: 2,
      pageSize: 20,
      reportAllPages: true
    })
    await flushPromises()

    expect(exportCampaignManagerItem).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel', reportAllPages: true }),
      'parent-1'
    )
    expect(click).toHaveBeenCalled()
  })

  it('returns status helpers and group visibility logic', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.getErrorMessage({ status: 'Error', jobResultMessage: 'e1' })).toBe('e1')
    expect(wrapper.vm.getErrorMessage({ status: 'Running', jobResultMessage: 'e1' })).toBe('')
    expect(wrapper.vm.getTooltipDisabilityStatus({ status: 'Error', jobResultMessage: 'e1' })).toBe(false)
    expect(wrapper.vm.getTooltipDisabilityStatus({ status: 'Error', jobResultMessage: '' })).toBe(true)
    expect(wrapper.vm.getTooltipDisabilityStatus({ status: 'Scheduled' })).toBe(true)

    expect(wrapper.vm.isTargetUsersShowGroups({ status: ACTION_STATUSES.IDLE })).toBe(true)
    expect(wrapper.vm.isTargetUsersShowGroups({ status: ACTION_STATUSES.SCHEDULED })).toBe(true)
    expect(wrapper.vm.isTargetUsersShowGroups({ status: ACTION_STATUSES.RUNNING })).toBe(false)
    expect(wrapper.vm.isTargetUsersShowGroups({})).toBe(false)
  })

  it('emits navigation and action events', () => {
    const wrapper = createWrapper()

    wrapper.vm.handleBackClick()
    wrapper.vm.handleOnAddButtonClick()
    wrapper.vm.handleStop({ instanceGroup: 'g-1' })
    wrapper.vm.handleLaunch({ instanceGroup: 'g-2' })
    wrapper.vm.handleTargetUsersGroupsClick({ instanceGroup: 'will-be-ignored' })

    expect(wrapper.emitted('on-back-click')).toBeTruthy()
    expect(wrapper.emitted('on-launch')).toBeTruthy()
    expect(wrapper.emitted('on-stop')[0][0]).toEqual({ resourceId: 'parent-1', instanceGroup: 'g-1' })
    expect(wrapper.emitted('on-start')[0][0]).toEqual({ resourceId: 'parent-1', instanceGroup: 'g-2' })
    expect(wrapper.emitted('on-target-users-groups-click')[0][0]).toEqual({
      resourceId: 'parent-1',
      campaignType: 1,
      instanceGroup: 'ig-parent'
    })
  })

  it('toggles delete dialog state and resets selected row on close', () => {
    const wrapper = createWrapper()

    wrapper.vm.handleDelete({ instanceGroup: 'to-delete' })
    expect(wrapper.vm.isShowDeleteDialog).toBe(true)
    expect(wrapper.vm.selectedRow).toEqual({ instanceGroup: 'to-delete' })

    wrapper.vm.toggleShowDeleteDialog()
    expect(wrapper.vm.isShowDeleteDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toEqual({})
  })

  it('passes status badge props through utility helper', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getStatusBadgeProps('Scheduled')).toEqual(getStatusBadgeProps('Scheduled'))
  })

  it('returns helper defaults for empty rows and emits add-button launch', () => {
    const wrapper = createWrapper({ parentResourceId: 'parent-add-1' })

    expect(wrapper.vm.getErrorMessage({})).toBe('')
    expect(wrapper.vm.getTooltipDisabilityStatus({})).toBe(true)
    expect(wrapper.vm.isTargetUsersShowGroups({})).toBe(false)

    wrapper.vm.handleOnAddButtonClick()
    expect(wrapper.emitted('on-launch')[0][0]).toEqual({ resourceId: 'parent-add-1' })
  })

  it('statusItems watcher does nothing for null value', async () => {
    const wrapper = createWrapper({ statusItems: [{ text: 'Scheduled' }] })
    const statusCol = wrapper.vm.tableOptions.columns.find((col) => col.property === COLUMNS.STATUS.property)
    const previous = statusCol.filterableItems

    await wrapper.setProps({ statusItems: null })

    expect(statusCol.filterableItems).toBe(previous)
  })

  it('callForData toggles loading true then false through finally callback', async () => {
    const loadingFlags = []
    const ctx = {
      axiosPayload: { filter: {}, orderBy: 'CreatedDate' },
      item: { frequencyGroup: 'fg-x' },
      parentResourceId: 'parent-x',
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn((flag = false) => loadingFlags.push(flag)),
      $nextTick: (cb) => cb()
    }

    CampaignManagerFrequencyTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(loadingFlags).toEqual([true, false])
  })

  it('handleTargetUsersGroupsClick emits undefined instanceGroup when item is missing', () => {
    const emit = jest.fn()
    const ctx = {
      parentResourceId: 'parent-z',
      parentCampaignType: 9,
      item: null,
      $emit: emit
    }

    CampaignManagerFrequencyTable.methods.handleTargetUsersGroupsClick.call(ctx, {
      instanceGroup: 'ignored'
    })

    expect(emit).toHaveBeenCalledWith('on-target-users-groups-click', {
      resourceId: 'parent-z',
      campaignType: 9,
      instanceGroup: undefined
    })
  })

  it('getErrorMessage returns empty string for Error status without message', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getErrorMessage({ status: 'Error' })).toBe('')
  })
})
