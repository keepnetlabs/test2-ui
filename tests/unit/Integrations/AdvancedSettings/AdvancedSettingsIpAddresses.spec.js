import { shallowMount } from '@vue/test-utils'
import AdvancedSettingsIpAddresses from '@/components/Integrations/AdvancedSettings/AdvancedSettingsIpAddresses.vue'

describe('AdvancedSettingsIpAddresses.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(AdvancedSettingsIpAddresses, {
      propsData: {
        formData: [],
        isActionButtonDisabled: false,
        ...propsData
      },
      stubs: {
        BatchImportPopup: true,
        DataContainerWithSearchInput: true,
        InputIpAddress: true,
        DataContainerWithSearch: true,
        'v-icon': true,
        'v-btn': true
      }
    })

  it('sets ip list and object list from formData on created', () => {
    const wrapper = createWrapper({
      formData: [
        { exclusionType: 'IP', value: '1.1.1.1', isEditable: false },
        { exclusionType: 'URL', value: 'https://a.test', isEditable: true },
        { exclusionType: 'IP', value: '2.2.2.2', isEditable: true }
      ]
    })

    expect(wrapper.vm.dataContainerWithSearchItems).toEqual(['1.1.1.1', '2.2.2.2'])
    expect(wrapper.vm.initialData).toEqual(['1.1.1.1', '2.2.2.2'])
    expect(wrapper.vm.dataWithObjects.length).toBe(2)
  })

  it('handleIpAddressesAdd adds item and resets input', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ ipAddressSearch: '10.0.0.1' })

    wrapper.vm.handleIpAddressesAdd()

    expect(wrapper.vm.dataContainerWithSearchItems[0]).toBe('10.0.0.1')
    expect(wrapper.vm.dataWithObjects[0]).toEqual({
      value: '10.0.0.1',
      exclusionType: 'IP',
      isEditable: true
    })
    expect(wrapper.vm.ipAddressSearch).toBe('')
  })

  it('handleBatchImport ignores empty and prepends valid ip data', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      dataContainerWithSearchItems: ['3.3.3.3'],
      dataWithObjects: [{ value: '3.3.3.3', exclusionType: 'IP', isEditable: true }]
    })

    wrapper.vm.handleBatchImport([])
    expect(wrapper.vm.dataContainerWithSearchItems).toEqual(['3.3.3.3'])

    wrapper.vm.handleBatchImport(['4.4.4.4', '5.5.5.5'])
    expect(wrapper.vm.dataContainerWithSearchItems).toEqual(['4.4.4.4', '5.5.5.5', '3.3.3.3'])
  })

  it('toggleBatchImportPopup flips modal state', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.isBatchImportPopupOpen).toBe(false)
    wrapper.vm.toggleBatchImportPopup()
    expect(wrapper.vm.isBatchImportPopupOpen).toBe(true)
  })

  it('handleSaveChanges returns when invalid container exists', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      dataContainerWithSearchItems: ['8.8.8.8'],
      dataWithObjects: [{ value: '8.8.8.8', exclusionType: 'IP', isEditable: true }]
    })
    wrapper.vm.$refs.dataContainerWithSearch = { isAllValid: false }

    wrapper.vm.handleSaveChanges()
    expect(wrapper.emitted('on-submit')).toBeFalsy()
  })

  it('handleSaveChanges emits editable IP payload', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      dataContainerWithSearchItems: ['9.9.9.9', '7.7.7.7'],
      dataWithObjects: [
        { value: '0.0.0.0', exclusionType: 'IP', isEditable: true },
        { value: '7.7.7.7', exclusionType: 'IP', isEditable: false }
      ]
    })
    wrapper.vm.$refs.dataContainerWithSearch = { isAllValid: true }

    wrapper.vm.handleSaveChanges()
    expect(wrapper.emitted('on-submit')[0]).toEqual([
      [{ attachmentExtensionType: null, exclusionType: 'IP', value: '9.9.9.9' }],
      'IP'
    ])
  })
})
