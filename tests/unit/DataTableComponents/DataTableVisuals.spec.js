import { mount, shallowMount } from '@vue/test-utils'
import DataTableAttachment from '@/components/DataTableComponents/DataTableAttachment'
import DataTableProgress from '@/components/DataTableComponents/DataTableProgress'
import DataTableService from '@/components/DataTableComponents/DataTableService'
import DataTableUserStatus from '@/components/DataTableComponents/DataTableUserStatus'
import DataTableChart from '@/components/DataTableComponents/DataTableChart'

describe('DataTable visual components', () => {
  it('DataTableAttachment renders check/cancel icons by numeric value', () => {
    const checkWrapper = mount({
      components: { DataTableAttachment },
      template: '<DataTableAttachment :scope="scope" :col="col" />',
      data() {
        return {
          scope: { row: { count: 2 } },
          col: { property: 'count' }
        }
      }
    }, {
      stubs: { 'v-icon': true }
    })
    const cancelWrapper = mount({
      components: { DataTableAttachment },
      template: '<DataTableAttachment :scope="scope" :col="col" />',
      data() {
        return {
          scope: { row: { count: 0 } },
          col: { property: 'count' }
        }
      }
    }, {
      stubs: { 'v-icon': true }
    })

    expect(checkWrapper.text()).toContain('mdi-check')
    expect(cancelWrapper.text()).toContain('mdi-cancel')
  })

  it('DataTableProgress handles valid and invalid progress values', () => {
    const validWrapper = shallowMount(DataTableProgress, {
      propsData: {
        scope: { row: { progress: 100 } },
        col: { property: 'progress' }
      }
    })
    const invalidWrapper = shallowMount(DataTableProgress, {
      propsData: {
        scope: { row: { progress: 'NaN' } },
        col: { property: 'progress' }
      }
    })

    expect(validWrapper.vm.hasValidProgress).toBe(true)
    expect(validWrapper.text()).toContain('Completed')
    expect(invalidWrapper.vm.hasValidProgress).toBe(false)
  })

  it('DataTableService renders expected icon and fallback empty text', () => {
    const iconWrapper = shallowMount(DataTableService, {
      propsData: {
        scope: { row: { service: 'Outlook' } },
        col: { property: 'service', emptyText: '-' }
      }
    })
    const fallbackWrapper = shallowMount(DataTableService, {
      propsData: {
        scope: { row: {} },
        col: { property: 'service', emptyText: '-' }
      }
    })

    expect(iconWrapper.find('img[alt="outlook"]').exists()).toBe(true)
    expect(fallbackWrapper.text()).toContain('-')
  })

  it('DataTableUserStatus maps status color values', () => {
    const wrapper = shallowMount(DataTableUserStatus, {
      propsData: {
        scope: { row: { status: 'online' } },
        col: { property: 'status' }
      },
      stubs: {
        badge: true
      }
    })

    expect(wrapper.vm.getBtnUserStatusColor('online')).toBe('#00bcd4')
    expect(wrapper.vm.getBtnUserStatusColor('offline')).toBe('#f56c6c')
    expect(wrapper.find('badge-stub').exists()).toBe(true)
  })

  it('DataTableChart computes tooltip rendering state from chart data', () => {
    const withData = shallowMount(DataTableChart, {
      propsData: {
        scope: { row: { stats: [1, 0, 0], label: 'x' } },
        col: { property: 'stats', informationTextProperty: 'label' },
        chartOptions: { labels: ['a', 'b', 'c'] }
      },
      stubs: {
        pie: true
      }
    })
    const emptyData = shallowMount(DataTableChart, {
      propsData: {
        scope: { row: { stats: [0, 0], label: 'x' } },
        col: { property: 'stats', informationTextProperty: 'label' },
        chartOptions: { labels: ['a', 'b'] }
      },
      stubs: {
        pie: true
      }
    })

    expect(withData.vm.shouldRenderTooltip).toBe(true)
    expect(emptyData.vm.shouldRenderTooltip).toBe(false)
  })
})
