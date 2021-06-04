import 'regenerator-runtime/runtime'
import { VBtn } from 'vuetify/lib/components/VBtn'
// Components
import CustomCard from '@/components/CustomCard'

// Utilities
import { mount } from '@vue/test-utils'

describe('CustomCard.vue', () => {
  it('should have vbtn', () => {
    const wrapper = mount(CustomCard, {
      propsData: { title: 'Foobar' }
    })
    expect(wrapper.findComponent(VBtn).exists()).toBe(true)
  })

  it('should have foobar', () => {
    const wrapper = mount(CustomCard, {
      propsData: { title: 'Foobar' }
    })
    expect(wrapper.text()).toContain('Foobar')
  })
})
