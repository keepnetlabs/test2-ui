import TestInputFirstNameWrapper from '@/components/TestHelpers/TestInputFirstNameWrapper.vue'

describe('TestInputFirstNameWrapper.vue', () => {
  it('data returns value and rules', () => {
    const data = TestInputFirstNameWrapper.data()
    expect(data.value).toBe('')
    expect(data.rules).toBeDefined()
    expect(Array.isArray(data.rules)).toBe(true)
  })
})
