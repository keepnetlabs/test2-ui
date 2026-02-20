import { shallowMount } from '@vue/test-utils'
import CommonSimulatorAttachmentRenameDialog from '@/components/Common/Simulator/CommonSimulatorAttachmentRenameDialog.vue'

describe('CommonSimulatorAttachmentRenameDialog.vue', () => {
  const factory = (propsData = {}) =>
    shallowMount(CommonSimulatorAttachmentRenameDialog, {
      propsData,
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          props: ['status', 'title'],
          template:
            '<div><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        AppDialogFooter: true,
        VForm: true,
        VTextField: true
      }
    })

  it('initializes attachmentName from defaultAttachmentName prop', () => {
    const wrapper = factory({ defaultAttachmentName: 'invoice.pdf' })
    expect(wrapper.vm.attachmentName).toBe('invoice.pdf')
  })

  it('handleClose emits on-close', () => {
    const wrapper = factory()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('handleConfirm emits on-confirm when form is valid', () => {
    const wrapper = factory({ defaultAttachmentName: 'new-name' })
    wrapper.vm.$refs.refAttachmentNameForm = {
      validate: jest.fn(() => true)
    }

    wrapper.vm.handleConfirm()

    expect(wrapper.vm.$refs.refAttachmentNameForm.validate).toHaveBeenCalled()
    expect(wrapper.emitted('on-confirm')).toEqual([['new-name']])
  })

  it('handleConfirm does not emit on-confirm when form is invalid', () => {
    const wrapper = factory({ defaultAttachmentName: 'invalid-name' })
    wrapper.vm.$refs.refAttachmentNameForm = {
      validate: jest.fn(() => false)
    }

    wrapper.vm.handleConfirm()

    expect(wrapper.vm.$refs.refAttachmentNameForm.validate).toHaveBeenCalled()
    expect(wrapper.emitted('on-confirm')).toBeFalsy()
  })
})
