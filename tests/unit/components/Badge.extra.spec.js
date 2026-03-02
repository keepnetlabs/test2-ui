import Badge from '@/components/Badge.vue'

describe('Badge.vue (extra branch coverage)', () => {
  describe('getDynamicProps branches', () => {
    it('handles col null when outline false', () => {
      const props = { outline: false, color: '#2196f3', col: null }
      const result = Badge.getDynamicProps(props)
      expect(result.style).toBeFalsy()
      expect(result.color).toBe('#2196f3')
    })
    it('handles col without props when outline false', () => {
      const props = { outline: false, color: '#2196f3', col: {} }
      const result = Badge.getDynamicProps(props)
      expect(result.style).toBeUndefined()
    })
    it('handles col.props null when outline true', () => {
      const props = {
        outline: true,
        color: '#f56c6c',
        defaultBackgroundColor: '#fff',
        hideBorder: false,
        col: { props: null }
      }
      const result = Badge.getDynamicProps(props)
      expect(result.style[1]).toBeFalsy()
    })
  })

  describe('getBadgeSize', () => {
    it('returns empty for unknown size', () => {
      expect(Badge.getBadgeSize('xlarge')).toBe('')
      expect(Badge.getBadgeSize('')).toBe('')
    })
    it('returns medium class for medium size', () => {
      expect(Badge.getBadgeSize('medium')).toBe('k-badge__sizes--medium')
    })
    it('returns small class for small size', () => {
      expect(Badge.getBadgeSize('small')).toBe('k-badge__sizes--small')
    })
    it('returns mini class for mini size', () => {
      expect(Badge.getBadgeSize('mini')).toBe('k-badge__sizes--mini')
    })
    it('returns auto class for auto size', () => {
      expect(Badge.getBadgeSize('auto')).toBe('k-badge__sizes--auto')
    })
  })

  describe('getDynamicProps hideBorder branch', () => {
    it('sets border none when hideBorder is true and outline true', () => {
      const props = {
        outline: true,
        color: '#f56c6c',
        defaultBackgroundColor: '#fff',
        hideBorder: true,
        col: null
      }
      const result = Badge.getDynamicProps(props)
      expect(result.style[0].border).toBe('none')
    })
    it('sets border with color when hideBorder is false and outline true', () => {
      const props = {
        outline: true,
        color: '#2196f3',
        defaultBackgroundColor: '#fff',
        hideBorder: false,
        col: null
      }
      const result = Badge.getDynamicProps(props)
      expect(result.style[0].border).toContain('1px solid')
      expect(result.style[0].border).toContain('#2196f3')
    })
  })
})
