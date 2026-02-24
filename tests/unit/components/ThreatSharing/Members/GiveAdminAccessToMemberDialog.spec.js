import { shallowMount } from '@vue/test-utils'
import GiveAdminAccessToMemberDialog from '@/components/ThreatSharing/Members/GiveAdminAccessToMemberDialog.vue'
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'

describe('GiveAdminAccessToMemberDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(GiveAdminAccessToMemberDialog, {
      propsData: {
        status: true,
        appointUserName: 'John Doe',
        isActionButtonDisabled: false,
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays appointUserName in body', () => {
    const wrapper = createWrapper({ appointUserName: 'Jane Smith' })
    const dialog = wrapper.findComponent(AppDialog)
    expect(dialog.attributes('body')).toContain('Jane Smith')
  })

  it('emits on-close when footer handleClose', () => {
    const wrapper = createWrapper()
    wrapper.findComponent(AppDialogFooter).vm.$emit('handleClose')
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('emits on-confirm when footer handleConfirm', () => {
    const wrapper = createWrapper()
    wrapper.findComponent(AppDialogFooter).vm.$emit('handleConfirm')
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })

  it('emits on-close when AppDialog changeStatus', () => {
    const wrapper = createWrapper()
    wrapper.findComponent(AppDialog).vm.$emit('changeStatus')
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })
})
