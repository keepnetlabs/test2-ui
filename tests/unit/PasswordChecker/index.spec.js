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
})
