import { shallowMount } from '@vue/test-utils'
import SmishingSimulatorRoute from '@/views/SmishingSimulatorRoute.vue'

describe('SmishingSimulatorRoute.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(SmishingSimulatorRoute, {
      mocks: {
        $router: { push: jest.fn() }
      }
    })
  })

  it('should render', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('should have correct name', () => {
    expect(wrapper.vm.$options.name).toBe('SmishingSimulatorRoute')
  })
})
