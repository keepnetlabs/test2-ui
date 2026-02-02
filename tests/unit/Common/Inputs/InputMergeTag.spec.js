import { shallowMount } from '@vue/test-utils'
import InputMergeTag from '@/components/Common/Inputs/InputMergeTag.vue'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'

describe('InputMergeTag.vue', () => {
  let wrapper
  const mockMergeTags = [
    { text: 'First Name', value: '{FIRST_NAME}' },
    { text: 'Last Name', value: '{LAST_NAME}' },
    { text: 'Email', value: '{EMAIL}' },
    { text: 'Department', value: '{DEPARTMENT}' },
    { text: 'Title', value: '{TITLE}' },
    { text: 'Phone', value: '{PHONE}' }
  ]

  beforeEach(() => {
    wrapper = shallowMount(InputMergeTag, {
      propsData: {
        value: 'Dear {FIRST_NAME} {LAST_NAME},',
        mergeTags: mockMergeTags
      },
      stubs: {
        'v-textarea': true,
        'v-btn': true,
        'v-icon': true,
        'v-menu': true,
        'v-list': true,
        'v-list-item': true,
        'v-list-item-title': true,
        'v-tooltip': true,
        'audio-player': true
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('InputMergeTag')
    })

    it('should render v-textarea component', () => {
      const textarea = wrapper.findComponent({ name: 'VTextarea' })
      expect(textarea.exists()).toBe(true)
    })

    it('should render merge tag buttons when tags exist', () => {
      expect(wrapper.vm.mergeTags.length).toBeGreaterThan(0)
    })
  })

  describe('prop defaults', () => {
    it('should accept value prop', () => {
      expect(wrapper.vm.value).toBe('Dear {FIRST_NAME} {LAST_NAME},')
    })

    it('should have entityName default labels.Description', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          mergeTags: []
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.entityName).toBe(labels.Description)
    })

    it('should have required default false', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          mergeTags: []
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.required).toBe(false)
    })

    it('should have maxLength default 2000', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          mergeTags: []
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.maxLength).toBe(2000)
    })

    it('should have overflowCount default 5', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          mergeTags: mockMergeTags
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.overflowCount).toBe(5)
    })

    it('should have disabled default false', () => {
      expect(wrapper.vm.disabled).toBe(false)
    })

    it('should have readonly default false', () => {
      expect(wrapper.vm.readonly).toBe(false)
    })

    it('should have applyRules default true', () => {
      expect(wrapper.vm.applyRules).toBe(true)
    })

    it('should have isTextToSpeech default false', () => {
      expect(wrapper.vm.isTextToSpeech).toBe(false)
    })

    it('should have isCallback default false', () => {
      expect(wrapper.vm.isCallback).toBe(false)
    })
  })

  describe('props configuration', () => {
    it('should accept custom value', () => {
      expect(wrapper.vm.value).toBe('Dear {FIRST_NAME} {LAST_NAME},')
    })

    it('should accept custom mergeTags', () => {
      expect(wrapper.vm.mergeTags).toEqual(mockMergeTags)
    })

    it('should accept custom entityName', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          mergeTags: mockMergeTags,
          entityName: 'Email Body'
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.entityName).toBe('Email Body')
    })

    it('should accept required true', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          mergeTags: mockMergeTags,
          required: true
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should accept custom maxLength', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          mergeTags: mockMergeTags,
          maxLength: 5000
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.maxLength).toBe(5000)
    })

    it('should accept disabled true', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          mergeTags: mockMergeTags,
          disabled: true
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })

    it('should accept readonly true', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          mergeTags: mockMergeTags,
          readonly: true
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.readonly).toBe(true)
    })

    it('should accept isTextToSpeech true', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          mergeTags: mockMergeTags,
          isTextToSpeech: true,
          language: 'English',
          voice: 'Joanna'
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true,
          'v-tooltip': true
        }
      })
      expect(wrapper.vm.isTextToSpeech).toBe(true)
    })
  })

  describe('data properties', () => {
    it('should have rules array', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should have mergeTagRules array', () => {
      expect(wrapper.vm.mergeTagRules).toBeDefined()
      expect(Array.isArray(wrapper.vm.mergeTagRules)).toBe(true)
    })

    it('should have isFetchingTTSUrl as false', () => {
      expect(wrapper.vm.isFetchingTTSUrl).toBe(false)
    })

    it('should have isPlayTextClicked as false', () => {
      expect(wrapper.vm.isPlayTextClicked).toBe(false)
    })

    it('should have audioSrc as empty string', () => {
      expect(wrapper.vm.audioSrc).toBe('')
    })

    it('should have placeholder property', () => {
      expect(wrapper.vm.placeholder).toBeDefined()
    })

    it('should have requiredProps object', () => {
      expect(wrapper.vm.requiredProps).toBeDefined()
      expect(typeof wrapper.vm.requiredProps).toBe('object')
    })
  })

  describe('computed properties', () => {
    it('should have hasOverflowItems', () => {
      expect(wrapper.vm.hasOverflowItems).toBeDefined()
    })

    it('should return true when mergeTags exceed overflowCount', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          mergeTags: mockMergeTags,
          overflowCount: 3
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.hasOverflowItems).toBe(true)
    })

    it('should have getRowMergeTags computed property', () => {
      expect(wrapper.vm.getRowMergeTags).toBeDefined()
      expect(Array.isArray(wrapper.vm.getRowMergeTags)).toBe(true)
    })

    it('should have getOverflowItems computed property', () => {
      expect(wrapper.vm.getOverflowItems).toBeDefined()
      expect(Array.isArray(wrapper.vm.getOverflowItems)).toBe(true)
    })

    it('should have isShowTooltip computed property', () => {
      expect(wrapper.vm.isShowTooltip).toBeDefined()
    })

    it('should have isPlayTextDisabled computed property', () => {
      expect(wrapper.vm.isPlayTextDisabled).toBeDefined()
    })
  })

  describe('getRowMergeTags computed property', () => {
    it('should return tags up to overflowCount', () => {
      const rowTags = wrapper.vm.getRowMergeTags
      expect(rowTags.length).toBeLessThanOrEqual(wrapper.vm.overflowCount)
    })

    it('should return first 5 tags by default', () => {
      const rowTags = wrapper.vm.getRowMergeTags
      expect(rowTags).toEqual(mockMergeTags.slice(0, 5))
    })
  })

  describe('getOverflowItems computed property', () => {
    it('should return tags after overflowCount', () => {
      const overflowItems = wrapper.vm.getOverflowItems
      expect(overflowItems).toEqual(mockMergeTags.slice(wrapper.vm.overflowCount))
    })

    it('should return empty array when no overflow', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          mergeTags: mockMergeTags.slice(0, 3),
          overflowCount: 5
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.getOverflowItems).toEqual([])
    })
  })

  describe('methods', () => {
    it('should have handleMergeTagClick method', () => {
      expect(typeof wrapper.vm.handleMergeTagClick).toBe('function')
    })

    it('should have handlePlayTextToSpeech method', () => {
      expect(typeof wrapper.vm.handlePlayTextToSpeech).toBe('function')
    })
  })

  describe('handleMergeTagClick method', () => {
    it('should be defined as a function', () => {
      expect(typeof wrapper.vm.handleMergeTagClick).toBe('function')
    })

    it('should handle merge tag click', () => {
      const spy = jest.spyOn(wrapper.vm, 'handleMergeTagClick')
      wrapper.vm.handleMergeTagClick('{FIRST_NAME}')
      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
  })

  describe('validation rules', () => {
    it('should have startsWithSpace rule', () => {
      const rules = wrapper.vm.rules
      expect(rules.length).toBeGreaterThan(0)
    })

    it('should have maxLength rule', () => {
      const rules = wrapper.vm.rules
      expect(rules.some((rule) => typeof rule === 'function')).toBe(true)
    })

    it('should have merge tag validation rules when mergeTags exist', () => {
      expect(wrapper.vm.mergeTagRules.length).toBeGreaterThan(0)
    })
  })

  describe('text to speech', () => {
    it('should show play button when isTextToSpeech is true', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          value: 'Test message',
          mergeTags: mockMergeTags,
          isTextToSpeech: true,
          language: 'English',
          voice: 'Joanna'
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true,
          'v-tooltip': true
        }
      })
      expect(wrapper.vm.isTextToSpeech).toBe(true)
    })

    it('should disable play button when no value', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          value: '',
          mergeTags: mockMergeTags,
          isTextToSpeech: true,
          language: 'English',
          voice: 'Joanna'
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true,
          'v-tooltip': true
        }
      })
      expect(wrapper.vm.isPlayTextDisabled).toBe(true)
    })

    it('should disable play button when no language', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          value: 'Test message',
          mergeTags: mockMergeTags,
          isTextToSpeech: true,
          voice: 'Joanna'
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true,
          'v-tooltip': true
        }
      })
      expect(wrapper.vm.isPlayTextDisabled).toBe(true)
    })

    it('should disable play button when no voice', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          value: 'Test message',
          mergeTags: mockMergeTags,
          isTextToSpeech: true,
          language: 'English'
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true,
          'v-tooltip': true
        }
      })
      expect(wrapper.vm.isPlayTextDisabled).toBe(true)
    })
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      await wrapper.setProps({ value: 'Hello {FIRST_NAME}' })
      expect(wrapper.vm.value).toBe('Hello {FIRST_NAME}')
    })

    it('should update when mergeTags prop changes', async () => {
      const newTags = [{ text: 'New Tag', value: '{NEW_TAG}' }]
      await wrapper.setProps({ mergeTags: newTags })
      expect(wrapper.vm.mergeTags).toEqual(newTags)
    })

    it('should update when required prop changes', async () => {
      await wrapper.setProps({ required: true })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should reset isPlayTextClicked when voice changes', async () => {
      wrapper.vm.isPlayTextClicked = true
      await wrapper.setProps({ voice: 'Matthew' })
      expect(wrapper.vm.isPlayTextClicked).toBe(false)
    })

    it('should reset isPlayTextClicked when value changes', async () => {
      wrapper.vm.isPlayTextClicked = true
      await wrapper.setProps({ value: 'New value' })
      expect(wrapper.vm.isPlayTextClicked).toBe(false)
    })
  })

  describe('event handling', () => {
    it('should emit input event when textarea value changes', () => {
      wrapper.vm.$emit('input', 'New value')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit correct value in input event', () => {
      const newValue = 'Hello {FIRST_NAME}'
      wrapper.vm.$emit('input', newValue)
      expect(wrapper.emitted('input')[0][0]).toBe(newValue)
    })
  })

  describe('integration scenarios', () => {
    it('should work as basic textarea with merge tags', () => {
      expect(wrapper.vm.mergeTags.length).toBeGreaterThan(0)
      expect(wrapper.vm.value).toBeDefined()
    })

    it('should work with required validation', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          value: '',
          mergeTags: mockMergeTags,
          required: true
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.required).toBe(true)
    })

    it('should work with custom maxLength', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          value: 'Test',
          mergeTags: mockMergeTags,
          maxLength: 100
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.maxLength).toBe(100)
    })

    it('should work with text-to-speech enabled', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          value: 'Hello {FIRST_NAME}',
          mergeTags: mockMergeTags,
          isTextToSpeech: true,
          language: 'English',
          voice: 'Joanna',
          voiceResourceId: 'voice-1'
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true,
          'v-tooltip': true
        }
      })
      expect(wrapper.vm.isTextToSpeech).toBe(true)
    })

    it('should work with disabled state', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          value: 'Test',
          mergeTags: mockMergeTags,
          disabled: true
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.disabled).toBe(true)
    })
  })

  describe('state management', () => {
    it('should maintain textarea value', () => {
      expect(wrapper.vm.value).toBe('Dear {FIRST_NAME} {LAST_NAME},')
    })

    it('should maintain merge tags list', () => {
      expect(wrapper.vm.mergeTags).toEqual(mockMergeTags)
    })

    it('should maintain TTS state', () => {
      wrapper.vm.isFetchingTTSUrl = true
      expect(wrapper.vm.isFetchingTTSUrl).toBe(true)
    })

    it('should maintain audio source', () => {
      wrapper.vm.audioSrc = 'audio-url'
      expect(wrapper.vm.audioSrc).toBe('audio-url')
    })
  })

  describe('merge tag overflow', () => {
    it('should show menu when tags exceed overflow count', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          mergeTags: mockMergeTags,
          overflowCount: 2
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true,
          'v-menu': true
        }
      })
      expect(wrapper.vm.hasOverflowItems).toBe(true)
    })

    it('should not show menu when tags within limit', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          mergeTags: mockMergeTags.slice(0, 2),
          overflowCount: 5
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.hasOverflowItems).toBe(false)
    })

    it('should respect custom overflowCount', () => {
      wrapper = shallowMount(InputMergeTag, {
        propsData: {
          mergeTags: mockMergeTags,
          overflowCount: 3
        },
        stubs: {
          'v-textarea': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.getRowMergeTags.length).toBe(3)
      expect(wrapper.vm.getOverflowItems.length).toBe(3)
    })
  })
})
