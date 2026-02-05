import { shallowMount } from '@vue/test-utils'
import Playbook from '@/views/Playbook.vue'

describe('Playbook.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Playbook, {
      mocks: {
        $store: {
          getters: {
            'permissions/getPlaybookPermissions': () => ({})
          }
        }
      },
      stubs: {
        Rules: true
      }
    })
  })

  it('should render', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('should have Rules component', () => {
    const components = wrapper.vm.$options.components
    expect(components.Rules).toBeDefined()
  })

  it('should access permissions from store', () => {
    expect(wrapper.vm.permissions).toBeDefined()
  })
})
