import { shallowMount } from '@vue/test-utils'
import VishingRoute from '@/views/VishingRoute.vue'

describe('VishingRoute.vue', () => {
  it('renders and redirects to Vishing Templates on created', () => {
    const push = jest.fn()
    const wrapper = shallowMount(VishingRoute, {
      mocks: {
        $router: { push }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$options.name).toBe('VishingRoute')
    expect(push).toHaveBeenCalledWith({ name: 'Vishing Templates' })

    wrapper.destroy()
  })
})
