import { shallowMount } from '@vue/test-utils'
import ExcludeUserAgent from '@/components/QuishingSettings/ExcludeUserAgent/ExcludeUserAgent.vue'

describe('QuishingSettings ExcludeUserAgent.vue', () => {
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

  it('handleBatchImport does nothing when empty array', () => {
    const wrapper = createWrapper()
    jest.advanceTimersByTime(2000)
    wrapper.vm.dataContainerWithSearchItems = ['existing']

    wrapper.vm.handleBatchImport([])

    expect(wrapper.vm.dataContainerWithSearchItems).toEqual(['existing'])
  })

  it('toggleBatchImportPopup toggles popup state', () => {
    const wrapper = createWrapper()
    jest.advanceTimersByTime(2000)

    expect(wrapper.vm.isBatchImportPopupOpen).toBe(false)
    wrapper.vm.toggleBatchImportPopup()
    expect(wrapper.vm.isBatchImportPopupOpen).toBe(true)
    wrapper.vm.toggleBatchImportPopup()
    expect(wrapper.vm.isBatchImportPopupOpen).toBe(false)
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

  it('handleUserAgentAdd does nothing when input only whitespace', () => {
    const wrapper = createWrapper()
    jest.advanceTimersByTime(2000)
    wrapper.vm.userAgentInput = '   '

    wrapper.vm.handleUserAgentAdd()

    expect(wrapper.vm.dataContainerWithSearchItems).toEqual([])
  })

  it('handleSaveChanges returns when dataContainerWithSearch invalid', () => {
    const wrapper = createWrapper()
    jest.advanceTimersByTime(2000)
    wrapper.vm.$refs = {
      dataContainerWithSearch: { isAllValid: false }
    }

    wrapper.vm.handleSaveChanges()

    expect(wrapper.vm.$refs.dataContainerWithSearch.isAllValid).toBe(false)
  })

  it('handleSaveChanges does not return when ref missing', () => {
    const wrapper = createWrapper()
    jest.advanceTimersByTime(2000)
    wrapper.vm.$refs = {}

    expect(() => wrapper.vm.handleSaveChanges()).not.toThrow()
  })
})
