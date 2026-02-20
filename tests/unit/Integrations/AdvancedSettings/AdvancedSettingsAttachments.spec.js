import { shallowMount } from '@vue/test-utils'
import AdvancedSettingsAttachments from '@/components/Integrations/AdvancedSettings/AdvancedSettingsAttachments.vue'

describe('AdvancedSettingsAttachments.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(AdvancedSettingsAttachments, {
      propsData: {
        formData: [],
        isActionButtonDisabled: false,
        ...propsData
      },
      stubs: {
        CompanySettingsHeader: true,
        'v-checkbox': true,
        'v-btn': true
      }
    })

  it('sets values from formData on created for AttacmentExtension items', () => {
    const wrapper = createWrapper({
      formData: [
        { exclusionType: 'AttacmentExtension', attachmentExtensionType: 'Archive' },
        { exclusionType: 'URL', value: 'https://x.test' },
        { exclusionType: 'AttacmentExtension', attachmentExtensionType: 'Image' }
      ]
    })

    expect(wrapper.vm.values).toEqual(['Archive', 'Image'])
    expect(wrapper.vm.initialData).toEqual(['Archive', 'Image'])
  })

  it('createPayload maps values to expected payload shape', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ values: ['Archive', 'MSOffice'] })

    expect(wrapper.vm.createPayload()).toEqual([
      { attachmentExtensionType: 'Archive', exclusionType: 'AttacmentExtension', value: null },
      { attachmentExtensionType: 'MSOffice', exclusionType: 'AttacmentExtension', value: null }
    ])
  })

  it('handleSaveChanges emits on-submit with AttacmentExtension type', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ values: ['PEExtensions'] })

    wrapper.vm.handleSaveChanges()

    expect(wrapper.emitted('on-submit')[0]).toEqual([
      [{ attachmentExtensionType: 'PEExtensions', exclusionType: 'AttacmentExtension', value: null }],
      'AttacmentExtension'
    ])
  })

  it('getSaveButtonStyle reflects disabled state from equality and prop', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ values: ['Archive'], initialData: ['Archive'] })
    expect(wrapper.vm.getSaveButtonStyle).toEqual({
      opacity: 0.5,
      cursor: 'default',
      pointerEvents: 'none'
    })

    await wrapper.setData({ values: ['Archive', 'Image'] })
    expect(wrapper.vm.getSaveButtonStyle).toEqual({
      opacity: 1,
      cursor: 'pointer',
      pointerEvents: 'auto'
    })

    await wrapper.setProps({ isActionButtonDisabled: true })
    expect(wrapper.vm.getSaveButtonStyle).toEqual({
      opacity: 0.5,
      cursor: 'default',
      pointerEvents: 'none'
    })
  })
})
