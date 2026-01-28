import { createLocalVue } from '@vue/test-utils'
import MFACantLogin from '../Objects/MFACantLogin'
import { wait } from '../utils'

describe('MFA Cant Login component', () => {
  const localVue = createLocalVue()
  it('Check render', () => {
    const { wrapper } = new MFACantLogin(localVue)

    //check render
    expect(wrapper.find('.mfa-cant-login').exists()).toBe(true)

    //check title
    expect(wrapper.find('.login-title').text()).toContain('Login with SMS Authentication')

    //check subtitle

    expect(wrapper.find('.login-desc').text()).toContain('An SMS with verification code is sent to')

    //checking input
    expect(wrapper.find('input').exists()).toBeTruthy()

    //checking countDown
    expect(wrapper.find('#text--login-countdown').exists()).toBeTruthy()

    //checking Continue button
    expect(wrapper.find('button').text()).toContain('CONTINUE')
  })

  it('Check actions and props', async () => {
    const { wrapper } = new MFACantLogin(localVue)
    //clicking checkbox
    const checkbox = wrapper.find('.v-input__control .v-input__slot')
    await checkbox.trigger('click')
    //chechking resend sms
    await wait(2000)
    const countdownText = wrapper.find('#text--login-countdown').text()
    // Check if countdown is within expected range (00:56-00:58) to handle timing variability
    expect(['00:56', '00:57', '00:58'].some(time => countdownText.includes(time))).toBe(true)
    //clicking button
    const button = wrapper.find('.v-card__actions button')
    await button.trigger('click')
    //checking is event throwed
    const emittedEvent = wrapper.emitted()['verificationCodeLogin']
    expect(emittedEvent.length).toBe(1)

    //checking event
    expect(emittedEvent[0]).toStrictEqual([true, '', false])
  })

  it('displays SMS verification information', () => {
    const { wrapper } = new MFACantLogin(localVue)
    expect(wrapper.find('.login-title').text()).toContain('Login with SMS Authentication')
    expect(wrapper.find('.login-desc').text()).toContain('An SMS with verification code is sent to')
  })

  it('has input field for verification code', () => {
    const { wrapper } = new MFACantLogin(localVue)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('displays countdown timer', () => {
    const { wrapper } = new MFACantLogin(localVue)
    expect(wrapper.find('#text--login-countdown').exists()).toBe(true)
  })

  it('continue button is visible and functional', () => {
    const { wrapper } = new MFACantLogin(localVue)
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('CONTINUE')
  })
})
