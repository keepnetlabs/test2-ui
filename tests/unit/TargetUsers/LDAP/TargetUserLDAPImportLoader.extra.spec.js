import { shallowMount } from '@vue/test-utils'
import TargetUserLDAPImportLoader from '@/components/TargetUsers/LDAP/TargetUserLDAPImportLoader'

describe('TargetUserLDAPImportLoader.vue (extra)', () => {
  it('renders singular-style processed text and hides queued alert when not idle', () => {
    const wrapper = shallowMount(TargetUserLDAPImportLoader, {
      propsData: {
        isIdle: false,
        processedUserCount: 1
      }
    })

    expect(wrapper.findComponent({ name: 'v-alert' }).exists()).toBe(false)
    expect(wrapper.vm.getText).toBe('1 users processed')
    expect(wrapper.text()).toContain('Please wait while we are processing')
  })
})
