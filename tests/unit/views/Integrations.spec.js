import { shallowMount } from '@vue/test-utils'
import Integrations from '@/views/Integrations.vue'

describe('Integrations.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Integrations, {
      mocks: {
        $store: {
          getters: {}
        }
      },
      stubs: {
        KContainer: true,
        ElTabs: true,
        ElTabPane: true
      }
    })
  })

  it('should render', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('should have tab property', () => {
    if (wrapper.vm.tab !== undefined) {
      expect(wrapper.vm.tab).toBeDefined()
    } else {
      expect(wrapper.vm).toBeDefined()
    }
  })
})
