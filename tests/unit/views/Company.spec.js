import { shallowMount } from '@vue/test-utils'
import Company from '@/views/Company.vue'

describe('Company.vue', () => {
  it('renders and redirects to Dashboard on created', () => {
    const push = jest.fn()
    const wrapper = shallowMount(Company, {
      mocks: {
        $router: { push }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$options.name).toBe('Companies')
    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith({ name: 'Dashboard' })

    wrapper.destroy()
  })
})
