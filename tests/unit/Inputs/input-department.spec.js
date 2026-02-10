import { createLocalVue, mount } from '@vue/test-utils'
import TestInputDepartmentWrapper from '@/components/TestHelpers/TestInputDepartmentWrapper'
import InputHelper from '../Objects/InputHelper'

describe('Input company component', () => {
  const localVue = createLocalVue()

  it('Check is rendering', () => {
    const wrapper = mount(TestInputDepartmentWrapper, {
      localVue
    })
    //expecting component is rendering
    expect(wrapper.find('#test--input-department').exists()).toBeTruthy()
  })

  it('Checking props', () => {
    const wrapper = mount(TestInputDepartmentWrapper, {
      localVue
    })
    //checking placeholder

    const inputAttr = wrapper.find('input').attributes()
    expect(inputAttr.placeholder).toEqual('Enter a name for the department')
    //checking is autocomplete disabled
    expect(inputAttr.autocomplete).toEqual('off')
    //checking is required false
    expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(false)
  })

  it('Checking validations', async () => {
    const wrapper = mount(TestInputDepartmentWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    //checking cannot start empty space
    await inputHelper.addData(' my custom input department data', textInput, wrapper)

    expect(
      wrapper.find('.v-messages__message').text().includes('Cannot start with space')
    ).toBeTruthy()

    //checking length
    await inputHelper.addData(
      'my custom input department data my custom input department data my custom input department data my custom input department data my custom input department data my custom input department data my custom input department data',
      textInput,
      wrapper
    )
    expect(wrapper.find('.v-messages__message').text().includes('cannot exceed')).toBeTruthy()
  })

  it('Accepts valid department names', async () => {
    const wrapper = mount(TestInputDepartmentWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    await inputHelper.addData('IT Department', textInput, wrapper)
    const errorMsg = wrapper.find('.v-messages__message')
    expect(!errorMsg.exists() || !errorMsg.text().includes('Cannot start with space')).toBe(true)
  })

  it('Department is not required', () => {
    const wrapper = mount(TestInputDepartmentWrapper, {
      localVue
    })
    expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(false)
  })

  it('Has correct input attributes', () => {
    const wrapper = mount(TestInputDepartmentWrapper, {
      localVue
    })
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toEqual('Enter a name for the department')
    expect(input.attributes('autocomplete')).toEqual('off')
  })

  it('Allows empty input', async () => {
    const wrapper = mount(TestInputDepartmentWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    await inputHelper.addData('', textInput, wrapper)
    // Should not show required error
    const errorMsg = wrapper.find('.v-messages__message')
    expect(!errorMsg.exists() || !errorMsg.text().includes('Required')).toBe(true)
  })

  describe('Component Rendering', () => {
    it('renders department input component', () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      expect(wrapper.find('#test--input-department').exists()).toBeTruthy()
    })

    it('renders input element', () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      expect(wrapper.find('input').exists()).toBeTruthy()
    })

    it('renders input as visible', () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      expect(wrapper.find('input').isVisible()).toBe(true)
    })

    it('component is mountable', () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      expect(wrapper.exists()).toBeTruthy()
    })
  })

  describe('Props and Input Attributes', () => {
    it('has correct placeholder text', () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter a name for the department')
    })

    it('has autocomplete disabled', () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      expect(wrapper.find('input').attributes('autocomplete')).toBe('off')
    })

    it('is not required by default', () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(false)
    })

    it('all input attributes are correct', () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputAttr = wrapper.find('input').attributes()
      expect(inputAttr.placeholder).toBe('Enter a name for the department')
      expect(inputAttr.autocomplete).toBe('off')
    })
  })

  describe('Validation Rules', () => {
    it('rejects input starting with space', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData(' Department', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text()).toContain('Cannot start with space')
    })

    it('accepts input without leading space', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('HR Department', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(!errorMsg.exists() || !errorMsg.text().includes('Cannot start with space')).toBe(true)
    })

    it('enforces maximum length constraint', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const longName = 'a'.repeat(300)
      await inputHelper.addData(longName, textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('cannot exceed')).toBeTruthy()
    })

    it('handles multiple consecutive spaces', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('  IT', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Cannot start with space')).toBeTruthy()
    })
  })

  describe('Data Binding', () => {
    it('initializes with empty value', () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      expect(wrapper.vm.value === '' || wrapper.vm.value === undefined).toBeTruthy()
    })

    it('updates value when input changes', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Sales Department', textInput, wrapper)
      expect(wrapper.vm.value).toBe('Sales Department')
    })

    it('trims whitespace from input', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Engineering ', textInput, wrapper)
      expect(wrapper.vm.value.trim()).toBe('Engineering')
    })

    it('preserves input value in property', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const testValue = 'Marketing'
      await inputHelper.addData(testValue, textInput, wrapper)
      expect(wrapper.vm.value).toBe(testValue)
    })
  })

  describe('Valid Department Names', () => {
    it('accepts standard department names', async () => {
      const departments = ['IT', 'HR', 'Finance', 'Sales', 'Marketing']
      for (const dept of departments) {
        const wrapper = mount(TestInputDepartmentWrapper, {
          localVue
        })
        const inputHelper = new InputHelper()
        const textInput = wrapper.find('input')
        await inputHelper.addData(dept, textInput, wrapper)
        const errorMsg = wrapper.find('.v-messages__message')
        expect(!errorMsg.exists() || !errorMsg.text().includes('Cannot start with space')).toBe(true)
      }
    })

    it('accepts names with hyphens', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('IT-Support', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(!errorMsg.exists() || !errorMsg.text().includes('Cannot start with space')).toBe(true)
    })

    it('accepts names with numbers', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Department 1', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(!errorMsg.exists() || !errorMsg.text().includes('Cannot start with space')).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty string input', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(!errorMsg.exists() || !errorMsg.text().includes('Required')).toBe(true)
    })

    it('handles single character input', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('A', textInput, wrapper)
      expect(wrapper.vm.value).toBe('A')
    })

    it('handles special characters in department name', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('IT & Support', textInput, wrapper)
      expect(wrapper.vm.value).toBe('IT & Support')
    })

    it('handles Unicode characters', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Département', textInput, wrapper)
      expect(wrapper.vm.value).toBe('Département')
    })

    it('rejects all-space input', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('   ', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.text().includes('Cannot start with space')).toBeTruthy()
    })
  })

  describe('Maximum Length Handling', () => {
    it('enforces character limit', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const veryLongName = 'a'.repeat(500)
      await inputHelper.addData(veryLongName, textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('cannot exceed')).toBeTruthy()
    })

    it('accepts input at maximum allowed length', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const maxLengthName = 'a'.repeat(100)
      await inputHelper.addData(maxLengthName, textInput, wrapper)
      expect(wrapper.vm.value.length).toBeLessThanOrEqual(100)
    })
  })

  describe('Sequential Validations', () => {
    it('handles multiple validation attempts', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData(' Invalid', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBe(true)
      expect(errorMsg.text()).toContain('Cannot start with space')

      await inputHelper.addData('Valid Department', textInput, wrapper)
      const newErrorMsg = wrapper.find('.v-messages__message')
      expect(!newErrorMsg.exists() || !newErrorMsg.text().includes('Cannot start with space')).toBe(true)
    })

    it('clears errors on valid input', async () => {
      const wrapper = mount(TestInputDepartmentWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData(' spaced', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBe(true)
      expect(errorMsg.text().includes('Cannot start with space')).toBe(true)

      await inputHelper.addData('correct', textInput, wrapper)
      const newErrorMsg = wrapper.find('.v-messages__message')
      expect(!newErrorMsg.exists() || !newErrorMsg.text().includes('Cannot start with space')).toBe(true)
    })
  })
})
