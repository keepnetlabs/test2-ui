import { shallowMount } from '@vue/test-utils'
import VishingRoute from '@/views/VishingRoute.vue'

describe('VishingRoute.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(VishingRoute, {
      mocks: {
        $router: {
          push: jest.fn()
        }
      }
    })
  })

  it('should render', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('should be named VishingRoute', () => {
    expect(wrapper.vm.$options.name).toBe('VishingRoute')
  })
})
