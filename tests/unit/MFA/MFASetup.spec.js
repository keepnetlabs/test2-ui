import { createLocalVue } from '@vue/test-utils'
import MFASetup from '../Objects/MFASetup'

describe('MFA Setup component', () => {
  const localVue = createLocalVue()
  it('Check render', () => {
    const { wrapper } = new MFASetup(localVue)
    //check renders container
    expect(wrapper.find('.mfa-setup--dashboard').exists()).toBe(true)
    //checking content header
    expect(wrapper.find('.mfa-setup__content--header').text()).toContain(
      '1. Install an MFA app on your mobile device'
    )
    //checking sub text
    expect(wrapper.find('.mfa-setup__content--text').text()).toContain(
      'Compatible MFA applications to login with:'
    )
    expect(wrapper.text()).toContain(
      '2. Scan the QR code with your device’s camera using your virtual MFA app'
    )
    expect(wrapper.text()).toContain('3. Enter MFA code')
  })

  it('Check props and actions', async () => {
    const { wrapper } = new MFASetup(localVue)
    await wrapper.setProps({
      mfaSetupDetails: {
        manualEntryKey: 'i am custom manualEntryKey'
      }
    })
    //expecting manual entry key to be rendered
    expect(wrapper.text()).toContain('i am custom manualEntryKey')
    //checking is required
    expect(wrapper.find('.v-messages').text()).toContain('*Required')
    //changing isLogin
    await wrapper.setProps({
      isLogin: true
    })
    const submitButton = wrapper.find('#btn-setup--mfa-dashboard-popup')
    expect(submitButton.exists()).toBeTruthy()

    const input = wrapper.find('#input--login-mfa-code')
    input.find('input').element.value = 'custom'
    await input.trigger('keyup', { enterKey: true })
    await submitButton.trigger('click')

    //checking event
    const emittedEvent = wrapper.emitted()['confirmSetupMFA']
    expect(emittedEvent.length).toBe(1)

    expect(emittedEvent[0][0]).toBe(null)

    //adding mfa code
    await wrapper.setData({ mfaCode: 'asas' })
    await submitButton.trigger('click')
    expect(emittedEvent[1][0]).toBe('asas')
  })
})
