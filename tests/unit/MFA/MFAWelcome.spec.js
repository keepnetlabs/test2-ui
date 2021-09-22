import { createLocalVue } from '@vue/test-utils'
import MFAWelcome from '../Objects/MFAWelcome'

describe('MFA Setup component', () => {
  const localVue = createLocalVue()
  it('Check render', () => {
    const { wrapper } = new MFAWelcome(localVue)
    //check is rendering
    expect(wrapper.find('.mfa-welcome').exists()).toBeTruthy()
    //checking title
    expect(wrapper.find('.login-title').text()).toContain('Setup Multi-factor Authentication')
    //checking subtitle
    expect(wrapper.text()).toContain('You must enable multi-factor')
    //checking button
    expect(wrapper.find('button').exists()).toBeTruthy()
  })

  it('Check props and actions', async () => {
    const { wrapper } = new MFAWelcome(localVue)
    const button = wrapper.find('button')
    await button.trigger('click')
    //checking event
    const emittedEvent = wrapper.emitted()['setupMFA']
    expect(emittedEvent.length).toBe(1)
    //checking value
    expect(emittedEvent[0][0]).toStrictEqual(undefined)
  })
})
