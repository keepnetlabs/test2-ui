import {
  buildNavigationActions,
  buildCommandActions,
  buildFilterActions,
  buildSettingsActions,
  buildAccountActions,
  buildHelpActions,
  buildRecentActions
} from '@/utils/commandPaletteActions'

// Minimal fixture mirroring the real router shape: a few public routes plus
// the authenticated Main route with nested children.
const makeRoutes = () => [
  { path: '/login', name: 'login', meta: { isAuthenticated: false } },
  {
    path: '/',
    children: [
      { path: '/', name: 'Dashboard', meta: { isAuthenticated: true } },
      {
        path: '/phishing-simulator',
        name: 'Phishing Simulator',
        meta: {
          isAuthenticated: true,
          parentName: 'Dashboard',
          permissionStoreKey: 'permissions/getPhishingSimulatorLeftMenuPermissions'
        }
      },
      {
        path: '/phishing-simulator/campaign-manager',
        name: 'Campaign Manager',
        meta: {
          isAuthenticated: true,
          parentName: 'Phishing Simulator',
          permissionStoreKey: 'permissions/getCampaignManagerLeftMenuPermissions'
        }
      },
      {
        path: '/vishing',
        name: 'Vishing Simulator',
        meta: {
          isAuthenticated: true,
          parentName: 'Dashboard',
          permissionStoreKey: 'permissions/getVishingLeftMenuPermissions'
        }
      },
      {
        path: '/vishing/vishing-templates',
        name: 'Vishing Templates',
        meta: {
          isAuthenticated: true,
          parentName: 'Vishing Simulator',
          permissionStoreKey: 'permissions/getVishingTemplatesLeftMenuPermissions'
        }
      },
      {
        // Detail page with a dynamic param — must be excluded.
        path: '/reports/campaign-reports/campaign-report/:id/:instanceGroup',
        name: 'Campaign Report',
        meta: {
          isAuthenticated: true,
          parentName: 'Campaign Reports',
          permissionStoreKey: 'permissions/getReportsLeftMenuPermissions'
        }
      },
      {
        path: '/awareness-educator',
        name: 'Awareness Educator',
        meta: { isAuthenticated: true, parentName: 'Dashboard' },
        children: [
          {
            // Relative child path — router.push('training-library') would
            // mis-resolve; the palette must navigate by name instead.
            path: 'training-library',
            name: 'Training Library',
            meta: { isAuthenticated: true, parentName: 'Awareness Educator' }
          }
        ]
      },
      {
        path: '/callback-simulator',
        name: 'Callback Simulator',
        meta: {
          isAuthenticated: true,
          parentName: 'Dashboard',
          permissionStoreKey: 'permissions/getCallbackSimulatorLeftMenuPermissions'
        }
      },
      {
        // Forbidden by permission gate — must be excluded.
        path: '/company',
        name: 'Company',
        meta: {
          isAuthenticated: true,
          parentName: 'Dashboard',
          permissionStoreKey: 'permissions/getCompanyLeftMenuPermissions'
        }
      }
    ]
  },
  { path: '*', redirect: '/' }
]

// Store that grants everything except the Company menu.
const makeStore = () => ({
  getters: {
    'permissions/getPhishingSimulatorLeftMenuPermissions': true,
    'permissions/getCampaignManagerLeftMenuPermissions': true,
    'permissions/getVishingLeftMenuPermissions': true,
    'permissions/getVishingTemplatesLeftMenuPermissions': true,
    'permissions/getReportsLeftMenuPermissions': true,
    'permissions/getCallbackSimulatorLeftMenuPermissions': true,
    'permissions/getCompanyLeftMenuPermissions': false,
    // Campaign-manager permissions for command actions:
    'permissions/getSmishingCampaignManagerLeftMenuPermissions': true,
    'permissions/getCallbackCampaignManagerLeftMenuPermissions': true,
    'permissions/getQuishingCampaignManagerLeftMenuPermissions': false,
    'permissions/getInvestigationsSearchPermission': true,
    // Company-settings tab permissions for settings deep-links:
    'permissions/getSMTPSettingsSearchPermissions': true,
    'permissions/getSAMLIntegrationSearchPermissions': true,
    'permissions/getLDAPDetailPermission': false,
    'login/getHasAgenticAILicense': false
  }
})

const titles = actions => actions.map(a => a.title)

describe('commandPaletteActions', () => {
  it('includes Dashboard even without a permission key', () => {
    const actions = buildNavigationActions(makeRoutes(), makeStore(), () => {})
    expect(titles(actions)).toContain('Dashboard')
  })

  it('uses route name for both id and title', () => {
    const actions = buildNavigationActions(makeRoutes(), makeStore(), () => {})
    const phishing = actions.find(a => a.title === 'Phishing Simulator')
    expect(phishing).toBeDefined()
    expect(phishing.id).toBe('Phishing Simulator')
  })

  it('excludes public (non-authenticated) routes', () => {
    const actions = buildNavigationActions(makeRoutes(), makeStore(), () => {})
    expect(titles(actions)).not.toContain('login')
  })

  it('excludes routes with dynamic params', () => {
    const actions = buildNavigationActions(makeRoutes(), makeStore(), () => {})
    expect(titles(actions)).not.toContain('Campaign Report')
  })

  it('excludes pages the user has no permission for', () => {
    const actions = buildNavigationActions(makeRoutes(), makeStore(), () => {})
    expect(titles(actions)).not.toContain('Company')
  })

  it('includes relative-path nested children and navigates them by name', () => {
    const navigate = jest.fn()
    const actions = buildNavigationActions(makeRoutes(), makeStore(), navigate)
    const lib = actions.find(a => a.title === 'Training Library')
    expect(lib).toBeDefined()
    expect(lib.section).toBe('Awareness Educator')
    lib.handler()
    expect(navigate).toHaveBeenCalledWith({ name: 'Training Library' })
  })

  it('enriches keywords with the area and intent synonyms for search', () => {
    const actions = buildNavigationActions(makeRoutes(), makeStore(), () => {})
    const campaign = actions.find(a => a.title === 'Campaign Manager')
    // Area name in keywords → typing "phishing" surfaces nested pages.
    expect(campaign.keywords).toContain('Phishing Simulator')
    // Path is still part of keywords.
    expect(campaign.keywords).toContain('/phishing-simulator/campaign-manager')
    // Intent synonyms: "courses" should find the Training Library.
    const lib = actions.find(a => a.title === 'Training Library')
    expect(lib.keywords).toContain('courses')
  })

  it('groups pages under their top-level area via section', () => {
    const actions = buildNavigationActions(makeRoutes(), makeStore(), () => {})
    const templates = actions.find(a => a.title === 'Vishing Templates')
    expect(templates.section).toBe('Vishing Simulator')
    const campaign = actions.find(a => a.title === 'Campaign Manager')
    expect(campaign.section).toBe('Phishing Simulator')
  })

  it('puts Dashboard first in the sorted result', () => {
    const actions = buildNavigationActions(makeRoutes(), makeStore(), () => {})
    expect(actions[0].title).toBe('Dashboard')
  })

  it('handler navigates by route name (avoids relative-path mis-resolution)', () => {
    const navigate = jest.fn()
    const actions = buildNavigationActions(makeRoutes(), makeStore(), navigate)
    actions.find(a => a.title === 'Campaign Manager').handler()
    expect(navigate).toHaveBeenCalledWith({ name: 'Campaign Manager' })
  })

  it('renders an inline svg icon for each action', () => {
    const actions = buildNavigationActions(makeRoutes(), makeStore(), () => {})
    actions.forEach(a => {
      expect(typeof a.icon).toBe('string')
      expect(a.icon).toContain('<svg')
    })
  })

  it('uses the verbatim custom SVG (not an mdi path) for custom-icon areas', () => {
    const actions = buildNavigationActions(makeRoutes(), makeStore(), () => {})
    const callback = actions.find(a => a.title === 'Callback Simulator')
    // The embedded Callback glyph carries this distinctive sub-path.
    expect(callback.icon).toContain('M18.3333 14.2083')
  })

  describe('buildCommandActions', () => {
    it('lists permitted actions under the "Actions" section', () => {
      const actions = buildCommandActions(makeStore(), () => {})
      const t = titles(actions)
      expect(t).toContain('Create phishing campaign')
      expect(t).toContain('Create smishing campaign')
      expect(t).toContain('Create callback campaign')
      expect(t).toContain('Create executive report')
      expect(t).toContain('Start investigation')
      actions.forEach(a => expect(a.section).toBe('Actions'))
    })

    it('hides actions the user lacks permission for', () => {
      const actions = buildCommandActions(makeStore(), () => {})
      // getQuishingCampaignManagerLeftMenuPermissions is false in the fixture.
      expect(titles(actions)).not.toContain('Create quishing campaign')
    })

    it('handler navigates to the create flow (opens the add modal via query)', () => {
      const navigate = jest.fn()
      const actions = buildCommandActions(makeStore(), navigate)
      actions.find(a => a.title === 'Create phishing campaign').handler()
      expect(navigate).toHaveBeenCalledWith(
        '/phishing-simulator/campaign-manager?status=create'
      )
    })

    it('returns nothing when the store grants no permissions', () => {
      expect(buildCommandActions(undefined, () => {})).toEqual([])
    })
  })

  describe('buildFilterActions', () => {
    it('lists permitted simulator filter presets under the "Filters" section', () => {
      const actions = buildFilterActions(makeStore(), () => {})
      const t = actions.map(a => a.title)
      // Phishing / Smishing / Callback are permitted in the fixture.
      expect(t).toContain('Show running phishing campaigns')
      expect(t).toContain('Show completed smishing campaigns')
      expect(t).toContain('Show running callback campaigns')
      expect(t).toContain('Show running investigations')
      actions.forEach(a => expect(a.section).toBe('Filters'))
    })

    it('hides presets for a simulator the user cannot access', () => {
      // getQuishingCampaignManagerLeftMenuPermissions is false in the fixture.
      const t = buildFilterActions(makeStore(), () => {}).map(a => a.title)
      expect(t).not.toContain('Show running quishing campaigns')
    })

    it('handler navigates with the ?filterStatus query', () => {
      const navigate = jest.fn()
      const actions = buildFilterActions(makeStore(), navigate)
      actions.find(a => a.title === 'Show running phishing campaigns').handler()
      expect(navigate).toHaveBeenCalledWith(
        '/phishing-simulator/campaign-manager?filterStatus=Running'
      )
    })

    it('returns [] when no campaign-manager permissions are granted', () => {
      expect(buildFilterActions({ getters: {} }, () => {})).toEqual([])
    })
  })

  describe('buildRecentActions', () => {
    const recent = (names, currentName) =>
      buildRecentActions(makeRoutes(), makeStore(), () => {}, {
        recentNames: names,
        currentName
      })

    it('builds recent pages newest-first under the "Recent" section', () => {
      const actions = recent(['Campaign Manager', 'Phishing Simulator'])
      expect(actions.map(a => a.title)).toEqual([
        'Campaign Manager',
        'Phishing Simulator'
      ])
      actions.forEach(a => expect(a.section).toBe('Recent'))
    })

    it('prefixes ids so they do not collide with navigation entries', () => {
      const actions = recent(['Phishing Simulator'])
      expect(actions[0].id).toBe('recent:Phishing Simulator')
    })

    it('skips the page the user is currently on', () => {
      const actions = recent(['Phishing Simulator', 'Campaign Manager'], 'Phishing Simulator')
      expect(actions.map(a => a.title)).toEqual(['Campaign Manager'])
    })

    it('drops names that no longer resolve to a navigable, permitted page', () => {
      const actions = recent(['Deleted Page', 'Company', 'Campaign Manager'])
      // 'Deleted Page' does not exist; 'Company' is permission-denied.
      expect(actions.map(a => a.title)).toEqual(['Campaign Manager'])
    })

    it('handler navigates by route name', () => {
      const navigate = jest.fn()
      const actions = buildRecentActions(makeRoutes(), makeStore(), navigate, {
        recentNames: ['Campaign Manager']
      })
      actions[0].handler()
      expect(navigate).toHaveBeenCalledWith({ name: 'Campaign Manager' })
    })

    it('returns [] when there are no recent names', () => {
      expect(recent([])).toEqual([])
    })
  })

  describe('buildSettingsActions', () => {
    it('lists permitted settings tabs under the "Settings" section', () => {
      const actions = buildSettingsActions(makeStore(), () => {})
      const t = actions.map(a => a.title)
      expect(t).toContain('Open SMTP settings')
      expect(t).toContain('Open SAML settings')
      actions.forEach(a => expect(a.section).toBe('Settings'))
    })

    it('hides tabs the user lacks permission for', () => {
      const t = buildSettingsActions(makeStore(), () => {}).map(a => a.title)
      // getLDAPDetailPermission and the Agentic AI license are false.
      expect(t).not.toContain('Open LDAP settings')
      expect(t).not.toContain('Open Agentic AI settings')
    })

    it('handler deep-links to the company-settings tab via ?tab=', () => {
      const navigate = jest.fn()
      const actions = buildSettingsActions(makeStore(), navigate)
      actions.find(a => a.title === 'Open SMTP settings').handler()
      expect(navigate).toHaveBeenCalledWith(
        '/company/company-settings?tab=smtp-settings'
      )
    })

    it('ids are namespaced under "settings-"', () => {
      buildSettingsActions(makeStore(), () => {}).forEach(a =>
        expect(a.id.startsWith('settings-')).toBe(true)
      )
    })

    it('returns [] when no settings permissions are granted', () => {
      expect(buildSettingsActions({ getters: {} }, () => {})).toEqual([])
    })
  })

  describe('buildAccountActions', () => {
    it('lists the always-available account commands under "Account"', () => {
      const actions = buildAccountActions(() => {})
      const t = actions.map(a => a.title)
      expect(t).toContain('Open settings')
      expect(t).toContain('Change password')
      expect(t).toContain('Log out')
      actions.forEach(a => expect(a.section).toBe('Account'))
    })

    it('hides switch-company / return-to-main-account by default', () => {
      const t = buildAccountActions(() => {}).map(a => a.title)
      expect(t).not.toContain('Switch company')
      expect(t).not.toContain('Return to main account')
    })

    it('shows the conditional commands when their flags are set', () => {
      const t = buildAccountActions(() => {}, {
        canSwitchCompany: true,
        canReturnToMainAccount: true
      }).map(a => a.title)
      expect(t).toContain('Switch company')
      expect(t).toContain('Return to main account')
    })

    it('handler dispatches the dropdown value to the host callback', () => {
      const run = jest.fn()
      const actions = buildAccountActions(run)
      actions.find(a => a.title === 'Log out').handler()
      expect(run).toHaveBeenCalledWith('logout')
      actions.find(a => a.title === 'Open settings').handler()
      expect(run).toHaveBeenCalledWith('changeSettings')
    })

    it('ids are namespaced so they cannot collide with other sections', () => {
      buildAccountActions(() => {}, {
        canSwitchCompany: true,
        canReturnToMainAccount: true
      }).forEach(a => expect(a.id.startsWith('account-')).toBe(true))
    })

    it('returns [] when no dispatcher is provided', () => {
      expect(buildAccountActions(undefined)).toEqual([])
      expect(buildAccountActions(null, { canSwitchCompany: true })).toEqual([])
    })
  })

  describe('buildHelpActions', () => {
    it('lists documentation by default under the "Help" section', () => {
      const actions = buildHelpActions(() => {})
      const t = actions.map(a => a.title)
      expect(t).toContain('Open documentation')
      // No support e-mail configured, so support is omitted.
      expect(t).not.toContain('Contact support')
      actions.forEach(a => expect(a.section).toBe('Help'))
    })

    it('hides documentation when the whitelabel gate is off', () => {
      const t = buildHelpActions(() => {}, { documentationEnabled: false }).map(
        a => a.title
      )
      expect(t).not.toContain('Open documentation')
    })

    it('adds "Contact support" only when a support e-mail is set', () => {
      const t = buildHelpActions(() => {}, {
        supportEmail: 'help@acme.test'
      }).map(a => a.title)
      expect(t).toContain('Contact support')
    })

    it('documentation handler opens the docs portal URL', () => {
      const openUrl = jest.fn()
      buildHelpActions(openUrl)
        .find(a => a.title === 'Open documentation')
        .handler()
      expect(openUrl).toHaveBeenCalledWith('https://doc.keepnetlabs.com')
    })

    it('support handler opens a mailto for the configured address', () => {
      const openUrl = jest.fn()
      buildHelpActions(openUrl, { supportEmail: 'help@acme.test' })
        .find(a => a.title === 'Contact support')
        .handler()
      expect(openUrl).toHaveBeenCalledWith('mailto:help@acme.test')
    })

    it('ids are namespaced under "help-"', () => {
      buildHelpActions(() => {}, { supportEmail: 'x@y.z' }).forEach(a =>
        expect(a.id.startsWith('help-')).toBe(true)
      )
    })

    it('returns [] when no opener is provided', () => {
      expect(buildHelpActions(undefined, { supportEmail: 'x@y.z' })).toEqual([])
    })
  })

  it('treats a falsy store defensively (only permission-free pages survive)', () => {
    const actions = buildNavigationActions(makeRoutes(), undefined, () => {})
    // Dashboard has no permission key, so it must remain.
    expect(titles(actions)).toContain('Dashboard')
    // Everything gated behind a permission key drops out.
    expect(titles(actions)).not.toContain('Phishing Simulator')
  })
})
