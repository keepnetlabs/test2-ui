import { shallowMount } from '@vue/test-utils'
import AdvancedSettingsURLs from '@/components/Integrations/AdvancedSettings/AdvancedSettingsURLs.vue'

describe('AdvancedSettingsURLs.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(AdvancedSettingsURLs, {
      propsData: {
        formData: [],
        isActionButtonDisabled: false,
        ...propsData
      },
      stubs: {
        BatchImportPopup: true,
        DataContainerWithSearchInput: true,
        InputUrl: true,
        DataContainerWithSearch: true,
        'v-icon': true,
        'v-btn': true
      }
    })

  it('sets url list and object list from formData on created', () => {
    const wrapper = createWrapper({
      formData: [
        { exclusionType: 'URL', value: 'https://a.test', isEditable: false },
        { exclusionType: 'IP', value: '1.1.1.1', isEditable: true },
        { exclusionType: 'URL', value: 'https://b.test', isEditable: true }
      ]
    })

    expect(wrapper.vm.dataContainerWithSearchItems).toEqual(['https://a.test', 'https://b.test'])
    expect(wrapper.vm.initialData).toEqual(['https://a.test', 'https://b.test'])
    expect(wrapper.vm.dataWithObjects.length).toBe(2)
  })

  it('handleUrlAdd adds url and resets search', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ urlSearch: 'https://new.test' })

    wrapper.vm.handleUrlAdd()

    expect(wrapper.vm.dataContainerWithSearchItems[0]).toBe('https://new.test')
    expect(wrapper.vm.dataWithObjects[0]).toEqual({
      value: 'https://new.test',
      exclusionType: 'URL',
      isEditable: true
    })
    expect(wrapper.vm.urlSearch).toBe('')
  })

  it('handleBatchImport ignores empty input and appends valid data', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      dataContainerWithSearchItems: ['https://old.test'],
      dataWithObjects: [{ value: 'https://old.test', exclusionType: 'URL', isEditable: true }]
    })

    wrapper.vm.handleBatchImport([])
    expect(wrapper.vm.dataContainerWithSearchItems).toEqual(['https://old.test'])

    wrapper.vm.handleBatchImport(['https://x.test', 'https://y.test'])
    expect(wrapper.vm.dataContainerWithSearchItems).toEqual([
      'https://x.test',
      'https://y.test',
      'https://old.test'
    ])
    expect(wrapper.vm.dataWithObjects[0]).toEqual({
      value: 'https://x.test',
      exclusionType: 'URL',
      isEditable: true
    })
  })

  it('toggleBatchImportPopup flips modal state', async () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.isBatchImportPopupOpen).toBe(false)
    wrapper.vm.toggleBatchImportPopup()
    expect(wrapper.vm.isBatchImportPopupOpen).toBe(true)
  })

  it('handleSaveChanges returns early when container validity is false', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      dataContainerWithSearchItems: ['https://a.test'],
      dataWithObjects: [{ value: 'https://a.test', exclusionType: 'URL', isEditable: true }]
    })
    wrapper.vm.$refs.dataContainerWithSearch = { isAllValid: false }

    wrapper.vm.handleSaveChanges()

    expect(wrapper.emitted('on-submit')).toBeFalsy()
  })

  it('handleSaveChanges emits payload with editable URLs', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      dataContainerWithSearchItems: ['https://changed.test', 'https://fixed.test'],
      dataWithObjects: [
        { value: 'https://old.test', exclusionType: 'URL', isEditable: true },
        { value: 'https://fixed.test', exclusionType: 'URL', isEditable: false }
      ]
    })
    wrapper.vm.$refs.dataContainerWithSearch = { isAllValid: true }

    wrapper.vm.handleSaveChanges()

    expect(wrapper.emitted('on-submit')[0]).toEqual([
      [{ attachmentExtensionType: null, exclusionType: 'URL', value: 'https://changed.test' }],
      'URL'
    ])
  })
})
