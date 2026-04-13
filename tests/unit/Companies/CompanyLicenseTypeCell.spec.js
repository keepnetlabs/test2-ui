import { shallowMount } from '@vue/test-utils'
import CompanyLicenseTypeCell from '@/components/Companies/CompanyLicenseTypeCell.vue'

describe('CompanyLicenseTypeCell.vue', () => {
  let originalResizeObserver
  let observeMock
  let unobserveMock
  let disconnectMock

  const VTooltipStub = {
    template: `
      <div>
        <slot name="activator" :on="{}" />
        <slot />
      </div>
    `
  }

  const createWrapper = (propsData = {}) =>
    shallowMount(CompanyLicenseTypeCell, {
      propsData: {
        licenseTypeName: 'Custom',
        modules: [],
        ...propsData
      },
      stubs: {
        VTooltip: VTooltipStub
      }
    })

  beforeEach(() => {
    originalResizeObserver = global.ResizeObserver
    observeMock = jest.fn()
    unobserveMock = jest.fn()
    disconnectMock = jest.fn()
    global.ResizeObserver = class {
      observe = observeMock
      unobserve = unobserveMock
      disconnect = disconnectMock
    }
  })

  afterEach(() => {
    global.ResizeObserver = originalResizeObserver
  })

  it('normalizes object and string modules and shows overflow count', () => {
    const wrapper = createWrapper({
      modules: [
        { name: 'Agentic AI' },
        'Awareness Educator',
        { name: 'Phishing Simulator' },
        { name: 'Threat Sharing' }
      ]
    })

    expect(wrapper.vm.moduleNames).toEqual([
      'Agentic AI',
      'Awareness Educator',
      'Phishing Simulator',
      'Threat Sharing'
    ])
    expect(wrapper.vm.visibleModulesText).toBe('Agentic AI, Awareness Educator')
    expect(wrapper.vm.remainingModuleCount).toBe(2)
    expect(wrapper.find('.company-license-type-cell__more').text()).toBe('+2')
  })

  it('filters falsy module entries and unnamed objects from moduleNames', () => {
    const wrapper = createWrapper({
      modules: [null, undefined, '', { id: 'x' }, { name: 'Agentic AI' }, 'Aware']
    })

    expect(wrapper.vm.moduleNames).toEqual(['Agentic AI', 'Aware'])
  })

  it('expands visible module count when container width allows more items', () => {
    const wrapper = createWrapper({
      modules: [
        { name: 'Agentic AI' },
        { name: 'Awareness Educator' },
        { name: 'Phishing Simulator' }
      ]
    })

    wrapper.vm.$refs.summaryContainer = {
      getBoundingClientRect: () => ({ width: 150 })
    }
    jest.spyOn(wrapper.vm, 'measureTextWidth').mockImplementation((text) => {
      if (!text) return 0
      return {
        'Agentic AI, Awareness Educator': 70,
        'Agentic AI, Awareness Educator, Phishing Simulator': 110,
        '+1': 8
      }[text] || 10
    })

    wrapper.vm.updateVisibleModuleCount()

    expect(wrapper.vm.renderedModuleCount).toBe(3)
    expect(wrapper.vm.visibleModulesText).toBe(
      'Agentic AI, Awareness Educator, Phishing Simulator'
    )
    expect(wrapper.vm.hasOverflowModules).toBe(false)
  })

  it('observes summary container when modules appear after mount', async () => {
    const wrapper = createWrapper({ modules: [] })

    expect(observeMock).not.toHaveBeenCalled()

    await wrapper.setProps({
      modules: [{ name: 'Agentic AI' }, { name: 'Awareness Educator' }]
    })
    await wrapper.vm.$nextTick()

    expect(observeMock).toHaveBeenCalled()
    expect(wrapper.vm.observedSummaryContainer).toBe(wrapper.vm.$refs.summaryContainer)
  })

  it('falls back to default visible count when summary width is unavailable', () => {
    const wrapper = createWrapper({
      modules: [
        { name: 'Agentic AI' },
        { name: 'Awareness Educator' },
        { name: 'Phishing Simulator' }
      ]
    })

    wrapper.vm.$refs.summaryContainer = {
      getBoundingClientRect: () => ({ width: 0 })
    }

    wrapper.vm.updateVisibleModuleCount()

    expect(wrapper.vm.renderedModuleCount).toBe(2)
    expect(wrapper.vm.remainingModuleCount).toBe(1)
  })

  it('measureTextWidth falls back when canvas context is unavailable', () => {
    const wrapper = createWrapper()
    wrapper.vm.textMeasureCanvas = {
      getContext: () => null
    }

    expect(wrapper.vm.measureTextWidth('abcd')).toBe(24)
  })

  it('measureTextWidth creates a canvas and rounds measured width', () => {
    const wrapper = createWrapper()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        return {
          getContext: () => ({
            measureText: () => ({ width: 12.2 })
          })
        }
      }

      return originalCreateElement(tagName)
    })

    expect(wrapper.vm.measureTextWidth('abcd')).toBe(13)
    expect(createElementSpy).toHaveBeenCalledWith('canvas')

    createElementSpy.mockRestore()
  })

  it('renders no summary when there are no modules', () => {
    const wrapper = createWrapper({ modules: [] })

    expect(wrapper.vm.visibleModulesText).toBe('')
    expect(wrapper.find('.company-license-type-cell__summary').exists()).toBe(false)
    expect(wrapper.vm.remainingModuleCount).toBe(0)
  })

  it('visibleModuleCount never exceeds moduleNames length even when rendered count is larger', () => {
    const wrapper = createWrapper({
      modules: [{ name: 'Agentic AI' }, { name: 'Aware' }]
    })
    wrapper.vm.renderedModuleCount = 10

    expect(wrapper.vm.visibleModuleCount).toBe(2)
  })

  it('visibleModuleCount honors defaultVisibleModules when rendered count is lower', () => {
    const wrapper = createWrapper({
      modules: [{ name: 'Agentic AI' }, { name: 'Aware' }, { name: 'Phishing Simulator' }],
      defaultVisibleModules: 2
    })
    wrapper.vm.renderedModuleCount = 1

    expect(wrapper.vm.visibleModuleCount).toBe(2)
  })

  it('re-observes a new summary container and unobserves the previous one', () => {
    const wrapper = createWrapper({
      modules: [{ name: 'Agentic AI' }, { name: 'Awareness Educator' }]
    })
    const firstContainer = { id: 'first' }
    const secondContainer = { id: 'second' }

    wrapper.vm.$refs.summaryContainer = firstContainer
    wrapper.vm.observeSummaryContainer()
    wrapper.vm.$refs.summaryContainer = secondContainer
    wrapper.vm.observeSummaryContainer()

    expect(unobserveMock).toHaveBeenCalledWith(firstContainer)
    expect(observeMock).toHaveBeenCalledWith(secondContainer)
  })

  it('observeSummaryContainer is a no-op when resizeObserver is missing', () => {
    const wrapper = createWrapper({
      modules: [{ name: 'Agentic AI' }, { name: 'Awareness Educator' }]
    })
    wrapper.vm.resizeObserver = null
    wrapper.vm.observedSummaryContainer = { id: 'tracked' }
    wrapper.vm.$refs.summaryContainer = { id: 'summary' }

    expect(() => wrapper.vm.observeSummaryContainer()).not.toThrow()
    expect(wrapper.vm.observedSummaryContainer).toEqual({ id: 'tracked' })
  })

  it('destroyResizeObserver disconnects observer and clears tracked container', () => {
    const wrapper = createWrapper({
      modules: [{ name: 'Agentic AI' }, { name: 'Awareness Educator' }]
    })
    wrapper.vm.observedSummaryContainer = { id: 'tracked' }

    wrapper.vm.destroyResizeObserver()

    expect(disconnectMock).toHaveBeenCalled()
    expect(wrapper.vm.resizeObserver).toBeNull()
    expect(wrapper.vm.observedSummaryContainer).toBeNull()
  })

  it('destroyResizeObserver still clears tracked container when observer is already missing', () => {
    const wrapper = createWrapper({
      modules: [{ name: 'Agentic AI' }]
    })
    wrapper.vm.resizeObserver = null
    wrapper.vm.observedSummaryContainer = { id: 'tracked' }

    wrapper.vm.destroyResizeObserver()

    expect(wrapper.vm.observedSummaryContainer).toBeNull()
  })

  it('observeSummaryContainer does not re-observe the same container twice', () => {
    const wrapper = createWrapper({
      modules: [{ name: 'Agentic AI' }, { name: 'Awareness Educator' }]
    })
    const sameContainer = { id: 'same' }

    wrapper.vm.$refs.summaryContainer = sameContainer
    wrapper.vm.observeSummaryContainer()
    observeMock.mockClear()

    wrapper.vm.$refs.summaryContainer = sameContainer
    wrapper.vm.observeSummaryContainer()

    expect(observeMock).not.toHaveBeenCalled()
  })

  it('updateVisibleModuleCount resets rendered count when there are no modules', () => {
    const wrapper = createWrapper({ modules: [] })
    wrapper.vm.renderedModuleCount = 5

    wrapper.vm.updateVisibleModuleCount()

    expect(wrapper.vm.renderedModuleCount).toBe(0)
  })

  it('initResizeObserver falls back to window resize events when ResizeObserver is unavailable', () => {
    global.ResizeObserver = undefined
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

    const wrapper = createWrapper({
      modules: [{ name: 'Agentic AI' }, { name: 'Awareness Educator' }]
    })

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', wrapper.vm.updateVisibleModuleCount)

    wrapper.destroy()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', wrapper.vm.updateVisibleModuleCount)

    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
  })

  it('initResizeObserver creates observer and starts observing summary container', () => {
    const wrapper = createWrapper({
      modules: [{ name: 'Agentic AI' }, { name: 'Awareness Educator' }]
    })

    expect(wrapper.vm.resizeObserver).not.toBeNull()
    expect(observeMock).toHaveBeenCalled()
  })

  it('updateVisibleModuleCount keeps default visible count when next module does not fit', () => {
    const wrapper = createWrapper({
      modules: [
        { name: 'Agentic AI' },
        { name: 'Awareness Educator' },
        { name: 'Phishing Simulator' }
      ]
    })

    wrapper.vm.$refs.summaryContainer = {
      getBoundingClientRect: () => ({ width: 80 })
    }
    jest.spyOn(wrapper.vm, 'measureTextWidth').mockImplementation((text) => {
      if (!text) return 0
      return {
        'Agentic AI, Awareness Educator, Phishing Simulator': 100,
        '+1': 8
      }[text] || 10
    })

    wrapper.vm.updateVisibleModuleCount()

    expect(wrapper.vm.renderedModuleCount).toBe(2)
    expect(wrapper.vm.visibleModulesText).toBe('Agentic AI, Awareness Educator')
    expect(wrapper.vm.hasOverflowModules).toBe(true)
  })

  it('getRequiredWidth adds overflow spacing only when overflow exists', () => {
    const wrapper = createWrapper({
      modules: ['A', 'B', 'C']
    })
    jest.spyOn(wrapper.vm, 'measureTextWidth').mockImplementation((text) => text.length)

    expect(wrapper.vm.getRequiredWidth(2, 1)).toBe(12)
    expect(wrapper.vm.getRequiredWidth(2, 0)).toBe(4)
  })

  it('renders emptyText when license type name is missing', () => {
    const wrapper = createWrapper({
      licenseTypeName: '',
      emptyText: 'Not assigned'
    })

    expect(wrapper.find('.company-license-type-cell__title').text()).toBe('Not assigned')
  })

  it('exposes overflow module names and zero remaining count when all modules are visible', () => {
    const wrapper = createWrapper({
      modules: [{ name: 'Agentic AI' }, { name: 'Aware' }, { name: 'Phishing Simulator' }]
    })
    wrapper.vm.renderedModuleCount = 3

    expect(wrapper.vm.overflowModuleNames).toEqual([])
    expect(wrapper.vm.remainingModuleCount).toBe(0)
    expect(wrapper.vm.hasOverflowModules).toBe(false)
  })

  it('measureTextWidth returns 0 for empty text', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.measureTextWidth('')).toBe(0)
  })

  it('scheduleVisibleModuleCountUpdate runs observer and recalculation on next tick', async () => {
    const wrapper = createWrapper({
      modules: [{ name: 'Agentic AI' }, { name: 'Aware' }]
    })
    const observeSpy = jest.spyOn(wrapper.vm, 'observeSummaryContainer')
    const updateSpy = jest.spyOn(wrapper.vm, 'updateVisibleModuleCount')

    wrapper.vm.scheduleVisibleModuleCountUpdate()
    await wrapper.vm.$nextTick()

    expect(observeSpy).toHaveBeenCalled()
    expect(updateSpy).toHaveBeenCalled()
  })

  it('beforeDestroy delegates cleanup to destroyResizeObserver', () => {
    const wrapper = createWrapper({
      modules: [{ name: 'Agentic AI' }]
    })
    const destroySpy = jest.spyOn(wrapper.vm, 'destroyResizeObserver')

    wrapper.destroy()

    expect(destroySpy).toHaveBeenCalled()
  })
})
