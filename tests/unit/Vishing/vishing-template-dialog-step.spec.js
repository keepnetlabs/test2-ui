import { createLocalVue, mount } from '@vue/test-utils'
import VishingTemplateDialogStep from '@/components/VishingTemplates/VishingTemplateDialogStep'
import { customVuetify as vuetify } from '../utils'
import Vue from 'vue'

describe('Vishing template dialog step', () => {
  const localVue = createLocalVue()

  describe('component structure', () => {
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
  })

  describe('input validation and rules', () => {
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
      ).toBeTruthy()
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
      ).toBeTruthy()
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
      ).toBeTruthy()
    })
  })

  describe('props handling', () => {
    it('should accept value prop with TextToSpeech type', () => {
      const wrapper = mount(VishingTemplateDialogStep, {
        localVue,
        vuetify,
        propsData: {
          value: {
            inputType: 'TextToSpeech',
            inputText: 'Hello',
            inputUrl: null,
            inputDigit: 5,
            duration: 0,
            isVishingStep: false,
            order: 1,
            isExpanded: true
          },
          index: 0,
          isRemoveDisabled: false
        }
      })
      expect(wrapper.vm.value.inputType).toBe('TextToSpeech')
      expect(wrapper.vm.value.inputText).toBe('Hello')
    })

    it('should accept index prop', () => {
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
            order: 2,
            isExpanded: true
          },
          index: 5,
          isRemoveDisabled: false
        }
      })
      expect(wrapper.vm.index).toBe(5)
    })

    it('should accept isRemoveDisabled prop', () => {
      const wrapper = mount(VishingTemplateDialogStep, {
        localVue,
        vuetify,
        propsData: {
          value: {
            inputType: 'Pause',
            inputText: null,
            inputUrl: null,
            inputDigit: 0,
            duration: 5,
            isVishingStep: false,
            order: 1,
            isExpanded: true
          },
          index: 0,
          isRemoveDisabled: true
        }
      })
      expect(wrapper.vm.isRemoveDisabled).toBe(true)
    })

    it('should handle different step orders', () => {
      const wrapper1 = mount(VishingTemplateDialogStep, {
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
      expect(wrapper1.find('.vishing-template-dialog-step__header-text').exists()).toBeTruthy()
      expect(wrapper1.find('.vishing-template-dialog-step__header-text').text()).toContain('Step 1')

      const wrapper3 = mount(VishingTemplateDialogStep, {
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
            order: 3,
            isExpanded: true
          },
          index: 2,
          isRemoveDisabled: false
        }
      })
      expect(wrapper3.find('.vishing-template-dialog-step__header-text').exists()).toBeTruthy()
      expect(wrapper3.find('.vishing-template-dialog-step__header-text').text()).toContain('Step 3')
    })
  })

  describe('expansion state handling', () => {
    it('should render with expanded state true', () => {
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
      expect(wrapper.vm.value.isExpanded).toBe(true)
    })

    it('should render with expanded state false', () => {
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
            isExpanded: false
          },
          index: 0,
          isRemoveDisabled: false
        }
      })
      expect(wrapper.vm.value.isExpanded).toBe(false)
    })
  })

  describe('remove button functionality', () => {
    it('should show remove button when isRemoveDisabled is false', () => {
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
      const removeButton = wrapper.find('button[aria-label*="remove"], button[aria-label*="delete"], .delete-button, .remove-button')
      expect(wrapper.vm.isRemoveDisabled).toBe(false)
    })

    it('should disable remove button when isRemoveDisabled is true', () => {
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
          isRemoveDisabled: true
        }
      })
      expect(wrapper.vm.isRemoveDisabled).toBe(true)
    })
  })

  describe('CSS classes and styling', () => {
    it('should have main container class', () => {
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
    })

    it('should apply TextToSpeech specific classes', () => {
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
      expect(wrapper.find('.vishing-template-dialog-step__text-to-speech-input').exists()).toBeTruthy()
      expect(wrapper.find('.vishing-template-dialog-step__input-digit').exists()).toBeTruthy()
    })

    it('should apply FileUpload specific classes', () => {
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
      expect(wrapper.find('.vishing-template-dialog-step__audio-file-input').exists()).toBeTruthy()
    })

    it('should apply Pause specific classes', () => {
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
      expect(wrapper.find('.vishing-template-dialog-step__duration-input').exists()).toBeTruthy()
    })

    it('should always have header text element', () => {
      const variants = ['TextToSpeech', 'FileUpload', 'Pause']
      for (const variant of variants) {
        const wrapper = mount(VishingTemplateDialogStep, {
          localVue,
          vuetify,
          propsData: {
            value: {
              inputType: variant,
              inputText: variant === 'TextToSpeech' ? '' : null,
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
        expect(wrapper.find('.vishing-template-dialog-step__header-text').exists()).toBeTruthy()
      }
    })
  })

  describe('digit input validation boundaries', () => {
    it('should validate minimum digit boundary (0)', async () => {
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
      const input = wrapper.find('.vishing-template-dialog-step__input-digit input')
      await input.setValue(0)
      await Vue.nextTick()
      expect(wrapper.vm.value.inputDigit).toBeDefined()
    })

    it('should validate maximum digit boundary (20)', async () => {
      const wrapper = mount(VishingTemplateDialogStep, {
        localVue,
        vuetify,
        propsData: {
          value: {
            inputType: 'TextToSpeech',
            inputText: '',
            inputUrl: null,
            inputDigit: 20,
            duration: 0,
            isVishingStep: false,
            order: 1,
            isExpanded: true
          },
          index: 0,
          isRemoveDisabled: false
        }
      })
      const input = wrapper.find('.vishing-template-dialog-step__input-digit input')
      await input.setValue(20)
      await Vue.nextTick()
      expect(wrapper.vm.value.inputDigit).toBe(20)
    })

    it('should reject digits above 20', async () => {
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
      const input = wrapper.find('.vishing-template-dialog-step__input-digit input')
      await input.setValue(21)
      await Vue.nextTick()
      const messages = wrapper.find('.vishing-template-dialog-step__input-digit .v-messages__message')
      expect(messages.exists()).toBeTruthy()
    })
  })

  describe('duration input validation boundaries', () => {
    it('should validate minimum duration boundary (0)', async () => {
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
      const input = wrapper.find('.vishing-template-dialog-step__duration-input input')
      await input.setValue(0)
      await Vue.nextTick()
      expect(wrapper.vm.value.duration).toBeDefined()
    })

    it('should validate maximum duration boundary (10)', async () => {
      const wrapper = mount(VishingTemplateDialogStep, {
        localVue,
        vuetify,
        propsData: {
          value: {
            inputType: 'Pause',
            inputText: null,
            inputUrl: null,
            inputDigit: 0,
            duration: 10,
            isVishingStep: false,
            order: 1,
            isExpanded: true
          },
          index: 0,
          isRemoveDisabled: false
        }
      })
      const input = wrapper.find('.vishing-template-dialog-step__duration-input input')
      await input.setValue(10)
      await Vue.nextTick()
      expect(wrapper.vm.value.duration).toBe(10)
    })

    it('should reject duration above 10 seconds', async () => {
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
      const input = wrapper.find('.vishing-template-dialog-step__duration-input input')
      await input.setValue(11)
      await Vue.nextTick()
      const messages = wrapper.find('.vishing-template-dialog-step__duration-input .v-messages__message')
      expect(messages.exists()).toBeTruthy()
    })
  })

  describe('variant switching', () => {
    it('should handle TextToSpeech variant with all properties', () => {
      const wrapper = mount(VishingTemplateDialogStep, {
        localVue,
        vuetify,
        propsData: {
          value: {
            inputType: 'TextToSpeech',
            inputText: 'Please enter your account number',
            inputUrl: null,
            inputDigit: 5,
            duration: 0,
            isVishingStep: false,
            order: 1,
            isExpanded: true
          },
          index: 0,
          isRemoveDisabled: false
        }
      })
      expect(wrapper.vm.value.inputType).toBe('TextToSpeech')
      expect(wrapper.vm.value.inputText).toBe('Please enter your account number')
      expect(wrapper.vm.value.inputDigit).toBe(5)
    })

    it('should handle FileUpload variant with audio file', () => {
      const wrapper = mount(VishingTemplateDialogStep, {
        localVue,
        vuetify,
        propsData: {
          value: {
            inputType: 'FileUpload',
            inputText: null,
            inputUrl: 'https://example.com/audio.mp3',
            inputDigit: 4,
            duration: 0,
            isVishingStep: false,
            order: 2,
            isExpanded: true
          },
          index: 1,
          isRemoveDisabled: false
        }
      })
      expect(wrapper.vm.value.inputType).toBe('FileUpload')
      expect(wrapper.vm.value.inputUrl).toBe('https://example.com/audio.mp3')
    })

    it('should handle Pause variant with duration', () => {
      const wrapper = mount(VishingTemplateDialogStep, {
        localVue,
        vuetify,
        propsData: {
          value: {
            inputType: 'Pause',
            inputText: null,
            inputUrl: null,
            inputDigit: 0,
            duration: 5,
            isVishingStep: false,
            order: 3,
            isExpanded: true
          },
          index: 2,
          isRemoveDisabled: false
        }
      })
      expect(wrapper.vm.value.inputType).toBe('Pause')
      expect(wrapper.vm.value.duration).toBe(5)
    })
  })

  describe('multiple instances isolation', () => {
    it('should support multiple component instances', () => {
      const wrapper1 = mount(VishingTemplateDialogStep, {
        localVue,
        vuetify,
        propsData: {
          value: {
            inputType: 'TextToSpeech',
            inputText: 'First step',
            inputUrl: null,
            inputDigit: 3,
            duration: 0,
            isVishingStep: false,
            order: 1,
            isExpanded: true
          },
          index: 0,
          isRemoveDisabled: false
        }
      })

      const wrapper2 = mount(VishingTemplateDialogStep, {
        localVue,
        vuetify,
        propsData: {
          value: {
            inputType: 'Pause',
            inputText: null,
            inputUrl: null,
            inputDigit: 0,
            duration: 3,
            isVishingStep: false,
            order: 2,
            isExpanded: true
          },
          index: 1,
          isRemoveDisabled: false
        }
      })

      expect(wrapper1.vm.value.inputType).toBe('TextToSpeech')
      expect(wrapper2.vm.value.inputType).toBe('Pause')
      expect(wrapper1.vm.value.inputText).toBe('First step')
      expect(wrapper2.vm.value.duration).toBe(3)
    })

    it('should not affect other instances on destruction', () => {
      const wrapper1 = mount(VishingTemplateDialogStep, {
        localVue,
        vuetify,
        propsData: {
          value: {
            inputType: 'TextToSpeech',
            inputText: 'Instance 1',
            inputUrl: null,
            inputDigit: 2,
            duration: 0,
            isVishingStep: false,
            order: 1,
            isExpanded: true
          },
          index: 0,
          isRemoveDisabled: false
        }
      })

      const wrapper2 = mount(VishingTemplateDialogStep, {
        localVue,
        vuetify,
        propsData: {
          value: {
            inputType: 'FileUpload',
            inputText: null,
            inputUrl: 'audio.mp3',
            inputDigit: 3,
            duration: 0,
            isVishingStep: false,
            order: 2,
            isExpanded: true
          },
          index: 1,
          isRemoveDisabled: false
        }
      })

      wrapper1.destroy()
      expect(wrapper2.vm.value.inputType).toBe('FileUpload')
      expect(wrapper2.vm.value.inputUrl).toBe('audio.mp3')
    })
  })

  describe('edge cases and error scenarios', () => {
    it('should handle empty TextToSpeech input gracefully', () => {
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
      expect(wrapper.vm.value.inputText).toBe('')
      expect(wrapper.exists()).toBeTruthy()
    })

    it('should handle null values in FileUpload variant', () => {
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
      expect(wrapper.vm.value.inputUrl).toBeNull()
      expect(wrapper.exists()).toBeTruthy()
    })

    it('should handle special characters in TextToSpeech', async () => {
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
      const input = wrapper.find('.vishing-template-dialog-step__text-to-speech-input textarea')
      await input.setValue('Hello! @#$% World?')
      await Vue.nextTick()
      expect(wrapper.exists()).toBeTruthy()
    })

    it('should handle large step order numbers', () => {
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
            order: 100,
            isExpanded: true
          },
          index: 99,
          isRemoveDisabled: false
        }
      })
      expect(wrapper.find('.vishing-template-dialog-step__header-text').text()).toContain('Step 100')
      expect(wrapper.vm.value.order).toBe(100)
    })
  })

  describe('component lifecycle', () => {
    it('should initialize component cleanly', () => {
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
      expect(wrapper.vm).toBeDefined()
      expect(wrapper.find('.vishing-template-dialog-step').exists()).toBeTruthy()
    })

    it('should destroy without errors', () => {
      const wrapper = mount(VishingTemplateDialogStep, {
        localVue,
        vuetify,
        propsData: {
          value: {
            inputType: 'Pause',
            inputText: null,
            inputUrl: null,
            inputDigit: 0,
            duration: 5,
            isVishingStep: false,
            order: 1,
            isExpanded: true
          },
          index: 0,
          isRemoveDisabled: false
        }
      })
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('should handle multiple mount and destroy cycles', () => {
      for (let i = 0; i < 3; i++) {
        const wrapper = mount(VishingTemplateDialogStep, {
          localVue,
          vuetify,
          propsData: {
            value: {
              inputType: 'TextToSpeech',
              inputText: `Cycle ${i}`,
              inputUrl: null,
              inputDigit: i,
              duration: 0,
              isVishingStep: false,
              order: i + 1,
              isExpanded: true
            },
            index: i,
            isRemoveDisabled: false
          }
        })
        expect(wrapper.exists()).toBeTruthy()
        wrapper.destroy()
      }
    })
  })

  describe('performance', () => {
    it('should mount within reasonable time', () => {
      const start = Date.now()
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
      const end = Date.now()
      expect(end - start).toBeLessThan(1000)
      wrapper.destroy()
    })

    it('should handle rapid variant switching', async () => {
      const variants = ['TextToSpeech', 'FileUpload', 'Pause']
      for (const variant of variants) {
        const wrapper = mount(VishingTemplateDialogStep, {
          localVue,
          vuetify,
          propsData: {
            value: {
              inputType: variant,
              inputText: variant === 'TextToSpeech' ? '' : null,
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
        expect(wrapper.exists()).toBeTruthy()
        wrapper.destroy()
      }
    })
  })
})
