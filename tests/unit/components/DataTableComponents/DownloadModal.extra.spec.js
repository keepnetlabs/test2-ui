import { shallowMount } from '@vue/test-utils'
import DownloadModal from '@/components/DataTableComponents/DownloadModal.vue'

describe('DownloadModal.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DownloadModal, {
      propsData: {
        isShow: true,
        title: 'Download',
        download: { xls: true, csv: true, pdf: false },
        ...propsData
      },
      stubs: { AppDialog: true }
    })

  it('getDisabledStatusOfDelete is true when no download type selected', () => {
    const wrapper = createWrapper()
    wrapper.setData({ downloadType: [false, false, false] })
    expect(wrapper.vm.getDisabledStatusOfDelete).toBe(true)
  })

  it('getDisabledStatusOfDelete is false when at least one type selected', () => {
    const wrapper = createWrapper()
    wrapper.setData({ downloadType: [true, false, false] })
    expect(wrapper.vm.getDisabledStatusOfDelete).toBe(false)
  })

  it('downloadEvent emits XLS when index 0 selected', () => {
    const wrapper = createWrapper()
    wrapper.setData({ downloadType: [true, false, false] })
    wrapper.vm.downloadEvent()
    expect(wrapper.emitted('downloadEvent')[0][0]).toEqual(['XLS'])
  })

  it('downloadEvent emits CSV when index 1 selected', () => {
    const wrapper = createWrapper()
    wrapper.setData({ downloadType: [false, true, false] })
    wrapper.vm.downloadEvent()
    expect(wrapper.emitted('downloadEvent')[0][0]).toEqual(['CSV'])
  })

  it('downloadEvent emits PDF when index 2 selected', () => {
    const wrapper = createWrapper()
    wrapper.setData({ downloadType: [false, false, true] })
    wrapper.vm.downloadEvent()
    expect(wrapper.emitted('downloadEvent')[0][0]).toEqual(['PDF'])
  })

  it('downloadEvent emits multiple types when multiple selected', () => {
    const wrapper = createWrapper()
    wrapper.setData({ downloadType: [true, true, false] })
    wrapper.vm.downloadEvent()
    expect(wrapper.emitted('downloadEvent')[0][0]).toEqual(['XLS', 'CSV'])
  })

  it('changeDownloadModalStatus emits changeDownloadModalStatus with false', () => {
    const wrapper = createWrapper()
    wrapper.vm.changeDownloadModalStatus()
    expect(wrapper.emitted('changeDownloadModalStatus')).toEqual([[false]])
  })
})
