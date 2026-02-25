import TestInputIpAddresses from '@/components/TestHelpers/TestInputIpAddresses.vue'

describe('TestInputIpAddresses.vue', () => {
  it('data returns value and rules', () => {
    const data = TestInputIpAddresses.data()
    expect(data.value).toBe('')
    expect(data.rules).toBeDefined()
    expect(Array.isArray(data.rules)).toBe(true)
  })
})
