import { shallowMount } from '@vue/test-utils'
import LDAPScheduleDeleteDialog from '@/components/Company Settings/LDAP/LDAPScheduleDeleteDialog.vue'
import LDAPService from '@/api/ldap'

jest.mock('@/api/ldap', () => ({
  ...jest.requireActual('@/api/ldap'),
  deleteLDAPSchedule: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('LDAPScheduleDeleteDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(LDAPScheduleDeleteDialog, {
      propsData: {
        status: true,
        selectedRow: { resourceId: 'ldap-1', name: 'Nightly Sync' },
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('emits on-close via handleClose', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('deletes schedule and emits update event', async () => {
    const wrapper = createWrapper()
    wrapper.vm.handleDelete()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)

    await flushPromises()

    expect(LDAPService.deleteLDAPSchedule).toHaveBeenCalledWith('ldap-1')
    expect(wrapper.emitted('on-close-with-update')).toBeTruthy()
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})
