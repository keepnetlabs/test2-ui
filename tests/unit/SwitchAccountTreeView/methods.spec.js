import { shallowMount } from '@vue/test-utils'
import SwitchAccountTreeView from '@/components/SwitchAccountTreeView.vue'

describe('SwitchAccountTreeView.vue methods/watch', () => {
  const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
  const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

  const createWrapper = (propsData = {}) =>
    shallowMount(SwitchAccountTreeView, {
      propsData: {
        items: [],
        loading: false,
        isShowingMenu: false,
        isOpenAll: false,
        ...propsData
      },
      stubs: {
        'v-lazy': { template: '<div><slot /></div>' },
        'v-treeview': { template: '<div />' },
        'v-icon': true,
        'k-select-loading': true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('registers and unregisters resize listener', () => {
    const wrapper = createWrapper()
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', wrapper.vm.handleResizeMenuHeight)

    wrapper.destroy()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', wrapper.vm.handleResizeMenuHeight)
  })

  it('loading watcher triggers handleMenuHeight when loading becomes false', async () => {
    const wrapper = createWrapper({ loading: true })
    const handleMenuHeight = jest.spyOn(wrapper.vm, 'handleMenuHeight').mockImplementation(() => {})

    await wrapper.setProps({ loading: false })
    await wrapper.vm.$nextTick()

    expect(handleMenuHeight).toHaveBeenCalled()
  })

  it('loading watcher does not trigger handleMenuHeight when loading remains true', async () => {
    const wrapper = createWrapper({ loading: true })
    const handleMenuHeight = jest.spyOn(wrapper.vm, 'handleMenuHeight').mockImplementation(() => {})

    await wrapper.setProps({ loading: true })
    await wrapper.vm.$nextTick()

    expect(handleMenuHeight).not.toHaveBeenCalled()
  })

  it('handleResizeMenuHeight delegates with resize=true', () => {
    const wrapper = createWrapper()
    const handleMenuHeight = jest.spyOn(wrapper.vm, 'handleMenuHeight').mockImplementation(() => {})

    wrapper.vm.handleResizeMenuHeight()

    expect(handleMenuHeight).toHaveBeenCalledWith(true)
  })

  it('handleTreeViewChange emits selected account payload', () => {
    const wrapper = createWrapper()
    const item = {
      name: 'Tenant A',
      resourceId: 'id-1',
      privacyDurationId: 3,
      licenceExpired: false
    }

    wrapper.vm.handleTreeViewChange(item)

    expect(wrapper.emitted('on-selected-account')[0][0]).toEqual({
      label: 'Tenant A',
      id: 'id-1',
      privacyDurationId: 3,
      licenceExpired: false
    })
  })

  it('handleMenuHeight reduces max height when bottom exceeds viewport', () => {
    const wrapper = createWrapper()
    wrapper.vm.menuMaxHeight = '300px'
    const querySpy = jest.spyOn(document, 'querySelector').mockImplementation(() => ({
      getBoundingClientRect: () => ({ bottom: 950 })
    }))
    Object.defineProperty(globalThis, 'innerHeight', { configurable: true, value: 800 })

    wrapper.vm.handleMenuHeight()

    expect(wrapper.vm.menuMaxHeight).toBe('142px')
    querySpy.mockRestore()
  })

  it('handleMenuHeight resets height to default on resize branch', () => {
    const wrapper = createWrapper()
    wrapper.vm.menuMaxHeight = '200px'
    const querySpy = jest.spyOn(document, 'querySelector').mockImplementation(() => ({
      getBoundingClientRect: () => ({ bottom: 100 })
    }))
    Object.defineProperty(globalThis, 'innerHeight', { configurable: true, value: 1200 })

    wrapper.vm.handleMenuHeight(true)

    expect(wrapper.vm.menuMaxHeight).toBe('300px')
    querySpy.mockRestore()
  })

  it('handleMenuHeight safely does nothing when menu element is missing', () => {
    const wrapper = createWrapper()
    wrapper.vm.menuMaxHeight = '300px'
    const querySpy = jest.spyOn(document, 'querySelector').mockImplementation(() => null)

    wrapper.vm.handleMenuHeight()

    expect(wrapper.vm.menuMaxHeight).toBe('300px')
    querySpy.mockRestore()
  })
})
