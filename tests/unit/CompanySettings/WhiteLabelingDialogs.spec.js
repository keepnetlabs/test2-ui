import { shallowMount } from '@vue/test-utils'
import ResetToDefaultWhiteLabelingDialog from '@/components/Company Settings/ResetToDefaultWhiteLabelingDialog.vue'
import WhiteLabelingDomainDialog from '@/components/Company Settings/WhiteLabelingDomainDialog.vue'

describe('Company Settings white labeling dialogs', () => {
  it('ResetToDefaultWhiteLabelingDialog emits close and confirm', () => {
    const wrapper = shallowMount(ResetToDefaultWhiteLabelingDialog, {
      propsData: {
        status: true,
        isResetToDefaultActionButtonDisabled: false
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    wrapper.vm.handleCloseDialog()
    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('handleCloseDialog')).toBeTruthy()
    expect(wrapper.emitted('handleConfirm')).toBeTruthy()
  })

  it('WhiteLabelingDomainDialog emits close and confirm', () => {
    const wrapper = shallowMount(WhiteLabelingDomainDialog, {
      propsData: {
        status: true,
        isActionButtonDisabled: false,
        errorMessage: 'DNS not configured',
        title: 'White Labeling Domain Error'
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    wrapper.vm.handleCloseDialog()
    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })
})
