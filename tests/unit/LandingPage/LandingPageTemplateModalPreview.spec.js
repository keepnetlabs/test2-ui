jest.mock('@/utils/functions', () => ({
  openHtmlInNewWindow: jest.fn()
}))

import LandingPageTemplateModalPreview from '@/components/LandingPage/LandingPageTemplateModalPreview.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import { openHtmlInNewWindow } from '@/utils/functions'

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

  it('watch and mounted set selected language id when empty', () => {
    const watchCtx = { selectedLanguageId: null }
    watch.languages.call(watchCtx, [{ value: 'en', languageTypeResourceId: 'en' }])
    expect(watchCtx.selectedLanguageId).toBe('en')

    const mountedCtx = {
      languages: [{ languageTypeResourceId: 'tr' }],
      selectedLanguageId: null
    }
    mounted.call(mountedCtx)
    expect(mountedCtx.selectedLanguageId).toBe('tr')
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
