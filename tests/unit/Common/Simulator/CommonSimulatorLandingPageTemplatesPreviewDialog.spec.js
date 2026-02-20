import CommonSimulatorLandingPageTemplatesPreviewDialog from '@/components/Common/Simulator/LandingPageTemplates/CommonSimulatorLandingPageTemplatesPreviewDialog.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CommonSimulatorLandingPageTemplatesPreviewDialog.vue', () => {
  it('computes navigation drawer class with nested flag', () => {
    expect(
      CommonSimulatorLandingPageTemplatesPreviewDialog.computed.getNavigationDrawerClass.call({
        isNested: false
      })
    ).toEqual({
      'k-navigation-drawer k-navigation-drawer--landing-page-preview': true,
      'nested-drawer': false
    })

    expect(
      CommonSimulatorLandingPageTemplatesPreviewDialog.computed.getNavigationDrawerClass.call({
        isNested: true
      })
    ).toEqual({
      'k-navigation-drawer k-navigation-drawer--landing-page-preview': true,
      'nested-drawer': true
    })
  })

  it('calls closeDrawer for overlay and close handlers', () => {
    const closeDrawer = jest.fn()
    const event = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn()
    }
    const ctx = { closeDrawer }

    CommonSimulatorLandingPageTemplatesPreviewDialog.methods.handleOverlayClick.call(ctx, event)
    expect(event.stopPropagation).toHaveBeenCalled()
    expect(event.preventDefault).toHaveBeenCalled()
    expect(closeDrawer).toHaveBeenCalledTimes(1)

    CommonSimulatorLandingPageTemplatesPreviewDialog.methods.handleClose.call(ctx)
    expect(closeDrawer).toHaveBeenCalledTimes(2)
  })

  it('handleEdit emits on-edit and disables html overflow control', () => {
    const emit = jest.fn()
    const ctx = {
      isHtmlOverflowControlManuallyDisabled: false,
      selectedRow: { resourceId: 'lp-1', name: 'Landing A' },
      $emit: emit
    }

    CommonSimulatorLandingPageTemplatesPreviewDialog.methods.handleEdit.call(ctx)

    expect(ctx.isHtmlOverflowControlManuallyDisabled).toBe(true)
    expect(emit).toHaveBeenCalledWith('on-edit', { resourceId: 'lp-1', name: 'Landing A' })
  })

  it('callForData maps phishing landing page languages and transformed templates', async () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((fn) => {
      fn()
      return 1
    })

    const ctx = {
      type: PREVIEW_DIALOG_TYPES.PHISHING,
      selectedRow: { resourceId: 'lp-1' },
      languages: [
        { text: 'English', value: 'lang-en' },
        { text: 'Turkish', value: 'lang-tr' }
      ],
      landingPageParams: { languages: [] },
      landingPageTemplates: null,
      selectedTemplateHeader: '',
      templateHTML: null,
      setLoading: jest.fn(),
      apiFunc: jest.fn(() =>
        Promise.resolve({
          data: {
            data: {
              resourceId: 'lp-1',
              urlTemplate: 'https://phish.local',
              name: 'Landing A',
              isAssistedByAI: true,
              languageTypeResourceId: 'lang-en',
              languageTypeName: 'English',
              landingPages: [
                {
                  name: 'Page 1',
                  order: 1,
                  prompt: '',
                  content: '<div>EN</div>',
                  languages: [
                    {
                      languageTypeResourceId: 'lang-tr',
                      languageTypeName: 'Turkish',
                      content: '<div>TR</div>'
                    }
                  ]
                }
              ]
            }
          }
        })
      )
    }

    CommonSimulatorLandingPageTemplatesPreviewDialog.methods.callForData.call(ctx)
    await flushPromises()
    await flushPromises()

    expect(ctx.setLoading).toHaveBeenCalledWith(true)
    expect(ctx.landingPageParams.name).toBe('Landing A')
    expect(ctx.landingPageParams.urlTemplate).toBe('https://phish.local')
    expect(ctx.landingPageParams.languages).toHaveLength(2)
    expect(ctx.landingPageTemplates).toHaveLength(1)
    expect(ctx.landingPageTemplates[0].languages['lang-en']).toBe('<div>EN</div>')
    expect(ctx.landingPageTemplates[0].languages['lang-tr']).toBe('<div>TR</div>')
    expect(ctx.templateHTML).toBe('<div>EN</div>')

    setTimeoutSpy.mockRestore()
  })

  it('callForData keeps non-phishing templates as-is and filters main language', async () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((fn) => {
      fn()
      return 1
    })

    const landingPages = [{ name: 'Q Page', content: '<div>Q</div>' }]
    const ctx = {
      type: PREVIEW_DIALOG_TYPES.QUISHING,
      selectedRow: { resourceId: 'lp-2' },
      languages: [
        { text: 'English', value: 'lang-en' },
        { text: 'German', value: 'lang-de' }
      ],
      landingPageParams: { languages: [] },
      landingPageTemplates: null,
      selectedTemplateHeader: '',
      templateHTML: null,
      setLoading: jest.fn(),
      apiFunc: jest.fn(() =>
        Promise.resolve({
          data: {
            data: {
              resourceId: 'lp-2',
              urlTemplate: 'https://quish.local',
              name: 'Quishing Landing',
              languageTypeResourceId: 'lang-de',
              landingPages
            }
          }
        })
      )
    }

    CommonSimulatorLandingPageTemplatesPreviewDialog.methods.callForData.call(ctx)
    await flushPromises()
    await flushPromises()

    expect(ctx.landingPageParams.languages).toEqual([{ text: 'German', value: 'lang-de' }])
    expect(ctx.landingPageTemplates).toBe(landingPages)
    expect(ctx.templateHTML).toBe('<div>Q</div>')

    setTimeoutSpy.mockRestore()
  })
})
