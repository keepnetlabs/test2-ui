jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getBtnStatusColor: jest.fn(() => '#2196f3'),
    copyToClipboard: jest.fn()
  }
})

import EmailDetailsUrl from '@/components/IncidentResponder/EmailDetails/EmailDetailsUrl.vue'
import { getBtnStatusColor, copyToClipboard } from '@/utils/functions'

describe('EmailDetailsUrl.vue', () => {
  const { methods, computed } = EmailDetailsUrl

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getVerticalLineClasses includes open class when last url panel is open', () => {
    const ctx = {
      showSecondCollapse: [2],
      mailDetails: { urls: [{}, {}, {}] }
    }

    expect(computed.getVerticalLineClasses.call(ctx)).toEqual([
      'email-details-inside-url-vertical-line',
      'email-details-inside-url-vertical-line-last-index--open'
    ])
  })

  it('getVerticalLineClasses excludes open class when last url panel is closed', () => {
    const ctx = {
      showSecondCollapse: [0],
      mailDetails: { urls: [{}, {}, {}] }
    }

    expect(computed.getVerticalLineClasses.call(ctx)).toEqual([
      'email-details-inside-url-vertical-line',
      ''
    ])
  })

  it('getBtnStatusColor proxies helper and handleCopyUrl copies text', () => {
    expect(methods.getBtnStatusColor('Malicious')).toBe('#2196f3')
    expect(getBtnStatusColor).toHaveBeenCalledWith('Malicious')

    methods.handleCopyUrl('https://example.com')
    expect(copyToClipboard).toHaveBeenCalledWith('https://example.com')
  })

  it('isFileUploaded checks upload flags', () => {
    expect(methods.isFileUploaded([{ isSendFile: true }])).toBe(true)
    expect(methods.isFileUploaded([{ isSendFileHash: true }])).toBe(true)
    expect(methods.isFileUploaded([{ isSendFile: false, isSendFileHash: false }])).toBe(false)
  })

  it('isFileUploaded returns undefined when analysisList is null', () => {
    expect(methods.isFileUploaded(null)).toBeUndefined()
  })

  it('isRedirectUrl returns falsy when no redirectUrls', () => {
    expect(methods.isRedirectUrl({ url: 'https://a.com' })).toBeFalsy()
    expect(methods.isRedirectUrl({ redirectUrls: [] })).toBeFalsy()
    expect(methods.isRedirectUrl(undefined)).toBeFalsy()
  })

  it('getExpansionPanelHeaderText returns DETAILS for non-redirect when collapsed', () => {
    const ctx = { showSecondCollapse: [], isRedirectUrl: methods.isRedirectUrl }
    const url = { resourceId: 'u1', url: 'https://a.com' }
    expect(methods.getExpansionPanelHeaderText.call(ctx, url, 0)).toBe('DETAILS')
  })

  it('getExpansionPanelHeaderText returns COLLAPSE for non-redirect when expanded', () => {
    const ctx = { showSecondCollapse: [0], isRedirectUrl: methods.isRedirectUrl }
    const url = { resourceId: 'u1', url: 'https://a.com' }
    expect(methods.getExpansionPanelHeaderText.call(ctx, url, 0)).toBe('COLLAPSE')
  })

  it('setSecondCollapse handles HIDE prefix', () => {
    const ctx = { showSecondCollapse: [1] }
    methods.setSecondCollapse.call(ctx, { target: { textContent: 'HIDE REDIRECT URL' } }, 1)
    expect(ctx.showSecondCollapse).toEqual([])
  })

  it('setSecondCollapse toggles expanded index', () => {
    const ctx = { showSecondCollapse: [] }

    methods.setSecondCollapse.call(ctx, { target: { textContent: 'DETAILS' } }, 1)
    expect(ctx.showSecondCollapse).toEqual([1])

    methods.setSecondCollapse.call(ctx, { target: { textContent: 'COLLAPSE' } }, 1)
    expect(ctx.showSecondCollapse).toEqual([])
  })

  it('returns redirect panel text and copied first url object', () => {
    const ctx = {
      showSecondCollapse: [0],
      isRedirectUrl: methods.isRedirectUrl
    }
    const url = {
      resourceId: 'u1',
      url: 'https://a.com',
      redirectUrls: [{ resourceId: 'u2' }]
    }

    expect(methods.isRedirectUrl(url)).toBe(1)
    expect(methods.getExpansionPanelHeaderText.call(ctx, url, 0)).toBe('HIDE REDIRECT URL')

    const firstItem = methods.getFirstItemURL(url)
    expect(firstItem[0].url).toBe('https://a.com')
    expect(firstItem[0].redirectUrls).toEqual([])
  })
})
