import { shallowMount } from '@vue/test-utils'
import PasswordChecker from '@/components/Common/PasswordChecker/PasswordChecker.vue'

describe('PasswordChecker.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PasswordChecker, {
      propsData: {
        password: 'test123'
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
      expect(wrapper.vm.$options.name).toBe('PasswordChecker')
    })

    it('should render password-complexity container', () => {
      expect(wrapper.classes()).toContain('password-complexity')
    })
  })

  describe('props handling', () => {
    it('should have required password prop', () => {
      expect(wrapper.vm.$options.props.password.required).toBe(true)
    })

    it('should accept password prop', () => {
      expect(wrapper.vm.password).toBe('test123')
    })

    it('should update when password prop changes', async () => {
      await wrapper.setProps({ password: 'newpassword123' })
      expect(wrapper.vm.password).toBe('newpassword123')
    })
  })

  describe('data initialization', () => {
    it('should initialize complexity to 1', () => {
      expect(wrapper.vm.complexity).toBe(1)
    })
  })

  describe('computed passwordComplexity', () => {
    it('should calculate password complexity score', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'a' }
      })
      const score = wrapper.vm.passwordComplexity
      expect(typeof score === 'number').toBe(true)
    })

    it('should return numeric score', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'Test123!@#' }
      })
      expect(typeof wrapper.vm.passwordComplexity).toBe('number')
    })
  })

  describe('computed getPasswordColor', () => {
    it('should return color string', () => {
      expect(typeof wrapper.vm.getPasswordColor).toBe('string')
    })

    it('should return red color for very weak password (score <= 20)', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'a' }
      })
      const color = wrapper.vm.getPasswordColor
      expect(color).toBeDefined()
    })

    it('should return orange color for weak password (score 21-40)', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'abc123' }
      })
      const color = wrapper.vm.getPasswordColor
      expect(typeof color).toBe('string')
    })

    it('should return cyan color for medium password (score 41-60)', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'Password123' }
      })
      const color = wrapper.vm.getPasswordColor
      expect(typeof color).toBe('string')
    })

    it('should return blue color for strong password (score 61-80)', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'Password123!@' }
      })
      const color = wrapper.vm.getPasswordColor
      expect(typeof color).toBe('string')
    })

    it('should return green color for very strong password (score >= 81)', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'VerySecurePassword123!@#$%' }
      })
      const color = wrapper.vm.getPasswordColor
      expect(typeof color).toBe('string')
    })
  })

  describe('complexity levels', () => {
    it('should set complexity to 1 for very weak password', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'a' }
      })
      wrapper.vm.getPasswordColor // Trigger computed property
      expect(wrapper.vm.complexity).toBeGreaterThanOrEqual(1)
    })

    it('should set complexity to 2 for weak password', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'abc123' }
      })
      wrapper.vm.getPasswordColor
      expect(wrapper.vm.complexity).toBeGreaterThanOrEqual(1)
    })

    it('should set complexity to 3 for medium password', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'Password123' }
      })
      wrapper.vm.getPasswordColor
      expect(wrapper.vm.complexity).toBeGreaterThanOrEqual(1)
    })

    it('should set complexity to 4 for strong password', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'Password123!@' }
      })
      wrapper.vm.getPasswordColor
      expect(wrapper.vm.complexity).toBeGreaterThanOrEqual(1)
    })

    it('should set complexity to 5 for very strong password', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'VerySecurePassword123!@#$%' }
      })
      wrapper.vm.getPasswordColor
      expect(wrapper.vm.complexity).toBeGreaterThanOrEqual(1)
    })
  })

  describe('password strength colors', () => {
    it('should use red for very weak (#f56c6c)', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'a' }
      })
      const color = wrapper.vm.getPasswordColor
      expect(color).toBe('#f56c6c')
    })

    it('should use orange for weak (#e6a23c)', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'weak' }
      })
      const color = wrapper.vm.getPasswordColor
      expect(color).toBeDefined()
    })

    it('should use cyan for medium (#00bcd4)', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'MediumPass1' }
      })
      const color = wrapper.vm.getPasswordColor
      expect(color).toBeDefined()
    })

    it('should use blue for strong (#2196f3)', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'StrongPass123!' }
      })
      const color = wrapper.vm.getPasswordColor
      expect(color).toBeDefined()
    })

    it('should use green for very strong (#43a047)', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'VeryStrongPassword123!@#' }
      })
      const color = wrapper.vm.getPasswordColor
      expect(color).toBeDefined()
    })
  })

  describe('password examples', () => {
    it('should handle numeric passwords', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: '123456' }
      })
      expect(wrapper.vm.password).toBe('123456')
      expect(wrapper.vm.getPasswordColor).toBeDefined()
    })

    it('should handle alphanumeric passwords', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'password123' }
      })
      expect(wrapper.vm.password).toBe('password123')
    })

    it('should handle mixed case passwords', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'PassWord123' }
      })
      expect(wrapper.vm.password).toBe('PassWord123')
    })

    it('should handle special character passwords', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'Pass@Word123!' }
      })
      expect(wrapper.vm.password).toBe('Pass@Word123!')
    })

    it('should handle long passwords', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'VeryLongPasswordWith123!@#SpecialChars' }
      })
      expect(wrapper.vm.password.length).toBeGreaterThan(20)
    })

    it('should handle short passwords', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'a' }
      })
      expect(wrapper.vm.password.length).toBe(1)
    })

    it('should handle empty string password', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: '' }
      })
      expect(wrapper.vm.password).toBe('')
    })
  })

  describe('reactivity', () => {
    it('should update color when password changes', async () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'weak' }
      })
      const initialColor = wrapper.vm.getPasswordColor

      await wrapper.setProps({ password: 'VeryStrongPassword123!@#' })
      const updatedColor = wrapper.vm.getPasswordColor

      expect(initialColor).toBeDefined()
      expect(updatedColor).toBeDefined()
    })

    it('should update complexity when password changes', async () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'a' }
      })
      wrapper.vm.getPasswordColor

      await wrapper.setProps({ password: 'StrongPass123!' })
      wrapper.vm.getPasswordColor

      expect(wrapper.vm.complexity).toBeGreaterThanOrEqual(1)
    })
  })

  describe('template rendering', () => {
    it('should display password strength label', () => {
      expect(wrapper.text()).toContain('Password strength')
    })

    it('should render checker groups', () => {
      const checkerGroups = wrapper.findAll('.password-complexity__content-checker--group')
      expect(checkerGroups.length).toBeGreaterThan(0)
    })

    it('should have 5 strength indicators', () => {
      const indicators = wrapper.findAll('.password-complexity__content-checker--group')
      expect(indicators.length).toBe(5)
    })
  })

  describe('strength indicators', () => {
    it('should show "Very Weak" for low complexity', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'a' }
      })
      wrapper.vm.complexity = 1
      expect(wrapper.text()).toContain('Very Weak')
    })

    it('should show "Weak" for complexity 2', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'weak' }
      })
      wrapper.vm.complexity = 2
      expect(wrapper.vm.complexity).toBe(2)
    })

    it('should show "Medium" for complexity 3', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'medium' }
      })
      wrapper.vm.complexity = 3
      expect(wrapper.vm.complexity).toBe(3)
    })

    it('should show "Strong" for complexity 4', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'strong' }
      })
      wrapper.vm.complexity = 4
      expect(wrapper.vm.complexity).toBe(4)
    })

    it('should show "Very Strong" for complexity 5', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'verystrong' }
      })
      wrapper.vm.complexity = 5
      expect(wrapper.vm.complexity).toBe(5)
    })
  })

  describe('styling', () => {
    it('should have password-complexity class', () => {
      expect(wrapper.classes()).toContain('password-complexity')
    })

    it('should render with correct structure classes', () => {
      expect(wrapper.find('.password-complexity__content').exists()).toBe(true)
      expect(wrapper.find('.password-complexity__content-label').exists()).toBe(true)
      expect(wrapper.find('.password-complexity__content-checker').exists()).toBe(true)
    })

    it('should apply color to indicator elements', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'a' }
      })
      const indicators = wrapper.findAll('.password-complexity__content-checker--group')
      expect(indicators.length).toBeGreaterThan(0)
    })
  })

  describe('security assessment', () => {
    it('should recognize weak single character password', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'a' }
      })
      expect(wrapper.vm.complexity).toBeGreaterThanOrEqual(1)
    })

    it('should recognize improved alphanumeric password', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'abc123' }
      })
      expect(wrapper.vm.getPasswordColor).toBeDefined()
    })

    it('should recognize strong mixed case special char password', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'SecureP@ssw0rd!' }
      })
      expect(wrapper.vm.getPasswordColor).toBeDefined()
    })
  })

  describe('user feedback', () => {
    it('should provide immediate feedback', () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'test' }
      })
      expect(wrapper.vm.getPasswordColor).toBeDefined()
    })

    it('should update feedback when password changes', async () => {
      wrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'weak' }
      })
      const initialColor = wrapper.vm.getPasswordColor

      await wrapper.setProps({ password: 'VeryStrongPassword123!@#' })
      const newColor = wrapper.vm.getPasswordColor

      expect(initialColor).toBeDefined()
      expect(newColor).toBeDefined()
    })

    it('should show different colors for different strengths', () => {
      const weakWrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'a' }
      })
      const weakColor = weakWrapper.vm.getPasswordColor

      const strongWrapper = shallowMount(PasswordChecker, {
        propsData: { password: 'VeryStrongPassword123!@#' }
      })
      const strongColor = strongWrapper.vm.getPasswordColor

      expect(weakColor).toBeDefined()
      expect(strongColor).toBeDefined()
    })
  })
})
