// Full-branch tests for NewEmailTemplates.validateBarrelTemplate: the lure must contain no
// links / {PHISHINGURL}, and every language's payload subject + body are required.
jest.mock('@/utils/functions', () => ({
  scrollToComponent: jest.fn(),
  isDifferent: jest.fn(() => false),
  FLAGGED_AREA_CSS: '',
  cancellableAxiosRequest: jest.fn((fn) => fn),
  createRandomCryptStringNumber: jest.fn(() => 'rnd'),
  getDefaultAxiosPayload: jest.fn((payload = {}) => ({ ...payload }))
}))
jest.mock('@/api/file', () => ({ parseEmailOrMessageFile: jest.fn() }))

import NewEmailTemplates from '@/components/PhishingScenarios/NewEmailTemplates.vue'

const validate = NewEmailTemplates.methods.validateBarrelTemplate

const fullPayload = { subject: 'PS', template: '<p>payload {PHISHINGURL}</p>' }
const lureLang = (over = {}) => ({
  languageTypeResourceId: 'en',
  template: '<p>plain lure</p>',
  barrelPayload: { ...fullPayload },
  ...over
})

describe('validateBarrelTemplate', () => {
  it('returns true and clears error for non-barrel templates', () => {
    const ctx = { isBarrelTemplate: false, barrelError: 'stale', languagesPayload: [] }
    expect(validate.call(ctx)).toBe(true)
    expect(ctx.barrelError).toBe('')
  })

  it('rejects a lure body containing an anchor tag', () => {
    const ctx = {
      isBarrelTemplate: true,
      barrelError: '',
      activeLanguage: '',
      barrelEditMode: '',
      languagesPayload: [lureLang({ template: '<p><a href="http://x">click</a></p>' })]
    }
    expect(validate.call(ctx)).toBe(false)
    expect(ctx.activeLanguage).toBe('en')
    expect(ctx.barrelEditMode).toBe('lure')
    expect(ctx.barrelError).toMatch(/links/i)
  })

  it('rejects a lure body containing the {PHISHINGURL} tag', () => {
    const ctx = {
      isBarrelTemplate: true,
      barrelError: '',
      activeLanguage: '',
      barrelEditMode: '',
      languagesPayload: [lureLang({ template: '<p>visit {PHISHINGURL}</p>' })]
    }
    expect(validate.call(ctx)).toBe(false)
    expect(ctx.barrelEditMode).toBe('lure')
    expect(ctx.barrelError).toMatch(/PHISHINGURL/)
  })

  it('rejects when a payload subject is missing', () => {
    const ctx = {
      isBarrelTemplate: true,
      barrelError: '',
      activeLanguage: '',
      barrelEditMode: '',
      languagesPayload: [lureLang({ barrelPayload: { subject: '   ', template: '<p>p</p>' } })]
    }
    expect(validate.call(ctx)).toBe(false)
    expect(ctx.activeLanguage).toBe('en')
    expect(ctx.barrelEditMode).toBe('payload')
    expect(ctx.barrelError).toMatch(/Payload/i)
  })

  it('rejects when a payload body is missing', () => {
    const ctx = {
      isBarrelTemplate: true,
      barrelError: '',
      activeLanguage: '',
      barrelEditMode: '',
      languagesPayload: [lureLang({ barrelPayload: { subject: 'PS', template: '   ' } })]
    }
    expect(validate.call(ctx)).toBe(false)
    expect(ctx.barrelEditMode).toBe('payload')
  })

  it('flags the FIRST offending language across multiple languages', () => {
    const ctx = {
      isBarrelTemplate: true,
      barrelError: '',
      activeLanguage: '',
      barrelEditMode: '',
      languagesPayload: [
        lureLang({ languageTypeResourceId: 'en' }),
        lureLang({ languageTypeResourceId: 'tr', barrelPayload: { subject: '', template: '' } })
      ]
    }
    expect(validate.call(ctx)).toBe(false)
    expect(ctx.activeLanguage).toBe('tr')
    expect(ctx.barrelEditMode).toBe('payload')
  })

  it('passes when lure is clean and every payload is complete', () => {
    const ctx = {
      isBarrelTemplate: true,
      barrelError: 'stale',
      languagesPayload: [
        lureLang({ languageTypeResourceId: 'en' }),
        lureLang({ languageTypeResourceId: 'tr' })
      ]
    }
    expect(validate.call(ctx)).toBe(true)
    expect(ctx.barrelError).toBe('')
  })
})
