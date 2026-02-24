import { shallowMount } from '@vue/test-utils'
import TopPhishingSimulationReporters from '@/components/Common/Widget/WidgetComponents/TopPhishingSimulationReporters.vue'
import labels from '@/model/constants/labels'

describe('TopPhishingSimulationReporters.vue (extra branch coverage)', () => {
  const mountComponent = (options = {}) =>
    shallowMount(TopPhishingSimulationReporters, {
      mocks: {
        $store: {
          getters: {
            'widgets/getIsLoading': false,
            'widgets/getTopPhishingSimulationReportersCard': []
          }
        }
      },
      stubs: {
        WidgetLoading: true,
        WidgetContainer: true,
        WidgetHeader: true,
        WidgetBody: true,
        WidgetList: true
      },
      ...options
    })

  it('getTitle returns TopPhishingSimulationReporters label', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getTitle).toBe(labels.TopPhishingSimulationReporters)
  })

  it('empty message uses EmptyTopPhishingSimulationReporters', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.empty.message).toBe(labels.EmptyTopPhishingSimulationReporters)
  })

  it('columns have email and count properties', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.columns).toHaveLength(2)
    expect(wrapper.vm.columns[0].property).toBe('email')
    expect(wrapper.vm.columns[1].property).toBe('count')
  })
})
