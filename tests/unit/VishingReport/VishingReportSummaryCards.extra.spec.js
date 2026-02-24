import { shallowMount } from '@vue/test-utils'
import VishingReportSummaryCards from '@/components/VishingReport/VishingReportSummaryCards.vue'

describe('VishingReportSummaryCards.vue (extra branch coverage)', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(VishingReportSummaryCards, {
      propsData: { items: {}, ...propsData },
      stubs: { VishingReportSummaryInfoCard: true }
    })

  it('getAnsweredData returns default when answered is undefined', () => {
    const wrapper = mountComponent({ items: {} })
    expect(wrapper.vm.getAnsweredData).toEqual({ userCount: 0, userPercent: 0 })
  })

  it('getAnsweredData returns answered when provided', () => {
    const wrapper = mountComponent({
      items: { answered: { userCount: 5, userPercent: '25' } }
    })
    expect(wrapper.vm.getAnsweredData).toEqual({ userCount: 5, userPercent: '25' })
  })

  it('getVishedData returns default when vished is null', () => {
    const wrapper = mountComponent({ items: { vished: null } })
    expect(wrapper.vm.getVishedData).toEqual({ userCount: 0, userPercent: 0 })
  })

  it('getVishedData returns vished when provided', () => {
    const wrapper = mountComponent({
      items: { vished: { userCount: 10, userPercent: '50' } }
    })
    expect(wrapper.vm.getVishedData).toEqual({ userCount: 10, userPercent: '50' })
  })

  it('getNoResponseData returns default when noResponse is undefined', () => {
    const wrapper = mountComponent({ items: {} })
    expect(wrapper.vm.getNoResponseData).toEqual({ userCount: 0, userPercent: 0 })
  })

  it('getNoResponseData returns noResponse when provided', () => {
    const wrapper = mountComponent({
      items: { noResponse: { userCount: 3, userPercent: '15' } }
    })
    expect(wrapper.vm.getNoResponseData).toEqual({ userCount: 3, userPercent: '15' })
  })
})
