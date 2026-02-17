import { shallowMount } from '@vue/test-utils'
import TestFormWrapper from '@/components/TestHelpers/TestFormWrapper'

describe('TestFormWrapper.vue', () => {
  it('renders slot content inside v-form', () => {
    const wrapper = shallowMount(TestFormWrapper, {
      slots: {
        default: '<div id="slot-content">content</div>'
      }
    })

    expect(wrapper.find('#slot-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('content')
  })
})

