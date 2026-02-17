import { shallowMount } from '@vue/test-utils'
import ExecutiveReportsEmptyWidget from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsEmptyWidget'

describe('ExecutiveReportsEmptyWidget.vue', () => {
  it('renders as an empty widget container', () => {
    const wrapper = shallowMount(ExecutiveReportsEmptyWidget)

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.text()).toBe('')
  })
})

