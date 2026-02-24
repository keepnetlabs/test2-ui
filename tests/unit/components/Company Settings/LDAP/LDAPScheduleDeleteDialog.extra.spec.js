jest.mock('@/api/ldap', () => ({
  __esModule: true,
  default: {
    deleteLDAPSchedule: jest.fn(() => Promise.resolve())
  }
}))

import { shallowMount } from '@vue/test-utils'
import LDAPScheduleDeleteDialog from '@/components/Company Settings/LDAP/LDAPScheduleDeleteDialog.vue'
import LDAPService from '@/api/ldap'

describe('LDAPScheduleDeleteDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(LDAPScheduleDeleteDialog, {
      propsData: {
        status: true,
        selectedRow: { resourceId: 's1', name: 'Daily Sync' },
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleClose emits on-close', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('handleDelete calls deleteLDAPSchedule and emits on-close-with-update', async () => {
    const wrapper = createWrapper({
      selectedRow: { resourceId: 'r1', name: 'Sync' }
    })
    wrapper.vm.handleDelete()
    await new Promise((r) => setTimeout(r, 0))

    expect(LDAPService.deleteLDAPSchedule).toHaveBeenCalledWith('r1')
    expect(wrapper.emitted('on-close-with-update')).toBeTruthy()
  })
})
