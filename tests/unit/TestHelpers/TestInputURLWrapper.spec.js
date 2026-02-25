import TestInputURLWrapper from '@/components/TestHelpers/TestInputURLWrapper.vue'

describe('TestInputURLWrapper.vue', () => {
  it('data returns value and rules', () => {
    const data = TestInputURLWrapper.data()
    expect(data.value).toBe('')
    expect(data.rules).toBeDefined()
    expect(Array.isArray(data.rules)).toBe(true)
  })
})
