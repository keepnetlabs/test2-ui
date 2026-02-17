import { shallowMount } from '@vue/test-utils'
import CampaignManagerFrequencyTable from '@/components/CampaignManager/CampaignManagerFrequencyTable.vue'
import { COLUMNS, ACTION_STATUSES } from '@/components/CampaignManager/utils'

jest.mock('@/api/phishingsimulator', () => ({
  deletePhishingCampaignJob: jest.fn(() => Promise.resolve()),
  exportCampaignManagerItem: jest.fn(() => Promise.resolve({ data: new Blob(['x']) })),
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

  it('returns status helpers and group visibility logic', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.getErrorMessage({ status: 'Error', jobResultMessage: 'e1' })).toBe('e1')
    expect(wrapper.vm.getErrorMessage({ status: 'Running', jobResultMessage: 'e1' })).toBe('')
    expect(wrapper.vm.getTooltipDisabilityStatus({ status: 'Error', jobResultMessage: 'e1' })).toBe(false)
    expect(wrapper.vm.getTooltipDisabilityStatus({ status: 'Error', jobResultMessage: '' })).toBe(true)

    expect(wrapper.vm.isTargetUsersShowGroups({ status: ACTION_STATUSES.IDLE })).toBe(true)
    expect(wrapper.vm.isTargetUsersShowGroups({ status: ACTION_STATUSES.SCHEDULED })).toBe(true)
    expect(wrapper.vm.isTargetUsersShowGroups({ status: ACTION_STATUSES.RUNNING })).toBe(false)
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
})
