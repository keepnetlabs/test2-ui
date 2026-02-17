import { shallowMount } from '@vue/test-utils'
import SCIMSuccessDialog from '@/components/Company Settings/SCIM/SCIMSuccessDialog.vue'
import DeleteSCIMDialog from '@/components/Company Settings/SCIM/DeleteSCIMDialog.vue'
import RevokeSCIMDialog from '@/components/Company Settings/SCIM/RevokeSCIMDialog.vue'
import { deleteSCIMSetting, revokeSCIMSetting } from '@/api/scimSettings'
import { copyToClipboard } from '@/utils/functions'

jest.mock('@/api/scimSettings', () => ({
  deleteSCIMSetting: jest.fn(() => Promise.resolve()),
  revokeSCIMSetting: jest.fn(() =>
    Promise.resolve({
      data: { data: { token: 'new-token' } }
    })
  )
}))

jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  copyToClipboard: jest.fn(() => Promise.resolve(true))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SCIM dialogs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('SCIMSuccessDialog copies api key and closes when successful', async () => {
    const wrapper = shallowMount(SCIMSuccessDialog, {
      propsData: { status: true, apiKey: 'abc-key', title: 'Created' },
      stubs: {
        AppDialog: true,
        VTextarea: true,
        VBtn: true
      }
    })

    wrapper.vm.handleCopyToClipboard()
    await flushPromises()

    expect(copyToClipboard).toHaveBeenCalledWith('abc-key')
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('DeleteSCIMDialog deletes selected setting and emits close/update', async () => {
    const selectedRow = { resourceId: 'scim-1', name: 'My SCIM' }
    const wrapper = shallowMount(DeleteSCIMDialog, {
      propsData: { status: true, selectedRow },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    wrapper.vm.handleDelete()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)
    await flushPromises()

    expect(deleteSCIMSetting).toHaveBeenCalledWith('scim-1')
    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-close-with-update')).toEqual([[selectedRow]])
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('RevokeSCIMDialog revokes and emits token', async () => {
    const wrapper = shallowMount(RevokeSCIMDialog, {
      propsData: { status: true, selectedRow: { resourceId: 'scim-2', name: 'SCIM 2' } },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    wrapper.vm.handleRevoke()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)
    await flushPromises()

    expect(revokeSCIMSetting).toHaveBeenCalledWith('scim-2')
    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-success-revoke')).toEqual([['new-token']])
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})
