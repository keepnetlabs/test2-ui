jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => '42')
}))

import ShowMoreTags from '@/components/ShowMoreTags.vue'

describe('ShowMoreTags.vue (extra branch coverage)', () => {
  describe('getBadges branches', () => {
    it('returns early when badges.length <= 0', () => {
      const ctx = {
        badges: [],
        unRenderedBadgeCount: 0,
        maximumRenderedBadgeCount: 0,
        showMaximumBadgeCount: 0
      }
      ShowMoreTags.methods.getBadges.call(ctx)
      expect(ctx.maximumRenderedBadgeCount).toBe(0)
    })
    it('uses totalWidth minus 40 when unRenderedBadgeCount exists (second run)', () => {
      const ctx = {
        badges: ['a', 'b', 'c'],
        unRenderedBadgeCount: 2,
        maximumRenderedBadgeCount: 1,
        showMaximumBadgeCount: 0
      }
      ShowMoreTags.methods.getBadges.call(ctx)
      expect(ctx.maximumRenderedBadgeCount).toBeGreaterThanOrEqual(0)
    })
    it('uses showMaximumBadgeCount when provided and less than renderedCount', () => {
      const ctx = {
        badges: ['a', 'b', 'c', 'd', 'e'],
        unRenderedBadgeCount: 0,
        maximumRenderedBadgeCount: 0,
        showMaximumBadgeCount: 2
      }
      ShowMoreTags.methods.getBadges.call(ctx)
      expect(ctx.maximumRenderedBadgeCount).toBe(2)
    })
    it('caps maximumRenderedBadgeCount to badges.length when exceeds', () => {
      const ctx = {
        badges: ['a', 'b'],
        unRenderedBadgeCount: 0,
        maximumRenderedBadgeCount: 0,
        showMaximumBadgeCount: 10
      }
      ShowMoreTags.methods.getBadges.call(ctx)
      expect(ctx.maximumRenderedBadgeCount).toBe(2)
    })
    it('sets maximumRenderedBadgeCount to 1 when 0 and maxWidth > 100', () => {
      const ctx = {
        badges: ['a'.repeat(50)],
        unRenderedBadgeCount: 0,
        maximumRenderedBadgeCount: 0,
        showMaximumBadgeCount: 0
      }
      ShowMoreTags.methods.getBadges.call(ctx)
      expect(ctx.maximumRenderedBadgeCount).toBe(1)
    })
    it('normalizes negative showMaximumBadgeCount then applies min-1 rule', () => {
      const ctx = {
        badges: ['a', 'b', 'c'],
        unRenderedBadgeCount: 0,
        maximumRenderedBadgeCount: 0,
        showMaximumBadgeCount: -5
      }
      ShowMoreTags.methods.getBadges.call(ctx)
      expect(ctx.maximumRenderedBadgeCount).toBe(1)
    })
    it('breaks loop when itemWidth exceeds totalWidth', () => {
      const ctx = {
        badges: ['a'.repeat(100)],
        unRenderedBadgeCount: 0,
        maximumRenderedBadgeCount: 0,
        showMaximumBadgeCount: 0
      }
      ShowMoreTags.methods.getBadges.call(ctx)
      expect(ctx.maximumRenderedBadgeCount).toBe(1)
    })
  })

  describe('getBadgeText', () => {
    it('returns text as-is when length <= 25', () => {
      expect(ShowMoreTags.methods.getBadgeText('short')).toBe('short')
    })
    it('returns truncated with ellipsis when length > 25', () => {
      const long = 'a'.repeat(30)
      expect(ShowMoreTags.methods.getBadgeText(long)).toBe('a'.repeat(25) + '...')
    })
    it('returns default empty when no arg', () => {
      expect(ShowMoreTags.methods.getBadgeText()).toBe('')
    })
  })
})
