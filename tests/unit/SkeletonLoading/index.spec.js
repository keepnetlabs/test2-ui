import { createLocalVue, mount } from '@vue/test-utils'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading'
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading'
import PhishingReporterTopBar from '@/components/SkeletonLoading/PhishingReporterTopBar'
import ThreeRowLoading from '@/components/SkeletonLoading/ThreeRowLoading'

describe('Skeleton Loading test cases', () => {
  it('Datatable Loading skeleton loading', async () => {
    const localVue = createLocalVue()
    const wrapper = mount(DatatableLoading, {
      localVue,
      propsData: {
        loading: true
      }
    })
    //checking is rendered

    expect(wrapper.find('.data-table-loading').exists()).toBeTruthy()

    //setting loading false and re-checking

    await wrapper.setProps({
      loading: false
    })

    expect(wrapper.vm['loading']).toBe(false)
  })
  it('Widget Loading skeleton loading', async () => {
    const localVue = createLocalVue()
    const wrapper = mount(WidgetLoading, {
      localVue,
      propsData: {
        loading: true
      }
    })
    //checking is rendered

    expect(wrapper.find('.widget-loading').exists()).toBeTruthy()

    //setting loading false and re-checking

    await wrapper.setProps({
      loading: false
    })

    expect(wrapper.vm['loading']).toBe(false)
  })
  it('Phishing Reporter top bar skeleton loading', async () => {
    const localVue = createLocalVue()
    const wrapper = mount(PhishingReporterTopBar, {
      localVue,
      propsData: {
        loading: true
      }
    })
    //checking is rendered

    expect(wrapper.find('.phishing-reporter-top-bar-loading').exists()).toBeTruthy()

    //setting loading false and re-checking

    await wrapper.setProps({
      loading: false
    })

    expect(wrapper.vm['loading']).toBe(false)
  })

  it('Three row skeleton loading', async () => {
    const localVue = createLocalVue()
    const wrapper = mount(ThreeRowLoading, {
      localVue,
      propsData: {
        loading: true
      }
    })
    //checking is rendered

    expect(wrapper.find('.three-row-loading').exists()).toBeTruthy()

    //setting loading false and re-checking

    await wrapper.setProps({
      loading: false
    })

    expect(wrapper.vm['loading']).toBe(false)
  })
})
