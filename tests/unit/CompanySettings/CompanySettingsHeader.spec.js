import { shallowMount } from '@vue/test-utils'
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'

describe('CompanySettingsHeader.vue', () => {
  it('renders title and subtitle when slot title is disabled', () => {
    const wrapper = shallowMount(CompanySettingsHeader, {
      propsData: {
        title: 'Company Settings',
        subTitle: 'Manage company data',
        slots: { title: false }
      }
    })

    expect(wrapper.text()).toContain('Company Settings')
    expect(wrapper.text()).toContain('Manage company data')
  })

  it('renders title slot when enabled', () => {
    const wrapper = shallowMount(CompanySettingsHeader, {
      propsData: {
        subTitle: 'Manage company data',
        slots: { title: true }
      },
      slots: {
        title: '<div id="custom-title">Custom Title</div>'
      }
    })

    expect(wrapper.find('#custom-title').exists()).toBe(true)
    expect(wrapper.text()).toContain('Custom Title')
  })
})

