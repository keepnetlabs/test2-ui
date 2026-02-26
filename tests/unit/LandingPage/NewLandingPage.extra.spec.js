jest.mock('@/api/landingPage', () => ({
  getLandingPageTemplatePreviewContent: jest.fn(() =>
    Promise.resolve({
      data: { data: { landingPages: [{ content: '<div>x</div>' }] } }
    })
  )
}))

import NewLandingPage from '@/components/LandingPage/NewLandingPage.vue'

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
})
