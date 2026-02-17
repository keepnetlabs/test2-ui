import { shallowMount } from '@vue/test-utils'
import ConfigureNewCompanyNextStepsItem from '@/components/Companies/ConfigureNewCompanyNextStepsItem'

describe('ConfigureNewCompanyNextStepsItem.vue', () => {
  it('renders default content and title', () => {
    const wrapper = shallowMount(ConfigureNewCompanyNextStepsItem, {
      stubs: { 'router-link': true },
      propsData: {
        title: 'Next steps',
        routeLink: '/settings',
        routeText: 'Settings',
        text: 'for details.'
      }
    })

    expect(wrapper.text()).toContain('Next steps')
    expect(wrapper.text()).toContain('Go to')
    expect(wrapper.text()).toContain('Settings')
    expect(wrapper.text()).toContain('for details.')
  })

  it('renders slot content when provided', () => {
    const wrapper = shallowMount(ConfigureNewCompanyNextStepsItem, {
      propsData: {
        title: 'Next steps'
      },
      slots: {
        default: '<div id="custom-slot">Custom content</div>'
      }
    })

    expect(wrapper.find('#custom-slot').exists()).toBe(true)
    expect(wrapper.text()).toContain('Custom content')
  })

  it('accepts string and object routeLink values via prop validator', () => {
    const validator = ConfigureNewCompanyNextStepsItem.props.routeLink.validator

    expect(validator('/settings')).toBe(true)
    expect(validator({ name: 'Settings' })).toBe(true)
    expect(validator(123)).toBe(false)
  })
})

