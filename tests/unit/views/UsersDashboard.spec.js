import UsersDashboard from '@/views/UsersDashboard.vue'

describe('UsersDashboard.vue', () => {
  it('welcomeTitle uses user name when available and falls back to User', () => {
    const withName = {
      labels: { welcomeTitle: jest.fn((name) => `Welcome ${name}`), welcomeDescription: 'Desc' },
      userInfo: { name: 'Alice' }
    }

    expect(UsersDashboard.computed.welcomeTitle.call(withName)).toBe('Welcome Alice')
    expect(withName.labels.welcomeTitle).toHaveBeenCalledWith('Alice')

    const withoutName = {
      labels: { welcomeTitle: jest.fn((name) => `Welcome ${name}`), welcomeDescription: 'Desc' },
      userInfo: { name: '' }
    }

    expect(UsersDashboard.computed.welcomeTitle.call(withoutName)).toBe('Welcome User')
    expect(withoutName.labels.welcomeTitle).toHaveBeenCalledWith('User')
  })

  it('welcomeDescription returns label description', () => {
    const ctx = {
      labels: { welcomeDescription: 'Security training overview' }
    }

    expect(UsersDashboard.computed.welcomeDescription.call(ctx)).toBe('Security training overview')
  })

  it('created dispatches initialization and dashboard fetch actions', () => {
    const dispatch = jest.fn()
    const ctx = {
      $store: { dispatch }
    }

    UsersDashboard.created.call(ctx)

    expect(dispatch).toHaveBeenCalledWith('usersDashboard/initializeFromStorage')
    expect(dispatch).toHaveBeenCalledWith('usersDashboard/fetchUserInfo')
    expect(dispatch).toHaveBeenCalledWith('usersDashboard/fetchTopPerformance')
    expect(dispatch).toHaveBeenCalledWith('usersDashboard/fetchMyLearning')
    expect(dispatch).toHaveBeenCalledWith('usersDashboard/fetchMyCertificates')
    expect(dispatch).toHaveBeenCalledWith('usersDashboard/fetchMyBadges')
    expect(dispatch).toHaveBeenCalledTimes(6)
  })
})
