import TestConnectivityStatus from '@/components/SmishingSettings/DnsServices/TestConnectivityStatus.vue'

describe('SmishingSettings TestConnectivityStatus.vue', () => {
  it('has correct component name', () => {
    expect(TestConnectivityStatus.name).toBe('TestConnectivityStatus')
  })

  it('accepts state and message props', () => {
    expect(TestConnectivityStatus.props.state).toBeDefined()
    expect(TestConnectivityStatus.props.message).toBeDefined()
  })
})
