import { createLocalVue } from '@vue/test-utils'
import MFALogin from '../Objects/MFALogin'

describe('MFA Login component', () => {
  const localVue = createLocalVue()
  it('Check render', () => {
    const { wrapper } = new MFALogin(localVue)
    //checking is rendered
    expect(wrapper.exists()).toBeTruthy()
    //checking title
    const title = wrapper.find('.login-title')
    expect(title.exists()).toBeTruthy()
    expect(title.text()).toContain('Multi-factor Authentication')
    const subtitle = wrapper.find('.login-desc')
    expect(subtitle.exists()).toBeTruthy()
    expect(subtitle.text()).toContain('Please enter your verification code')
    //checking input container
    expect(wrapper.find('.verification-code-wrapper--textfield').exists()).toBeTruthy()
    //checking is input required
    expect(wrapper.find('.v-messages').text()).toContain('*Required')
  })

  it('Check props and actions', async () => {
    const { wrapper } = new MFALogin(localVue)
    //checking is input required
    const input = wrapper.find('input')
    input.element.value = 'custom data'
    await wrapper.setProps({ verificationCode: 'custom data' })
    //clicking login button
    const loginButton = wrapper.find('#btn--login-continue')
    //checking event

    await loginButton.trigger('click')
    //checking is event throwed
    const emittedEvent = wrapper.emitted()['verificationCodeLogin']
    expect(emittedEvent.length).toBe(1)
    //checking event content
    expect(emittedEvent[0]).toStrictEqual([false, 'custom data', false, null])

    //checking on cant login
    const checkboxWrapper = wrapper.find('.verification-code-wrapper__remember')

    expect(checkboxWrapper.exists()).toBeTruthy()
    //clicking checkbox
    await checkboxWrapper.find('.verification-code-wrapper__cant-login').trigger('click')

    const onCantLoginEvent = wrapper.emitted()['onCantLoginButtonClick']
    expect(onCantLoginEvent).toBeTruthy()
  })

  it('has MFA title and description', () => {
    const { wrapper } = new MFALogin(localVue)
    expect(wrapper.find('.login-title').text()).toContain('Multi-factor Authentication')
    expect(wrapper.find('.login-desc').text()).toContain('Please enter your verification code')
  })

  it('verifies input field is present', () => {
    const { wrapper } = new MFALogin(localVue)
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('.verification-code-wrapper--textfield').exists()).toBe(true)
  })

  it('button is clickable and functional', () => {
    const { wrapper } = new MFALogin(localVue)
    const button = wrapper.find('#btn--login-continue')
    expect(button.exists()).toBe(true)
    expect(button.isVisible()).toBe(true)
  })

  it('handles verification code input correctly', async () => {
    const { wrapper } = new MFALogin(localVue)
    const testCode = '123456'
    await wrapper.setProps({ verificationCode: testCode })
    expect(wrapper.vm.$props.verificationCode).toBe(testCode)
  })
})
