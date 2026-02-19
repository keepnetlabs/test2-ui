import { shallowMount } from '@vue/test-utils'
import TargetUserLDAPImportSyncByQueryViewUsers from '@/components/TargetUsers/LDAP/TargetUserLDAPImportSyncByQueryViewUsers.vue'

describe('TargetUserLDAPImportSyncByQueryViewUsers.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(TargetUserLDAPImportSyncByQueryViewUsers, {
      propsData: {
        status: true,
        ...propsData
      },
      stubs: {
        AppDialog: true,
        TargetUserLDAPImportManuallyStepTable: true,
        VBtn: true
      }
    })

  it('has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('TargetUserLDAPImportSyncByQueryViewUsers')
  })

  it('renders table component inside dialog body', () => {
    const wrapper = createWrapper()
    expect(wrapper.findComponent({ name: 'TargetUserLDAPImportManuallyStepTable' }).exists()).toBe(
      true
    )
  })

  it('getSubtitle computed reflects total number of records', async () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getSubtitle).toBe('0 users found.')
    await wrapper.setData({ totalNumberOfRecords: 42 })
    expect(wrapper.vm.getSubtitle).toBe('42 users found.')
  })

  it('handleClose emits on-close', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })
})
