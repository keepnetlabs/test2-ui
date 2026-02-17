import { shallowMount } from '@vue/test-utils'
import TargetUserLDAPImportManuallyStep from '@/components/TargetUsers/LDAP/TargetUserLDAPImportManuallyStep.vue'

describe('TargetUserLDAPImportManuallyStep.vue', () => {
  const mountComponent = () =>
    shallowMount(TargetUserLDAPImportManuallyStep, {
      stubs: {
        TargetUserLDAPImportManuallyStepTable: {
          name: 'TargetUserLDAPImportManuallyStepTable',
          template: '<div class="ldap-step-table-stub" />'
        }
      }
    })

  it('has expected component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('TargetUserLDAPImportManuallyStep')
  })

  it('renders manually step table component', () => {
    const wrapper = mountComponent()

    expect(wrapper.find('.ldap-step-table-stub').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'TargetUserLDAPImportManuallyStepTable' }).exists()).toBe(true)
  })
})

