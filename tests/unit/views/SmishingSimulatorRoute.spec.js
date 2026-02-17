import { shallowMount } from '@vue/test-utils'
import SmishingSimulatorRoute from '@/views/SmishingSimulatorRoute.vue'

describe('SmishingSimulatorRoute.vue', () => {
  it('renders and redirects to Smishing Scenarios on created', () => {
    const push = jest.fn()
    const wrapper = shallowMount(SmishingSimulatorRoute, {
      mocks: {
        $router: { push }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$options.name).toBe('SmishingSimulatorRoute')
    expect(push).toHaveBeenCalledWith({ name: 'Smishing Scenarios' })

    wrapper.destroy()
  })
})
