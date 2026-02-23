import { shallowMount } from '@vue/test-utils'
import CampaignManagerItemTable from '@/components/CampaignManager/CampaignManagerItemTable.vue'
import { COLUMNS, SCENARIO_DISTRIBUTION_TEXTS, ACTION_STATUSES, getStatusBadgeProps } from '@/components/CampaignManager/utils'

jest.mock('@/api/phishingsimulator', () => ({
  deletePhishingCampaignJob: jest.fn(() => Promise.resolve()),
  exportCampaignManagerItem: jest.fn(() => Promise.resolve({ data: new Uint8Array([120]) })),
  searchCampaignPhishingJob: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [
            {
              instanceGroup: 'ig-1',
              status: 'Error',
              jobResultMessage: 'Job failed',
              frequencyCount: '3',
              createdDate: '2024-01-01',
              totalTargetUserCount: 10
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

describe('CampaignManagerItemTable.vue', () => {
  const DataTableStub = {
    name: 'DataTable',
    template: '<div><slot name="table-search-left-side" /><slot name="table-all-records" /></div>'
  }

  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerItemTable, {
      propsData: {
        item: {
          resourceId: 'campaign-1',
          name: 'Campaign A',
          frequency: 1,
          categoryDistributionType: SCENARIO_DISTRIBUTION_TEXTS[0]
        },
        statusItems: [],
        ...propsData
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getCampaignManagerParentCreatePermissions': true,
            'permissions/getCampaignReportsPausePermissions': true,
            'permissions/getCampaignReportsDeletePermissions': true
          }
        }
      },
      stubs: {
        CampaignManagerItemDeleteDialog: true,
        DataTable: DataTableStub,
        CampaignManagerItemRowActions: true,
        Badge: true,
        TheRecordsButton: true,
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

  it('loads table data on created and maps frequencyCount to total', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(searchCampaignPhishingJob).toHaveBeenCalledWith(wrapper.vm.axiosPayload, 'campaign-1')
    expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(wrapper.vm.tableData[0].total).toBe(3)
    expect(wrapper.vm.tableData[0].frequencyCount).toBeUndefined()
  })

  it('updates add button disabled state from item watcher', async () => {
    const wrapper = createWrapper()
    await wrapper.setProps({
      item: {
        resourceId: 'campaign-1',
        name: 'Campaign A',
        frequency: 2,
        categoryDistributionType: SCENARIO_DISTRIBUTION_TEXTS[1]
      }
    })

    expect(wrapper.vm.tableOptions.addButton.disabled).toBe(true)

    await wrapper.setProps({
      item: {
        resourceId: 'campaign-1',
        name: 'Campaign A',
        frequency: 2,
        categoryDistributionType: SCENARIO_DISTRIBUTION_TEXTS[0]
      }
    })

    expect(wrapper.vm.tableOptions.addButton.disabled).toBe(false)
  })

  it('sets status filterable items from statusItems watcher', async () => {
    const wrapper = createWrapper()
    wrapper.vm.reRenderFilters = jest.fn()

    await wrapper.setProps({ statusItems: [{ text: 'Running' }, { text: 'Error' }] })

    const statusCol = wrapper.vm.tableOptions.columns.find(
      (col) => col.property === COLUMNS.STATUS.property
    )

    expect(statusCol.filterableItems).toEqual([
      { text: 'Running', value: 'Running' },
      { text: 'Error', value: 'Error' }
    ])
    expect(wrapper.vm.reRenderFilters).toHaveBeenCalled()
  })

  it('uses value fallback for status filters when text is missing', async () => {
    const wrapper = createWrapper()
    wrapper.vm.reRenderFilters = jest.fn()

    await wrapper.setProps({ statusItems: [{ value: 'Paused' }] })

    const statusCol = wrapper.vm.tableOptions.columns.find(
      (col) => col.property === COLUMNS.STATUS.property
    )
    expect(statusCol.filterableItems).toEqual([{ value: 'Paused' }])
    expect(wrapper.vm.reRenderFilters).toHaveBeenCalled()
  })

  it('returns table all records text and error tooltip helpers', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.getTableAllRecordsText).toContain('Campaign A')
    expect(wrapper.vm.getErrorMessage({ status: 'Error', jobResultMessage: 'boom' })).toBe('boom')
    expect(wrapper.vm.getErrorMessage({ status: 'Running', jobResultMessage: 'boom' })).toBe('')
    expect(wrapper.vm.getTooltipDisabilityStatus({ status: 'Error', jobResultMessage: 'boom' })).toBe(false)
    expect(wrapper.vm.getTooltipDisabilityStatus({ status: 'Error', jobResultMessage: '' })).toBe(true)
  })

  it('handles delete flow and refreshes table', async () => {
    const wrapper = createWrapper()
    const unSelectRow = jest.fn()

    wrapper.vm.$refs.refTable = { unSelectRow }
    wrapper.vm.callForData = jest.fn()

    await wrapper.vm.handleOnDelete({ instanceGroup: 'ig-1' })
    await flushPromises()

    expect(deletePhishingCampaignJob).toHaveBeenCalledWith('campaign-1', 'ig-1')
    expect(unSelectRow).toHaveBeenCalled()
    expect(wrapper.vm.callForData).toHaveBeenCalled()
    expect(wrapper.vm.isDeleteDialogActionButtonDisabled).toBe(false)
  })

  it('exports selected file types', async () => {
    const wrapper = createWrapper()
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

    wrapper.vm.exportCampaignManagerItemList({
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 1,
      pageSize: 25,
      reportAllPages: true
    })

    await flushPromises()

    expect(exportCampaignManagerItem).toHaveBeenCalledTimes(2)
    expect(exportCampaignManagerItem).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel', reportAllPages: true }),
      'campaign-1'
    )
    expect(exportCampaignManagerItem).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'CSV', reportAllPages: true }),
      'campaign-1'
    )
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    objectUrlSpy.mockRestore()
  })

  it('resets table state and emits action events', () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.refTable = {
      resetSearchText: jest.fn(),
      reRenderFilters: jest.fn()
    }

    wrapper.vm.handleBackClick()
    wrapper.vm.handleOnAddButtonClick()
    wrapper.vm.handleStop({ instanceGroup: 'ig-2' })
    wrapper.vm.handleLaunch({ instanceGroup: 'ig-3' })
    wrapper.vm.handlePreview({ id: 'p-1' })
    wrapper.vm.handleRecordButtonClick({ id: 'r-1' })
    wrapper.vm.resetTable()

    expect(wrapper.emitted('on-back-click')).toBeTruthy()
    expect(wrapper.emitted('on-launch')).toBeTruthy()
    expect(wrapper.emitted('on-stop')[0][0]).toEqual({ resourceId: 'campaign-1', instanceGroup: 'ig-2' })
    expect(wrapper.emitted('on-start')[0][0]).toEqual({ resourceId: 'campaign-1', instanceGroup: 'ig-3' })
    expect(wrapper.emitted('on-preview')[0][0]).toEqual({ id: 'p-1' })
    expect(wrapper.emitted('on-record-button-click')[0][0]).toEqual({ id: 'r-1' })
    expect(wrapper.vm.axiosPayload.orderBy).toBe('CreatedDate')
  })

  it('keeps status column shape stable for recurrence and non-recurrence scenarios', async () => {
    const recurringWrapper = createWrapper({
      item: {
        resourceId: 'campaign-1',
        name: 'Campaign A',
        frequency: 2,
        categoryDistributionType: SCENARIO_DISTRIBUTION_TEXTS[0]
      }
    })
    const nonRecurringWrapper = createWrapper({
      item: {
        resourceId: 'campaign-1',
        name: 'Campaign A',
        frequency: 0,
        categoryDistributionType: SCENARIO_DISTRIBUTION_TEXTS[0]
      }
    })
    await flushPromises()

    const recurringStatusCol = recurringWrapper.vm.tableColumnsWithTooltips.find(
      (col) => col.property === COLUMNS.STATUS.property
    )
    const nonRecurringStatusCol = nonRecurringWrapper.vm.tableColumnsWithTooltips.find(
      (col) => col.property === COLUMNS.STATUS.property
    )

    expect(recurringStatusCol.width).toBe(240)
    expect(nonRecurringStatusCol.width).toBe(240)
    expect(recurringStatusCol.showHeaderTooltip).toBe(false)
    expect(nonRecurringStatusCol.showHeaderTooltip).toBe(false)
    expect(recurringStatusCol.property).toBe(COLUMNS.STATUS.property)
    expect(nonRecurringStatusCol.property).toBe(COLUMNS.STATUS.property)
  })

  it('emits target users groups payload and resets selected row when closing delete dialog', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleTargetUsersGroupsClick({ instanceGroup: 'ig-x' })

    expect(wrapper.emitted('on-target-users-groups-click')[0][0]).toEqual({
      resourceId: 'campaign-1',
      campaignType: undefined,
      instanceGroup: 'ig-x'
    })

    wrapper.setData({ isShowDeleteDialog: true, selectedRow: { instanceGroup: 'ig-del' } })
    wrapper.vm.toggleShowDeleteDialog()

    expect(wrapper.vm.isShowDeleteDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toEqual({})
  })

  it('returns status helper pass-through and target users visibility by status', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.getStatusBadgeProps('Running')).toEqual(getStatusBadgeProps('Running'))
    expect(wrapper.vm.isTargetUsersShowGroups({ status: ACTION_STATUSES.IDLE })).toBe(true)
    expect(wrapper.vm.isTargetUsersShowGroups({ status: ACTION_STATUSES.SCHEDULED })).toBe(true)
    expect(wrapper.vm.isTargetUsersShowGroups({ status: ACTION_STATUSES.RUNNING })).toBe(false)
  })

  it('resets search and filters through resetTable and emits preview from handlePreview', () => {
    const wrapper = createWrapper()
    const resetSearchText = jest.fn()
    const reRenderFilters = jest.fn()
    wrapper.vm.$refs.refTable = { resetSearchText, reRenderFilters }

    wrapper.vm.handlePreview({ id: 'pv-1' })
    wrapper.vm.resetTable()

    expect(wrapper.emitted('on-preview')[0][0]).toEqual({ id: 'pv-1' })
    expect(resetSearchText).toHaveBeenCalled()
    expect(reRenderFilters).toHaveBeenCalledWith({})
    expect(wrapper.vm.axiosPayload.orderBy).toBe('CreatedDate')
  })

  it('maps total to zero when frequencyCount is missing', async () => {
    searchCampaignPhishingJob.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ instanceGroup: 'ig-zero', status: 'Running' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const wrapper = createWrapper()
    await flushPromises()

    searchCampaignPhishingJob.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ instanceGroup: 'ig-zero-2', status: 'Running' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    wrapper.vm.callForData()
    await flushPromises()

    expect(wrapper.vm.tableData[0].total).toBe(0)
  })

  it('adds width and label overrides for target users and status columns', () => {
    const wrapper = createWrapper()

    const usersCol = wrapper.vm.tableColumnsWithTooltips.find(
      (col) => col.property === 'totalTargetUserCount'
    )
    const statusCol = wrapper.vm.tableColumnsWithTooltips.find(
      (col) => col.property === COLUMNS.STATUS.property
    )

    expect(usersCol.label).toBe('Users')
    expect(usersCol.width).toBe(240)
    expect(statusCol.width).toBe(240)
  })

  it('does not throw when statusItems watcher runs without status column', async () => {
    const wrapper = createWrapper()
    wrapper.vm.tableOptions.columns = wrapper.vm.tableOptions.columns.filter(
      (col) => col.property !== COLUMNS.STATUS.property
    )
    wrapper.vm.reRenderFilters = jest.fn()

    await wrapper.setProps({ statusItems: [{ text: 'Running' }] })

    expect(wrapper.vm.reRenderFilters).not.toHaveBeenCalled()
  })

  it('handleDelete selects row and opens delete dialog', () => {
    const wrapper = createWrapper()
    const row = { instanceGroup: 'ig-del-2' }

    wrapper.vm.handleDelete(row)

    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowDeleteDialog).toBe(true)
  })

  it('reRenderFilters and resetSearchText behavior depends on table ref methods', () => {
    const wrapper = createWrapper()

    expect(() => wrapper.vm.reRenderFilters()).toThrow()
    expect(() => wrapper.vm.resetSearchText()).toThrow()

    const reRenderFilters = jest.fn()
    const resetSearchText = jest.fn()
    wrapper.vm.$refs.refTable = { reRenderFilters, resetSearchText }

    wrapper.vm.reRenderFilters()
    wrapper.vm.resetSearchText()

    expect(reRenderFilters).toHaveBeenCalledWith(undefined)
    expect(resetSearchText).toHaveBeenCalled()
  })

  it('emits launch payload from add button click', () => {
    const wrapper = createWrapper({
      item: {
        resourceId: 'campaign-add-1',
        name: 'Campaign A',
        frequency: 1,
        categoryDistributionType: SCENARIO_DISTRIBUTION_TEXTS[0]
      }
    })

    wrapper.vm.handleOnAddButtonClick()

    expect(wrapper.emitted('on-launch')[0][0]).toEqual({ resourceId: 'campaign-add-1' })
  })

  it('item watcher returns early for null and keeps add button enabled when frequency is zero', async () => {
    const wrapper = createWrapper()
    const initialTooltip = wrapper.vm.tableOptions.addButton.tooltip

    await wrapper.setProps({ item: null })
    expect(wrapper.vm.tableOptions.addButton.tooltip).toBe(initialTooltip)

    await wrapper.setProps({
      item: {
        resourceId: 'campaign-1',
        name: 'Campaign A',
        frequency: 0,
        categoryDistributionType: SCENARIO_DISTRIBUTION_TEXTS[1]
      }
    })
    expect(wrapper.vm.tableOptions.addButton.disabled).toBe(false)
    expect(wrapper.vm.tableOptions.addButton.tooltip).toBe('Add a Campaign')
  })

  it('statusItems watcher does nothing for empty values', async () => {
    const wrapper = createWrapper({ statusItems: [{ text: 'Running' }] })
    wrapper.vm.reRenderFilters = jest.fn()

    await wrapper.setProps({ statusItems: [] })
    await wrapper.setProps({ statusItems: null })

    expect(wrapper.vm.reRenderFilters).not.toHaveBeenCalled()
  })

  it('tooltip and table text helpers cover default branches', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.getTooltipDisabilityStatus({ status: 'Running', jobResultMessage: 'x' })).toBe(
      true
    )
    expect(wrapper.vm.getTableAllRecordsText).toBe('Campaign Name: Campaign A')
  })
})
