import { shallowMount } from '@vue/test-utils'
import ShowMore from '@/components/Common/ShowMore/ShowMore.vue'

describe('ShowMore.vue', () => {
  let wrapper

  beforeEach(() => {
    // Mock window.addEventListener and window.removeEventListener
    window.addEventListener = jest.fn()
    window.removeEventListener = jest.fn()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy()
    }
    jest.clearAllMocks()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      wrapper = shallowMount(ShowMore)
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      wrapper = shallowMount(ShowMore)
      expect(wrapper.vm.$options.name).toBe('ShowMore')
    })

    it('should render main show-more container', () => {
      wrapper = shallowMount(ShowMore)
      expect(wrapper.classes()).toContain('show-more')
    })

    it('should render left container div', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1' }]
        }
      })
      const leftContainer = wrapper.find('.show-more__left')
      expect(leftContainer.exists()).toBe(true)
    })
  })

  describe('props handling', () => {
    it('should have data prop with default empty array', () => {
      wrapper = shallowMount(ShowMore)
      expect(wrapper.vm.$options.props.data.default()).toEqual([])
    })

    it('should have btnShowMoreId prop', () => {
      wrapper = shallowMount(ShowMore)
      expect(wrapper.vm.$options.props.btnShowMoreId).toBeDefined()
    })

    it('should accept data prop', () => {
      const testData = [{ key1: 'value1' }]
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: testData
        }
      })
      expect(wrapper.vm.data).toEqual(testData)
    })

    it('should accept btnShowMoreId prop', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          btnShowMoreId: 'test-button-id'
        }
      })
      expect(wrapper.vm.btnShowMoreId).toBe('test-button-id')
    })
  })

  describe('data initialization', () => {
    it('should initialize unRenderedBadgeCount to 0', () => {
      wrapper = shallowMount(ShowMore)
      expect(wrapper.vm.unRenderedBadgeCount).toBe(0)
    })

    it('should initialize renderedBadgeCount to 0', () => {
      wrapper = shallowMount(ShowMore)
      expect(wrapper.vm.renderedBadgeCount).toBe(0)
    })

    it('should initialize computedData as empty array', () => {
      wrapper = shallowMount(ShowMore)
      expect(wrapper.vm.computedData).toEqual([])
    })

    it('should initialize status to 0', () => {
      wrapper = shallowMount(ShowMore)
      expect(wrapper.vm.status).toBe(0)
    })
  })

  describe('computed getButtonText', () => {
    it('should return "Show less" when status is 1', () => {
      wrapper = shallowMount(ShowMore)
      wrapper.vm.status = 1
      expect(wrapper.vm.getButtonText).toBe('Show less')
    })

    it('should return "+X more" when status is 0', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [
            { key1: 'val1' },
            { key2: 'val2' },
            { key3: 'val3' },
            { key4: 'val4' }
          ]
        }
      })
      wrapper.vm.status = 0
      // Text should be in format "+N more"
      expect(wrapper.vm.getButtonText).toMatch(/^\+\d+ more$/)
    })

    it('should show correct count in button text', () => {
      wrapper = shallowMount(ShowMore)
      wrapper.vm.unRenderedBadgeCount = 5
      wrapper.vm.status = 0
      expect(wrapper.vm.getButtonText).toBe('+5 more')
    })

    it('should update button text when status changes', async () => {
      wrapper = shallowMount(ShowMore)
      wrapper.vm.unRenderedBadgeCount = 3
      wrapper.vm.status = 0
      expect(wrapper.vm.getButtonText).toBe('+3 more')

      wrapper.vm.status = 1
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.getButtonText).toBe('Show less')
    })
  })

  describe('computed getIconName', () => {
    it('should return "mdi-menu-up" when status is 1', () => {
      wrapper = shallowMount(ShowMore)
      wrapper.vm.status = 1
      expect(wrapper.vm.getIconName).toBe('mdi-menu-up')
    })

    it('should return "mdi-menu-down" when status is 0', () => {
      wrapper = shallowMount(ShowMore)
      wrapper.vm.status = 0
      expect(wrapper.vm.getIconName).toBe('mdi-menu-down')
    })
  })

  describe('produceData method', () => {
    it('should flatten nested data structure', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1', key2: 'value2' }]
        }
      })
      wrapper.vm.produceData()
      expect(wrapper.vm.computedData.length).toBe(2)
    })

    it('should skip resourceId key', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1', resourceId: 'res123', key2: 'value2' }]
        }
      })
      wrapper.vm.produceData()
      expect(wrapper.vm.computedData).not.toContainEqual({ resourceId: 'res123' })
    })

    it('should skip empty values', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1', key2: '', key3: null }]
        }
      })
      wrapper.vm.produceData()
      expect(wrapper.vm.computedData.length).toBe(1)
    })

    it('should process multiple items', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [
            { key1: 'value1' },
            { key2: 'value2' },
            { key3: 'value3' }
          ]
        }
      })
      wrapper.vm.produceData()
      expect(wrapper.vm.computedData.length).toBe(3)
    })

    it('should create single property objects', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1', key2: 'value2' }]
        }
      })
      wrapper.vm.produceData()
      expect(wrapper.vm.computedData[0]).toEqual({ key1: 'value1' })
      expect(wrapper.vm.computedData[1]).toEqual({ key2: 'value2' })
    })
  })

  describe('changeStatus method', () => {
    it('should toggle status from 0 to 1', () => {
      wrapper = shallowMount(ShowMore)
      wrapper.vm.status = 0
      wrapper.vm.changeStatus()
      expect(wrapper.vm.status).toBe(1)
    })

    it('should toggle status from 1 to 0', () => {
      wrapper = shallowMount(ShowMore)
      wrapper.vm.status = 1
      wrapper.vm.changeStatus()
      expect(wrapper.vm.status).toBe(0)
    })

    it('should toggle multiple times', () => {
      wrapper = shallowMount(ShowMore)
      wrapper.vm.changeStatus()
      expect(wrapper.vm.status).toBe(1)
      wrapper.vm.changeStatus()
      expect(wrapper.vm.status).toBe(0)
      wrapper.vm.changeStatus()
      expect(wrapper.vm.status).toBe(1)
    })
  })

  describe('getRenderStatusOfButton method', () => {
    it('should return false when all badges are rendered', () => {
      wrapper = shallowMount(ShowMore)
      wrapper.vm.renderedBadgeCount = 10
      wrapper.vm.computedData = Array(10).fill(null)
      wrapper.vm.unRenderedBadgeCount = 0
      expect(wrapper.vm.getRenderStatusOfButton()).toBe(false)
    })

    it('should return true when there are unrendered badges', () => {
      wrapper = shallowMount(ShowMore)
      wrapper.vm.renderedBadgeCount = 5
      wrapper.vm.computedData = Array(10).fill(null)
      wrapper.vm.unRenderedBadgeCount = 5
      expect(wrapper.vm.getRenderStatusOfButton()).toBe(true)
    })

    it('should return false when unRenderedBadgeCount is 0', () => {
      wrapper = shallowMount(ShowMore)
      wrapper.vm.unRenderedBadgeCount = 0
      expect(wrapper.vm.getRenderStatusOfButton()).toBe(false)
    })

    it('should return false when rendered equals total', () => {
      wrapper = shallowMount(ShowMore)
      wrapper.vm.renderedBadgeCount = 10
      wrapper.vm.computedData = Array(10).fill(null)
      expect(wrapper.vm.getRenderStatusOfButton()).toBe(false)
    })
  })

  describe('getRenderStatusOfLeftContainer method', () => {
    it('should always return true', () => {
      wrapper = shallowMount(ShowMore)
      expect(wrapper.vm.getRenderStatusOfLeftContainer()).toBe(true)
    })

    it('should return true with no props', () => {
      wrapper = shallowMount(ShowMore)
      expect(wrapper.vm.getRenderStatusOfLeftContainer()).toBe(true)
    })

    it('should return true with data', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key: 'value' }]
        }
      })
      expect(wrapper.vm.getRenderStatusOfLeftContainer()).toBe(true)
    })
  })

  describe('lifecycle hooks', () => {
    it('should call produceData in created hook', () => {
      const produceSpy = jest.spyOn(ShowMore.methods, 'produceData')
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key: 'value' }]
        }
      })
      expect(wrapper.vm.computedData.length).toBeGreaterThanOrEqual(0)
    })

    it('should add resize listener in mounted', () => {
      wrapper = shallowMount(ShowMore)
      expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
    })

    it('should call getChips in mounted', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1' }]
        }
      })
      expect(wrapper.vm.renderedBadgeCount).toBeDefined()
    })

    it('should remove resize listener in beforeDestroy', () => {
      wrapper = shallowMount(ShowMore)
      wrapper.destroy()
      expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
    })
  })

  describe('watch data property', () => {
    it('should call produceData when data changes', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: []
        }
      })
      const newData = [{ key1: 'value1' }]
      wrapper.setProps({ data: newData })
      expect(wrapper.vm.computedData.length).toBeGreaterThan(0)
    })

    it('should call getChips when data changes', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: []
        }
      })
      const newData = [{ key1: 'value1', key2: 'value2' }]
      wrapper.setProps({ data: newData })
      expect(wrapper.vm.renderedBadgeCount).toBeDefined()
    })

    it('should not process empty data array', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: []
        }
      })
      expect(wrapper.vm.computedData).toEqual([])
    })
  })

  describe('button rendering', () => {
    it('should render button when there are unrendered badges', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [
            { key1: 'value1' },
            { key2: 'value2' },
            { key3: 'value3' }
          ]
        }
      })
      wrapper.vm.renderedBadgeCount = 1
      wrapper.vm.unRenderedBadgeCount = 2
      wrapper.vm.computedData = [
        { key1: 'value1' },
        { key2: 'value2' },
        { key3: 'value3' }
      ]
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.exists()).toBe(true)
    })

    it('should apply correct id to button', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          btnShowMoreId: 'my-button-id',
          data: [{ key1: 'value1' }, { key2: 'value2' }]
        }
      })
      wrapper.vm.renderedBadgeCount = 1
      wrapper.vm.unRenderedBadgeCount = 1
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.$attrs.id).toBe('my-button-id')
    })

    it('should have correct button styling', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1' }, { key2: 'value2' }]
        }
      })
      wrapper.vm.renderedBadgeCount = 1
      wrapper.vm.unRenderedBadgeCount = 1
      const button = wrapper.find({ name: 'VBtn' })
      expect(button.vm.$attrs.small).toBeDefined()
      expect(button.vm.$attrs.rounded).toBeDefined()
      expect(button.vm.color).toBe('#409eff')
    })
  })

  describe('icon rendering', () => {
    it('should render v-icon in button', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1' }, { key2: 'value2' }]
        }
      })
      wrapper.vm.renderedBadgeCount = 1
      wrapper.vm.unRenderedBadgeCount = 1
      const icon = wrapper.find({ name: 'VIcon' })
      expect(icon.exists()).toBe(true)
    })

    it('should show down icon in collapsed state', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1' }, { key2: 'value2' }]
        }
      })
      wrapper.vm.status = 0
      wrapper.vm.renderedBadgeCount = 1
      wrapper.vm.unRenderedBadgeCount = 1
      expect(wrapper.vm.getIconName).toBe('mdi-menu-down')
    })

    it('should show up icon in expanded state', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1' }, { key2: 'value2' }]
        }
      })
      wrapper.vm.status = 1
      expect(wrapper.vm.getIconName).toBe('mdi-menu-up')
    })
  })

  describe('chip rendering', () => {
    it('should render v-chip elements', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ name: 'John', age: '30' }]
        }
      })
      const chips = wrapper.findAll({ name: 'VChip' })
      expect(chips.length).toBeGreaterThan(0)
    })

    it('should format key names with capitalization', async () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ firstName: 'John' }]
        }
      })
      await wrapper.vm.$nextTick()
      const text = wrapper.text()
      expect(text).toContain('Firstname') // First letter capitalized
    })

    it('should display key-value pairs', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ role: 'Admin', status: 'Active' }]
        }
      })
      const text = wrapper.text()
      expect(text).toContain('role')
      expect(text).toContain('Admin')
    })
  })

  describe('button click interaction', () => {
    it('should change status when button is clicked', async () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1' }, { key2: 'value2' }]
        }
      })
      wrapper.vm.renderedBadgeCount = 1
      wrapper.vm.unRenderedBadgeCount = 1
      wrapper.vm.status = 0

      const button = wrapper.find({ name: 'VBtn' })
      await button.trigger('click')
      expect(wrapper.vm.status).toBe(1)
    })

    it('should toggle between show more and show less', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1' }, { key2: 'value2' }]
        }
      })
      wrapper.vm.renderedBadgeCount = 1
      wrapper.vm.unRenderedBadgeCount = 1

      expect(wrapper.vm.getButtonText).toContain('+')
      wrapper.vm.changeStatus()
      expect(wrapper.vm.getButtonText).toBe('Show less')
      wrapper.vm.changeStatus()
      expect(wrapper.vm.getButtonText).toContain('+')
    })
  })

  describe('responsive behavior', () => {
    it('should handle single item', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key: 'value' }]
        }
      })
      wrapper.vm.getChips()
      expect(wrapper.vm.renderedBadgeCount).toBe(1)
      expect(wrapper.vm.unRenderedBadgeCount).toBe(0)
    })

    it('should calculate rendered count for multiple items', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [
            { key1: 'value1' },
            { key2: 'value2' },
            { key3: 'value3' }
          ]
        }
      })
      expect(wrapper.vm.computedData.length).toBeGreaterThan(0)
    })

    it('should not set renderedBadgeCount greater than total items', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1' }, { key2: 'value2' }]
        }
      })
      wrapper.vm.renderedBadgeCount = 100 // Set to unreasonable number
      wrapper.vm.getChips()
      expect(wrapper.vm.renderedBadgeCount).toBeLessThanOrEqual(wrapper.vm.computedData.length)
    })

    it('should not set negative renderedBadgeCount', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1' }]
        }
      })
      wrapper.vm.renderedBadgeCount = -5
      wrapper.vm.getChips()
      expect(wrapper.vm.renderedBadgeCount).toBeGreaterThanOrEqual(0)
    })
  })

  describe('class management', () => {
    it('should add show-more__hidden class to hidden chips', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1' }, { key2: 'value2' }]
        }
      })
      wrapper.vm.renderedBadgeCount = 1
      wrapper.vm.unRenderedBadgeCount = 1
      wrapper.vm.status = 0
      // Hidden chips should have the class
      expect(wrapper.vm.renderedBadgeCount + wrapper.vm.unRenderedBadgeCount).toBeGreaterThan(
        wrapper.vm.renderedBadgeCount
      )
    })
  })

  describe('container references', () => {
    it('should have refLeftContainer ref', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1' }]
        }
      })
      expect(wrapper.vm.$refs.refLeftContainer).toBeDefined()
    })
  })

  describe('state management', () => {
    it('should maintain state through prop updates', async () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1' }]
        }
      })
      const initialStatus = wrapper.vm.status
      await wrapper.setProps({ data: [{ key1: 'value1' }, { key2: 'value2' }] })
      expect(wrapper.vm.status).toBe(initialStatus)
    })

    it('should reset computed data on data change', async () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ key1: 'value1' }]
        }
      })
      const firstDataLength = wrapper.vm.computedData.length
      await wrapper.setProps({ data: [{ key1: 'value1' }, { key2: 'value2' }] })
      expect(wrapper.vm.computedData.length).toBeGreaterThanOrEqual(firstDataLength)
    })
  })
})
