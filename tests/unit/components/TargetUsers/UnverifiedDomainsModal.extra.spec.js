import { shallowMount } from '@vue/test-utils'
import UnverifiedDomainsModal from '@/components/TargetUsers/UnverifiedDomainsModal.vue'

describe('UnverifiedDomainsModal.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(UnverifiedDomainsModal, {
      propsData: {
        status: true,
        domains: ['example.com', 'test.org'],
        ...propsData
      },
      stubs: { AppDialog: true }
    })

  it('closeOverlay emits closeOverlay', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeOverlay(false)
    expect(wrapper.emitted('closeOverlay')).toEqual([[false]])
  })
})
