jest.mock('@/api/smishing', () => ({
  getLandingPageTemplate: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  createLandingPageTemplate: jest.fn(() => Promise.resolve()),
  updateLandingPageTemplate: jest.fn(() => Promise.resolve()),
  searchLandingPageTemplates: jest.fn(() => Promise.resolve({ data: { data: { results: [] } } }))
}))

import NewLandingPage from '@/components/SmishingLandingPages/NewLandingPage.vue'

describe('SmishingLandingPages NewLandingPage.vue', () => {
  const { methods, computed } = NewLandingPage

  it('getTitle reflects create/edit/duplicate modes', () => {
    expect(computed.getTitle.call({ isEdit: false, isDuplicate: false })).toBe('New Landing Page Template')
    expect(computed.getTitle.call({ isEdit: true, isDuplicate: false })).toBe('Edit Landing Page Template')
    expect(computed.getTitle.call({ isEdit: true, isDuplicate: true })).toBe('Duplicate Landing Page Template')
  })

  it('showMakeAvailableFor and isRenderMakeAvailableFor branches', () => {
    expect(
      computed.showMakeAvailableFor.call({ $store: { state: { auth: { userRoleName: 'CompanyAdmin' } } } })
    ).toBe(false)
    expect(
      computed.showMakeAvailableFor.call({ $store: { state: { auth: { userRoleName: 'SystemAdmin' } } } })
    ).toBe(true)

    expect(
      computed.isRenderMakeAvailableFor.call({
        editItemsDisabled: true,
        selectedItem: null,
        $store: { state: { auth: { userRoleName: 'CompanyAdmin' } } }
      })
    ).toBe(false)
    expect(
      computed.isRenderMakeAvailableFor.call({
        editItemsDisabled: false,
        selectedItem: { id: 1 },
        $store: { state: { auth: { userRoleName: 'CompanyAdmin' } } }
      })
    ).toBe(true)
  })

  it('handleDeleteLandingPage removes page and resets tab', () => {
    const ctx = {
      formValues: {
        landingPages: [{ name: 'p1' }, { name: 'p2' }]
      },
      tab: 'page2'
    }
    methods.handleDeleteLandingPage.call(ctx, 1)
    expect(ctx.formValues.landingPages).toHaveLength(1)
    expect(ctx.tab).toBe('page1')
  })

  it('handleUploadHTML clicks hidden input', () => {
    const click = jest.fn()
    const ctx = { $refs: { refHtmlFile: { click } } }
    methods.handleUploadHTML.call(ctx)
    expect(click).toHaveBeenCalled()
  })

  it('handleHTMLUploadChange validates file type and size', () => {
    const dispatch = jest.fn()
    const ctx = {
      $store: { dispatch },
      formValues: { landingPages: [{ name: 'p1' }] },
      tab: 'page1'
    }
    methods.handleHTMLUploadChange.call(ctx, { target: { files: [{ type: 'application/json', size: 100 }] } })
    expect(dispatch).toHaveBeenCalled()

    dispatch.mockClear()
    methods.handleHTMLUploadChange.call(ctx, { target: { files: [{ type: 'text/html', size: 6000000 }] } })
    expect(dispatch).toHaveBeenCalled()
  })
})
