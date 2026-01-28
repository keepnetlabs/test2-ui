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

  it('displays welcome message', () => {
    const { wrapper } = new MFAWelcome(localVue)
    expect(wrapper.text()).toContain('You must enable multi-factor')
  })

  it('button emits correct event on click', async () => {
    const { wrapper } = new MFAWelcome(localVue)
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(wrapper.emitted()['setupMFA']).toBeTruthy()
  })

  it('has correct CSS classes for styling', () => {
    const { wrapper } = new MFAWelcome(localVue)
    expect(wrapper.find('.mfa-welcome').exists()).toBe(true)
    expect(wrapper.find('.login-title').exists()).toBe(true)
  })

  it('button is visible and enabled', () => {
    const { wrapper } = new MFAWelcome(localVue)
    const button = wrapper.find('button')
    expect(button.isVisible()).toBe(true)
    expect(button.attributes('disabled')).toBeFalsy()
  })

  it('has correct title styling', () => {
    const { wrapper } = new MFAWelcome(localVue)
    const title = wrapper.find('.login-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toContain('Setup Multi-factor Authentication')
  })

  it('displays complete welcome container', () => {
    const { wrapper } = new MFAWelcome(localVue)
    const container = wrapper.find('.mfa-welcome')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('mfa-welcome')
  })

  it('multiple button clicks emit multiple events', async () => {
    const { wrapper } = new MFAWelcome(localVue)
    const button = wrapper.find('button')

    await button.trigger('click')
    await button.trigger('click')
    await button.trigger('click')

    const emittedEvent = wrapper.emitted()['setupMFA']
    expect(emittedEvent.length).toBe(3)
  })
})
