import { shallowMount } from '@vue/test-utils'
import QuishingSimulatorRoute from '@/views/QuishingSimulatorRoute.vue'

describe('QuishingSimulatorRoute.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(QuishingSimulatorRoute, {
      mocks: {
        $router: { push: jest.fn() }
      }
    })
  })

  it('should render', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('should be QuishingSimulatorRoute', () => {
    expect(wrapper.vm.$options.name).toBe('QuishingSimulatorRoute')
  })
})
