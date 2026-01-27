import { createLocalVue, shallowMount } from '@vue/test-utils'
import KContainer from '@/components/KContainer/KContainer.vue'
import Vuetify from 'vuetify'

describe('KContainer.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('renders correctly', () => {
    const wrapper = shallowMount(KContainer, {
      localVue,
      vuetify
    })
    expect(wrapper.find('.k-container').exists()).toBe(true)
    expect(wrapper.find('v-card-stub').exists()).toBe(true)
  })

  it('applies no-tab class when tabless prop is true', () => {
    const wrapper = shallowMount(KContainer, {
      localVue,
      vuetify,
      propsData: {
        tabless: true
      }
    })
    expect(wrapper.find('.k-container__no-tab').exists()).toBe(true)
  })

  it('renders slot content', () => {
    const wrapper = shallowMount(KContainer, {
      localVue,
      vuetify,
      slots: {
        default: '<div class="test-content">Content</div>'
      }
    })
    expect(wrapper.find('.test-content').exists()).toBe(true)
  })
})
