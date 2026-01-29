import { mount } from '@vue/test-utils'
import VishingTemplatePreviewStep from '@/components/VishingTemplates/VishingTemplatePreviewStep'
import { customVuetify as vuetify } from '../utils'
import { setupPromisePool } from '../promise-pool-helpers'

// Mock Badge component to avoid functional component test issues
const MockBadge = {
  name: 'Badge',
  template: '<div :class="className">{{ text }}</div>',
  props: ['text', 'color', 'textBlack', 'size', 'className', 'outline']
}

// Mock AudioPlayer component
const MockAudioPlayer = {
  name: 'AudioPlayer',
  template: '<div class="audio-player__wrapper"><audio :src="src"></audio></div>',
  props: ['src', 'isFetchingTTSUrl', 'isTextToSpeechCompatible']
}

describe('Vishing template preview step', () => {
  setupPromisePool()

  it('should render TextToSpeech variant successfully', () => {
    const step = {
      inputType: 'TextToSpeech',
      inputText: 'Text to speech text',
      inputUrl: null,
      inputDigit: 10,
      duration: 0,
      isVishingStep: true
    }
    const wrapper = mount(VishingTemplatePreviewStep, {
      vuetify,
      propsData: {
        step: step,
        index: 0
      },
      stubs: {
        Badge: MockBadge,
        AudioPlayer: MockAudioPlayer
      }
    })

    expect(wrapper.find('.vishing-template-preview-step').exists()).toBeTruthy()
    expect(wrapper.find('.vishing-template-preview-step__title').text()).toEqual(
      'Step 1 - Text to Speech'
    )
    expect(wrapper.find('.vishing-template-preview-step__text-to-speech-text').text()).toEqual(
      step.inputText
    )
    expect(wrapper.find('.vishing-template-preview-step__tags__required-digit-tag').text()).toEqual(
      `Required ${step.inputDigit} digits input`
    )
    expect(
      wrapper.find('.vishing-template-preview-step__tags__vishing-step-tag').exists()
    ).toBeTruthy()
  })

  it('should render FileUpload variant successfully', () => {
    const step = {
      inputType: 'FileUpload',
      inputText: null,
      inputUrl:
        'data:audio/wave;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==',
      inputDigit: 0,
      duration: 0,
      isVishingStep: false
    }
    const wrapper = mount(VishingTemplatePreviewStep, {
      vuetify,
      propsData: {
        step: step,
        index: 0
      },
      stubs: {
        Badge: MockBadge,
        AudioPlayer: MockAudioPlayer
      }
    })

    expect(wrapper.find('.vishing-template-preview-step').exists()).toBeTruthy()
    expect(wrapper.find('.vishing-template-preview-step__title').text()).toEqual(
      'Step 1 - Upload Audio'
    )
    expect(wrapper.find('.audio-player__wrapper').exists()).toBeTruthy()
    expect(wrapper.find('audio').attributes('src')).toEqual(step.inputUrl)
  })

  it('should render Pause variant successfully', () => {
    const step = {
      inputType: 'Pause',
      inputText: null,
      inputUrl: null,
      inputDigit: 0,
      duration: 10,
      isVishingStep: false
    }
    const wrapper = mount(VishingTemplatePreviewStep, {
      vuetify,
      propsData: {
        step: step,
        index: 0
      },
      stubs: {
        Badge: MockBadge,
        AudioPlayer: MockAudioPlayer
      }
    })

    expect(wrapper.find('.vishing-template-preview-step').exists()).toBeTruthy()
    expect(wrapper.find('.vishing-template-preview-step__title').text()).toEqual('Step 1 - Pause')
    expect(wrapper.find('.vishing-template-preview-step__pause-duration-text').text()).toEqual(
      `Pause for ${step.duration} seconds`
    )
  })

  it('should not render required digit and vishing step tags', () => {
    const step = {
      inputType: 'TextToSpeech',
      inputText: 'Text to speech text',
      inputUrl: null,
      inputDigit: 0,
      duration: 0,
      isVishingStep: false
    }
    const wrapper = mount(VishingTemplatePreviewStep, {
      vuetify,
      propsData: {
        step: step,
        index: 0
      },
      stubs: {
        Badge: MockBadge,
        AudioPlayer: MockAudioPlayer
      }
    })

    expect(wrapper.find('.vishing-template-preview-step').exists()).toBeTruthy()
    expect(wrapper.find('.vishing-template-preview-step__title').text()).toEqual(
      'Step 1 - Text to Speech'
    )
    expect(wrapper.find('.vishing-template-preview-step__text-to-speech-text').text()).toEqual(
      step.inputText
    )
    expect(
      wrapper.find('.vishing-template-preview-step__tags__required-digit-tag').exists()
    ).toBeFalsy()
    expect(
      wrapper.find('.vishing-template-preview-step__tags__vishing-step-tag').exists()
    ).toBeFalsy()
  })

  it('displays correct step title with step number and type', () => {
    const step = {
      inputType: 'Pause',
      inputText: null,
      inputUrl: null,
      inputDigit: 0,
      duration: 5,
      isVishingStep: false
    }
    const wrapper = mount(VishingTemplatePreviewStep, {
      vuetify,
      propsData: {
        step: step,
        index: 2
      },
      stubs: {
        Badge: MockBadge,
        AudioPlayer: MockAudioPlayer
      }
    })

    expect(wrapper.find('.vishing-template-preview-step__title').text()).toEqual('Step 3 - Pause')
  })

  it('renders correct duration text for pause steps', () => {
    const step = {
      inputType: 'Pause',
      inputText: null,
      inputUrl: null,
      inputDigit: 0,
      duration: 15,
      isVishingStep: false
    }
    const wrapper = mount(VishingTemplatePreviewStep, {
      vuetify,
      propsData: {
        step: step,
        index: 0
      },
      stubs: {
        Badge: MockBadge,
        AudioPlayer: MockAudioPlayer
      }
    })

    expect(wrapper.find('.vishing-template-preview-step__pause-duration-text').text()).toEqual(
      'Pause for 15 seconds'
    )
  })

  it('renders badge components for tags', () => {
    const step = {
      inputType: 'TextToSpeech',
      inputText: 'Required audio',
      inputUrl: null,
      inputDigit: 5,
      duration: 0,
      isVishingStep: true
    }
    const wrapper = mount(VishingTemplatePreviewStep, {
      vuetify,
      propsData: {
        step: step,
        index: 0
      },
      stubs: {
        Badge: MockBadge,
        AudioPlayer: MockAudioPlayer
      }
    })

    expect(wrapper.find('.vishing-template-preview-step__tags').exists()).toBeTruthy()
    expect(wrapper.find('.vishing-template-preview-step__tags__required-digit-tag').exists()).toBeTruthy()
  })


  //   it('should play and pause audio successfully', async () => {
  //     const step = {
  //       inputType: 'FileUpload',
  //       inputText: null,
  //       inputUrl:
  //         'https://keepnetlabsvishing.s3.eu-west-2.amazonaws.com/VishingDEV/kBh4ckZ1PVnZ-2.mp3',
  //       inputDigit: 0,
  //       duration: 0,
  //       isVishingStep: false
  //     }
  //     const wrapper = mount(VishingTemplatePreviewStep, {
  //       localVue,
  //       vuetify,
  //       propsData: {
  //         step: step,
  //         index: 0
  //       }
  //     })

  //     expect(wrapper.find('.audio-player .mdi-play').exists()).toBeTruthy()
  //     wrapper.vm.$refs.refAudioPlayer.onLoadedmetadata({ target: { duration: 100 } })
  //     await wrapper.vm.$nextTick()
  //     const playPauseButton = wrapper.find('.audio-player__play-pause-button')
  //     await playPauseButton.trigger('click')
  //     await wrapper.vm.$nextTick()
  //     expect(wrapper.find('.audio-player .mdi-pause').exists()).toBeTruthy()
  //   })
})
