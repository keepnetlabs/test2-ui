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
    expect(wrapper.find('#text--login-countdown').text()).toContain('00:57')
    //clicking button
    const button = wrapper.find('.v-card__actions button')
    await button.trigger('click')
    //checking is event throwed
    const emittedEvent = wrapper.emitted()['verificationCodeLogin']
    expect(emittedEvent.length).toBe(1)

    //checking event
    expect(emittedEvent[0]).toStrictEqual([true, '', false])
  })
})
