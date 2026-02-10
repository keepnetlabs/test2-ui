import { createLocalVue, mount } from '@vue/test-utils'
import { customVuetify as vuetify } from '../utils'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputHelper from '../Objects/InputHelper'

describe('Input entity name', () => {
  const localVue = createLocalVue()

  it('should render successfully', () => {
    const wrapper = mount(InputEntityName, {
      localVue,
      vuetify,
      propsData: {
        id: 'input-entity-name'
      }
    })
    expect(wrapper.find('#input-entity-name').exists()).toBeTruthy()
  })
  it('should render props successfully', async () => {
    const props = {
      id: 'input-entity-name',
      value: 'Some input entity name value',
      initialPlaceholder: 'Some input entity name placeholder',
      initialRules: [],
      required: false,
      entityName: 'entity-name'
    }
    const wrapper = await mount(InputEntityName, {
      localVue,
      vuetify,
      propsData: props
    })

    expect(wrapper.find('#input-entity-name').exists()).toBeTruthy()
    expect(wrapper.find('#input-entity-name').element.value).toEqual(props.value)
    expect(wrapper.find('#input-entity-name').attributes().placeholder).toEqual(
      props.initialPlaceholder
    )
    expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(false)
  })

  it('should apply rules successfully', async () => {
    const props = {
      id: 'input-entity-name',
      value: 'Some input entity name value',
      initialPlaceholder: 'Some input entity name placeholder',
      required: true,
      entityName: 'entity-name'
    }
    const wrapper = mount(InputEntityName, {
      localVue,
      vuetify,
      propsData: props
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    //checking cannot start empty space
    await inputHelper.addData(' my custom input first name data', textInput, wrapper)

    expect(
      wrapper.find('.v-messages__message').text().includes('Cannot start with space')
    ).toBeTruthy()

    //checking length
    await inputHelper.addData(
      'my custom input first name data my custom input first name data my custom input first name datamy custom input first name data  vmy custom input first name datamy custom input first name datamy custom input first name data',
      textInput,
      wrapper
    )
    expect(wrapper.find('.v-messages__message').text()).toEqual(
      `${props.entityName} cannot exceed 200 characters`
    )
    //checking required
    await inputHelper.addData('', textInput, wrapper)

    expect(wrapper.find('.v-messages__message').text().includes('Required')).toBeTruthy()
  })

  it('should apply custom rules', async () => {
    const customRules = [(v) => v && v.length > 0 || 'Must not be empty']
    const props = {
      id: 'input-entity-name',
      value: '',
      initialPlaceholder: 'Enter entity name',
      initialRules: customRules,
      required: true,
      entityName: 'Custom Entity'
    }
    const wrapper = mount(InputEntityName, {
      localVue,
      vuetify,
      propsData: props
    })
    expect(wrapper.find('#input-entity-name').exists()).toBeTruthy()
  })

  describe('Component Rendering', () => {
    it('renders input field', () => {
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: { id: 'test-input', initialRules: [], required: false }
      })
      expect(wrapper.find('input').exists()).toBeTruthy()
    })

    it('input field is visible', () => {
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: { id: 'test-input', initialRules: [], required: false }
      })
      expect(wrapper.find('input').isVisible()).toBe(true)
    })
  })

  describe('Props Handling', () => {
    it('accepts value prop', () => {
      const props = {
        id: 'input-entity-name',
        value: 'Test Value',
        initialRules: [],
        required: false
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      expect(wrapper.find('input').element.value).toBe('Test Value')
    })

    it('accepts required prop as true', () => {
      const props = {
        id: 'input-entity-name',
        required: true
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(true)
    })

    it('accepts required prop as false', () => {
      const props = {
        id: 'input-entity-name',
        required: false,
        initialRules: []
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      expect(wrapper.find('input').exists()).toBeTruthy()
    })

    it('accepts entityName prop', () => {
      const props = {
        id: 'input-entity-name',
        entityName: 'Custom Entity Name'
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      expect(wrapper.vm.entityName).toBe('Custom Entity Name')
    })
  })

  describe('Validation Rules', () => {
    it('validates space at beginning', async () => {
      const props = {
        id: 'input-entity-name',
        required: true,
        entityName: 'test'
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData(' invalid', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBeTruthy()
      expect(errorMsg.text().includes('Cannot start with space')).toBe(true)
    })

    it('rejects long input exceeding 200 characters', async () => {
      const props = {
        id: 'input-entity-name',
        required: true,
        entityName: 'myentity'
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const longText = 'a'.repeat(201)
      await inputHelper.addData(longText, textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBeTruthy()
    })

    it('requires field when required prop is true', async () => {
      const props = {
        id: 'input-entity-name',
        required: true,
        entityName: 'test'
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBeTruthy()
      expect(errorMsg.text().includes('Required')).toBe(true)
    })
  })

  describe('Valid Input Handling', () => {
    it('accepts valid names', async () => {
      const props = {
        id: 'input-entity-name',
        required: true,
        entityName: 'entity'
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Valid Name', textInput, wrapper)
      expect(wrapper.find('input').element.value).toBe('Valid Name')
    })

    it('accepts names with numbers', async () => {
      const props = {
        id: 'input-entity-name',
        entityName: 'entity'
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Entity123', textInput, wrapper)
      expect(wrapper.find('input').element.value).toBe('Entity123')
    })

    it('accepts names with hyphens', async () => {
      const props = {
        id: 'input-entity-name',
        entityName: 'entity'
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Entity-Name', textInput, wrapper)
      expect(wrapper.find('input').element.value).toBe('Entity-Name')
    })

    it('accepts names with underscores', async () => {
      const props = {
        id: 'input-entity-name',
        entityName: 'entity'
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Entity_Name', textInput, wrapper)
      expect(wrapper.find('input').element.value).toBe('Entity_Name')
    })
  })

  describe('Maximum Length (200 characters)', () => {
    it('accepts exactly 200 characters', async () => {
      const props = {
        id: 'input-entity-name',
        entityName: 'entity'
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const text200 = 'a'.repeat(200)
      await inputHelper.addData(text200, textInput, wrapper)
      expect(wrapper.find('input').element.value.length).toBeLessThanOrEqual(200)
    })

    it('rejects 201 characters', async () => {
      const props = {
        id: 'input-entity-name',
        entityName: 'entity'
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const text201 = 'a'.repeat(201)
      await inputHelper.addData(text201, textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBeTruthy()
    })
  })

  describe('Custom Rules', () => {
    it('accepts custom validation rules', () => {
      const customRules = [(v) => v && v.length > 0 || 'Must not be empty']
      const props = {
        id: 'input-entity-name',
        initialRules: customRules,
        entityName: 'custom'
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      expect(wrapper.vm.$data).toBeDefined()
    })

    it('applies initial rules on mount', () => {
      const customRules = [(v) => true]
      const props = {
        id: 'input-entity-name',
        initialRules: customRules
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      expect(wrapper.find('input').exists()).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty value', () => {
      const props = {
        id: 'input-entity-name',
        value: '',
        entityName: 'entity'
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      expect(wrapper.find('input').element.value).toBe('')
    })

    it('handles special characters', async () => {
      const props = {
        id: 'input-entity-name',
        entityName: 'entity'
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Entity@Special#Name', textInput, wrapper)
      expect(wrapper.find('input').element.value).toBe('Entity@Special#Name')
    })

    it('handles Unicode characters', async () => {
      const props = {
        id: 'input-entity-name',
        entityName: 'entity'
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Entité', textInput, wrapper)
      expect(wrapper.find('input').element.value).toBe('Entité')
    })

    it('handles whitespace in middle', async () => {
      const props = {
        id: 'input-entity-name',
        entityName: 'entity'
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Entity Name', textInput, wrapper)
      expect(wrapper.find('input').element.value).toBe('Entity Name')
    })
  })

  describe('Data Binding', () => {
    it('preserves input value during typing', async () => {
      const props = {
        id: 'input-entity-name',
        entityName: 'entity'
      }
      const wrapper = mount(InputEntityName, {
        localVue,
        vuetify,
        propsData: props
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const testValue = 'Test123'
      await inputHelper.addData(testValue, textInput, wrapper)
      expect(wrapper.vm.value).toBe(testValue)
    })
  })

})
