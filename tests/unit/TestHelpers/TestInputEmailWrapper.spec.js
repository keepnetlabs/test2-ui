import TestInputEmailWrapper from '@/components/TestHelpers/TestInputEmailWrapper.vue'

describe('TestInputEmailWrapper.vue', () => {
  it('data returns value and rules', () => {
    const data = TestInputEmailWrapper.data()
    expect(data.value).toBe('')
    expect(data.rules).toBeDefined()
    expect(Array.isArray(data.rules)).toBe(true)
  })
})
