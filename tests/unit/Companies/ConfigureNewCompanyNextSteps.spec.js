import { shallowMount } from '@vue/test-utils'
import ConfigureNewCompanyNextSteps from '@/components/Companies/ConfigureNewCompanyNextSteps.vue'

describe('ConfigureNewCompanyNextSteps.vue', () => {
  it('renders five next-step items', () => {
    const wrapper = shallowMount(ConfigureNewCompanyNextSteps, {
      stubs: {
        ConfigureNewCompanyNextStepsItem: {
          name: 'ConfigureNewCompanyNextStepsItem',
          template: '<div class="step-item" />'
        }
      }
    })

    expect(wrapper.findAll('.step-item').length).toBe(5)
  })

  it('has expected component name', () => {
    const wrapper = shallowMount(ConfigureNewCompanyNextSteps, {
      stubs: { ConfigureNewCompanyNextStepsItem: true }
    })
    expect(wrapper.vm.$options.name).toBe('ConfigureNewCompanyNextSteps')
  })

  it('passes expected props to first and second next-step items', () => {
    const ItemStub = {
      name: 'ConfigureNewCompanyNextStepsItem',
      props: ['title', 'text', 'routeText', 'routeLink'],
      template: '<div class="step-item">{{ title }}</div>'
    }
    const wrapper = shallowMount(ConfigureNewCompanyNextSteps, {
      stubs: { ConfigureNewCompanyNextStepsItem: ItemStub }
    })

    const items = wrapper.findAllComponents(ItemStub)
    expect(items.at(0).props('title')).toBe('Customize notification templates')
    expect(items.at(1).props('routeLink')).toBe('/target-users')
  })

  it('passes expected route config to phishing reporter item', () => {
    const ItemStub = {
      name: 'ConfigureNewCompanyNextStepsItem',
      props: ['title', 'text', 'routeText', 'routeLink'],
      template: '<div class="step-item">{{ title }}</div>'
    }
    const wrapper = shallowMount(ConfigureNewCompanyNextSteps, {
      stubs: { ConfigureNewCompanyNextStepsItem: ItemStub }
    })

    const items = wrapper.findAllComponents(ItemStub)
    const lastItem = items.at(4)
    expect(lastItem.props('title')).toBe('Configure Phishing Reporter')
    expect(lastItem.props('routeLink')).toEqual({
      name: 'Phishing Reporter',
      query: { tab: 'phishing-reporter-settings' }
    })
  })
})
