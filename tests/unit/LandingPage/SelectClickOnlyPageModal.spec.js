import { shallowMount } from '@vue/test-utils'
import SelectClickOnlyPageModal from '@/components/LandingPage/SelectClickOnlyPageModal.vue'

describe('SelectClickOnlyPageModal.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(SelectClickOnlyPageModal, {
      propsData: {
        status: true,
        method: 'click',
        scenarioDetailsLookup: {},
        languages: [],
        type: 'landing',
        ...propsData
      },
      stubs: {
        LandingPageTemplateListPreview: true,
        'v-dialog': true,
        'v-card': true,
        'v-card-title': true,
        'v-card-text': true,
        'v-card-actions': true,
        'v-btn': true,
        'v-icon': true,
        'v-divider': true,
        'v-spacer': true
      }
    })

  it('resets selectedResourceId when modal is closed', async () => {
    const wrapper = mountComponent()
    await wrapper.setData({ selectedResourceId: 'lp-1' })

    await wrapper.setProps({ status: false })

    expect(wrapper.vm.selectedResourceId).toBe(null)
  })

  it('emits add with selected resource id', async () => {
    const wrapper = mountComponent()
    await wrapper.setData({ selectedResourceId: 'lp-123' })

    wrapper.vm.handleAddTemplate()

    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('add')[0]).toEqual(['lp-123'])
  })

  it('does not emit add when selected resource id is missing', () => {
    const wrapper = mountComponent()

    wrapper.vm.handleAddTemplate()

    expect(wrapper.emitted('add')).toBeFalsy()
  })

  it('stores selected resource id from child event', async () => {
    const wrapper = mountComponent()

    wrapper.findComponent({ name: 'LandingPageTemplateListPreview' }).vm.$emit(
      'selectedLandingPageTemplateResourceId',
      'lp-999'
    )
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedResourceId).toBe('lp-999')
  })
})
