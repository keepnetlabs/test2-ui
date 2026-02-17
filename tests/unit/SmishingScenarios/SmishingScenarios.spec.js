import { createLocalVue, shallowMount } from '@vue/test-utils'
import SmishingScenarios from '@/views/SmishingScenarios'

describe('SmishingScenarios.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (getterOverrides = {}, customStubs = {}) =>
    shallowMount(SmishingScenarios, {
      localVue,
      stubs: {
        KContainer: true,
        Scenarios: true,
        Templates: true,
        LandingPageList: true,
        'el-tabs': true,
        'el-tab-pane': true,
        ...customStubs
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getSmishingScenariosSearchPermissions': true,
            'permissions/getSmishingTextMessageTemplatesSearchPermissions': true,
            'permissions/getSmishingLandingPageTemplatesSearchPermissions': true,
            ...getterOverrides
          }
        }
      }
    })

  it('renders', () => {
    expect(mountComponent().vm).toBeDefined()
  })

  it('has expected name', () => {
    expect(mountComponent().vm.$options.name).toBe('SmishingScenariosParent')
  })

  it('sets default tab to templates when scenarios permission is missing', () => {
    const wrapper = mountComponent({
      'permissions/getSmishingScenariosSearchPermissions': false,
      'permissions/getSmishingTextMessageTemplatesSearchPermissions': true
    })
    expect(wrapper.vm.tab).toBe('templates')
  })

  it('sets default tab to landingPage when only landing-page permission is available', () => {
    const wrapper = mountComponent({
      'permissions/getSmishingScenariosSearchPermissions': false,
      'permissions/getSmishingTextMessageTemplatesSearchPermissions': false,
      'permissions/getSmishingLandingPageTemplatesSearchPermissions': true
    })
    expect(wrapper.vm.tab).toBe('landingPage')
  })

  it('handleNoMessageTemplate switches tab and opens template modal', async () => {
    const openModal = jest.fn()
    const wrapper = mountComponent(
      {},
      {
        Templates: {
          name: 'Templates',
          template: '<div />',
          methods: {
            changeNewEmailTemplateModalStatus: openModal
          }
        }
      }
    )

    wrapper.vm.handleNoMessageTemplate()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.tab).toBe('templates')
    expect(openModal).toHaveBeenCalledWith(true, false)
  })

  it('beforeRouteLeave blocks navigation when scenarios modal is open', () => {
    const wrapper = mountComponent()
    const next = jest.fn()
    const checkIfCanCLoseNewScenarioModal = jest.fn()
    wrapper.vm.$refs = {
      refScenarios: {
        modalStatus: true,
        checkIfCanCLoseNewScenarioModal
      }
    }

    wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, {}, {}, next)

    expect(checkIfCanCLoseNewScenarioModal).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)
  })
})
