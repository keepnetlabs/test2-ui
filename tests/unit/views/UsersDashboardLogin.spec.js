import UsersDashboardLogin from '@/views/UsersDashboardLogin.vue'

describe('UsersDashboardLogin.vue', () => {
  it('has correct component name', () => {
    expect(UsersDashboardLogin.name).toBe('UsersDashboardLogin')
  })

  it('has data and methods', () => {
    expect(UsersDashboardLogin.data).toBeDefined()
    expect(UsersDashboardLogin.methods).toBeDefined()
  })
})
