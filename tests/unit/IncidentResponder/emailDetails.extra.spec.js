import EmailDetails from '@/components/IncidentResponder/emailDetails.vue'

jest.mock('@/api/notifiedEmail', () => ({
  getNotifiedEmail: jest.fn()
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getBtnStatusColor: jest.fn((type) => (type === 'active' ? '#1173C1' : '#00bcd4')),
    scrollToComponent: jest.fn(),
    copyToClipboard: jest.fn().mockResolvedValue(undefined)
  }
})

describe('IncidentResponder emailDetails.vue (extra branch coverage)', () => {
  const { methods, computed, created, watch } = EmailDetails

  describe('getKeyValue', () => {
    it('returns empty when key is not string', () => {
      expect(methods.getKeyValue({ key: 123 })).toBe('')
      expect(methods.getKeyValue({ key: null })).toBe('')
    })

    it('handles item undefined with default key', () => {
      expect(methods.getKeyValue(undefined)).toBe('')
    })

    it('capitalizes single character key', () => {
      expect(methods.getKeyValue({ key: 'x' })).toBe('X')
    })
  })

  describe('isFileUploaded', () => {
    it('returns undefined when attachments is null', () => {
      expect(methods.isFileUploaded(null)).toBeUndefined()
    })

    it('returns undefined when attachments is undefined', () => {
      expect(methods.isFileUploaded(undefined)).toBeUndefined()
    })

    it('returns true when all items have isSendFile false', () => {
      expect(methods.isFileUploaded([{ isSendFile: false }])).toBe(true)
    })
  })

  describe('handleIsSha512Copied and handleIsMd5Copied', () => {
    it('does not call writeToNavigator when index already in clipboard', () => {
      const writeToNavigator = jest.fn()
      const ctx = {
        isCopiedShaClipboard: [1],
        writeToNavigator
      }
      methods.handleIsSha512Copied.call(ctx, 1, { sha512: 'abc' })
      expect(writeToNavigator).not.toHaveBeenCalled()
    })

    it('calls writeToNavigator when index not in clipboard', () => {
      const writeToNavigator = jest.fn()
      const ctx = {
        isCopiedShaClipboard: [],
        writeToNavigator
      }
      methods.handleIsSha512Copied.call(ctx, 1, { sha512: 'abc' })
      expect(writeToNavigator).toHaveBeenCalledWith('abc', 1, 'sha')
    })

    it('handleIsMd5Copied does not call when index in clipboard', () => {
      const writeToNavigator = jest.fn()
      const ctx = {
        isCopiedMd5Clipboard: [2],
        writeToNavigator
      }
      methods.handleIsMd5Copied.call(ctx, 2, { md5: 'xyz' })
      expect(writeToNavigator).not.toHaveBeenCalled()
    })

    it('handleIsMd5Copied calls writeToNavigator when index not in clipboard', () => {
      const writeToNavigator = jest.fn()
      const ctx = {
        isCopiedMd5Clipboard: [],
        writeToNavigator
      }
      methods.handleIsMd5Copied.call(ctx, 0, { md5: 'hash123' })
      expect(writeToNavigator).toHaveBeenCalledWith('hash123', 0, 'md5')
    })
  })

  describe('writeToNavigator', () => {
    it('pushes to isCopiedShaClipboard for sha type', () => {
      jest.useFakeTimers()
      const ctx = {
        isCopiedShaClipboard: [],
        isCopiedMd5Clipboard: []
      }
      const copyToClipboard = jest.fn().mockResolvedValue(undefined)

      methods.writeToNavigator.call(ctx, 'sha-value', 0, 'sha')
      expect(ctx.isCopiedShaClipboard).toEqual([0])

      jest.advanceTimersByTime(5000)
      expect(ctx.isCopiedShaClipboard).toEqual([])

      jest.useRealTimers()
    })

    it('pushes to isCopiedMd5Clipboard for md5 type', () => {
      jest.useFakeTimers()
      const ctx = {
        isCopiedShaClipboard: [],
        isCopiedMd5Clipboard: []
      }

      methods.writeToNavigator.call(ctx, 'md5-value', 1, 'md5')
      expect(ctx.isCopiedMd5Clipboard).toEqual([1])

      jest.advanceTimersByTime(5000)
      expect(ctx.isCopiedMd5Clipboard).toEqual([])

      jest.useRealTimers()
    })
  })

  describe('setSecondCollapse', () => {
    it('does not splice clipboard when sha/clipboard index is -1', () => {
      const ctx = {
        showSecondCollapse: [1],
        isCopiedShaClipboard: [],
        isCopiedMd5Clipboard: []
      }
      const event = { target: { textContent: 'COLLAPSE' } }

      methods.setSecondCollapse.call(ctx, event, 1)

      expect(ctx.showSecondCollapse).toEqual([])
      expect(ctx.isCopiedShaClipboard).toEqual([])
      expect(ctx.isCopiedMd5Clipboard).toEqual([])
    })
  })

  describe('handleAttachmentClick', () => {
    it('sets tab to fifth and pushes to panel and showSecondCollapse', () => {
      const scrollToComponent = jest.fn()
      const nextTick = jest.fn((cb) => cb())
      const ctx = {
        tab: 'first',
        panel: [],
        showSecondCollapse: [],
        $nextTick: nextTick
      }
      jest.spyOn(document, 'getElementById').mockReturnValue({ scrollIntoView: jest.fn() })

      methods.handleAttachmentClick.call(ctx, 2, 'email-details-attachment-expansion-panel-2')

      expect(ctx.tab).toBe('fifth')
      expect(ctx.panel).toEqual([2])
      expect(ctx.showSecondCollapse).toEqual([2])

      jest.restoreAllMocks()
    })
  })

  describe('handleDownloadEmail', () => {
    it('sets downloadModalStatus to true', () => {
      const ctx = { downloadModalStatus: false }
      methods.handleDownloadEmail.call(ctx)
      expect(ctx.downloadModalStatus).toBe(true)
    })
  })

  describe('getBtnStatusColor', () => {
    it('delegates to utility', () => {
      const result = methods.getBtnStatusColor.call({}, 'active')
      expect(result).toBe('#1173C1')
    })
  })

  describe('created hook', () => {
    it('sets tab from route params', () => {
      const ctx = {
        tab: 'first',
        $route: { params: { tab: 'second' }, query: {} }
      }
      created.call(ctx)
      expect(ctx.tab).toBe('second')
    })

    it('sets tab from route query when params has no tab', () => {
      const ctx = {
        tab: 'first',
        $route: { params: {}, query: { tab: 'third' } }
      }
      created.call(ctx)
      expect(ctx.tab).toBe('third')
    })

    it('keeps default tab when no params or query tab', () => {
      const ctx = {
        tab: 'first',
        $route: { params: {}, query: {} }
      }
      created.call(ctx)
      expect(ctx.tab).toBe('first')
    })
  })

  describe('isMailDetailsHaveAttachments', () => {
    it('returns length when attachments exist', () => {
      expect(
        computed.isMailDetailsHaveAttachments.call({
          mailDetails: { attachments: [1, 2, 3] }
        })
      ).toBe(3)
    })

    it('returns undefined when mailDetails is null', () => {
      expect(computed.isMailDetailsHaveAttachments.call({ mailDetails: null })).toBeUndefined()
    })

    it('returns undefined when attachments is undefined', () => {
      expect(
        computed.isMailDetailsHaveAttachments.call({ mailDetails: {} })
      ).toBeUndefined()
    })
  })

  describe('showAIAnalyze', () => {
    it('returns true when hostname includes localhost', () => {
      const origHostname = globalThis.location.hostname
      Object.defineProperty(globalThis.location, 'hostname', {
        value: 'localhost',
        configurable: true
      })
      const mockThis = {
        $store: { state: { auth: { selectedCompanyName: '' } } }
      }
      expect(computed.showAIAnalyze.call(mockThis)).toBe(true)
      Object.defineProperty(globalThis.location, 'hostname', {
        value: origHostname,
        configurable: true
      })
    })
  })
})
