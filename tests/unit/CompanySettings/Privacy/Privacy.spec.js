import { shallowMount } from '@vue/test-utils'
import Privacy from '@/components/Company Settings/Privacy/Privacy.vue'

describe('Company Settings/Privacy/Privacy.vue', () => {
  const mountComponent = (permission = true) =>
    shallowMount(Privacy, {
      stubs: {
        ElTabs: {
          name: 'ElTabs',
          props: ['value'],
          template: '<div class="tabs-stub"><slot /></div>'
        },
        ElTabPane: {
          name: 'ElTabPane',
          props: ['label', 'name', 'id'],
          template: '<div class="tab-pane-stub"><slot /></div>'
        },
        DataPrivacy: { name: 'DataPrivacy', template: '<div class="data-privacy-stub" />' },
        AccountPrivacy: { name: 'AccountPrivacy', template: '<div class="account-privacy-stub" />' }
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getAccountPrivacyPermission': permission
          }
        }
      }
    })

  it('has expected component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('Privacy')
  })

  it('initializes account-privacy tab by default', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.tab).toBe('account-privacy')
  })

  it('renders privacy panes when account privacy permission exists', () => {
    const wrapper = mountComponent(true)

    expect(wrapper.findAll('.tab-pane-stub')).toHaveLength(2)
    expect(wrapper.find('.account-privacy-stub').exists()).toBe(true)
    expect(wrapper.find('.data-privacy-stub').exists()).toBe(true)
  })

  it('does not render privacy panes when permission is missing', () => {
    const wrapper = mountComponent(false)

    expect(wrapper.findAll('.tab-pane-stub')).toHaveLength(0)
    expect(wrapper.find('.account-privacy-stub').exists()).toBe(false)
    expect(wrapper.find('.data-privacy-stub').exists()).toBe(false)
  })
})

