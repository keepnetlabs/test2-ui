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

  it('createBodyDataFactory returns defaults for empty params', () => {
    const body = createBodyDataFactory()
    expect(body.url).toBeNull()
    expect(body.keyword).toBeNull()
    expect(body.regex).toBeNull()
  })

  it('createAttachmentDataFactory returns defaults for empty params', () => {
    const att = createAttachmentDataFactory()
    expect(att.size).toBeNull()
    expect(att.name).toBeNull()
    expect(att.md5).toBeNull()
    expect(att.sha512).toBeNull()
    expect(att.extension).toBeNull()
  })

  it('createHeaderDataFactory merges params over defaults', () => {
    const header = createHeaderDataFactory({ ip: '1.2.3.4', subject: 'Test' })
    expect(header.ip).toBe('1.2.3.4')
    expect(header.subject).toBe('Test')
    expect(header.from).toBeNull()
  })

  it('exports keys and operators', () => {
    expect(HEADER_KEYS).toContain('subject')
    expect(BODY_KEYS).toContain('regex')
    expect(ATTACHMENT_KEYS).toContain('sha512')
    expect(OPERATORS).toEqual({ OR: 0, AND: 1 })
    expect(TEXT_OPERATORS.OR).toBe('OR')
  })
})
