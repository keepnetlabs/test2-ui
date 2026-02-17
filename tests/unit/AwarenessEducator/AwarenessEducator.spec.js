import { createLocalVue, shallowMount } from '@vue/test-utils'
import AwarenessEducator from '@/views/AwarenessEducator'

describe('AwarenessEducator.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (routeName = 'Training Library') =>
    shallowMount(AwarenessEducator, {
      localVue,
      stubs: {
        RouterView: true
      },
      mocks: {
        $route: { name: routeName },
        $router: { push: jest.fn() }
      }
    })

  it('renders', () => {
    expect(mountComponent().vm).toBeDefined()
  })

  it('has expected name', () => {
    expect(mountComponent().vm.$options.name).toBe('AwarenessEducator')
  })
})
