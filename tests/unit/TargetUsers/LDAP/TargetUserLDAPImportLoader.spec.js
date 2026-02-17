import { shallowMount } from '@vue/test-utils'
import TargetUserLDAPImportLoader from '@/components/TargetUsers/LDAP/TargetUserLDAPImportLoader'

describe('TargetUserLDAPImportLoader.vue', () => {
  it('shows queued alert when idle', () => {
    const wrapper = shallowMount(TargetUserLDAPImportLoader, {
      propsData: {
        isIdle: true,
        processedUserCount: 0
      }
    })

    expect(wrapper.text()).toContain('Process is Queued')
    expect(wrapper.vm.getText).toBe('No user processed')
  })

  it('computes processed users text for non-zero count', () => {
    const wrapper = shallowMount(TargetUserLDAPImportLoader, {
      propsData: {
        isIdle: false,
        processedUserCount: 3
      }
    })

    expect(wrapper.vm.getText).toBe('3 users processed')
  })
})

