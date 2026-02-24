import { shallowMount } from '@vue/test-utils'
import RightColumnDeleteCommunityDialog from '@/components/ThreatSharing/RightColumn/RightColumnDeleteCommunityDialog.vue'

describe('RightColumnDeleteCommunityDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(RightColumnDeleteCommunityDialog, {
      propsData: {
        status: true,
        communityDetails: { name: 'Test Community' },
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays community name in subtitle', () => {
    const wrapper = createWrapper()
    const dialog = wrapper.find('appdialog-stub')
    expect(dialog.attributes('subtitle')).toBe('Test Community')
  })

  it('body contains community name', () => {
    const wrapper = createWrapper()
    const dialog = wrapper.find('appdialog-stub')
    expect(dialog.attributes('body')).toContain('Test Community')
  })

  it('emits on-close when footer handleClose', () => {
    const wrapper = createWrapper()
    wrapper.find('appdialogfooter-stub').vm.$emit('handleClose')
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('emits on-confirm when footer handleConfirm', () => {
    const wrapper = createWrapper()
    wrapper.find('appdialogfooter-stub').vm.$emit('handleConfirm')
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })

  it('handles empty communityDetails', () => {
    const wrapper = createWrapper({ communityDetails: null })
    expect(wrapper.vm).toBeDefined()
  })
})
