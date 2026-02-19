import {
  TARGET_USER_TYPES,
  ACTION_TYPES,
  DURATION_TYPES,
  durations,
  actions,
  createHeaderDataFactory,
  createBodyDataFactory,
  createAttachmentDataFactory,
  HEADER_KEYS,
  BODY_KEYS,
  ATTACHMENT_KEYS,
  OPERATORS,
  TEXT_OPERATORS
} from '@/components/Investigation/utils'

describe('Investigation utils', () => {
  it('exports enum constants and list items', () => {
    expect(TARGET_USER_TYPES.Users).toBe('SpecificUsers')
    expect(ACTION_TYPES.Delete).toBe('Delete')
    expect(DURATION_TYPES.SevenDays).toBe(7)
    expect(durations).toHaveLength(3)
    expect(actions).toHaveLength(4)
  })

  it('factory methods apply defaults and overrides', () => {
    expect(createHeaderDataFactory({ from: 'a@b.com' }).from).toBe('a@b.com')
    expect(createBodyDataFactory({ keyword: 'urgent' }).keyword).toBe('urgent')
    expect(createAttachmentDataFactory({ extension: '.pdf' }).extension).toBe('.pdf')
    expect(createHeaderDataFactory().subject).toBeNull()
  })

  it('exports keys and operators', () => {
    expect(HEADER_KEYS).toContain('subject')
    expect(BODY_KEYS).toContain('regex')
    expect(ATTACHMENT_KEYS).toContain('sha512')
    expect(OPERATORS).toEqual({ OR: 0, AND: 1 })
    expect(TEXT_OPERATORS.OR).toBe('OR')
  })
})
