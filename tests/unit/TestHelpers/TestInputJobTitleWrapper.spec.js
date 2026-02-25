import TestInputJobTitleWrapper from '@/components/TestHelpers/TestInputJobTitleWrapper.vue'

describe('TestInputJobTitleWrapper.vue', () => {
  it('data returns value and rules', () => {
    const data = TestInputJobTitleWrapper.data()
    expect(data.value).toBe('')
    expect(data.rules).toBeDefined()
    expect(Array.isArray(data.rules)).toBe(true)
  })
})
