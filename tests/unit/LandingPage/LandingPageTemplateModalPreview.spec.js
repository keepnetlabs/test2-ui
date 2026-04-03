jest.mock('@/utils/functions', () => ({
  openHtmlInNewWindow: jest.fn()
}))

jest.mock('@/api/domainBlacklist', () => ({
  getDomainBlacklistStatus: jest.fn().mockResolvedValue({ data: {} })
}))

import LandingPageTemplateModalPreview from '@/components/LandingPage/LandingPageTemplateModalPreview.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import { openHtmlInNewWindow } from '@/utils/functions'
import { getDomainBlacklistStatus } from '@/api/domainBlacklist'

describe('LandingPageTemplateModalPreview.vue', () => {
  const { computed, methods, watch, mounted } = LandingPageTemplateModalPreview

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('computes template presence and template type flags', () => {
    expect(computed.hasLandingPageTemplate.call({ landingPageTemplates: [{ content: 'x' }] })).toBe(
      true
    )
    expect(computed.hasLandingPageTemplate.call({ landingPageTemplates: [] })).toBe(false)
    expect(computed.isPhishing.call({ type: 'phishing' })).toBe(true)
    expect(computed.isQuishing.call({ isQuishingProp: true, type: 'phishing' })).toBe(true)
    expect(
      computed.isQuishing.call({ isQuishingProp: false, type: PREVIEW_DIALOG_TYPES.QUISHING })
    ).toBe(true)
  })

  it('template language row hidden for Quishing or Smishing (!isQuishing && !isSmishingProp)', () => {
    const shouldShow = (ctx) =>
      !computed.isQuishing.call(ctx) && !ctx.isSmishingProp
    expect(shouldShow({ isQuishingProp: true, type: 'phishing', isSmishingProp: false })).toBe(false)
    expect(shouldShow({ isQuishingProp: false, type: PREVIEW_DIALOG_TYPES.QUISHING, isSmishingProp: false })).toBe(
      false
    )
    expect(shouldShow({ isQuishingProp: false, type: 'phishing', isSmishingProp: true })).toBe(false)
    expect(shouldShow({ isQuishingProp: false, type: 'phishing', isSmishingProp: false })).toBe(true)
  })

  it('maps language items and builds language label', () => {
    const languageItems = computed.languageItems.call({
      languages: [{ text: 'English', value: 'en' }, { name: 'Turkish', id: 'tr' }]
    })
    expect(languageItems).toEqual([
      { text: 'English', value: 'en' },
      { text: 'Turkish', value: 'tr' }
    ])

    expect(computed.templateLanguageLabel.call({ languageItems: [{}, {}] })).toBe(
      'Template Languages (2)'
    )
    expect(computed.templateLanguageLabel.call({ languageItems: [{}] })).toBe(
      'Template Language (1)'
    )
  })

  it('returns current landing page template from selected language in phishing type', () => {
    const ctx = {
      landingPageTemplates: [
        {
          content: '<p>fallback</p>',
          languages: {
            en: '<p>English</p>',
            tr: '<p>Turkish</p>'
          }
        }
      ],
      selectedLandingPageIndex: 0,
      selectedLanguageId: 'tr',
      isPhishing: true
    }

    expect(computed.getCurrentLandingPageTemplate.call(ctx)).toBe('<p>Turkish</p>')
  })

  it('falls back to page content when selected language translation is missing', () => {
    const ctx = {
      landingPageTemplates: [
        {
          content: '<p>fallback</p>',
          languages: { en: '<p>English</p>' }
        }
      ],
      selectedLandingPageIndex: 0,
      selectedLanguageId: 'tr',
      isPhishing: true
    }

    expect(computed.getCurrentLandingPageTemplate.call(ctx)).toBe('<p>fallback</p>')
  })

  it('builds preview html by replacing company logo for red flagged template', () => {
    localStorage.setItem('isSelectCompany', 'true')
    const ctx = {
      getCurrentLandingPageTemplate: '<img src="{COMPANYLOGO}" data-redflag />',
      isRedFlaggedTemplate: true,
      $store: {
        state: {
          dashboard: { selectedCompanyObject: { logoUrl: 'https://logo.company/logo.png' } },
          auth: { logoUrl: '' },
          whitelabel: { mainLogoUrl: 'https://logo.main/main.png' }
        }
      }
    }

    expect(computed.previewHtml.call(ctx)).toContain('https://logo.company/logo.png')
    expect(computed.isRedFlaggedTemplate.call(ctx)).toBe(true)
  })

  it('previewHtml uses auth logo then whitelabel logo as fallback', () => {
    localStorage.setItem('isSelectCompany', 'false')
    const authLogoCtx = {
      getCurrentLandingPageTemplate: '<img src="{COMPANYLOGO}" data-redflag />',
      isRedFlaggedTemplate: true,
      $store: {
        state: {
          dashboard: { selectedCompanyObject: { logoUrl: '' } },
          auth: { logoUrl: 'https://logo.auth/logo.png' },
          whitelabel: { mainLogoUrl: 'https://logo.main/main.png' }
        }
      }
    }
    expect(computed.previewHtml.call(authLogoCtx)).toContain('https://logo.auth/logo.png')

    const whiteLabelCtx = {
      ...authLogoCtx,
      $store: {
        state: {
          dashboard: { selectedCompanyObject: { logoUrl: '' } },
          auth: { logoUrl: '' },
          whitelabel: { mainLogoUrl: 'https://logo.main/main.png' }
        }
      }
    }
    expect(computed.previewHtml.call(whiteLabelCtx)).toContain('https://logo.main/main.png')
  })

  it('isRedFlaggedTemplate returns false for non-red-flag html', () => {
    expect(computed.isRedFlaggedTemplate.call({ getCurrentLandingPageTemplate: '<div>x</div>' })).toBe(
      false
    )
  })

  it('watch and mounted set selected language id when empty', () => {
    const watchCtx = { selectedLanguageId: null }
    watch.languages.call(watchCtx, [{ value: 'en', languageTypeResourceId: 'en' }])
    expect(watchCtx.selectedLanguageId).toBe('en')

    const mountedCtx = {
      languages: [{ languageTypeResourceId: 'tr' }],
      selectedLanguageId: null,
      checkDomainBlacklist: jest.fn()
    }
    mounted.call(mountedCtx)
    expect(mountedCtx.selectedLanguageId).toBe('tr')
  })

  it('watch does not override selected language when already set', () => {
    const ctx = { selectedLanguageId: 'en' }
    watch.languages.call(ctx, [{ value: 'tr', languageTypeResourceId: 'tr' }])
    expect(ctx.selectedLanguageId).toBe('en')
  })

  describe('Blacklist Warning', () => {
    it('extractDomain parses full URL correctly', () => {
      const result = methods.extractDomain('https://www.example.com/path?q=1')
      expect(result).toBe('example.com')
    })

    it('extractDomain strips www prefix', () => {
      expect(methods.extractDomain('https://www.test.com')).toBe('test.com')
    })

    it('extractDomain adds https if missing', () => {
      expect(methods.extractDomain('example.com/path')).toBe('example.com')
    })

    it('extractDomain returns null for empty url', () => {
      expect(methods.extractDomain('')).toBeNull()
      expect(methods.extractDomain(null)).toBeNull()
    })

    it('checkDomainBlacklist calls API with extracted domain', () => {
      const ctx = {
        phishingUrl: 'https://www.malicious.com/login.php',
        blacklistWarning: null,
        extractDomain: methods.extractDomain
      }
      getDomainBlacklistStatus.mockResolvedValueOnce({
        data: { status: 'malicious', reason: 'Blocked by browsers' }
      })
      methods.checkDomainBlacklist.call(ctx)
      expect(getDomainBlacklistStatus).toHaveBeenCalledWith('malicious.com')
    })

    it('checkDomainBlacklist sets warning for malicious domain', async () => {
      const ctx = {
        phishingUrl: 'https://bad.com/page',
        blacklistWarning: null,
        extractDomain: methods.extractDomain
      }
      getDomainBlacklistStatus.mockResolvedValueOnce({
        data: { status: 'malicious', reason: 'Blocked by 3 vendors' }
      })
      await methods.checkDomainBlacklist.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blacklistWarning).toEqual({
        status: 'malicious',
        reason: 'Blocked by 3 vendors'
      })
    })

    it('checkDomainBlacklist does not set warning for clean domain', async () => {
      const ctx = {
        phishingUrl: 'https://clean.com/page',
        blacklistWarning: null,
        extractDomain: methods.extractDomain
      }
      getDomainBlacklistStatus.mockResolvedValueOnce({
        data: { status: 'clean', reason: null }
      })
      await methods.checkDomainBlacklist.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blacklistWarning).toBeNull()
    })

    it('checkDomainBlacklist does nothing when phishingUrl is empty', () => {
      const ctx = { phishingUrl: '', blacklistWarning: null, extractDomain: methods.extractDomain }
      methods.checkDomainBlacklist.call(ctx)
      expect(getDomainBlacklistStatus).not.toHaveBeenCalled()
    })

    it('phishingUrl watch resets warning and rechecks', () => {
      const ctx = {
        blacklistWarning: { status: 'malicious', reason: 'test' },
        cleanSuggestions: [],
        checkDomainBlacklist: jest.fn()
      }
      watch.phishingUrl.call(ctx)
      expect(ctx.blacklistWarning).toBeNull()
      expect(ctx.checkDomainBlacklist).toHaveBeenCalled()
    })

    it('checkDomainBlacklist sets warning for suspicious domain', async () => {
      const ctx = {
        phishingUrl: 'https://suspicious.com/page',
        blacklistWarning: null,
        extractDomain: methods.extractDomain
      }
      getDomainBlacklistStatus.mockResolvedValueOnce({
        data: { status: 'suspicious', reason: 'Flagged by 2 vendors' }
      })
      await methods.checkDomainBlacklist.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blacklistWarning.status).toBe('suspicious')
    })

    it('checkDomainBlacklist handles API errors silently', async () => {
      const ctx = {
        phishingUrl: 'https://error.com',
        blacklistWarning: null,
        extractDomain: methods.extractDomain
      }
      getDomainBlacklistStatus.mockRejectedValueOnce(new Error('Network'))
      await methods.checkDomainBlacklist.call(ctx)
      await new Promise((r) => setTimeout(r, 0))
      expect(ctx.blacklistWarning).toBeNull()
    })

    it('extractDomain handles domain with hyphens', () => {
      expect(methods.extractDomain('https://www.global-cloud-llc.com/path')).toBe('global-cloud-llc.com')
    })

    it('extractDomain handles .co TLD', () => {
      expect(methods.extractDomain('https://onlineislem.co/login')).toBe('onlineislem.co')
    })

    it('extractDomain handles invalid URL gracefully', () => {
      expect(methods.extractDomain('not a url %%')).toBeNull()
    })

    it('mounted calls checkDomainBlacklist', () => {
      const ctx = {
        languages: [],
        selectedLanguageId: null,
        checkDomainBlacklist: jest.fn()
      }
      mounted.call(ctx)
      expect(ctx.checkDomainBlacklist).toHaveBeenCalled()
    })
  })

  it('emits language and edit actions, and opens preview in new tab', () => {
    const emit = jest.fn()
    const ctx = {
      previewHtml: '<p>Preview</p>',
      $emit: emit
    }

    methods.handleLanguageChange.call(ctx, 'en')
    methods.handleEdit.call(ctx)
    methods.handleExternalLink.call(ctx)

    expect(emit).toHaveBeenCalledWith('language-change', 'en')
    expect(emit).toHaveBeenCalledWith('edit')
    expect(openHtmlInNewWindow).toHaveBeenCalledWith('<p>Preview</p>')
  })
})
