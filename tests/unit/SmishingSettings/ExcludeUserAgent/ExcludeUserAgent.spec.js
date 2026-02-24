import { shallowMount } from '@vue/test-utils'
import ExcludeUserAgent from '@/components/SmishingSettings/ExcludeUserAgent/ExcludeUserAgent.vue'

describe('SmishingSettings ExcludeUserAgent.vue', () => {
  const createWrapper = () =>
    shallowMount(ExcludeUserAgent, {
      stubs: {
        BatchImportPopup: true,
        DataContainerWithSearchInput: true,
        DataContainerWithSearch: true,
        InputEntityName: true,
        DatatableLoading: true
      }
    })

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('getExcludedIPAddresses sets loading and clears after delay', async () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.isLoading).toBe(true)
    jest.advanceTimersByTime(2000)
    await Promise.resolve()

    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('handleBatchImport adds items when data provided', () => {
    const wrapper = createWrapper()
    jest.advanceTimersByTime(2000)

    wrapper.vm.handleBatchImport(['ua1', 'ua2'])

    expect(wrapper.vm.dataContainerWithSearchItems).toEqual(['ua1', 'ua2'])
  })

  it('handleUserAgentAdd adds value and resets input', () => {
    const wrapper = createWrapper()
    jest.advanceTimersByTime(2000)
    wrapper.vm.userAgentInput = 'Mozilla/5.0'

    wrapper.vm.handleUserAgentAdd()

    expect(wrapper.vm.dataContainerWithSearchItems).toEqual(['Mozilla/5.0'])
    expect(wrapper.vm.userAgentInput).toBe('')
  })

  it('handleUserAgentAdd does nothing when input empty', () => {
    const wrapper = createWrapper()
    jest.advanceTimersByTime(2000)

    wrapper.vm.handleUserAgentAdd()

    expect(wrapper.vm.dataContainerWithSearchItems).toEqual([])
  })

  it('toggleBatchImportPopup toggles popup state', () => {
    const wrapper = createWrapper()
    jest.advanceTimersByTime(2000)

    expect(wrapper.vm.isBatchImportPopupOpen).toBe(false)
    wrapper.vm.toggleBatchImportPopup()
    expect(wrapper.vm.isBatchImportPopupOpen).toBe(true)
  })
})
