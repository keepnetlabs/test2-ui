import Badge from '@/components/Badge.vue'

describe('Badge.vue helpers', () => {
  it('returns expected badge size class', () => {
    expect(Badge.getBadgeSize('medium')).toBe('k-badge__sizes--medium')
    expect(Badge.getBadgeSize('small')).toBe('k-badge__sizes--small')
    expect(Badge.getBadgeSize('mini')).toBe('k-badge__sizes--mini')
    expect(Badge.getBadgeSize('auto')).toBe('k-badge__sizes--auto')
    expect(Badge.getBadgeSize('unknown')).toBe('')
  })

  it('builds dynamic props for filled style when outline is false', () => {
    const props = {
      outline: false,
      color: '#2196f3',
      col: { props: { style: { width: '100px' } } }
    }

    expect(Badge.getDynamicProps(props)).toEqual({
      color: '#2196f3',
      style: { width: '100px' },
      rounded: true
    })
  })

  it('builds dynamic props for outlined style with optional border removal', () => {
    const withBorder = Badge.getDynamicProps({
      outline: true,
      color: '#f56c6c',
      defaultBackgroundColor: '#fff',
      hideBorder: false,
      col: { props: { style: { fontWeight: 600 } } }
    })

    expect(withBorder.color).toBe('#fff')
    expect(withBorder.style[0]).toEqual({
      border: '1px solid #f56c6c !important',
      color: '#f56c6c'
    })
    expect(withBorder.style[1]).toEqual({ fontWeight: 600 })

    const withoutBorder = Badge.getDynamicProps({
      outline: true,
      color: '#f56c6c',
      defaultBackgroundColor: '#fff',
      hideBorder: true
    })
    expect(withoutBorder.style[0].border).toBe('none')
  })
})
