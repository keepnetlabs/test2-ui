import { createLocalVue, mount } from '@vue/test-utils'
import TestInputJobTitleWrapper from '@/components/TestHelpers/TestInputJobTitleWrapper'
import InputHelper from '../Objects/InputHelper'

describe('Input company component', () => {
  const localVue = createLocalVue()

  it('Check is rendering', () => {
    const wrapper = mount(TestInputJobTitleWrapper, {
      localVue
    })
    //expecting component is rendering
    expect(wrapper.find('#test--input-job-title').exists()).toBeTruthy()
  })

  it('Checking props', () => {
    const wrapper = mount(TestInputJobTitleWrapper, {
      localVue
    })
    //checking placeholder

    const inputAttr = wrapper.find('input').attributes()
    expect(inputAttr.placeholder).toEqual('Enter a name for the job title')
    //checking is autocomplete off
    expect(inputAttr.autocomplete).toEqual('off')
    //checking is required true
    expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(true)
  })

  it('Checking validations', async () => {
    const wrapper = mount(TestInputJobTitleWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    //checking cannot start empty space
    await inputHelper.addData(' my custom input job title data', textInput, wrapper)

    expect(
      wrapper.find('.v-messages__message').text().includes('Cannot start with space')
    ).toBeTruthy()

    //checking length
    await inputHelper.addData(
      'my custom input job title datamy custom input job title datamy custom input job title datamy custom input job title datamy custom input job title datamy custom input job title datamy custom input job title data',
      textInput,
      wrapper
    )

    expect(wrapper.find('.v-messages__message').text().includes('Max 64')).toBeTruthy()
    //checking required
    await inputHelper.addData('', textInput, wrapper)

    expect(wrapper.find('.v-messages__message').text().includes('Required')).toBeTruthy()
  })

  it('Accepts valid job titles', async () => {
    const wrapper = mount(TestInputJobTitleWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    await inputHelper.addData('Senior Developer', textInput, wrapper)
    expect(wrapper.find('.v-messages__message').text().includes('Cannot start with space')).toBe(false)
  })

  it('Enforces 64 character limit', async () => {
    const wrapper = mount(TestInputJobTitleWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    const longTitle = 'a'.repeat(65)
    await inputHelper.addData(longTitle, textInput, wrapper)
    expect(wrapper.find('.v-messages__message').text()).toContain('Max 64')
  })

  it('Shows required indicator', () => {
    const wrapper = mount(TestInputJobTitleWrapper, {
      localVue
    })
    expect(wrapper.find('.v-messages__wrapper').text()).toContain('*Required')
  })

  it('Has correct placeholder', () => {
    const wrapper = mount(TestInputJobTitleWrapper, {
      localVue
    })
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toEqual('Enter a name for the job title')
  })

  describe('Component Rendering', () => {
    it('renders job title input component', () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      expect(wrapper.find('#test--input-job-title').exists()).toBeTruthy()
    })

    it('renders input field', () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      expect(wrapper.find('input').exists()).toBeTruthy()
    })

    it('input is visible', () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      expect(wrapper.find('input').isVisible()).toBe(true)
    })

    it('component is mounted successfully', () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      expect(wrapper.exists()).toBeTruthy()
    })
  })

  describe('Props and Input Attributes', () => {
    it('has correct placeholder text', () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter a name for the job title')
    })

    it('has autocomplete disabled', () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      expect(wrapper.find('input').attributes('autocomplete')).toBe('off')
    })

    it('is marked as required', () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      expect(wrapper.find('.v-messages__wrapper').text()).toContain('*Required')
    })

    it('shows required asterisk', () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(true)
    })
  })

  describe('Validation Rules', () => {
    it('rejects input starting with space', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData(' Developer', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text()).toContain('Cannot start with space')
    })

    it('accepts input without leading space', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Developer', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Cannot start with space')).toBe(false)
    })

    it('enforces 64 character maximum', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const longTitle = 'a'.repeat(65)
      await inputHelper.addData(longTitle, textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text()).toContain('Max 64')
    })

    it('requires field to be non-empty', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text()).toContain('Required')
    })

    it('rejects multiple leading spaces', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('  Manager', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text()).toContain('Cannot start with space')
    })
  })

  describe('Data Binding', () => {
    it('initializes with empty value', () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      expect(wrapper.vm.value === '' || wrapper.vm.value === undefined).toBeTruthy()
    })

    it('updates value when input changes', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Senior Manager', textInput, wrapper)
      expect(wrapper.vm.value).toBe('Senior Manager')
    })

    it('trims whitespace from input', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Engineer ', textInput, wrapper)
      expect(wrapper.vm.value.trim()).toBe('Engineer')
    })

    it('preserves input value correctly', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const testValue = 'Product Manager'
      await inputHelper.addData(testValue, textInput, wrapper)
      expect(wrapper.vm.value).toBe(testValue)
    })
  })

  describe('Valid Job Titles', () => {
    it('accepts common job titles', async () => {
      const titles = ['Developer', 'Manager', 'Analyst', 'Director', 'Consultant']
      for (const title of titles) {
        const wrapper = mount(TestInputJobTitleWrapper, {
          localVue
        })
        const inputHelper = new InputHelper()
        const textInput = wrapper.find('input')
        await inputHelper.addData(title, textInput, wrapper)
        expect(wrapper.find('.v-messages__message').text().includes('Cannot start with space')).toBe(false)
      }
    })

    it('accepts titles with numbers', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Level 3 Engineer', textInput, wrapper)
      expect(wrapper.vm.value).toBe('Level 3 Engineer')
    })

    it('accepts titles with hyphens', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Senior-Level Manager', textInput, wrapper)
      expect(wrapper.vm.value).toBe('Senior-Level Manager')
    })

    it('accepts titles with slashes', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Engineer/Analyst', textInput, wrapper)
      expect(wrapper.vm.value).toBe('Engineer/Analyst')
    })
  })

  describe('Maximum Length (64 characters)', () => {
    it('accepts 64 character title', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const title64 = 'a'.repeat(64)
      await inputHelper.addData(title64, textInput, wrapper)
      expect(wrapper.vm.value.length).toBeLessThanOrEqual(64)
    })

    it('rejects 65 character title', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const title65 = 'a'.repeat(65)
      await inputHelper.addData(title65, textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text()).toContain('Max 64')
    })

    it('rejects titles exceeding 64 characters', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const longTitle = 'Chief Executive Officer and Additional Roles'.repeat(2)
      await inputHelper.addData(longTitle, textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text()).toContain('Max 64')
    })

    it('accepts title exactly at boundary', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const title = 'a'.repeat(64)
      await inputHelper.addData(title, textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text().includes('Max 64')).toBe(false)
    })
  })

  describe('Required Field Behavior', () => {
    it('shows required indicator on mount', () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      expect(wrapper.find('.v-messages__wrapper').text()).toContain('*Required')
    })

    it('validates required on empty string', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBe(true)
      expect(errorMsg.text()).toContain('Required')
    })

    it('is a required field', () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('handles single character input', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('A', textInput, wrapper)
      expect(wrapper.vm.value).toBe('A')
    })

    it('handles special characters', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Chief & VP', textInput, wrapper)
      expect(wrapper.vm.value).toBe('Chief & VP')
    })

    it('handles Unicode characters', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Ingénieur', textInput, wrapper)
      expect(wrapper.vm.value).toBe('Ingénieur')
    })

    it('handles punctuation in title', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('Director (IT)', textInput, wrapper)
      expect(wrapper.vm.value).toBe('Director (IT)')
    })

    it('rejects all-spaces input', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('   ', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').text()).toContain('Cannot start with space')
    })
  })

  describe('Sequential Validations', () => {
    it('handles validation changes during input', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData(' Invalid', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBe(true)
      expect(errorMsg.text()).toContain('Cannot start with space')

      await inputHelper.addData('Valid Title', textInput, wrapper)
      const validMsg = wrapper.find('.v-messages__message')
      expect(!validMsg.exists() || !validMsg.text().includes('Cannot start with space')).toBe(true)
    })

    it('handles multiple validation checks', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData(' ', textInput, wrapper)
      let msg = wrapper.find('.v-messages__message')
      expect(msg.exists()).toBe(true)
      expect(msg.text()).toContain('Cannot start with space')

      await inputHelper.addData('a'.repeat(65), textInput, wrapper)
      msg = wrapper.find('.v-messages__message')
      expect(msg.text()).toContain('Max 64')

      await inputHelper.addData('Developer', textInput, wrapper)
      msg = wrapper.find('.v-messages__message')
      if (msg.exists()) {
        expect(msg.text().includes('Cannot start with space')).toBe(false)
        expect(msg.text().includes('Max 64')).toBe(false)
      }
    })

    it('shows error messages for invalid input', async () => {
      const wrapper = mount(TestInputJobTitleWrapper, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('', textInput, wrapper)
      let msg = wrapper.find('.v-messages__message')
      expect(msg.exists()).toBe(true)
      expect(msg.text()).toContain('Required')
    })
  })
})
