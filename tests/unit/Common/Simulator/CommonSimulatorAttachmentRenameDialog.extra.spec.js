import { shallowMount } from '@vue/test-utils'
import CommonSimulatorAttachmentRenameDialog from '@/components/Common/Simulator/CommonSimulatorAttachmentRenameDialog.vue'

describe('CommonSimulatorAttachmentRenameDialog.vue (extra branch coverage)', () => {
  const factory = (propsData = {}) =>
    shallowMount(CommonSimulatorAttachmentRenameDialog, {
      propsData,
      stubs: {
        AppDialog: true,
        AppDialogFooter: true,
        VForm: true,
        VTextField: true
      }
    })

  it('initializes attachmentName as empty when defaultAttachmentName not provided', () => {
    const wrapper = factory()
    expect(wrapper.vm.attachmentName).toBe('')
  })

  it('commonRules contains required, maxLength and noDots validators', () => {
    const wrapper = factory()
    expect(wrapper.vm.commonRules.rules).toHaveLength(3)
    expect(wrapper.vm.commonRules.hint).toBe('*Required')
    expect(wrapper.vm.commonRules.persistentHint).toBe(true)
  })

  it('handleConfirm emits on-confirm when form validates', () => {
    const wrapper = factory({ defaultAttachmentName: 'valid-name' })
    wrapper.vm.$refs.refAttachmentNameForm = { validate: () => true }
    wrapper.vm.handleConfirm()
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')[0][0]).toBe('valid-name')
  })

  it('handleConfirm does not emit when form validation fails', () => {
    const wrapper = factory()
    wrapper.vm.$refs.refAttachmentNameForm = { validate: () => false }
    wrapper.vm.handleConfirm()
    expect(wrapper.emitted('on-confirm')).toBeFalsy()
  })
})
