import TestConnectivityStatus from '@/components/Settings/DnsServices/TestConnectivityStatus.vue'

describe('TestConnectivityStatus.vue', () => {
  it('has correct component name', () => {
    expect(TestConnectivityStatus.name).toBe('TestConnectivityStatus')
  })

  it('accepts state and message props', () => {
    expect(TestConnectivityStatus.props.state).toBeDefined()
    expect(TestConnectivityStatus.props.state.required).toBe(true)
    expect(TestConnectivityStatus.props.message).toBeDefined()
  })
})
