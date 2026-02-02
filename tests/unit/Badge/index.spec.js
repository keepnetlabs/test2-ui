import Badge from '@/components/Badge.vue'

describe('Badge.vue', () => {
  // Test the component's exported methods directly
  const getBadgeSize = Badge.getBadgeSize
  const getDynamicProps = Badge.getDynamicProps

  it('getBadgeSize returns correct class for default size', () => {
    expect(getBadgeSize('medium')).toBe('k-badge__sizes--medium')
  })

  it('getBadgeSize returns correct class for different sizes', () => {
    expect(getBadgeSize('small')).toBe('k-badge__sizes--small')
    expect(getBadgeSize('mini')).toBe('k-badge__sizes--mini')
    expect(getBadgeSize('auto')).toBe('k-badge__sizes--auto')
  })

  it('getBadgeSize returns empty string for unknown size', () => {
    expect(getBadgeSize('unknown')).toBe('')
  })

  it('getDynamicProps returns color for outline=true', () => {
    const props = {
      outline: true,
      color: 'red',
      defaultBackgroundColor: '#fff',
      hideBorder: false
    }
    const dynamicProps = getDynamicProps(props)
    expect(dynamicProps.color).toBe('#fff')
  })

  it('getDynamicProps returns style with border for outline=true', () => {
    const props = {
      outline: true,
      color: 'red',
      defaultBackgroundColor: '#fff',
      hideBorder: false
    }
    const dynamicProps = getDynamicProps(props)
    expect(dynamicProps.style[0].borderColor || dynamicProps.style[0].border).toBeDefined()
    expect(dynamicProps.style[0].color).toBe('red')
  })

  it('getDynamicProps hides border when hideBorder is true', () => {
    const props = {
      outline: true,
      hideBorder: true,
      color: 'green',
      defaultBackgroundColor: '#fff'
    }
    const dynamicProps = getDynamicProps(props)
    const styleObj = dynamicProps.style[0]
    expect(styleObj.border).toBe('none')
  })

  it('getDynamicProps returns color for outline=false', () => {
    const props = {
      outline: false,
      color: 'blue',
      defaultBackgroundColor: '#fff'
    }
    const dynamicProps = getDynamicProps(props)
    expect(dynamicProps.color).toBe('blue')
    expect(dynamicProps.rounded).toBe(true)
  })
})
