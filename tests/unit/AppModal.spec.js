import { shallowMount } from '@vue/test-utils'
import AppModal from '@/components/AppModal.vue'

describe('AppModal.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(AppModal, {
      propsData: {
        status: true,
        title: 'Test Modal',
        ...propsData
      },
      stubs: {
        VOverlay: true,
        VCard: true,
        VForm: true,
        VListItem: true,
        VIcon: true,
        VListItemContent: true,
        VListItemTitle: true,
        VBtn: true
      }
    })

  it('applies hidden overflow on created and clears on destroy by default', () => {
    const htmlEl = document.querySelector('html')
    const originalOverflow = htmlEl.style.overflowY

    const wrapper = createWrapper()
    expect(htmlEl.style.overflowY).toBe('hidden')

    wrapper.destroy()
    expect(htmlEl.style.overflowY).toBe('')
    htmlEl.style.overflowY = originalOverflow
  })

  it('does not clear overflow on destroy when shouldRemoveOverflow is false', () => {
    const htmlEl = document.querySelector('html')
    const originalOverflow = htmlEl.style.overflowY

    const wrapper = createWrapper({ shouldRemoveOverflow: false })
    expect(htmlEl.style.overflowY).toBe('hidden')

    wrapper.destroy()
    expect(htmlEl.style.overflowY).toBe('hidden')
    htmlEl.style.overflowY = originalOverflow
  })

  it('computes footer class with and without custom class', async () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getFooterClass).toBe('k-overlay__footer')

    await wrapper.setProps({ footerClass: 'custom-footer' })
    expect(wrapper.vm.getFooterClass).toBe('k-overlay__footer custom-footer')
  })

  it('emits closeOverlay and submit events from methods', () => {
    const wrapper = createWrapper()

    wrapper.vm.closeOverlay()
    wrapper.vm.submit()

    expect(wrapper.emitted('closeOverlay')).toBeTruthy()
    expect(wrapper.emitted('submit')).toBeTruthy()
  })
})
