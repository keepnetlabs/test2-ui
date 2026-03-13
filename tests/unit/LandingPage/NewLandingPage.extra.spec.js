jest.mock('@/api/landingPage', () => ({
  getLandingPageTemplatePreviewContent: jest.fn(() =>
    Promise.resolve({
      data: { data: { landingPages: [{ content: '<div>x</div>' }] } }
    })
  )
}))

jest.mock('@/api/phishingsimulator', () => ({
  getMergedTextForPhishing: jest.fn(),
  fixEmailTemplateWithAI: jest.fn()
}))

import NewLandingPage from '@/components/LandingPage/NewLandingPage.vue'
import { fixEmailTemplateWithAI } from '@/api/phishingsimulator'

describe('NewLandingPage.vue (extra branches)', () => {
  const { methods, computed } = NewLandingPage

  it('showMakeAvailableFor returns false for CompanyAdmin', () => {
    expect(
      computed.showMakeAvailableFor.call({
        $store: { state: { auth: { userRoleName: 'CompanyAdmin' } } }
      })
    ).toBe(false)
  })

  it('clickOnlyMethodText falls back to "Click Only" when method label missing', () => {
    expect(
      computed.clickOnlyMethodText.call({
        formValues: { methodTypeId: '1' },
        landingPageData: { methodTypes: [{ value: '2', text: 'Data Submission' }] }
      })
    ).toBe('Click Only')
  })

  it('getLandingPageKey returns empty when step is not 2', () => {
    expect(computed.getLandingPageKey.call({ step: 1 })).toBe('')
  })

  it('buildLandingPagesPayload skips languages field when no translated pages found', () => {
    const ctx = {
      isEdit: false,
      isDuplicate: false,
      selectedLanguages: [{ value: 'en' }],
      formValues: {
        languageTypeResourceId: 'en',
        landingPages: [{ name: 'Main', content: 'main', order: 1, prompt: '' }]
      },
      languagesPayload: [
        {
          languageTypeResourceId: 'en',
          landingPages: [{ name: 'Main', content: 'main', order: 1, prompt: '' }],
          isTranslated: true
        },
        {
          languageTypeResourceId: 'tr',
          landingPages: [],
          isTranslated: true
        }
      ]
    }
    const payload = {
      languageTypeResourceId: 'en',
      landingPages: [{ name: 'Main', content: 'main', order: 1, prompt: '' }]
    }

    const result = methods.buildLandingPagesPayload.call(ctx, payload)
    expect(result[0].languages).toBeUndefined()
  })

  it('created sets methodTypeId to "2" for non-click selectedMethodText', () => {
    const ctx = {
      isDuplicate: false,
      isEdit: false,
      selectedMethodText: 'Data Submission',
      landingPageData: { methodTypes: [{ value: '1' }, { value: '2' }] },
      formValues: {},
      footerButtonsIds: {},
      callForMergedTags: jest.fn(),
      callForLanguages: jest.fn()
    }

    NewLandingPage.created.call(ctx)
    expect(ctx.formValues.methodTypeId).toBe('2')
  })

  it('handleClickOnlyPageAdded keeps current tab when first page is deleted flow not triggered', async () => {
    const ctx = {
      isSelectClickOnlyPageOpen: true,
      isEdit: false,
      formValues: {
        landingPages: [
          { name: 'landing-page', order: 1, prompt: '', content: 'existing' },
          { name: 'Page 2', order: 2, prompt: '', content: 'existing-2' }
        ]
      },
      languagesPayload: [],
      tab: 'page2',
      getAndUpdateFirstIndexForPageText: jest.fn(() => 3),
      getNewIndexForPageText: jest.fn(() => 3)
    }

    await methods.handleClickOnlyPageAdded.call(ctx, 'resource-1')

    expect(ctx.isSelectClickOnlyPageOpen).toBe(false)
    expect(ctx.formValues.landingPages).toHaveLength(3)
    expect(ctx.formValues.landingPages[2].name).toBe('Page 3')
    expect(ctx.tab).toBe('page2')
  })

  it('handleHTMLUploadChange supports html boundary size (5MB)', () => {
    const originalFileReader = global.FileReader
    class MockFileReader {
      readAsText() {
        this.onload({ target: { result: '<html>limit</html>' } })
      }
    }
    global.FileReader = MockFileReader

    const dispatch = jest.fn()
    const ctx = {
      isEdit: false,
      $store: { dispatch },
      formValues: { landingPages: [{ name: 'landing-page', order: 1, prompt: '', content: 'x' }] },
      languagesPayload: [],
      tab: 'page1',
      getAndUpdateFirstIndexForPageText: jest.fn(() => 2),
      getNewIndexForPageText: jest.fn(() => 2)
    }

    methods.handleHTMLUploadChange.call(ctx, {
      target: { files: [{ type: 'text/html', size: 5242880 }] }
    })

    expect(dispatch).not.toHaveBeenCalled()
    expect(ctx.formValues.landingPages).toHaveLength(2)
    global.FileReader = originalFileReader
  })

  describe('handleCheckWithAI', () => {
    const $nextTick = (cb) => cb()

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('returns early when template is empty', () => {
      const ctx = {
        tab: 'page1',
        getSelectedLanguagePayload: {
          landingPages: [{ content: '' }]
        }
      }
      methods.handleCheckWithAI.call(ctx)
      expect(fixEmailTemplateWithAI).not.toHaveBeenCalled()
    })

    it('returns early when template is whitespace only', () => {
      const ctx = {
        tab: 'page1',
        getSelectedLanguagePayload: {
          landingPages: [{ content: '   ' }]
        }
      }
      methods.handleCheckWithAI.call(ctx)
      expect(fixEmailTemplateWithAI).not.toHaveBeenCalled()
    })

    it('updates landing page content with fixed_html from response', async () => {
      const landingPage = { content: '<div>old</div>' }
      fixEmailTemplateWithAI.mockResolvedValue({
        data: {
          data: {
            fixed_html: '<div>enhanced</div>',
            tags: ['urgency'],
            difficulty: 'DIFFICULTY_LOW',
            domain: 'test.com',
            change_log: ['Fixed layout']
          }
        }
      })

      const ctx = {
        tab: 'page1',
        getSelectedLanguagePayload: { landingPages: [landingPage] },
        isCheckWithAILoading: false,
        isEnhanceWithAi: false,
        isCheckWithAIDone: false,
        aiTags: [],
        aiDifficulty: '',
        aiChangeLog: [],
        showAIChangeLogDialog: false,
        $refs: { refEmailTemplate: null },
        formValues: {
          difficultyTypeId: null,
          phishingLink: { domainRecordId: null },
          tags: []
        },
        landingPageData: {
          difficultyTypes: [
            { text: 'Easy', value: 1 },
            { text: 'Medium', value: 2 },
            { text: 'Hard', value: 3 }
          ],
          domainRecords: [{ text: 'test.com', value: 'd1' }]
        },
        $nextTick,
        $store: { dispatch: jest.fn() }
      }

      methods.handleCheckWithAI.call(ctx)
      await new Promise((r) => setTimeout(r, 0))

      expect(fixEmailTemplateWithAI).toHaveBeenCalledWith({
        html: '<div>old</div>',
        type: 'landing_page'
      })
      expect(landingPage.content).toBe('<div>enhanced</div>')
      expect(ctx.formValues.difficultyTypeId).toBe(1)
      expect(ctx.formValues.phishingLink.domainRecordId).toBe('d1')
      expect(ctx.formValues.tags).toEqual(['urgency'])
      expect(ctx.aiTags).toEqual(['urgency'])
      expect(ctx.aiDifficulty).toBe('DIFFICULTY_LOW')
      expect(ctx.isCheckWithAIDone).toBe(true)
      expect(ctx.showAIChangeLogDialog).toBe(true)
      expect(ctx.aiChangeLog).toEqual(['Fixed layout'])
      expect(ctx.isCheckWithAILoading).toBe(false)
      expect(ctx.isEnhanceWithAi).toBe(false)
    })

    it('shows snackbar when change_log is empty', async () => {
      const landingPage = { content: '<div>old</div>' }
      fixEmailTemplateWithAI.mockResolvedValue({
        data: { data: { fixed_html: '<div>same</div>', change_log: [] } }
      })

      const dispatch = jest.fn()
      const ctx = {
        tab: 'page1',
        getSelectedLanguagePayload: { landingPages: [landingPage] },
        isCheckWithAILoading: false,
        isEnhanceWithAi: false,
        isCheckWithAIDone: false,
        aiTags: [],
        aiDifficulty: '',
        aiChangeLog: [],
        showAIChangeLogDialog: false,
        $refs: { refEmailTemplate: null },
        formValues: {
          difficultyTypeId: null,
          phishingLink: { domainRecordId: null },
          tags: []
        },
        landingPageData: { difficultyTypes: [], domainRecords: [] },
        $nextTick,
        $store: { dispatch }
      }

      methods.handleCheckWithAI.call(ctx)
      await new Promise((r) => setTimeout(r, 0))

      expect(dispatch).toHaveBeenCalledWith(
        'common/createSnackBar',
        expect.objectContaining({ message: 'AI enhancement complete. No changes needed.' })
      )
      expect(ctx.showAIChangeLogDialog).toBe(false)
    })

    it('shows error snackbar on API failure', async () => {
      fixEmailTemplateWithAI.mockRejectedValue({
        response: { data: { detail: 'Rate limit exceeded' } }
      })

      const dispatch = jest.fn()
      const ctx = {
        tab: 'page1',
        getSelectedLanguagePayload: { landingPages: [{ content: '<div>test</div>' }] },
        isCheckWithAILoading: false,
        isEnhanceWithAi: false,
        $refs: { refEmailTemplate: null },
        $nextTick,
        $store: { dispatch }
      }

      methods.handleCheckWithAI.call(ctx)
      await new Promise((r) => setTimeout(r, 0))

      expect(dispatch).toHaveBeenCalledWith(
        'common/createSnackBar',
        expect.objectContaining({ message: 'Rate limit exceeded' })
      )
      expect(ctx.isCheckWithAILoading).toBe(false)
      expect(ctx.isEnhanceWithAi).toBe(false)
    })

    it('sets isEmailGenerating on refs during processing', async () => {
      fixEmailTemplateWithAI.mockResolvedValue({
        data: { data: { fixed_html: '<div>ok</div>', change_log: [] } }
      })

      const ref1 = { isEmailGenerating: false }
      const ctx = {
        tab: 'page1',
        getSelectedLanguagePayload: { landingPages: [{ content: '<div>x</div>' }] },
        isCheckWithAILoading: false,
        isEnhanceWithAi: false,
        isCheckWithAIDone: false,
        aiTags: [],
        aiDifficulty: '',
        aiChangeLog: [],
        showAIChangeLogDialog: false,
        $refs: { refEmailTemplate: [ref1] },
        formValues: {
          difficultyTypeId: null,
          phishingLink: { domainRecordId: null },
          tags: []
        },
        landingPageData: { difficultyTypes: [], domainRecords: [] },
        $nextTick,
        $store: { dispatch: jest.fn() }
      }

      methods.handleCheckWithAI.call(ctx)
      expect(ref1.isEmailGenerating).toBe(true)

      await new Promise((r) => setTimeout(r, 0))
      expect(ref1.isEmailGenerating).toBe(false)
    })

    it('handles second page tab correctly', async () => {
      const page1 = { content: '<div>page1</div>' }
      const page2 = { content: '<div>page2</div>' }
      fixEmailTemplateWithAI.mockResolvedValue({
        data: { data: { fixed_html: '<div>page2-enhanced</div>', change_log: [] } }
      })

      const ctx = {
        tab: 'page2',
        getSelectedLanguagePayload: { landingPages: [page1, page2] },
        isCheckWithAILoading: false,
        isEnhanceWithAi: false,
        isCheckWithAIDone: false,
        aiTags: [],
        aiDifficulty: '',
        aiChangeLog: [],
        showAIChangeLogDialog: false,
        $refs: { refEmailTemplate: null },
        formValues: {
          difficultyTypeId: null,
          phishingLink: { domainRecordId: null },
          tags: []
        },
        landingPageData: { difficultyTypes: [], domainRecords: [] },
        $nextTick,
        $store: { dispatch: jest.fn() }
      }

      methods.handleCheckWithAI.call(ctx)
      await new Promise((r) => setTimeout(r, 0))

      expect(page1.content).toBe('<div>page1</div>')
      expect(page2.content).toBe('<div>page2-enhanced</div>')
    })

    it('does not update content when fixed_html is missing', async () => {
      const landingPage = { content: '<div>original</div>' }
      fixEmailTemplateWithAI.mockResolvedValue({
        data: { data: { tags: ['test'], change_log: [] } }
      })

      const ctx = {
        tab: 'page1',
        getSelectedLanguagePayload: { landingPages: [landingPage] },
        isCheckWithAILoading: false,
        isEnhanceWithAi: false,
        isCheckWithAIDone: false,
        aiTags: [],
        aiDifficulty: '',
        aiChangeLog: [],
        showAIChangeLogDialog: false,
        $refs: { refEmailTemplate: null },
        formValues: {
          difficultyTypeId: null,
          phishingLink: { domainRecordId: null },
          tags: []
        },
        landingPageData: { difficultyTypes: [], domainRecords: [] },
        $nextTick,
        $store: { dispatch: jest.fn() }
      }

      methods.handleCheckWithAI.call(ctx)
      await new Promise((r) => setTimeout(r, 0))

      expect(landingPage.content).toBe('<div>original</div>')
    })

    it('merges AI tags with existing tags without replacing', async () => {
      fixEmailTemplateWithAI.mockResolvedValue({
        data: { data: { fixed_html: '<div>x</div>', tags: ['authority', 'scarcity'], change_log: [] } }
      })

      const ctx = {
        tab: 'page1',
        getSelectedLanguagePayload: { landingPages: [{ content: '<div>x</div>' }] },
        isCheckWithAILoading: false,
        isEnhanceWithAi: false,
        isEnhanceWithAiJustFinished: false,
        isCheckWithAIDone: false,
        aiTags: [],
        aiDifficulty: '',
        aiChangeLog: [],
        showAIChangeLogDialog: false,
        $refs: { refEmailTemplate: null },
        formValues: {
          difficultyTypeId: null,
          phishingLink: { domainRecordId: null },
          tags: ['urgency', 'curiosity']
        },
        landingPageData: { difficultyTypes: [], domainRecords: [] },
        $nextTick,
        $store: { dispatch: jest.fn() }
      }

      methods.handleCheckWithAI.call(ctx)
      await new Promise((r) => setTimeout(r, 0))

      expect(ctx.formValues.tags).toEqual(['urgency', 'curiosity', 'authority', 'scarcity'])
    })

    it('merges AI tags with existing tags and deduplicates', async () => {
      fixEmailTemplateWithAI.mockResolvedValue({
        data: { data: { fixed_html: '<div>x</div>', tags: ['urgency', 'authority'], change_log: [] } }
      })

      const ctx = {
        tab: 'page1',
        getSelectedLanguagePayload: { landingPages: [{ content: '<div>x</div>' }] },
        isCheckWithAILoading: false,
        isEnhanceWithAi: false,
        isEnhanceWithAiJustFinished: false,
        isCheckWithAIDone: false,
        aiTags: [],
        aiDifficulty: '',
        aiChangeLog: [],
        showAIChangeLogDialog: false,
        $refs: { refEmailTemplate: null },
        formValues: {
          difficultyTypeId: null,
          phishingLink: { domainRecordId: null },
          tags: ['urgency', 'curiosity']
        },
        landingPageData: { difficultyTypes: [], domainRecords: [] },
        $nextTick,
        $store: { dispatch: jest.fn() }
      }

      methods.handleCheckWithAI.call(ctx)
      await new Promise((r) => setTimeout(r, 0))

      expect(ctx.formValues.tags).toEqual(['urgency', 'curiosity', 'authority'])
    })

    it('deduplicates tags from response', async () => {
      fixEmailTemplateWithAI.mockResolvedValue({
        data: { data: { fixed_html: '<div>x</div>', tags: ['urgency', 'authority', 'urgency'], change_log: [] } }
      })

      const ctx = {
        tab: 'page1',
        getSelectedLanguagePayload: { landingPages: [{ content: '<div>x</div>' }] },
        isCheckWithAILoading: false,
        isEnhanceWithAi: false,
        isCheckWithAIDone: false,
        aiTags: [],
        aiDifficulty: '',
        aiChangeLog: [],
        showAIChangeLogDialog: false,
        $refs: { refEmailTemplate: null },
        formValues: {
          difficultyTypeId: null,
          phishingLink: { domainRecordId: null },
          tags: []
        },
        landingPageData: { difficultyTypes: [], domainRecords: [] },
        $nextTick,
        $store: { dispatch: jest.fn() }
      }

      methods.handleCheckWithAI.call(ctx)
      await new Promise((r) => setTimeout(r, 0))

      expect(ctx.formValues.tags).toEqual(['urgency', 'authority'])
      expect(ctx.aiTags).toEqual(['urgency', 'authority'])
    })
  })

  describe('handleAIAlly', () => {
    it('toggles isAIAllyOpen', () => {
      const ctx = { isAIAllyOpen: false }
      methods.handleAIAlly.call(ctx)
      expect(ctx.isAIAllyOpen).toBe(true)
      methods.handleAIAlly.call(ctx)
      expect(ctx.isAIAllyOpen).toBe(false)
    })
  })

  describe('handleAITemplateUpdate', () => {
    it('updates the current page content with provided template', () => {
      const ctx = {
        tab: 'page1',
        formValues: {
          landingPages: [{ content: 'old' }, { content: 'page2' }]
        },
        languagesPayload: [
          { languageTypeResourceId: 'en', landingPages: [{ content: 'old' }] }
        ],
        activeLanguage: 'en',
        $set: jest.fn()
      }
      methods.handleAITemplateUpdate.call(ctx, '<div>new AI template</div>')
      expect(ctx.$set).toHaveBeenCalledWith(
        ctx.formValues.landingPages[0],
        'content',
        '<div>new AI template</div>'
      )
    })

    it('updates second page when tab is page2', () => {
      const ctx = {
        tab: 'page2',
        formValues: {
          landingPages: [{ content: 'p1' }, { content: 'p2' }]
        },
        languagesPayload: [
          { languageTypeResourceId: 'en', landingPages: [{ content: 'p1' }, { content: 'p2' }] }
        ],
        activeLanguage: 'en',
        $set: jest.fn()
      }
      methods.handleAITemplateUpdate.call(ctx, '<div>updated</div>')
      expect(ctx.$set).toHaveBeenCalledWith(
        ctx.formValues.landingPages[1],
        'content',
        '<div>updated</div>'
      )
    })

    it('does not update formValues when landing page at index does not exist', () => {
      const ctx = {
        tab: 'page5',
        formValues: {
          landingPages: [{ content: 'p1' }]
        },
        languagesPayload: [],
        activeLanguage: 'en',
        $set: jest.fn()
      }
      methods.handleAITemplateUpdate.call(ctx, '<div>noop</div>')
      expect(ctx.$set).not.toHaveBeenCalledWith(
        expect.anything(),
        'content',
        '<div>noop</div>'
      )
    })
  })
})
