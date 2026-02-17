import { shallowMount } from '@vue/test-utils'
import VishingRoute from '@/views/VishingRoute.vue'

describe('VishingRoute.vue', () => {
  const mountComponent = (router = { push: jest.fn() }) =>
    shallowMount(VishingRoute, {
      mocks: {
        $router: router
      }
    })

  it('renders', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
  })

  it('has expected component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('VishingRoute')
  })

  it('redirects to Vishing Templates on created', () => {
    const router = { push: jest.fn() }
    mountComponent(router)
    expect(router.push).toHaveBeenCalledWith({ name: 'Vishing Templates' })
  })

  it('creates isolated router calls per instance', () => {
    const routerA = { push: jest.fn() }
    const routerB = { push: jest.fn() }

    mountComponent(routerA)
    mountComponent(routerB)

    expect(routerA.push).toHaveBeenCalledTimes(1)
    expect(routerB.push).toHaveBeenCalledTimes(1)
  })
})
