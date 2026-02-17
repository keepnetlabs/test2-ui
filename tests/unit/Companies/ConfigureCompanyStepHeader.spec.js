import { shallowMount } from '@vue/test-utils'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'

describe('ConfigureCompanyStepHeader.vue', () => {
  it('renders title and subtitle', () => {
    const wrapper = shallowMount(ConfigureCompanyStepHeader, {
      propsData: {
        title: 'Step 1',
        subtitle: 'Configure company info'
      }
    })

    expect(wrapper.text()).toContain('Step 1')
    expect(wrapper.text()).toContain('Configure company info')
  })
})

