import { shallowMount } from '@vue/test-utils'
import ShowAllJobs from '@/views/ShowAllJobs.vue'

describe('ShowAllJobs.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ShowAllJobs, {
      stubs: {
        JobHistory: true
      }
    })
  })

  it('should render', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('should have JobHistory component', () => {
    const components = wrapper.vm.$options.components
    expect(components.JobHistory).toBeDefined()
  })
})
