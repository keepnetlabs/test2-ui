import { shallowMount } from '@vue/test-utils'
import DeleteCommunityDialog from '@/components/ThreatSharing/Communities/DeleteCommunityDialog.vue'
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'

describe('DeleteCommunityDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteCommunityDialog, {
      propsData: {
        status: true,
        deleteCommunityName: 'Test Community',
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays deleteCommunityName in subtitle and body', () => {
    const wrapper = createWrapper({ deleteCommunityName: 'My Community' })
    const dialog = wrapper.findComponent(AppDialog)
    expect(dialog.attributes('subtitle')).toBe('My Community')
    expect(dialog.attributes('body')).toContain('My Community')
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
