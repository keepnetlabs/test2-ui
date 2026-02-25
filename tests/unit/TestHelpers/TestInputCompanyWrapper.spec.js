jest.mock('@/components/TestHelpers/TestFormWrapper', () => ({
  name: 'TestFormWrapper',
  template: '<div><slot /></div>'
}))

import TestInputCompanyWrapper from '@/components/TestHelpers/TestInputCompanyWrapper.vue'

describe('TestInputCompanyWrapper.vue', () => {
  it('data returns value and rules', () => {
    const data = TestInputCompanyWrapper.data()
    expect(data.value).toBe('')
    expect(data.rules).toBeDefined()
    expect(Array.isArray(data.rules)).toBe(true)
  })
})
