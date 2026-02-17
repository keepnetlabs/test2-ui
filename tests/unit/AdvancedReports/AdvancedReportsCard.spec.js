import { shallowMount } from '@vue/test-utils'
import AdvancedReportsCard from '@/components/AdvancedReports/AdvancedReportsCard'

describe('AdvancedReportsCard.vue', () => {
  it('renders props correctly', () => {
    const wrapper = shallowMount(AdvancedReportsCard, {
      propsData: {
        title: 'My Report',
        description: 'Description',
        buttonText: 'Create'
      }
    })

    expect(wrapper.text()).toContain('My Report')
    expect(wrapper.text()).toContain('Description')
    expect(wrapper.text()).toContain('Create')
  })

  it('emits resource id on action click', () => {
    const wrapper = shallowMount(AdvancedReportsCard, {
      propsData: {
        resourceId: 'abc-123'
      }
    })

    wrapper.vm.handleActionButtonClick()

    expect(wrapper.emitted('on-action-button-click')).toBeTruthy()
    expect(wrapper.emitted('on-action-button-click')[0]).toEqual(['abc-123'])
  })
})

