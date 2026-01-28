import { createLocalVue } from '@vue/test-utils'
import PasswordChecker from '../Objects/PasswordChecker'

describe('PasswordChecker component', () => {
  const localVue = createLocalVue()
  it('Check renders', () => {
    const { wrapper } = new PasswordChecker(localVue)
    //checking render
    expect(wrapper.find('.password-complexity').exists()).toBeTruthy()
    //checking label
    expect(wrapper.find('.password-complexity__content-label').text()).toContain(
      'Password strength:'
    )
    //checking default
    expect(wrapper.find('.password-complexity__content-checker--group').exists()).toBeTruthy()
  })

  it('Check actions and props', async () => {
    const { wrapper } = new PasswordChecker(localVue)
    //default is Very Weak
    expect(wrapper.text()).toContain('Very Weak')
    //entering weak password
    await wrapper.setProps({ password: 'asksa1skaskask' })
    //checking is text weak
    expect(wrapper.text()).toContain('Weak')
    //entering medium password
    await wrapper.setProps({ password: '11sksa11a1skaskask' })
    expect(wrapper.text()).toContain('Medium')
    //entering strong password
    await wrapper.setProps({ password: '11sksASKAKa11a1skaskask' })
    expect(wrapper.text()).toContain('Strong')
    //entering very strong password
    await wrapper.setProps({ password: '11sks#@AS@KA#Ka11a1skaskask' })
    expect(wrapper.text()).toContain('Very Strong')
  })

  it('Displays correct UI elements', () => {
    const { wrapper } = new PasswordChecker(localVue)
    expect(wrapper.find('.password-complexity').exists()).toBeTruthy()
    expect(wrapper.find('.password-complexity__content-label').exists()).toBeTruthy()
    expect(wrapper.find('.password-complexity__content-checker--group').exists()).toBeTruthy()
  })

  it('Updates strength indicator on password change', async () => {
    const { wrapper } = new PasswordChecker(localVue)
    const initialText = wrapper.text()
    expect(initialText).toContain('Very Weak')

    await wrapper.setProps({ password: 'TestPassword123!' })
    const updatedText = wrapper.text()
    expect(updatedText).not.toContain('Very Weak')
  })

  it('Handles empty password correctly', async () => {
    const { wrapper } = new PasswordChecker(localVue)
    await wrapper.setProps({ password: '' })
    expect(wrapper.text()).toContain('Very Weak')
  })

  it('Password strength indicators are visually distinct', async () => {
    const { wrapper } = new PasswordChecker(localVue)
    const initialStrength = wrapper.find('.password-complexity__content-checker--group')
    expect(initialStrength.exists()).toBeTruthy()

    await wrapper.setProps({ password: 'StrongPass123!@' })
    expect(wrapper.find('.password-complexity__content-checker--group').exists()).toBeTruthy()
  })
})
