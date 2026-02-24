import { shallowMount } from '@vue/test-utils'
import RightColumnLeaveCommunityDialog from '@/components/ThreatSharing/RightColumn/RightColumnLeaveCommunityDialog.vue'

describe('RightColumnLeaveCommunityDialog.vue (extra branches)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(RightColumnLeaveCommunityDialog, {
      propsData: {
        status: true,
        communityDetails: { name: 'Security Team' },
        isActionButtonDisabled: false,
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

  it('renders fallback subtitle/body safely when communityDetails is null', () => {
    const wrapper = createWrapper({ communityDetails: null })
    const dialog = wrapper.find('appdialog-stub')

    expect(dialog.attributes('subtitle')).toBeUndefined()
    expect(dialog.attributes('body')).toContain('You are leaving')
  })

  it('passes disabled state to dialog footer', () => {
    const wrapper = createWrapper({ isActionButtonDisabled: true })
    const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
    expect(footer.exists()).toBe(true)
    expect(footer.props('confirmButtonDisabled')).toBe(true)
  })

  it('emits on-close and on-confirm through footer and dialog events', () => {
    const wrapper = createWrapper()

    wrapper.find('appdialog-stub').vm.$emit('changeStatus')
    wrapper.find('appdialogfooter-stub').vm.$emit('handleClose')
    wrapper.find('appdialogfooter-stub').vm.$emit('handleConfirm')

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })
})
