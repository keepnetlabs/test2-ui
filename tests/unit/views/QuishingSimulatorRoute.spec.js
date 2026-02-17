import { shallowMount } from '@vue/test-utils'
import QuishingSimulatorRoute from '@/views/QuishingSimulatorRoute.vue'

describe('QuishingSimulatorRoute.vue', () => {
  it('renders and redirects to Quishing Scenarios on created', () => {
    const push = jest.fn()
    const wrapper = shallowMount(QuishingSimulatorRoute, {
      mocks: {
        $router: { push }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$options.name).toBe('QuishingSimulatorRoute')
    expect(push).toHaveBeenCalledWith({ name: 'Quishing Scenarios' })

    wrapper.destroy()
  })
})
