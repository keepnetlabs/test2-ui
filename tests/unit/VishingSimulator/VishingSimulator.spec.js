import { createLocalVue, shallowMount } from '@vue/test-utils'
import VishingRoute from '@/views/VishingRoute'

/** Spec path is historical; component under test is VishingRoute (vishing entry redirect). */
describe('VishingRoute via VishingSimulator.spec', () => {
  const localVue = createLocalVue()

  const mountComponent = () =>
    shallowMount(VishingRoute, {
      localVue,
      mocks: {
        $router: {
          push: jest.fn()
        }
      }
    })

  it('renders', () => {
    expect(mountComponent().vm).toBeDefined()
  })

  it('redirects to Vishing Templates', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({ name: 'Vishing Templates' })
    expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  })
})
