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

  it('All skeleton loaders respond to loading prop change', async () => {
    const localVue = createLocalVue()

    const datatableWrapper = mount(DatatableLoading, {
      localVue,
      propsData: { loading: true }
    })
    expect(datatableWrapper.vm.loading).toBe(true)
    await datatableWrapper.setProps({ loading: false })
    expect(datatableWrapper.vm.loading).toBe(false)
  })

  it('Datatable loader renders correct container', () => {
    const localVue = createLocalVue()
    const wrapper = mount(DatatableLoading, {
      localVue,
      propsData: { loading: true }
    })
    expect(wrapper.find('.data-table-loading').exists()).toBe(true)
  })

  it('Widget loader renders correct container', () => {
    const localVue = createLocalVue()
    const wrapper = mount(WidgetLoading, {
      localVue,
      propsData: { loading: true }
    })
    expect(wrapper.find('.widget-loading').exists()).toBe(true)
  })

  it('Phishing reporter loader renders correct container', () => {
    const localVue = createLocalVue()
    const wrapper = mount(PhishingReporterTopBar, {
      localVue,
      propsData: { loading: true }
    })
    expect(wrapper.find('.phishing-reporter-top-bar-loading').exists()).toBe(true)
  })

  it('Three row loader renders correct container', () => {
    const localVue = createLocalVue()
    const wrapper = mount(ThreeRowLoading, {
      localVue,
      propsData: { loading: true }
    })
    expect(wrapper.find('.three-row-loading').exists()).toBe(true)
  })

  describe('DatatableLoading Component', () => {
    it('renders datatable loading component', () => {
      const localVue = createLocalVue()
      const wrapper = mount(DatatableLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('renders datatable loading skeleton with correct class', () => {
      const localVue = createLocalVue()
      const wrapper = mount(DatatableLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.find('.data-table-loading').exists()).toBe(true)
    })

    it('shows loading skeleton when loading is true', () => {
      const localVue = createLocalVue()
      const wrapper = mount(DatatableLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.find('.data-table-loading').exists()).toBeTruthy()
    })

    it('updates loading state on prop change', async () => {
      const localVue = createLocalVue()
      const wrapper = mount(DatatableLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.vm.loading).toBe(true)

      await wrapper.setProps({ loading: false })
      expect(wrapper.vm.loading).toBe(false)
    })

    it('unmounts datatable loader without errors', () => {
      const localVue = createLocalVue()
      const wrapper = mount(DatatableLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(() => wrapper.destroy()).not.toThrow()
    })
  })

  describe('WidgetLoading Component', () => {
    it('renders widget loading component', () => {
      const localVue = createLocalVue()
      const wrapper = mount(WidgetLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('renders widget loading skeleton with correct class', () => {
      const localVue = createLocalVue()
      const wrapper = mount(WidgetLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.find('.widget-loading').exists()).toBe(true)
    })

    it('shows loading skeleton when loading is true', () => {
      const localVue = createLocalVue()
      const wrapper = mount(WidgetLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.find('.widget-loading').exists()).toBeTruthy()
    })

    it('updates loading state on prop change', async () => {
      const localVue = createLocalVue()
      const wrapper = mount(WidgetLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.vm.loading).toBe(true)

      await wrapper.setProps({ loading: false })
      expect(wrapper.vm.loading).toBe(false)
    })

    it('unmounts widget loader without errors', () => {
      const localVue = createLocalVue()
      const wrapper = mount(WidgetLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(() => wrapper.destroy()).not.toThrow()
    })
  })

  describe('PhishingReporterTopBar Component', () => {
    it('renders phishing reporter loading component', () => {
      const localVue = createLocalVue()
      const wrapper = mount(PhishingReporterTopBar, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('renders phishing reporter loading skeleton with correct class', () => {
      const localVue = createLocalVue()
      const wrapper = mount(PhishingReporterTopBar, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.find('.phishing-reporter-top-bar-loading').exists()).toBe(true)
    })

    it('shows loading skeleton when loading is true', () => {
      const localVue = createLocalVue()
      const wrapper = mount(PhishingReporterTopBar, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.find('.phishing-reporter-top-bar-loading').exists()).toBeTruthy()
    })

    it('updates loading state on prop change', async () => {
      const localVue = createLocalVue()
      const wrapper = mount(PhishingReporterTopBar, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.vm.loading).toBe(true)

      await wrapper.setProps({ loading: false })
      expect(wrapper.vm.loading).toBe(false)
    })

    it('unmounts phishing reporter loader without errors', () => {
      const localVue = createLocalVue()
      const wrapper = mount(PhishingReporterTopBar, {
        localVue,
        propsData: { loading: true }
      })
      expect(() => wrapper.destroy()).not.toThrow()
    })
  })

  describe('ThreeRowLoading Component', () => {
    it('renders three row loading component', () => {
      const localVue = createLocalVue()
      const wrapper = mount(ThreeRowLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('renders three row loading skeleton with correct class', () => {
      const localVue = createLocalVue()
      const wrapper = mount(ThreeRowLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.find('.three-row-loading').exists()).toBe(true)
    })

    it('shows loading skeleton when loading is true', () => {
      const localVue = createLocalVue()
      const wrapper = mount(ThreeRowLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.find('.three-row-loading').exists()).toBeTruthy()
    })

    it('updates loading state on prop change', async () => {
      const localVue = createLocalVue()
      const wrapper = mount(ThreeRowLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.vm.loading).toBe(true)

      await wrapper.setProps({ loading: false })
      expect(wrapper.vm.loading).toBe(false)
    })

    it('unmounts three row loader without errors', () => {
      const localVue = createLocalVue()
      const wrapper = mount(ThreeRowLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(() => wrapper.destroy()).not.toThrow()
    })
  })

  describe('Loading Prop Behavior', () => {
    it('datatable loader responds to loading true', () => {
      const localVue = createLocalVue()
      const wrapper = mount(DatatableLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.vm.loading).toBe(true)
    })

    it('datatable loader responds to loading false', () => {
      const localVue = createLocalVue()
      const wrapper = mount(DatatableLoading, {
        localVue,
        propsData: { loading: false }
      })
      expect(wrapper.vm.loading).toBe(false)
    })

    it('widget loader responds to loading changes', async () => {
      const localVue = createLocalVue()
      const wrapper = mount(WidgetLoading, {
        localVue,
        propsData: { loading: true }
      })

      expect(wrapper.vm.loading).toBe(true)
      await wrapper.setProps({ loading: false })
      expect(wrapper.vm.loading).toBe(false)
    })

    it('all loaders react to loading prop independently', () => {
      const localVue = createLocalVue()

      const datatable = mount(DatatableLoading, {
        localVue,
        propsData: { loading: true }
      })
      const widget = mount(WidgetLoading, {
        localVue,
        propsData: { loading: false }
      })

      expect(datatable.vm.loading).toBe(true)
      expect(widget.vm.loading).toBe(false)
    })

    it('loading state persists across multiple prop updates', async () => {
      const localVue = createLocalVue()
      const wrapper = mount(DatatableLoading, {
        localVue,
        propsData: { loading: true }
      })

      await wrapper.setProps({ loading: false })
      expect(wrapper.vm.loading).toBe(false)

      await wrapper.setProps({ loading: true })
      expect(wrapper.vm.loading).toBe(true)
    })
  })

  describe('CSS Classes', () => {
    it('datatable loader uses correct CSS class', () => {
      const localVue = createLocalVue()
      const wrapper = mount(DatatableLoading, {
        localVue,
        propsData: { loading: true }
      })
      const element = wrapper.find('.data-table-loading')
      expect(element.exists()).toBe(true)
    })

    it('widget loader uses correct CSS class', () => {
      const localVue = createLocalVue()
      const wrapper = mount(WidgetLoading, {
        localVue,
        propsData: { loading: true }
      })
      const element = wrapper.find('.widget-loading')
      expect(element.exists()).toBe(true)
    })

    it('phishing reporter loader uses correct CSS class', () => {
      const localVue = createLocalVue()
      const wrapper = mount(PhishingReporterTopBar, {
        localVue,
        propsData: { loading: true }
      })
      const element = wrapper.find('.phishing-reporter-top-bar-loading')
      expect(element.exists()).toBe(true)
    })

    it('three row loader uses correct CSS class', () => {
      const localVue = createLocalVue()
      const wrapper = mount(ThreeRowLoading, {
        localVue,
        propsData: { loading: true }
      })
      const element = wrapper.find('.three-row-loading')
      expect(element.exists()).toBe(true)
    })

    it('each loader renders its primary CSS class', () => {
      const localVue = createLocalVue()

      const datatable = mount(DatatableLoading, {
        localVue,
        propsData: { loading: true }
      })
      const widget = mount(WidgetLoading, {
        localVue,
        propsData: { loading: true }
      })

      expect(datatable.find('.data-table-loading').exists()).toBe(true)
      expect(widget.find('.widget-loading').exists()).toBe(true)
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts all loaders successfully', () => {
      const localVue = createLocalVue()

      const datatable = mount(DatatableLoading, { localVue, propsData: { loading: true } })
      const widget = mount(WidgetLoading, { localVue, propsData: { loading: true } })
      const phishing = mount(PhishingReporterTopBar, { localVue, propsData: { loading: true } })
      const threeRow = mount(ThreeRowLoading, { localVue, propsData: { loading: true } })

      expect(datatable.vm).toBeDefined()
      expect(widget.vm).toBeDefined()
      expect(phishing.vm).toBeDefined()
      expect(threeRow.vm).toBeDefined()
    })

    it('unmounts all loaders without errors', () => {
      const localVue = createLocalVue()

      const datatable = mount(DatatableLoading, { localVue, propsData: { loading: true } })
      const widget = mount(WidgetLoading, { localVue, propsData: { loading: true } })
      const phishing = mount(PhishingReporterTopBar, { localVue, propsData: { loading: true } })
      const threeRow = mount(ThreeRowLoading, { localVue, propsData: { loading: true } })

      expect(() => {
        datatable.destroy()
        widget.destroy()
        phishing.destroy()
        threeRow.destroy()
      }).not.toThrow()
    })

    it('handles multiple mount/unmount cycles', () => {
      const localVue = createLocalVue()

      for (let i = 0; i < 3; i++) {
        const wrapper = mount(DatatableLoading, { localVue, propsData: { loading: true } })
        expect(wrapper.vm).toBeDefined()
        wrapper.destroy()
      }
    })

    it('maintains loading state after mount', () => {
      const localVue = createLocalVue()
      const wrapper = mount(DatatableLoading, { localVue, propsData: { loading: true } })
      expect(wrapper.vm.loading).toBe(true)
    })
  })

  describe('Props Validation', () => {
    it('datatable loader accepts loading prop', () => {
      const localVue = createLocalVue()
      const wrapper = mount(DatatableLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.props('loading')).toBe(true)
    })

    it('widget loader accepts loading prop', () => {
      const localVue = createLocalVue()
      const wrapper = mount(WidgetLoading, {
        localVue,
        propsData: { loading: false }
      })
      expect(wrapper.props('loading')).toBe(false)
    })

    it('phishing reporter loader accepts loading prop', () => {
      const localVue = createLocalVue()
      const wrapper = mount(PhishingReporterTopBar, {
        localVue,
        propsData: { loading: true }
      })
      expect(wrapper.props('loading')).toBe(true)
    })

    it('three row loader accepts loading prop', () => {
      const localVue = createLocalVue()
      const wrapper = mount(ThreeRowLoading, {
        localVue,
        propsData: { loading: false }
      })
      expect(wrapper.props('loading')).toBe(false)
    })

    it('loading prop default to false or true', () => {
      const localVue = createLocalVue()
      const wrapper = mount(DatatableLoading, {
        localVue,
        propsData: { loading: true }
      })
      expect(typeof wrapper.props('loading')).toBe('boolean')
    })
  })

  describe('Reactivity', () => {
    it('datatable loader reacts to rapid loading changes', async () => {
      const localVue = createLocalVue()
      const wrapper = mount(DatatableLoading, {
        localVue,
        propsData: { loading: true }
      })

      await wrapper.setProps({ loading: false })
      await wrapper.setProps({ loading: true })
      await wrapper.setProps({ loading: false })

      expect(wrapper.vm.loading).toBe(false)
    })

    it('all loaders maintain independence', async () => {
      const localVue = createLocalVue()

      const datatable = mount(DatatableLoading, {
        localVue,
        propsData: { loading: true }
      })
      const widget = mount(WidgetLoading, {
        localVue,
        propsData: { loading: false }
      })

      await datatable.setProps({ loading: false })
      expect(datatable.vm.loading).toBe(false)
      expect(widget.vm.loading).toBe(false)

      await widget.setProps({ loading: true })
      expect(datatable.vm.loading).toBe(false)
      expect(widget.vm.loading).toBe(true)
    })

    it('loaders update immediately on prop change', async () => {
      const localVue = createLocalVue()
      const wrapper = mount(DatatableLoading, {
        localVue,
        propsData: { loading: true }
      })

      expect(wrapper.vm.loading).toBe(true)
      await wrapper.setProps({ loading: false })
      expect(wrapper.vm.loading).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('handles null loading prop gracefully', () => {
      const localVue = createLocalVue()
      const wrapper = mount(DatatableLoading, {
        localVue,
        propsData: { loading: null }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('handles undefined loading prop gracefully', () => {
      const localVue = createLocalVue()
      const wrapper = mount(DatatableLoading, {
        localVue,
        propsData: { loading: undefined }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('handles all loaders with same loading state', () => {
      const localVue = createLocalVue()

      const datatable = mount(DatatableLoading, { localVue, propsData: { loading: true } })
      const widget = mount(WidgetLoading, { localVue, propsData: { loading: true } })
      const phishing = mount(PhishingReporterTopBar, { localVue, propsData: { loading: true } })
      const threeRow = mount(ThreeRowLoading, { localVue, propsData: { loading: true } })

      expect(datatable.vm.loading).toBe(true)
      expect(widget.vm.loading).toBe(true)
      expect(phishing.vm.loading).toBe(true)
      expect(threeRow.vm.loading).toBe(true)
    })
  })
})
