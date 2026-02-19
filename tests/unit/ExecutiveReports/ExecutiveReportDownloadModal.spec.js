import { shallowMount } from '@vue/test-utils'
import ExecutiveReportDownloadModal from '@/components/ExecutiveReports/ExecutiveReportDownloadModal.vue'

describe('ExecutiveReportDownloadModal.vue', () => {
  const createWrapper = (propsData = {}, routeParams = {}) =>
    shallowMount(ExecutiveReportDownloadModal, {
      propsData: {
        status: true,
        isPreview: false,
        isCreated: false,
        ...propsData
      },
      stubs: {
        AppModal: true,
        VIcon: true
      },
      mocks: {
        $route: {
          params: routeParams
        }
      }
    })

  it('computes title/icon and wait text for download mode', () => {
    const wrapper = createWrapper({ isPreview: false, isCreated: false })
    expect(wrapper.vm.getTitle).toBe('Download PDF')
    expect(wrapper.vm.getIcon).toBe('mdi-download')
    expect(wrapper.vm.getWaitTitle).toBe('PDF Generating')
    expect(wrapper.vm.getWaitSubtitle).toContain('generating your PDF report')
    expect(wrapper.vm.getWaitDescription).toBe('Thank you for your patience.')
  })

  it('computes title/icon and wait text for preview mode when created', () => {
    const wrapper = createWrapper({ isPreview: true, isCreated: true })
    expect(wrapper.vm.getTitle).toBe('Preview PDF')
    expect(wrapper.vm.getIcon).toBe('mdi-eye')
    expect(wrapper.vm.getWaitTitle).toBe('PDF Preparation Complete')
    expect(wrapper.vm.getWaitSubtitle).toContain('ready for preview')
  })

  it('mounted auto-submits when showDownloadModal route param is not set', () => {
    const wrapper = createWrapper({}, {})
    expect(wrapper.emitted('on-submit')).toBeTruthy()
  })

  it('mounted does not auto-submit when showDownloadModal route param is set', () => {
    const wrapper = createWrapper({}, { showDownloadModal: true })
    expect(wrapper.emitted('on-submit')).toBeFalsy()
  })

  it('isParentLoading watcher triggers submit only when allowed', () => {
    const wrapper = createWrapper({}, { showDownloadModal: true })

    wrapper.vm.$options.watch.isParentLoading.call(wrapper.vm, false)
    expect(wrapper.emitted('on-submit')).toBeTruthy()

    const wrapper2 = createWrapper({}, {})
    wrapper2.vm.$options.watch.isParentLoading.call(wrapper2.vm, false)
    expect(wrapper2.emitted('on-submit')).toBeTruthy()
  })

  it('handleClose emits on-close', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })
})
