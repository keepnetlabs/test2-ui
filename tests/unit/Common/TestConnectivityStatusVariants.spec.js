import { shallowMount } from '@vue/test-utils'
import MailConnectivityStatus from '@/components/MailConfiguration/TestConnectivityStatus'
import SettingsDnsConnectivityStatus from '@/components/Settings/DnsServices/TestConnectivityStatus'
import SmishingDnsConnectivityStatus from '@/components/SmishingSettings/DnsServices/TestConnectivityStatus'
import QuishingDnsConnectivityStatus from '@/components/QuishingSettings/DnsServices/TestConnectivityStatus'

const assertCommonStates = (Component) => {
  const loadingWrapper = shallowMount(Component, {
    propsData: { state: 'loading' }
  })
  expect(loadingWrapper.text()).toContain('...')

  const errorWrapper = shallowMount(Component, {
    propsData: { state: 'error', message: 'Failed' }
  })
  expect(errorWrapper.text()).toContain('Failed')
}

describe('TestConnectivityStatus variants', () => {
  it('MailConfiguration variant renders loading/error/success states', () => {
    assertCommonStates(MailConnectivityStatus)

    const successWrapper = shallowMount(MailConnectivityStatus, {
      propsData: { state: 'success', message: 'Connected' }
    })
    expect(successWrapper.text()).not.toContain('Connected')
  })

  it('Settings DNS variant renders loading/error/success states', () => {
    assertCommonStates(SettingsDnsConnectivityStatus)

    const successWrapper = shallowMount(SettingsDnsConnectivityStatus, {
      propsData: { state: 'success', message: 'Connected' }
    })
    expect(successWrapper.text()).toContain('Connected')
  })

  it('Smishing DNS variant renders loading/error/success states', () => {
    assertCommonStates(SmishingDnsConnectivityStatus)

    const successWrapper = shallowMount(SmishingDnsConnectivityStatus, {
      propsData: { state: 'success', message: 'Connected' }
    })
    expect(successWrapper.text()).toContain('Connected')
  })

  it('Quishing DNS variant renders loading/error/success states', () => {
    assertCommonStates(QuishingDnsConnectivityStatus)

    const successWrapper = shallowMount(QuishingDnsConnectivityStatus, {
      propsData: { state: 'success', message: 'Connected' }
    })
    expect(successWrapper.text()).toContain('Connected')
  })
})

