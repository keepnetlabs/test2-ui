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
  })
})
