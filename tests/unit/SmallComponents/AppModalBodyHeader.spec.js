import { createLocalVue, shallowMount } from '@vue/test-utils'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'

describe('AppModalBodyHeader.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) =>
    shallowMount(AppModalBodyHeader, {
      localVue,
      propsData,
      stubs: {
        VListItem: true,
        VListItemContent: true,
        VListItemTitle: true,
        VListItemSubtitle: true
      }
    })

  it('renders', () => {
    expect(mountComponent().vm).toBeDefined()
  })

  it('has expected name', () => {
    expect(mountComponent().vm.$options.name).toBe('AppModalBodyHeader')
  })

  it('renders title and subtitle props', () => {
    const wrapper = mountComponent({ title: 'Title', subTitle: 'Sub title' })
    expect(wrapper.text()).toContain('Title')
    expect(wrapper.text()).toContain('Sub title')
  })
})
