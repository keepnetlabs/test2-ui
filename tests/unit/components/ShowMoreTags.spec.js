jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => '42')
}))

import ShowMoreTags from '@/components/ShowMoreTags.vue'

describe('ShowMoreTags.vue', () => {
  it('initializes badges by filtering falsy values', () => {
    const data = ShowMoreTags.data.call({
      defaultBadges: ['A', '', null, 'B']
    })
    expect(data.badges).toEqual(['A', 'B'])
  })

  it('getBadgeText truncates long text', () => {
    expect(ShowMoreTags.methods.getBadgeText('short text')).toBe('short text')
    expect(ShowMoreTags.methods.getBadgeText('a'.repeat(30))).toBe(`${'a'.repeat(25)}...`)
  })

  it('getTooltipText joins non-rendered badges with line breaks', () => {
    const text = ShowMoreTags.computed.getTooltipText.call({
      badges: ['one', 'two', 'three'],
      maximumRenderedBadgeCount: 1
    })
    expect(text).toBe('two\nthree\n')
  })

  it('getKey returns deterministic key format', () => {
    const key = ShowMoreTags.methods.getKey(3)
    expect(key).toBe('3ab-42')
  })

  it('getBadges calculates rendered and unrendered counts', () => {
    const ctx = {
      badges: ['abc', 'def', 'ghi', 'jkl'],
      unRenderedBadgeCount: 0,
      maximumRenderedBadgeCount: 0,
      showMaximumBadgeCount: 2
    }
    ShowMoreTags.methods.getBadges.call(ctx)

    expect(ctx.maximumRenderedBadgeCount).toBe(2)
    expect(ctx.unRenderedBadgeCount).toBe(2)
  })

  it('getBadges ensures at least one badge when list exists', () => {
    const ctx = {
      badges: ['x'.repeat(50)],
      unRenderedBadgeCount: 0,
      maximumRenderedBadgeCount: 0,
      showMaximumBadgeCount: 0
    }
    ShowMoreTags.methods.getBadges.call(ctx)

    expect(ctx.maximumRenderedBadgeCount).toBe(1)
    expect(ctx.unRenderedBadgeCount).toBe(0)
  })

  it('getBadges normalizes negative max badge count safely', () => {
    const ctx = {
      badges: ['alpha', 'beta'],
      unRenderedBadgeCount: 0,
      maximumRenderedBadgeCount: 0,
      showMaximumBadgeCount: -5
    }

    ShowMoreTags.methods.getBadges.call(ctx)

    expect(ctx.maximumRenderedBadgeCount).toBe(1)
    expect(ctx.unRenderedBadgeCount).toBe(1)
  })
})
