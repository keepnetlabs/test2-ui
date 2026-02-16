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

  describe('component rendering', () => {
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
  })

  describe('tag rendering', () => {
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
  })

  describe('step title formatting', () => {
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
  })

  describe('duration formatting', () => {
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

    it('should format different duration values correctly', () => {
      const durations = [1, 5, 10, 30]
      for (const duration of durations) {
        const step = {
          inputType: 'Pause',
          inputText: null,
          inputUrl: null,
          inputDigit: 0,
          duration: duration,
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
          `Pause for ${duration} seconds`
        )
      }
    })
  })

  describe('props handling', () => {
    it('should accept step prop', () => {
      const step = {
        inputType: 'TextToSpeech',
        inputText: 'Hello',
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
      expect(wrapper.vm.step).toEqual(step)
    })

    it('should accept index prop and display correct step number', () => {
      const step = {
        inputType: 'TextToSpeech',
        inputText: 'Test',
        inputUrl: null,
        inputDigit: 0,
        duration: 0,
        isVishingStep: false
      }
      const wrapper = mount(VishingTemplatePreviewStep, {
        vuetify,
        propsData: {
          step: step,
          index: 5
        },
        stubs: {
          Badge: MockBadge,
          AudioPlayer: MockAudioPlayer
        }
      })
      expect(wrapper.vm.index).toBe(5)
      expect(wrapper.find('.vishing-template-preview-step__title').text()).toContain('Step 6')
    })

    it('should handle different index values', () => {
      const indices = [0, 1, 2, 10]
      for (const idx of indices) {
        const step = {
          inputType: 'Pause',
          inputText: null,
          inputUrl: null,
          inputDigit: 0,
          duration: 3,
          isVishingStep: false
        }
        const wrapper = mount(VishingTemplatePreviewStep, {
          vuetify,
          propsData: {
            step: step,
            index: idx
          },
          stubs: {
            Badge: MockBadge,
            AudioPlayer: MockAudioPlayer
          }
        })
        expect(wrapper.find('.vishing-template-preview-step__title').text()).toContain(`Step ${idx + 1}`)
      }
    })
  })

  describe('variant type handling', () => {
    it('should display correct type for TextToSpeech variant', () => {
      const step = {
        inputType: 'TextToSpeech',
        inputText: 'Sample text',
        inputUrl: null,
        inputDigit: 3,
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
      expect(wrapper.find('.vishing-template-preview-step__title').text()).toContain('Text to Speech')
    })

    it('should display correct type for FileUpload variant', () => {
      const step = {
        inputType: 'FileUpload',
        inputText: null,
        inputUrl: 'data:audio/wave;base64,test',
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
      expect(wrapper.find('.vishing-template-preview-step__title').text()).toContain('Upload Audio')
    })

    it('should display correct type for Pause variant', () => {
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
          index: 0
        },
        stubs: {
          Badge: MockBadge,
          AudioPlayer: MockAudioPlayer
        }
      })
      expect(wrapper.find('.vishing-template-preview-step__title').text()).toContain('Pause')
    })
  })

  describe('required digits tag', () => {
    it('should display required digits tag when inputDigit > 0', () => {
      const step = {
        inputType: 'TextToSpeech',
        inputText: 'Enter code',
        inputUrl: null,
        inputDigit: 6,
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
      expect(wrapper.find('.vishing-template-preview-step__tags__required-digit-tag').text()).toContain('6 digits')
    })

    it('should not display required digits tag when inputDigit is 0', () => {
      const step = {
        inputType: 'TextToSpeech',
        inputText: 'Just listen',
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
      expect(wrapper.find('.vishing-template-preview-step__tags__required-digit-tag').exists()).toBeFalsy()
    })

    it('should format different digit counts correctly', () => {
      const digitCounts = [1, 2, 5, 10, 20]
      for (const digits of digitCounts) {
        const step = {
          inputType: 'TextToSpeech',
          inputText: 'Enter digits',
          inputUrl: null,
          inputDigit: digits,
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
        expect(wrapper.find('.vishing-template-preview-step__tags__required-digit-tag').text()).toContain(`${digits} digits`)
      }
    })
  })

  describe('vishing step tag', () => {
    it('should display vishing step tag when isVishingStep is true', () => {
      const step = {
        inputType: 'TextToSpeech',
        inputText: 'Vishing step',
        inputUrl: null,
        inputDigit: 0,
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
      expect(wrapper.find('.vishing-template-preview-step__tags__vishing-step-tag').exists()).toBeTruthy()
    })

    it('should not display vishing step tag when isVishingStep is false', () => {
      const step = {
        inputType: 'TextToSpeech',
        inputText: 'Not a vishing step',
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
      expect(wrapper.find('.vishing-template-preview-step__tags__vishing-step-tag').exists()).toBeFalsy()
    })
  })

  describe('CSS classes', () => {
    it('should have main step container class', () => {
      const step = {
        inputType: 'TextToSpeech',
        inputText: 'Test',
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
    })

    it('should have title element with correct class', () => {
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
          index: 0
        },
        stubs: {
          Badge: MockBadge,
          AudioPlayer: MockAudioPlayer
        }
      })
      expect(wrapper.find('.vishing-template-preview-step__title').exists()).toBeTruthy()
    })

    it('should render audio player for FileUpload variant', () => {
      const step = {
        inputType: 'FileUpload',
        inputText: null,
        inputUrl: 'audio.mp3',
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
      expect(wrapper.find('.audio-player__wrapper').exists()).toBeTruthy()
    })
  })

  describe('multiple instances', () => {
    it('should support multiple component instances', () => {
      const step1 = {
        inputType: 'TextToSpeech',
        inputText: 'First step',
        inputUrl: null,
        inputDigit: 3,
        duration: 0,
        isVishingStep: false
      }
      const step2 = {
        inputType: 'Pause',
        inputText: null,
        inputUrl: null,
        inputDigit: 0,
        duration: 5,
        isVishingStep: true
      }
      const wrapper1 = mount(VishingTemplatePreviewStep, {
        vuetify,
        propsData: {
          step: step1,
          index: 0
        },
        stubs: {
          Badge: MockBadge,
          AudioPlayer: MockAudioPlayer
        }
      })
      const wrapper2 = mount(VishingTemplatePreviewStep, {
        vuetify,
        propsData: {
          step: step2,
          index: 1
        },
        stubs: {
          Badge: MockBadge,
          AudioPlayer: MockAudioPlayer
        }
      })
      expect(wrapper1.find('.vishing-template-preview-step__title').text()).toContain('Step 1')
      expect(wrapper2.find('.vishing-template-preview-step__title').text()).toContain('Step 2')
      expect(wrapper1.vm.step.inputType).toBe('TextToSpeech')
      expect(wrapper2.vm.step.inputType).toBe('Pause')
    })

    it('should not affect other instances on destruction', () => {
      const step1 = {
        inputType: 'TextToSpeech',
        inputText: 'Step 1',
        inputUrl: null,
        inputDigit: 2,
        duration: 0,
        isVishingStep: false
      }
      const step2 = {
        inputType: 'FileUpload',
        inputText: null,
        inputUrl: 'audio.mp3',
        inputDigit: 0,
        duration: 0,
        isVishingStep: false
      }
      const wrapper1 = mount(VishingTemplatePreviewStep, {
        vuetify,
        propsData: {
          step: step1,
          index: 0
        },
        stubs: {
          Badge: MockBadge,
          AudioPlayer: MockAudioPlayer
        }
      })
      const wrapper2 = mount(VishingTemplatePreviewStep, {
        vuetify,
        propsData: {
          step: step2,
          index: 1
        },
        stubs: {
          Badge: MockBadge,
          AudioPlayer: MockAudioPlayer
        }
      })
      wrapper1.destroy()
      expect(wrapper2.find('.vishing-template-preview-step__title').text()).toContain('Step 2')
      expect(wrapper2.vm.step.inputType).toBe('FileUpload')
    })
  })

  describe('edge cases', () => {
    it('should handle empty text input', () => {
      const step = {
        inputType: 'TextToSpeech',
        inputText: '',
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
      expect(wrapper.exists()).toBeTruthy()
    })

    it('should handle long text input', () => {
      const step = {
        inputType: 'TextToSpeech',
        inputText: 'A'.repeat(500),
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
      expect(wrapper.find('.vishing-template-preview-step__text-to-speech-text').text()).toBe('A'.repeat(500))
    })

    it('should handle zero duration for pause', () => {
      const step = {
        inputType: 'Pause',
        inputText: null,
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
      const pauseElement = wrapper.find('.vishing-template-preview-step__pause-duration-text')
      if (pauseElement.exists()) {
        expect(pauseElement.text()).toEqual('Pause for 0 seconds')
      }
      expect(wrapper.exists()).toBeTruthy()
    })
  })

  describe('component lifecycle', () => {
    it('should initialize component cleanly', () => {
      const step = {
        inputType: 'TextToSpeech',
        inputText: 'Test',
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
      expect(wrapper.vm).toBeDefined()
      expect(wrapper.exists()).toBeTruthy()
    })

    it('should destroy without errors', () => {
      const step = {
        inputType: 'Pause',
        inputText: null,
        inputUrl: null,
        inputDigit: 0,
        duration: 3,
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
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('should handle multiple mount and destroy cycles', () => {
      for (let i = 0; i < 3; i++) {
        const step = {
          inputType: 'TextToSpeech',
          inputText: `Cycle ${i}`,
          inputUrl: null,
          inputDigit: i,
          duration: 0,
          isVishingStep: false
        }
        const wrapper = mount(VishingTemplatePreviewStep, {
          vuetify,
          propsData: {
            step: step,
            index: i
          },
          stubs: {
            Badge: MockBadge,
            AudioPlayer: MockAudioPlayer
          }
        })
        expect(wrapper.exists()).toBeTruthy()
        wrapper.destroy()
      }
    })
  })

  describe('performance', () => {
    it('should mount within reasonable time', () => {
      const step = {
        inputType: 'TextToSpeech',
        inputText: 'Performance test',
        inputUrl: null,
        inputDigit: 0,
        duration: 0,
        isVishingStep: false
      }
      const start = Date.now()
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
      const end = Date.now()
      expect(end - start).toBeLessThan(1000)
      wrapper.destroy()
    })

    it('should handle rapid variant switching', () => {
      const variants = ['TextToSpeech', 'FileUpload', 'Pause']
      for (const variant of variants) {
        const step = {
          inputType: variant,
          inputText: variant === 'TextToSpeech' ? 'Text' : null,
          inputUrl: variant === 'FileUpload' ? 'audio.mp3' : null,
          inputDigit: 0,
          duration: variant === 'Pause' ? 3 : 0,
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
        expect(wrapper.exists()).toBeTruthy()
        wrapper.destroy()
      }
    })
  })
})
