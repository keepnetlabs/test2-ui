import permissions from '@/permissions/index'

describe('permissions/index.js', () => {
  it('exports default object with permission groups', () => {
    expect(permissions).toBeDefined()
    expect(typeof permissions).toBe('object')
  })

  it('has DASHBOARD_PERMISSIONS', () => {
    expect(permissions.DASHBOARD_PERMISSIONS).toBeDefined()
    expect(permissions.DASHBOARD_PERMISSIONS.WIDGETS).toMatchObject({
      url: expect.any(String),
      hasPermission: false,
      method: expect.any(String)
    })
  })

  it('has SMISHING_CAMPAIGN_MANAGER_PERMISSIONS', () => {
    expect(permissions.SMISHING_CAMPAIGN_MANAGER_PERMISSIONS).toBeDefined()
    expect(permissions.SMISHING_CAMPAIGN_MANAGER_PERMISSIONS.SEARCH).toMatchObject({
      url: expect.stringContaining('smishing-campaign'),
      hasPermission: false
    })
  })

  it('has PHISHING_SIMULATOR_LEFT_MENU_PERMISSIONS', () => {
    expect(permissions.PHISHING_SIMULATOR_LEFT_MENU_PERMISSIONS).toBeDefined()
  })

  it('has CAMPAIGN_MANAGER_PARENT with SEARCH and CREATE', () => {
    expect(permissions.CAMPAIGN_MANAGER_PARENT.SEARCH).toBeDefined()
    expect(permissions.CAMPAIGN_MANAGER_PARENT.CREATE).toBeDefined()
  })
})
