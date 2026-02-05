import { shallowMount } from '@vue/test-utils'
import PhishingSimulatorRoute from '@/views/PhishingSimulatorRoute.vue'

describe('PhishingSimulatorRoute.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PhishingSimulatorRoute, {
      mocks: {
        $router: {
          push: jest.fn()
        }
      }
    })
  })

  it('should render the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('should have correct component name', () => {
    expect(wrapper.vm.$options.name).toBe('PhishingSimulatorRoute')
  })
})
