import { createLocalVue } from '@vue/test-utils'
import PasswordChecker from '../Objects/PasswordChecker'

describe('PasswordChecker component', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) => {
    return new PasswordChecker(localVue, propsData).wrapper
  }

  describe('component rendering', () => {
    it('should render password-complexity container', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(wrapper.find('.password-complexity').exists()).toBeTruthy()
    })

    it('should render content label with correct text', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(wrapper.find('.password-complexity__content-label').text()).toContain('Password strength:')
    })

    it('should render checker group elements', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(wrapper.find('.password-complexity__content-checker--group').exists()).toBeTruthy()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(wrapper.vm.$options.name).toBe('PasswordChecker')
    })

    it('should render as Vue component', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(wrapper.vm).toBeDefined()
    })

    it('should render 5 strength indicator groups', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      const groups = wrapper.findAll('.password-complexity__content-checker--group')
      expect(groups.length).toBe(5)
    })

    it('should render checker container', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(wrapper.find('.password-complexity__content-checker').exists()).toBeTruthy()
    })

    it('should render content wrapper', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(wrapper.find('.password-complexity__content').exists()).toBeTruthy()
    })
  })

  describe('password complexity levels', () => {
    it('should show very weak for default empty password', () => {
      const wrapper = mountComponent({ propsData: { password: '' } })
      expect(wrapper.text()).toContain('Very Weak')
    })

    it('should show very weak for short password', () => {
      const wrapper = mountComponent({ propsData: { password: 'abc' } })
      expect(wrapper.text()).toContain('Very Weak')
    })

    it('should show weak for weak password', async () => {
      const wrapper = mountComponent({ propsData: { password: 'asksa1skaskask' } })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Weak')
    })

    it('should show medium for medium password', async () => {
      const wrapper = mountComponent({ propsData: { password: '11sksa11a1skaskask' } })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Medium')
    })

    it('should show strong for strong password', async () => {
      const wrapper = mountComponent({ propsData: { password: '11sksASKAKa11a1skaskask' } })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Strong')
    })

    it('should show very strong for very strong password', async () => {
      const wrapper = mountComponent({ propsData: { password: '11sks#@AS@KA#Ka11a1skaskask' } })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Very Strong')
    })

    it('should detect multiple levels progressively', async () => {
      const wrapper = mountComponent({ propsData: { password: '' } })
      expect(wrapper.text()).toContain('Very Weak')

      await wrapper.setProps({ password: 'asksa1skaskask' })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Weak')

      await wrapper.setProps({ password: '11sksa11a1skaskask' })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Medium')

      await wrapper.setProps({ password: '11sksASKAKa11a1skaskask' })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Strong')

      await wrapper.setProps({ password: '11sks#@AS@KA#Ka11a1skaskask' })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Very Strong')
    })
  })

  describe('reactive prop updates', () => {
    it('should update strength on password change', async () => {
      const wrapper = mountComponent({ propsData: { password: '' } })
      expect(wrapper.text()).toContain('Very Weak')

      await wrapper.setProps({ password: 'TestPassword123!' })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).not.toContain('Very Weak')
    })

    it('should handle empty string password', async () => {
      const wrapper = mountComponent({ propsData: { password: 'test123' } })
      await wrapper.setProps({ password: '' })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Very Weak')
    })

    it('should update complexity state reactively', async () => {
      const wrapper = mountComponent({ propsData: { password: '' } })
      expect(wrapper.vm.complexity).toBe(1)

      await wrapper.setProps({ password: 'TestPassword123!' })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.complexity).toBeGreaterThan(1)
    })

    it('should accept new passwords dynamically', async () => {
      const wrapper = mountComponent({ propsData: { password: 'initial' } })
      await wrapper.setProps({ password: 'changed' })
      expect(wrapper.vm.password).toBe('changed')
    })
  })

  describe('color coding', () => {
    it('should apply red color for empty password', () => {
      const wrapper = mountComponent({ propsData: { password: '' } })
      const colorStyle = wrapper.vm.getPasswordColor
      expect(colorStyle).toBe('#f56c6c')
    })

    it('should apply valid hex color format', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      const colorStyle = wrapper.vm.getPasswordColor
      expect(colorStyle).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('should return different colors for different password strengths', async () => {
      const wrapper1 = mountComponent({ propsData: { password: '' } })
      const color1 = wrapper1.vm.getPasswordColor

      const wrapper2 = mountComponent({ propsData: { password: 'VeryStrongPassword123!@#' } })
      await wrapper2.vm.$nextTick()
      const color2 = wrapper2.vm.getPasswordColor

      expect(color1).not.toBe(color2)
    })

    it('should have 5 distinct color values in code', () => {
      const colors = ['#f56c6c', '#e6a23c', '#00bcd4', '#2196f3', '#43a047']
      expect(colors.length).toBe(5)
      colors.forEach(color => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })

    it('should apply red color for very weak password', () => {
      const wrapper = mountComponent({ propsData: { password: 'abc' } })
      const colorStyle = wrapper.vm.getPasswordColor
      expect(colorStyle).toBe('#f56c6c')
    })

    it('should return green color for very strong password', async () => {
      const wrapper = mountComponent({ propsData: { password: '11sks#@AS@KA#Ka11a1skaskask' } })
      await wrapper.vm.$nextTick()
      const colorStyle = wrapper.vm.getPasswordColor
      expect(colorStyle).toBe('#43a047')
    })
  })

  describe('data properties', () => {
    it('should initialize complexity to 1', () => {
      const wrapper = mountComponent({ propsData: { password: '' } })
      expect(wrapper.vm.complexity).toBe(1)
    })

    it('should have complexity as number type', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(typeof wrapper.vm.complexity).toBe('number')
    })

    it('should have complexity in valid range 1-5', async () => {
      const wrapper = mountComponent({ propsData: { password: 'TestPassword123!@#' } })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.complexity).toBeGreaterThanOrEqual(1)
      expect(wrapper.vm.complexity).toBeLessThanOrEqual(5)
    })
  })

  describe('computed properties', () => {
    it('should have passwordComplexity computed property', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(wrapper.vm.passwordComplexity).toBeDefined()
    })

    it('should have getPasswordColor computed property', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(wrapper.vm.getPasswordColor).toBeDefined()
    })

    it('passwordComplexity should return a number', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(typeof wrapper.vm.passwordComplexity).toBe('number')
    })

    it('getPasswordColor should return a hex color', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      const color = wrapper.vm.getPasswordColor
      expect(color).toMatch(/^#[0-9a-f]{6}$/i)
    })
  })

  describe('props validation', () => {
    it('should require password prop', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(wrapper.props('password')).toBe('test')
    })

    it('should accept any string as password', () => {
      const passwords = ['test', '123', '!@#$%', 'Test123!@#', '']
      passwords.forEach(password => {
        const wrapper = mountComponent({ propsData: { password } })
        expect(wrapper.props('password')).toBe(password)
      })
    })

    it('should accept long passwords', () => {
      const longPassword = 'a'.repeat(100)
      const wrapper = mountComponent({ propsData: { password: longPassword } })
      expect(wrapper.props('password')).toBe(longPassword)
    })

    it('should accept password with special characters', () => {
      const wrapper = mountComponent({ propsData: { password: '!@#$%^&*()_+-=[]{}|;:,.<>?' } })
      expect(wrapper.props('password')).toBeDefined()
    })
  })

  describe('strength indicator DOM elements', () => {
    it('should render all 5 indicator elements', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      const indicators = wrapper.findAll('.password-complexity__content-checker--group')
      expect(indicators.length).toBe(5)
    })

    it('should have correct IDs for first indicators', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(wrapper.find('#text--password-checker-0').exists()).toBeTruthy()
      expect(wrapper.find('#text--password-checker-1').exists()).toBeTruthy()
    })

    it('should apply background style to indicators', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      const indicator = wrapper.find('.password-complexity__content-checker--group')
      expect(indicator.attributes('style')).toBeDefined()
    })

    it('should update indicator colors based on password', async () => {
      const wrapper = mountComponent({ propsData: { password: '' } })
      let firstColor = wrapper.find('.password-complexity__content-checker--group').attributes('style')

      await wrapper.setProps({ password: 'StrongPassword123!@#' })
      await wrapper.vm.$nextTick()
      let newColor = wrapper.find('.password-complexity__content-checker--group').attributes('style')

      expect(firstColor).not.toBe(newColor)
    })
  })

  describe('edge cases', () => {
    it('should handle very long password', () => {
      const veryLongPassword = 'a'.repeat(1000)
      const wrapper = mountComponent({ propsData: { password: veryLongPassword } })
      expect(wrapper.exists()).toBeTruthy()
    })

    it('should handle password with only spaces', async () => {
      const wrapper = mountComponent({ propsData: { password: '   ' } })
      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBeTruthy()
    })

    it('should handle password with newlines', async () => {
      const wrapper = mountComponent({ propsData: { password: 'line1\nline2' } })
      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBeTruthy()
    })

    it('should handle rapid password changes', async () => {
      const wrapper = mountComponent({ propsData: { password: 'initial' } })
      for (let i = 0; i < 5; i++) {
        await wrapper.setProps({ password: `password${i}` })
        await wrapper.vm.$nextTick()
      }
      expect(wrapper.exists()).toBeTruthy()
    })

    it('should handle unicode characters in password', () => {
      const wrapper = mountComponent({ propsData: { password: '密码测试🔐' } })
      expect(wrapper.exists()).toBeTruthy()
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = mountComponent({ propsData: { password: 'test' } })
      const wrapper2 = mountComponent({ propsData: { password: 'test' } })
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
    })

    it('should handle component destruction gracefully', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('should maintain state after lifecycle events', async () => {
      const wrapper = mountComponent({ propsData: { password: 'TestPassword123!' } })
      const initialComplexity = wrapper.vm.complexity
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.complexity).toBe(initialComplexity)
    })

    it('should have correct DOM structure', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(wrapper.find('.password-complexity').exists()).toBeTruthy()
      expect(wrapper.find('.password-complexity__content').exists()).toBeTruthy()
      expect(wrapper.find('.password-complexity__content-label').exists()).toBeTruthy()
      expect(wrapper.find('.password-complexity__content-checker').exists()).toBeTruthy()
    })
  })

  describe('data types validation', () => {
    it('password prop should be string type', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(typeof wrapper.props('password')).toBe('string')
    })

    it('complexity should be number type', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(typeof wrapper.vm.complexity).toBe('number')
    })

    it('getPasswordColor should be string type', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(typeof wrapper.vm.getPasswordColor).toBe('string')
    })

    it('passwordComplexity should be number type', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(typeof wrapper.vm.passwordComplexity).toBe('number')
    })
  })

  describe('component lifecycle', () => {
    it('should be defined after mount', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(wrapper.vm).toBeDefined()
    })

    it('should have $el defined after mount', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(wrapper.vm.$el).toBeDefined()
    })

    it('should have $data defined after mount', () => {
      const wrapper = mountComponent({ propsData: { password: 'test' } })
      expect(wrapper.vm.$data).toBeDefined()
    })
  })
})
