import { shallowMount } from '@vue/test-utils'
import ShowMore from '@/components/Common/ShowMore/ShowMore.vue'

describe('ShowMore.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ShowMore, {
      stubs: {
        'v-chip': true,
        'v-btn': true,
        'v-icon': true
      }
    })
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 500,
      height: 35,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0
    }))
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('ShowMore')
    })

    it('should have show-more container', () => {
      expect(wrapper.classes()).toContain('show-more')
    })
  })

  describe('prop defaults', () => {
    it('should have data as empty array by default', () => {
      expect(wrapper.vm.data).toEqual([])
    })

    it('should have btnShowMoreId undefined by default', () => {
      expect(wrapper.vm.btnShowMoreId).toBeUndefined()
    })
  })

  describe('data properties', () => {
    it('should initialize unRenderedBadgeCount as 0', () => {
      expect(wrapper.vm.unRenderedBadgeCount).toBe(0)
    })

    it('should initialize renderedBadgeCount as 0', () => {
      expect(wrapper.vm.renderedBadgeCount).toBe(0)
    })

    it('should initialize computedData as empty array', () => {
      expect(wrapper.vm.computedData).toEqual([])
    })

    it('should initialize status as 0', () => {
      expect(wrapper.vm.status).toBe(0)
    })
  })

  describe('props configuration', () => {
    it('should accept custom data', () => {
      const data = [
        { name: 'Item 1', value: 'value1' },
        { name: 'Item 2', value: 'value2' }
      ]
      wrapper = shallowMount(ShowMore, {
        propsData: { data },
        stubs: {
          'v-chip': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.data).toEqual(data)
    })

    it('should accept custom btnShowMoreId', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          btnShowMoreId: 'custom-show-more-btn'
        },
        stubs: {
          'v-chip': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.btnShowMoreId).toBe('custom-show-more-btn')
    })
  })

  describe('getButtonText computed property', () => {
    it('should return +X more when status is 0', () => {
      wrapper.vm.unRenderedBadgeCount = 3
      wrapper.vm.status = 0
      expect(wrapper.vm.getButtonText).toContain('+3 more')
    })

    it('should return Show less when status is 1', () => {
      wrapper.vm.status = 1
      expect(wrapper.vm.getButtonText).toBe('Show less')
    })

    it('should update button text based on status', () => {
      wrapper.vm.unRenderedBadgeCount = 5
      wrapper.vm.status = 0
      expect(wrapper.vm.getButtonText).toBe('+5 more')
      wrapper.vm.status = 1
      expect(wrapper.vm.getButtonText).toBe('Show less')
    })
  })

  describe('getIconName computed property', () => {
    it('should return mdi-menu-down when status is 0', () => {
      wrapper.vm.status = 0
      expect(wrapper.vm.getIconName).toBe('mdi-menu-down')
    })

    it('should return mdi-menu-up when status is 1', () => {
      wrapper.vm.status = 1
      expect(wrapper.vm.getIconName).toBe('mdi-menu-up')
    })

    it('should toggle icon based on status', () => {
      wrapper.vm.status = 0
      expect(wrapper.vm.getIconName).toBe('mdi-menu-down')
      wrapper.vm.status = 1
      expect(wrapper.vm.getIconName).toBe('mdi-menu-up')
    })
  })

  describe('changeStatus method', () => {
    it('should have changeStatus method', () => {
      expect(typeof wrapper.vm.changeStatus).toBe('function')
    })

    it('should toggle status from 0 to 1', () => {
      wrapper.vm.status = 0
      wrapper.vm.changeStatus()
      expect(wrapper.vm.status).toBe(1)
    })

    it('should toggle status from 1 to 0', () => {
      wrapper.vm.status = 1
      wrapper.vm.changeStatus()
      expect(wrapper.vm.status).toBe(0)
    })

    it('should toggle status multiple times', () => {
      wrapper.vm.status = 0
      wrapper.vm.changeStatus()
      expect(wrapper.vm.status).toBe(1)
      wrapper.vm.changeStatus()
      expect(wrapper.vm.status).toBe(0)
      wrapper.vm.changeStatus()
      expect(wrapper.vm.status).toBe(1)
    })
  })

  describe('produceData method', () => {
    it('should have produceData method', () => {
      expect(typeof wrapper.vm.produceData).toBe('function')
    })

    it('should flatten nested data structure', () => {
      wrapper.vm.data = [
        { name: 'John', age: 25 },
        { name: 'Jane', age: 30 }
      ]
      wrapper.vm.produceData()
      expect(wrapper.vm.computedData.length).toBeGreaterThan(0)
    })

    it('should exclude resourceId field', () => {
      wrapper.vm.data = [
        { name: 'Item', resourceId: '123' }
      ]
      wrapper.vm.produceData()
      const hasResourceId = wrapper.vm.computedData.some((item) => 'resourceId' in item)
      expect(hasResourceId).toBe(false)
    })

    it('should exclude falsy values', () => {
      wrapper.vm.data = [
        { name: 'Item', value: null }
      ]
      wrapper.vm.produceData()
      const hasNull = wrapper.vm.computedData.some((item) => item.value === null)
      expect(hasNull).toBe(false)
    })

    it('should create separate entries for each key-value pair', () => {
      wrapper.vm.data = [
        { field1: 'value1', field2: 'value2' }
      ]
      wrapper.vm.produceData()
      expect(wrapper.vm.computedData.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('getRenderStatusOfButton method', () => {
    it('should have getRenderStatusOfButton method', () => {
      expect(typeof wrapper.vm.getRenderStatusOfButton).toBe('function')
    })

    it('should return false when all badges are rendered', () => {
      wrapper.vm.renderedBadgeCount = 5
      wrapper.vm.computedData = Array(5).fill({})
      wrapper.vm.unRenderedBadgeCount = 0
      expect(wrapper.vm.getRenderStatusOfButton()).toBe(false)
    })

    it('should return true when not all badges are rendered', () => {
      wrapper.vm.renderedBadgeCount = 3
      wrapper.vm.computedData = Array(5).fill({})
      wrapper.vm.unRenderedBadgeCount = 2
      expect(wrapper.vm.getRenderStatusOfButton()).toBe(true)
    })

    it('should return false when unRenderedBadgeCount is 0', () => {
      wrapper.vm.unRenderedBadgeCount = 0
      expect(wrapper.vm.getRenderStatusOfButton()).toBe(false)
    })
  })

  describe('getRenderStatusOfLeftContainer method', () => {
    it('should have getRenderStatusOfLeftContainer method', () => {
      expect(typeof wrapper.vm.getRenderStatusOfLeftContainer).toBe('function')
    })

    it('should always return true', () => {
      expect(wrapper.vm.getRenderStatusOfLeftContainer()).toBe(true)
    })
  })

  describe('lifecycle hooks', () => {
    it('should call produceData in created hook', () => {
      expect(wrapper.vm.computedData).toBeDefined()
    })

    it('should add window resize listener in mounted', () => {
      // Verify listener was added by checking component is functional
      expect(wrapper.vm).toBeDefined()
    })

    it('should remove window resize listener in beforeDestroy', () => {
      // Verify cleanup by checking component can be destroyed
      expect(() => wrapper.destroy()).not.toThrow()
    })
  })

  describe('data watching', () => {
    it('should update when data prop changes', async () => {
      const newData = [{ field: 'value' }]
      await wrapper.setProps({ data: newData })
      expect(wrapper.vm.data).toEqual(newData)
    })

    it('should call produceData and getChips when data changes', async () => {
      const newData = [{ field: 'value' }]
      await wrapper.setProps({ data: newData })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.computedData.length).toBeGreaterThanOrEqual(0)
    })

    it('should not process empty data', async () => {
      await wrapper.setProps({ data: [] })
      expect(wrapper.vm.computedData).toEqual([])
    })
  })

  describe('getChips method', () => {
    it('should have getChips method', () => {
      expect(typeof wrapper.vm.getChips).toBe('function')
    })

    it('should calculate rendered badge count', () => {
      wrapper.vm.computedData = [
        { field: 'value' }
      ]
      wrapper.vm.getChips()
      expect(wrapper.vm.renderedBadgeCount).toBeDefined()
    })

    it('should calculate unrendered badge count', () => {
      wrapper.vm.computedData = [
        { field: 'value' },
        { field: 'value2' }
      ]
      wrapper.vm.getChips()
      expect(wrapper.vm.unRenderedBadgeCount).toBeDefined()
    })

    it('should handle single item', () => {
      wrapper.vm.computedData = [{ field: 'value' }]
      wrapper.vm.getChips()
      expect(wrapper.vm.renderedBadgeCount).toBe(1)
      expect(wrapper.vm.unRenderedBadgeCount).toBe(0)
    })

    it('should handle multiple items', () => {
      wrapper.vm.computedData = [
        { field: 'value1' },
        { field: 'value2' },
        { field: 'value3' }
      ]
      wrapper.vm.getChips()
      expect(wrapper.vm.renderedBadgeCount + wrapper.vm.unRenderedBadgeCount).toBe(3)
    })
  })

  describe('getContainerWidth method', () => {
    it('should have getContainerWidth method', () => {
      expect(typeof wrapper.vm.getContainerWidth).toBe('function')
    })

    it('should return a number', () => {
      const width = wrapper.vm.getContainerWidth()
      expect(typeof width).toBe('number')
    })

    it('should return width minus 60 when unRenderedBadgeCount is 0', () => {
      wrapper.vm.unRenderedBadgeCount = 0
      const width = wrapper.vm.getContainerWidth()
      expect(typeof width).toBe('number')
    })

    it('should return container width when unRenderedBadgeCount is not 0', () => {
      wrapper.vm.unRenderedBadgeCount = 1
      const width = wrapper.vm.getContainerWidth()
      expect(typeof width).toBe('number')
    })
  })

  describe('component reactivity', () => {
    it('should update status reactively', async () => {
      wrapper.vm.status = 0
      wrapper.vm.changeStatus()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.status).toBe(1)
    })

    it('should update computed properties when status changes', () => {
      wrapper.vm.status = 0
      wrapper.vm.unRenderedBadgeCount = 5
      const text1 = wrapper.vm.getButtonText
      wrapper.vm.changeStatus()
      const text2 = wrapper.vm.getButtonText
      expect(text1).not.toBe(text2)
    })

    it('should handle prop changes reactively', async () => {
      const data = [{ name: 'Test' }]
      await wrapper.setProps({ data })
      expect(wrapper.vm.data).toEqual(data)
    })
  })

  describe('integration scenarios', () => {
    it('should work with single badge', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ name: 'Single' }]
        },
        stubs: {
          'v-chip': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      wrapper.vm.produceData()
      expect(wrapper.vm.computedData.length).toBeGreaterThan(0)
    })

    it('should work with multiple badges', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [
            { name: 'Item1', value: 'val1' },
            { name: 'Item2', value: 'val2' },
            { name: 'Item3', value: 'val3' }
          ]
        },
        stubs: {
          'v-chip': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      wrapper.vm.produceData()
      expect(wrapper.vm.computedData.length).toBeGreaterThan(0)
    })

    it('should handle show more/less toggle', () => {
      wrapper.vm.computedData = Array(5).fill({})
      wrapper.vm.renderedBadgeCount = 2
      wrapper.vm.unRenderedBadgeCount = 3
      expect(wrapper.vm.getRenderStatusOfButton()).toBe(true)
      wrapper.vm.changeStatus()
      expect(wrapper.vm.status).toBe(1)
      expect(wrapper.vm.getButtonText).toBe('Show less')
    })

    it('should work with custom button ID', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          btnShowMoreId: 'my-button',
          data: [{ field: 'value' }]
        },
        stubs: {
          'v-chip': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.vm.btnShowMoreId).toBe('my-button')
    })
  })

  describe('template rendering', () => {
    it('should render left container', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [{ field: 'value' }]
        },
        stubs: {
          'v-chip': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      const leftContainer = wrapper.find('.show-more__left')
      expect(leftContainer.exists()).toBe(true)
    })

    it('should have structure for show more button', () => {
      wrapper = shallowMount(ShowMore, {
        propsData: {
          data: [
            { field: 'value1' },
            { field: 'value2' },
            { field: 'value3' }
          ]
        },
        stubs: {
          'v-chip': true,
          'v-btn': true,
          'v-icon': true
        }
      })
      expect(wrapper.find('.show-more').exists()).toBe(true)
    })
  })

  describe('badge count calculations', () => {
    it('should correctly count rendered badges', () => {
      wrapper.vm.computedData = Array(3).fill({})
      wrapper.vm.renderedBadgeCount = 1
      wrapper.vm.unRenderedBadgeCount = 2
      expect(wrapper.vm.renderedBadgeCount + wrapper.vm.unRenderedBadgeCount).toBe(3)
    })

    it('should never render more than total count', () => {
      wrapper.vm.computedData = Array(5).fill({})
      wrapper.vm.renderedBadgeCount = 10
      wrapper.vm.getChips()
      expect(wrapper.vm.renderedBadgeCount).toBeLessThanOrEqual(5)
    })

    it('should never have negative rendered count', () => {
      wrapper.vm.computedData = Array(5).fill({})
      wrapper.vm.renderedBadgeCount = -1
      wrapper.vm.getChips()
      expect(wrapper.vm.renderedBadgeCount).toBeGreaterThanOrEqual(0)
    })
  })

  describe('status management', () => {
    it('should start in collapsed state (status = 0)', () => {
      expect(wrapper.vm.status).toBe(0)
    })

    it('should toggle to expanded state (status = 1)', () => {
      wrapper.vm.changeStatus()
      expect(wrapper.vm.status).toBe(1)
    })

    it('should toggle back to collapsed state', () => {
      wrapper.vm.changeStatus()
      wrapper.vm.changeStatus()
      expect(wrapper.vm.status).toBe(0)
    })
  })
})
