import { shallowMount } from '@vue/test-utils'
import TrainingLibraryPreviewDialogFooter from '@/components/TrainingLibrary/TrainingLibraryCommonComponents/TrainingLibraryPreviewDialogFooter'

describe('TrainingLibraryPreviewDialogFooter.vue', () => {
  it('emits on-send and on-close', () => {
    const wrapper = shallowMount(TrainingLibraryPreviewDialogFooter, {
      propsData: {
        showSendButton: true
      }
    })

    wrapper.vm.handleSend()
    wrapper.vm.handleClose()

    expect(wrapper.emitted('on-send')).toBeTruthy()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('hides send button when showSendButton is false', () => {
    const wrapper = shallowMount(TrainingLibraryPreviewDialogFooter, {
      propsData: {
        showSendButton: false
      }
    })

    expect(wrapper.text()).not.toContain('SEND')
    expect(wrapper.text()).toContain('CLOSE')
  })
})

