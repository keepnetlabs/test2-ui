import TestInputLastNameWrapper from '@/components/TestHelpers/TestInputLastNameWrapper.vue'

describe('TestInputLastNameWrapper.vue', () => {
  it('data returns value and rules', () => {
    const data = TestInputLastNameWrapper.data()
    expect(data.value).toBe('')
    expect(data.rules).toBeDefined()
    expect(Array.isArray(data.rules)).toBe(true)
  })
})
