import TestInputDepartmentWrapper from '@/components/TestHelpers/TestInputDepartmentWrapper.vue'

describe('TestInputDepartmentWrapper.vue', () => {
  it('data returns value and rules', () => {
    const data = TestInputDepartmentWrapper.data()
    expect(data.value).toBe('')
    expect(data.rules).toBeDefined()
    expect(Array.isArray(data.rules)).toBe(true)
  })
})
