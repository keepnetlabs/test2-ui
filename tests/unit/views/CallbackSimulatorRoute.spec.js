import { shallowMount } from '@vue/test-utils'
import CallbackSimulatorRoute from '@/views/CallbackSimulatorRoute.vue'

describe('CallbackSimulatorRoute.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(CallbackSimulatorRoute, {
      mocks: {
        $router: { push: jest.fn() }
      }
    })
  })

  it('should exist', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('should have correct name', () => {
    expect(wrapper.vm.$options.name).toBe('CallbackSimulatorRoute')
  })
})
