import { shallowMount } from '@vue/test-utils'
import ExecutiveWidgetHeader from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue'

describe('ExecutiveWidgetHeader.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(ExecutiveWidgetHeader, {
      propsData: {
        title: 'Risk Score',
        subtitle: 'Executive Reports',
        editMode: true,
        ...propsData
      },
      stubs: {
        VIcon: {
          name: 'VIcon',
          template: '<i @click="$emit(\'click\')"><slot /></i>'
        }
      }
    })

  it('renders title/subtitle and component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Risk Score')
    expect(wrapper.text()).toContain('Executive Reports')
    expect(wrapper.vm.$options.name).toBe('ExecutiveWidgetHeader')
  })

  it('shows editable actions when editMode is true', () => {
    const wrapper = createWrapper({ editMode: true, isDashboardWidget: false })
    expect(wrapper.find('.executive-widget-header__right').exists()).toBe(true)
    expect(wrapper.find('.executive-widget-header__right-date').exists()).toBe(false)
  })

  it('shows last-updated text when editMode is false and lastUpdated exists', () => {
    const wrapper = createWrapper({ editMode: false, lastUpdated: '2026-02-19 10:00' })
    expect(wrapper.find('.executive-widget-header__right-date').text()).toContain('Last Updated:')
  })

  it('handleDelete emits on-delete and handleEdit emits on-edit', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleDelete()
    wrapper.vm.handleEdit()
    expect(wrapper.emitted('on-delete')).toBeTruthy()
    expect(wrapper.emitted('on-edit')).toBeTruthy()
  })

  it('renders dashboard close icon variant when isDashboardWidget is true', () => {
    const wrapper = createWrapper({ isDashboardWidget: true })
    expect(wrapper.find('.widget__header-icon').exists()).toBe(true)
  })
})
