import DashBoard from '@/views/DashBoard.vue'
import { shallowMount } from '@vue/test-utils'

describe('DashBoard.vue', () => {
  it('registers Widgets component', () => {
    expect(DashBoard.components.Widgets).toBeDefined()
  })

  it('has permissions computed mapping', () => {
    expect(DashBoard.computed.permissions).toBeDefined()
  })

  it('permissions computed returns widgets permissions from store', () => {
    const wrapper = shallowMount(DashBoard, {
      stubs: { Widgets: true },
      mocks: {
        $store: {
          getters: {
            'permissions/getWidgetsPermissions': { canSeeRisk: true }
          }
        }
      }
    })

    expect(wrapper.vm.permissions).toEqual({ canSeeRisk: true })
    wrapper.destroy()
  })

  it('renders widgets with resolved permissions prop', () => {
    const wrapper = shallowMount(DashBoard, {
      stubs: { Widgets: { name: 'Widgets', template: '<div />', props: ['permissions'] } },
      mocks: {
        $store: {
          getters: {
            'permissions/getWidgetsPermissions': ['a', 'b']
          }
        }
      }
    })

    const widgets = wrapper.findComponent({ name: 'Widgets' })
    expect(widgets.exists()).toBe(true)
    expect(widgets.props('permissions')).toEqual(['a', 'b'])

    wrapper.destroy()
  })
})
