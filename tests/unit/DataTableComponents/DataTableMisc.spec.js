import { mount, shallowMount } from '@vue/test-utils'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import DataTableFilterOptions from '@/components/DataTableComponents/DataTableFilterOptions'
import DownloadModal from '@/components/DataTableComponents/DownloadModal'
import DataTableTooltip from '@/components/DataTableComponents/DataTableTooltip'
import DataTableColorfulText from '@/components/DataTableComponents/DataTableColorfulText'
import DataTableText from '@/components/DataTableComponents/DataTableText'

describe('DataTable misc components', () => {
  it('DataTableFilterOptions emits expected actions for list items', () => {
    const wrapper = shallowMount(DataTableFilterOptions, {
      propsData: { isActive: true, hideActionOptions: false }
    })

    wrapper.vm.handleListItemClick(COMMON_CONSTANTS.FILTER_OPTIONS[0])
    wrapper.vm.handleListItemClick(COMMON_CONSTANTS.FILTER_OPTIONS[1])
    wrapper.vm.handleListItemClick(COMMON_CONSTANTS.FILTER_OPTIONS[2])

    expect(wrapper.emitted('set-default-search')).toBeTruthy()
    expect(wrapper.emitted('restore-default-search')).toBeTruthy()
    expect(wrapper.emitted('clear-filters')).toBeTruthy()
  })

  it('DataTableFilterOptions is hidden when action options are disabled', () => {
    const wrapper = shallowMount(DataTableFilterOptions, {
      propsData: { hideActionOptions: true }
    })

    expect(wrapper.find('v-menu-stub').exists()).toBe(false)
  })

  it('DownloadModal computes disabled state and emits selected formats', () => {
    const wrapper = shallowMount(DownloadModal, {
      propsData: {
        isShow: true,
        title: 'Download',
        download: { xls: true, csv: true, pdf: true }
      }
    })

    expect(wrapper.vm.getDisabledStatusOfDelete).toBe(true)

    wrapper.setData({ downloadType: [true, false, true] })
    wrapper.vm.downloadEvent()

    expect(wrapper.emitted('downloadEvent')).toBeTruthy()
    expect(wrapper.emitted('downloadEvent')[0][0]).toEqual(['XLS', 'PDF'])
    expect(wrapper.emitted('changeDownloadModalStatus')).toBeTruthy()
    expect(wrapper.emitted('changeDownloadModalStatus')[0]).toEqual([false])
  })

  it('DataTableTooltip appends/removes itself from body when requested', () => {
    const wrapper = mount(DataTableTooltip, {
      propsData: {
        appendToBody: true,
        content: 'Tooltip Content',
        tooltipStyle: { top: '10px' }
      }
    })

    expect(document.body.contains(wrapper.vm.$refs.tooltip)).toBe(true)

    wrapper.destroy()
    expect(document.body.querySelector('.datatable-tooltip')).toBeNull()
  })

  it('DataTableColorfulText renders fallback and value branches', () => {
    const withValue = shallowMount(DataTableColorfulText, {
      propsData: {
        scope: { row: { status: 'warn' } },
        col: { property: 'status' },
        text: 'Warning'
      }
    })
    const emptyValue = shallowMount(DataTableColorfulText, {
      propsData: {
        scope: { row: {} },
        col: { property: 'status', emptyText: '-' },
        text: 'Warning'
      }
    })

    expect(withValue.text()).toContain('Warning')
    expect(emptyValue.text()).toContain('-')
  })

  it('DataTableText helper methods detect content and validation details', () => {
    const props = {
      scope: {
        row: {
          email: 'user@example.com',
          validationDetail: [{ fieldName: 'EMAIL', message: 'Invalid domain' }]
        }
      },
      col: { property: 'email' }
    }

    expect(DataTableText.getHasRowContent(props)).toBe(true)
    expect(DataTableText.getHasValidationError(props)).toBeTruthy()
  })
})
