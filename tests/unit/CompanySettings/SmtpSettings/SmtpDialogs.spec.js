import { shallowMount } from '@vue/test-utils'
import TestEmailDialog from '@/components/Company Settings/SmtpSettings/TestEmailDialog.vue'
import TestEmailErrorDialog from '@/components/Company Settings/SmtpSettings/TestEmailErrorDialog.vue'
import DeleteSmtpSettings from '@/components/Company Settings/SmtpSettings/DeleteSmtpSettings.vue'

describe('SMTP dialogs', () => {
  it('TestEmailDialog emits close and confirm only when form is valid', async () => {
    const wrapper = shallowMount(TestEmailDialog, {
      propsData: {
        status: true,
        isActionButtonDisabled: false
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true,
        FormGroup: true,
        InputEmail: true,
        VForm: true,
        VTextField: true,
        VTextarea: true
      }
    })

    wrapper.vm.handleCloseDialog()
    expect(wrapper.emitted('closeDialog')).toBeTruthy()

    wrapper.vm.$refs.refForm = { validate: jest.fn(() => false) }
    wrapper.vm.handleConfirm()
    expect(wrapper.emitted('confirm')).toBeFalsy()

    wrapper.vm.$refs.refForm = { validate: jest.fn(() => true) }
    await wrapper.setData({
      formValues: {
        to: 'to@mail.com',
        from: 'from@mail.com',
        fromName: 'Sender',
        message: 'Hello'
      }
    })
    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('confirm')).toEqual([
      [
        {
          to: 'to@mail.com',
          from: 'from@mail.com',
          fromName: 'Sender',
          message: 'Hello'
        }
      ]
    ])
  })

  it('TestEmailErrorDialog emits close', () => {
    const wrapper = shallowMount(TestEmailErrorDialog, {
      propsData: {
        isShowErrorMessage: true,
        errorMessage: 'Some error'
      },
      stubs: {
        AppDialog: true,
        VBtn: true
      }
    })

    wrapper.vm.handleCloseDialog()
    expect(wrapper.emitted('closeDialog')).toBeTruthy()
  })

  it('DeleteSmtpSettings computes subtitle and emits proper delete actions', () => {
    const objectWrapper = shallowMount(DeleteSmtpSettings, {
      propsData: {
        status: true,
        data: { name: 'Primary SMTP' }
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })
    expect(objectWrapper.vm.getSubtitle).toBe('Primary SMTP')
    expect(objectWrapper.vm.getActionName()).toBe('handleDelete')
    expect(objectWrapper.vm.getActionData()).toEqual({ name: 'Primary SMTP' })
    objectWrapper.vm.handleDelete()
    expect(objectWrapper.emitted('handleDelete')).toEqual([[{ name: 'Primary SMTP' }]])
    expect(objectWrapper.emitted('closeOverlay')).toBeTruthy()

    const singleArrayWrapper = shallowMount(DeleteSmtpSettings, {
      propsData: {
        status: true,
        data: [{ name: 'Only SMTP' }]
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })
    expect(singleArrayWrapper.vm.getSubtitle).toBe('Only SMTP')
    expect(singleArrayWrapper.vm.getActionName()).toBe('handleDelete')

    const multiArrayWrapper = shallowMount(DeleteSmtpSettings, {
      propsData: {
        status: true,
        data: [{ name: 'SMTP A' }, { name: 'SMTP B' }]
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })
    expect(multiArrayWrapper.vm.getSubtitle).toBe('2 SMTP Settings')
    expect(multiArrayWrapper.vm.getActionName()).toBe('handleMultipleDelete')
    multiArrayWrapper.vm.handleDelete()
    expect(multiArrayWrapper.emitted('handleMultipleDelete')).toEqual([
      [[{ name: 'SMTP A' }, { name: 'SMTP B' }]]
    ])
  })
})
