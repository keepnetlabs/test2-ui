import { createLocalVue, mount } from '@vue/test-utils'
import VishingTemplateDialogStep from '@/components/VishingTemplates/VishingTemplateDialogStep'
import { customVuetify as vuetify } from '../utils'
import Vue from 'vue'

describe('Vishing template dialog step', () => {
  const localVue = createLocalVue()
  it('should render TextToSpeech variant successfully', () => {
    const wrapper = mount(VishingTemplateDialogStep, {
      localVue,
      vuetify,
      propsData: {
        value: {
          inputType: 'TextToSpeech',
          inputText: '',
          inputUrl: null,
          inputDigit: 0,
          duration: 0,
          isVishingStep: false,
          order: 1,
          isExpanded: true
        },
        index: 0,
        isRemoveDisabled: false
      }
    })

    expect(wrapper.find('.vishing-template-dialog-step').exists()).toBeTruthy()
    expect(
      wrapper.find('.vishing-template-dialog-step__text-to-speech-input').exists()
    ).toBeTruthy()
    expect(wrapper.find('.vishing-template-dialog-step__input-digit').exists()).toBeTruthy()
    expect(wrapper.find('.vishing-template-dialog-step__duration-input').exists()).toBeFalsy()
    expect(wrapper.find('.vishing-template-dialog-step__audio-file-input').exists()).toBeFalsy()
    expect(wrapper.find('.vishing-template-dialog-step__header-text').text()).toEqual(
      'Step 1 - Text To Speech'
    )
  })

  it('should render UploadAudio variant successfully', () => {
    const wrapper = mount(VishingTemplateDialogStep, {
      localVue,
      vuetify,
      propsData: {
        value: {
          inputType: 'FileUpload',
          inputText: null,
          inputUrl: null,
          inputDigit: 0,
          duration: 0,
          isVishingStep: false,
          order: 1,
          isExpanded: true
        },
        index: 0,
        isRemoveDisabled: false
      }
    })

    expect(wrapper.find('.vishing-template-dialog-step').exists()).toBeTruthy()
    expect(wrapper.find('.vishing-template-dialog-step__text-to-speech-input').exists()).toBeFalsy()
    expect(wrapper.find('.vishing-template-dialog-step__input-digit').exists()).toBeTruthy()
    expect(wrapper.find('.vishing-template-dialog-step__duration-input').exists()).toBeFalsy()
    expect(wrapper.find('.vishing-template-dialog-step__audio-file-input').exists()).toBeTruthy()
    expect(wrapper.find('.vishing-template-dialog-step__header-text').text()).toEqual(
      'Step 1 - Upload Audio'
    )
  })

  it('should render Pause variant successfully', () => {
    const wrapper = mount(VishingTemplateDialogStep, {
      localVue,
      vuetify,
      propsData: {
        value: {
          inputType: 'Pause',
          inputText: null,
          inputUrl: null,
          inputDigit: 0,
          duration: 0,
          isVishingStep: false,
          order: 1,
          isExpanded: true
        },
        index: 0,
        isRemoveDisabled: false
      }
    })

    expect(wrapper.find('.vishing-template-dialog-step').exists()).toBeTruthy()
    expect(wrapper.find('.vishing-template-dialog-step__text-to-speech-input').exists()).toBeFalsy()
    expect(wrapper.find('.vishing-template-dialog-step__input-digit').exists()).toBeFalsy()
    expect(wrapper.find('.vishing-template-dialog-step__duration-input').exists()).toBeTruthy()
    expect(wrapper.find('.vishing-template-dialog-step__audio-file-input').exists()).toBeFalsy()
    expect(wrapper.find('.vishing-template-dialog-step__header-text').text()).toEqual(
      'Step 1 - Pause'
    )
  })

  it('should apply TextToSpeech rules successfully', async () => {
    const wrapper = mount(VishingTemplateDialogStep, {
      localVue,
      vuetify,
      propsData: {
        value: {
          inputType: 'TextToSpeech',
          inputText: '',
          inputUrl: null,
          inputDigit: 0,
          duration: 0,
          isVishingStep: false,
          order: 1,
          isExpanded: true
        },
        index: 0,
        isRemoveDisabled: false
      }
    })
    const textToSpeechInput = wrapper.find(
      '.vishing-template-dialog-step__text-to-speech-input textarea'
    )
    await textToSpeechInput.setValue(' Text that starts with space')
    await Vue.nextTick()
    expect(
      wrapper
        .find('.vishing-template-dialog-step__text-to-speech-input .v-messages__message')
        .text()
        .includes('Cannot start with space')
    ).toBeTruthy()
    await textToSpeechInput.setValue('')
    await Vue.nextTick()
    expect(
      wrapper
        .find('.vishing-template-dialog-step__text-to-speech-input .v-messages__message')
        .text()
        .includes('Required')
    ).toBeTruthy()

    const requiredDigitInput = wrapper.find('.vishing-template-dialog-step__input-digit input')
    await requiredDigitInput.setValue(100)
    await Vue.nextTick()
    expect(
      wrapper
        .find('.vishing-template-dialog-step__input-digit .v-messages__message')
        .text()
        .includes('Number of digits must be between 0 and 20')
    ).toBeTruthy()
    await requiredDigitInput.setValue('')
    await Vue.nextTick()
    expect(
      wrapper
        .find('.vishing-template-dialog-step__input-digit .v-messages__message')
        .text()
        .includes('Required')
    )
  })

  it('should apply UploadAudio rules successfully', async () => {
    const wrapper = mount(VishingTemplateDialogStep, {
      localVue,
      vuetify,
      propsData: {
        value: {
          inputType: 'FileUpload',
          inputText: null,
          inputUrl: null,
          inputDigit: 0,
          duration: 0,
          isVishingStep: false,
          order: 1,
          isExpanded: true
        },
        index: 0,
        isRemoveDisabled: false
      }
    })

    const requiredDigitInput = wrapper.find('.vishing-template-dialog-step__input-digit input')
    await requiredDigitInput.setValue(100)
    await Vue.nextTick()
    expect(
      wrapper
        .find('.vishing-template-dialog-step__input-digit .v-messages__message')
        .text()
        .includes('Number of digits must be between 0 and 20')
    ).toBeTruthy()
    await requiredDigitInput.setValue('')
    await Vue.nextTick()
    expect(
      wrapper
        .find('.vishing-template-dialog-step__input-digit .v-messages__message')
        .text()
        .includes('Required')
    )
  })

  it('should apply Pause rules successfully', async () => {
    const wrapper = mount(VishingTemplateDialogStep, {
      localVue,
      vuetify,
      propsData: {
        value: {
          inputType: 'Pause',
          inputText: null,
          inputUrl: null,
          inputDigit: 0,
          duration: 0,
          isVishingStep: false,
          order: 1,
          isExpanded: true
        },
        index: 0,
        isRemoveDisabled: false
      }
    })

    const durationInput = wrapper.find('.vishing-template-dialog-step__duration-input input')
    await durationInput.setValue(100)
    await Vue.nextTick()
    expect(
      wrapper
        .find('.vishing-template-dialog-step__duration-input .v-messages__message')
        .text()
        .includes('Duration must be between 0 and 10 seconds')
    ).toBeTruthy()
    await durationInput.setValue('')
    await Vue.nextTick()
    expect(
      wrapper
        .find('.vishing-template-dialog-step__duration-input .v-messages__message')
        .text()
        .includes('Required')
    )
  })
})
