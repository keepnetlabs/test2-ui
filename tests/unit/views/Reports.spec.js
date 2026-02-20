import { shallowMount } from '@vue/test-utils'
import Reports from '@/views/Reports.vue'

describe('Reports.vue', () => {
  it('renders and redirects to Dashboard on created', () => {
    const push = jest.fn()
    const wrapper = shallowMount(Reports, {
      mocks: {
        $router: { push }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$options.name).toBe('Reports')
    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith({ name: 'Dashboard' })

    wrapper.destroy()
  })
})
