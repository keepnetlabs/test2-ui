import { shallowMount } from '@vue/test-utils'

import PhishingSimulatorRoute from '@/views/PhishingSimulatorRoute.vue'
import VishingRoute from '@/views/VishingRoute.vue'
import CallbackSimulatorRoute from '@/views/CallbackSimulatorRoute.vue'
import QuishingSimulatorRoute from '@/views/QuishingSimulatorRoute.vue'
import SmishingSimulatorRoute from '@/views/SmishingSimulatorRoute.vue'

describe('Route Views', () => {
  const routeCases = [
    {
      component: PhishingSimulatorRoute,
      name: 'PhishingSimulatorRoute',
      redirectName: 'Phishing Scenarios'
    },
    {
      component: VishingRoute,
      name: 'VishingRoute',
      redirectName: 'Vishing Templates'
    },
    {
      component: CallbackSimulatorRoute,
      name: 'CallbackSimulatorRoute',
      redirectName: 'Callback Scenarios'
    },
    {
      component: QuishingSimulatorRoute,
      name: 'QuishingSimulatorRoute',
      redirectName: 'Quishing Scenarios'
    },
    {
      component: SmishingSimulatorRoute,
      name: 'SmishingSimulatorRoute',
      redirectName: 'Smishing Scenarios'
    }
  ]

  it.each(routeCases)('$name redirects to "$redirectName" on created', ({ component, name, redirectName }) => {
    const push = jest.fn()
    const wrapper = shallowMount(component, {
      mocks: {
        $router: { push }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$options.name).toBe(name)
    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith({ name: redirectName })
    expect(wrapper.find('div').exists()).toBe(true)

    wrapper.destroy()
  })
})
