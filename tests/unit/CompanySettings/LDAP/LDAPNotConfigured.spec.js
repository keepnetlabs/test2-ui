import { shallowMount } from '@vue/test-utils'
import LDAPNotConfigured from '@/components/Company Settings/LDAP/LDAPNotConfigured'

describe('LDAPNotConfigured.vue', () => {
  it('renders content and emits integrateClicked', () => {
    const wrapper = shallowMount(LDAPNotConfigured)

    expect(wrapper.text()).toContain('LDAP Configuration')
    expect(wrapper.text()).toContain('INTEGRATE WITH LDAP')

    wrapper.vm.onIntegrateClicked()
    expect(wrapper.emitted('integrateClicked')).toBeTruthy()
  })
})

