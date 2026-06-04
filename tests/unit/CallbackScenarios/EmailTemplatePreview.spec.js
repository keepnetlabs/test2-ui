jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  openHtmlInNewWindow: jest.fn()
}))

import EmailTemplatePreview from '@/components/CallbackScenarios/EmailTemplatePreview.vue'
import { openHtmlInNewWindow } from '@/utils/functions'

describe('CallbackScenarios/EmailTemplatePreview.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('computed', () => {
    it('getNavigationDrawerClass toggles nested-drawer class via isNested', () => {
      expect(
        EmailTemplatePreview.computed.getNavigationDrawerClass.call({ isNested: false })
      ).toEqual({
        'k-navigation-drawer k-navigation-drawer--preview-dialog': true,
        'nested-drawer': false
      })
      expect(
        EmailTemplatePreview.computed.getNavigationDrawerClass.call({ isNested: true })
      ).toEqual({
        'k-navigation-drawer k-navigation-drawer--preview-dialog': true,
        'nested-drawer': true
      })
    })

    it('showEditButton is true when selectedRow is missing or isOwner !== false', () => {
      expect(EmailTemplatePreview.computed.showEditButton.call({ selectedRow: null })).toBe(true)
      expect(EmailTemplatePreview.computed.showEditButton.call({ selectedRow: undefined })).toBe(
        true
      )
      expect(EmailTemplatePreview.computed.showEditButton.call({ selectedRow: { name: 'X' } })).toBe(
        true
      )
      expect(
        EmailTemplatePreview.computed.showEditButton.call({
          selectedRow: { isOwner: true }
        })
      ).toBe(true)
    })

    it('showEditButton is false only when selectedRow.isOwner === false', () => {
      expect(
        EmailTemplatePreview.computed.showEditButton.call({
          selectedRow: { isOwner: false }
        })
      ).toBe(false)
    })

    it('showDuplicateButton mirrors selectedRow presence', () => {
      expect(
        EmailTemplatePreview.computed.showDuplicateButton.call({ selectedRow: { name: 'X' } })
      ).toBe(true)
      expect(EmailTemplatePreview.computed.showDuplicateButton.call({ selectedRow: null })).toBe(
        false
      )
    })
  })

  describe('methods', () => {
    it('handleClose delegates to closeDrawer', () => {
      const closeDrawer = jest.fn()
      EmailTemplatePreview.methods.handleClose.call({ closeDrawer })
      expect(closeDrawer).toHaveBeenCalled()
    })

    it('handleEdit emits on-edit with selectedRow', () => {
      const emit = jest.fn()
      const selectedRow = { resourceId: 'et-1', name: 'Email A' }
      EmailTemplatePreview.methods.handleEdit.call({ $emit: emit, selectedRow })
      expect(emit).toHaveBeenCalledWith('on-edit', selectedRow)
    })

    it('handleDuplicate emits on-duplicate with selectedRow', () => {
      const emit = jest.fn()
      const selectedRow = { resourceId: 'et-1' }
      EmailTemplatePreview.methods.handleDuplicate.call({ $emit: emit, selectedRow })
      expect(emit).toHaveBeenCalledWith('on-duplicate', selectedRow)
    })

    it('handleExternalLink calls openHtmlInNewWindow with templateHTML', () => {
      const ctx = { templateHTML: '<html>preview</html>' }
      EmailTemplatePreview.methods.handleExternalLink.call(ctx)
      expect(openHtmlInNewWindow).toHaveBeenCalledWith('<html>preview</html>')
    })
  })
})
