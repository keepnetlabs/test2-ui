import { shallowMount } from '@vue/test-utils'
import ExecutiveWidgetBody from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue'
import ExecutiveWidgetContainer from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue'

describe('Executive report widget layout components', () => {
  it('ExecutiveWidgetBody renders slot content and class', () => {
    const wrapper = shallowMount(ExecutiveWidgetBody, {
      slots: {
        default: '<div id="body-slot">Body Content</div>'
      }
    })

    expect(wrapper.vm.$options.name).toBe('ExecutiveWidgetBody')
    expect(wrapper.find('.executive-widget-body').exists()).toBe(true)
    expect(wrapper.find('#body-slot').text()).toBe('Body Content')
  })

  it('ExecutiveWidgetContainer renders slot content and class', () => {
    const wrapper = shallowMount(ExecutiveWidgetContainer, {
      slots: {
        default: '<div id="container-slot">Container Content</div>'
      }
    })

    expect(wrapper.vm.$options.name).toBe('ExecutiveWidgetContainer')
    expect(wrapper.find('.executive-widget-container').exists()).toBe(true)
    expect(wrapper.find('#container-slot').text()).toBe('Container Content')
  })
})
