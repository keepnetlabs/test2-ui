import Badge from '@/components/Badge.vue'

describe('Badge.vue', () => {
  const getBadgeSize = Badge.getBadgeSize
  const getDynamicProps = Badge.getDynamicProps

  describe('getBadgeSize method', () => {
    it('getBadgeSize returns correct class for medium size', () => {
      expect(getBadgeSize('medium')).toBe('k-badge__sizes--medium')
    })

    it('getBadgeSize returns correct class for small size', () => {
      expect(getBadgeSize('small')).toBe('k-badge__sizes--small')
    })

    it('getBadgeSize returns correct class for mini size', () => {
      expect(getBadgeSize('mini')).toBe('k-badge__sizes--mini')
    })

    it('getBadgeSize returns correct class for auto size', () => {
      expect(getBadgeSize('auto')).toBe('k-badge__sizes--auto')
    })

    it('getBadgeSize returns empty string for unknown size', () => {
      expect(getBadgeSize('unknown')).toBe('')
    })

    it('getBadgeSize returns empty string for undefined size', () => {
      expect(getBadgeSize(undefined)).toBe('')
    })

    it('getBadgeSize returns empty string for null size', () => {
      expect(getBadgeSize(null)).toBe('')
    })

    it('getBadgeSize returns empty string for empty string', () => {
      expect(getBadgeSize('')).toBe('')
    })

    it('getBadgeSize is case sensitive', () => {
      expect(getBadgeSize('MEDIUM')).toBe('')
      expect(getBadgeSize('Small')).toBe('')
    })

    it('getBadgeSize handles all size variations', () => {
      const sizes = ['medium', 'small', 'mini', 'auto']
      const results = sizes.map(getBadgeSize)
      expect(results.every(r => r !== '')).toBe(true)
    })
  })

  describe('getDynamicProps method - outline mode', () => {
    it('getDynamicProps returns background color for outline=true', () => {
      const props = {
        outline: true,
        color: 'red',
        defaultBackgroundColor: '#fff',
        hideBorder: false
      }
      const dynamicProps = getDynamicProps(props)
      expect(dynamicProps.color).toBe('#fff')
    })

    it('getDynamicProps returns style array for outline=true', () => {
      const props = {
        outline: true,
        color: 'red',
        defaultBackgroundColor: '#fff',
        hideBorder: false
      }
      const dynamicProps = getDynamicProps(props)
      expect(Array.isArray(dynamicProps.style)).toBe(true)
    })

    it('getDynamicProps includes border styling for outline=true', () => {
      const props = {
        outline: true,
        color: 'red',
        defaultBackgroundColor: '#fff',
        hideBorder: false
      }
      const dynamicProps = getDynamicProps(props)
      const styleObj = dynamicProps.style[0]
      expect(styleObj.border).toContain('1px solid red')
    })

    it('getDynamicProps includes text color for outline=true', () => {
      const props = {
        outline: true,
        color: 'blue',
        defaultBackgroundColor: '#fff',
        hideBorder: false
      }
      const dynamicProps = getDynamicProps(props)
      expect(dynamicProps.style[0].color).toBe('blue')
    })

    it('getDynamicProps hides border when hideBorder is true', () => {
      const props = {
        outline: true,
        hideBorder: true,
        color: 'green',
        defaultBackgroundColor: '#fff'
      }
      const dynamicProps = getDynamicProps(props)
      expect(dynamicProps.style[0].border).toBe('none')
    })

    it('getDynamicProps shows border when hideBorder is false', () => {
      const props = {
        outline: true,
        hideBorder: false,
        color: 'purple',
        defaultBackgroundColor: '#fff'
      }
      const dynamicProps = getDynamicProps(props)
      expect(dynamicProps.style[0].border).toContain('1px solid purple')
    })

    it('getDynamicProps uses different colors for different props', () => {
      const colors = ['red', 'blue', 'green', 'yellow']
      const results = colors.map(color => {
        const props = {
          outline: true,
          color,
          defaultBackgroundColor: '#fff',
          hideBorder: false
        }
        return getDynamicProps(props).style[0].color
      })
      expect(results).toEqual(['red', 'blue', 'green', 'yellow'])
    })

    it('getDynamicProps includes background color property', () => {
      const props = {
        outline: true,
        color: 'red',
        defaultBackgroundColor: '#f0f0f0',
        hideBorder: false
      }
      const dynamicProps = getDynamicProps(props)
      expect(dynamicProps.color).toBe('#f0f0f0')
    })
  })

  describe('getDynamicProps method - non-outline mode', () => {
    it('getDynamicProps returns color for outline=false', () => {
      const props = {
        outline: false,
        color: 'blue',
        defaultBackgroundColor: '#fff'
      }
      const dynamicProps = getDynamicProps(props)
      expect(dynamicProps.color).toBe('blue')
    })

    it('getDynamicProps sets rounded to true for outline=false', () => {
      const props = {
        outline: false,
        color: 'blue',
        defaultBackgroundColor: '#fff'
      }
      const dynamicProps = getDynamicProps(props)
      expect(dynamicProps.rounded).toBe(true)
    })

    it('getDynamicProps handles style from col for outline=false', () => {
      const props = {
        outline: false,
        color: 'green',
        defaultBackgroundColor: '#fff',
        col: {
          props: {
            style: { padding: '10px' }
          }
        }
      }
      const dynamicProps = getDynamicProps(props)
      expect(dynamicProps.style).toEqual({ padding: '10px' })
    })

    it('getDynamicProps returns undefined style when col is missing', () => {
      const props = {
        outline: false,
        color: 'orange',
        defaultBackgroundColor: '#fff'
      }
      const dynamicProps = getDynamicProps(props)
      expect(dynamicProps.style).toBeUndefined()
    })

    it('getDynamicProps style is not an array for outline=false', () => {
      const props = {
        outline: false,
        color: 'purple',
        defaultBackgroundColor: '#fff'
      }
      const dynamicProps = getDynamicProps(props)
      expect(Array.isArray(dynamicProps.style)).not.toBe(true)
    })

    it('getDynamicProps uses text color for outline=false', () => {
      const props = {
        outline: false,
        color: 'red',
        defaultBackgroundColor: '#fff'
      }
      const dynamicProps = getDynamicProps(props)
      expect(dynamicProps.color).toBe('red')
    })
  })

  describe('getDynamicProps edge cases', () => {
    it('getDynamicProps handles empty props object', () => {
      const dynamicProps = getDynamicProps({})
      expect(dynamicProps).toBeDefined()
      expect(typeof dynamicProps).toBe('object')
    })

    it('getDynamicProps handles undefined props', () => {
      const dynamicProps = getDynamicProps(undefined)
      expect(dynamicProps).toBeDefined()
    })

    it('getDynamicProps handles null color', () => {
      const props = {
        outline: true,
        color: null,
        defaultBackgroundColor: '#fff',
        hideBorder: false
      }
      const dynamicProps = getDynamicProps(props)
      expect(dynamicProps.style[0].color).toBe(null)
    })

    it('getDynamicProps handles special color values', () => {
      const specialColors = ['#FF0000', 'rgb(255,0,0)', 'transparent']
      specialColors.forEach(color => {
        const props = {
          outline: true,
          color,
          defaultBackgroundColor: '#fff',
          hideBorder: false
        }
        const dynamicProps = getDynamicProps(props)
        expect(dynamicProps.style[0].color).toBe(color)
      })
    })

    it('getDynamicProps handles col with missing props', () => {
      const props = {
        outline: true,
        color: 'blue',
        defaultBackgroundColor: '#fff',
        hideBorder: false,
        col: {
          props: null
        }
      }
      const dynamicProps = getDynamicProps(props)
      expect(Array.isArray(dynamicProps.style)).toBe(true)
    })

    it('getDynamicProps maintains hideBorder flag correctly', () => {
      const withBorder = getDynamicProps({
        outline: true,
        color: 'red',
        defaultBackgroundColor: '#fff',
        hideBorder: false
      })
      const withoutBorder = getDynamicProps({
        outline: true,
        color: 'red',
        defaultBackgroundColor: '#fff',
        hideBorder: true
      })
      expect(withBorder.style[0].border).toContain('1px solid')
      expect(withoutBorder.style[0].border).toBe('none')
    })
  })

  describe('props validation', () => {
    it('Badge has expected prop keys', () => {
      const expectedProps = ['id', 'color', 'isBlackText', 'defaultBackgroundColor', 'text', 'textBlack', 'listeners', 'fullWidth', 'size', 'style', 'className', 'col', 'outline', 'isErrorState', 'errorStateValue', 'hideBorder']
      const componentProps = Object.keys(Badge.props)
      expect(componentProps).toEqual(expect.arrayContaining(expectedProps))
    })

    it('Badge has correct default values', () => {
      expect(Badge.props.fullWidth.default).toBe(true)
      expect(Badge.props.size.default).toBe('medium')
      expect(Badge.props.outline.default).toBe(true)
    })
  })

  describe('static methods availability', () => {
    it('Badge has getBadgeSize static method', () => {
      expect(typeof Badge.getBadgeSize).toBe('function')
    })

    it('Badge has getDynamicProps static method', () => {
      expect(typeof Badge.getDynamicProps).toBe('function')
    })

    it('getBadgeSize is callable', () => {
      expect(() => {
        Badge.getBadgeSize('medium')
      }).not.toThrow()
    })

    it('getDynamicProps is callable', () => {
      expect(() => {
        Badge.getDynamicProps({})
      }).not.toThrow()
    })
  })

  describe('method return types', () => {
    it('getBadgeSize returns string', () => {
      expect(typeof Badge.getBadgeSize('medium')).toBe('string')
    })

    it('getDynamicProps returns object', () => {
      expect(typeof Badge.getDynamicProps({})).toBe('object')
    })

    it('getDynamicProps returns non-null object', () => {
      expect(Badge.getDynamicProps({})).not.toBeNull()
    })

    it('getDynamicProps.style is array or undefined for outline mode', () => {
      const result = Badge.getDynamicProps({ outline: true, color: 'red', defaultBackgroundColor: '#fff' })
      expect(Array.isArray(result.style) || result.style === undefined).toBe(true)
    })
  })

  describe('component metadata', () => {
    it('Badge has correct name', () => {
      expect(Badge.name).toBe('Badge')
    })

    it('Badge is functional component', () => {
      expect(Badge.functional).toBe(true)
    })
  })
})
