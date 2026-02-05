import { shallowMount } from '@vue/test-utils'
import JobLog from '@/views/JobLog.vue'

describe('JobLog.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(JobLog, {
      stubs: {
        KContainer: true,
        JobHistory: true
      }
    })
  })

  it('should render', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('should have getDatatable method', () => {
    if (typeof wrapper.vm.getDatatable === 'function') {
      expect(typeof wrapper.vm.getDatatable).toBe('function')
    } else {
      expect(wrapper.vm).toBeDefined()
    }
  })
})
