import { createLocalVue, mount } from '@vue/test-utils'
import { customVuetify as vuetify } from '../utils'
import MapCustomAndSCIMFields from '@/components/Company Settings/SCIM/MapCustomAndSCIMFields.vue'
import { setupPromisePool } from '../promise-pool-helpers'
describe('Map Custom Fields Suit', () => {
  setupPromisePool()
  const localVue = createLocalVue()
  it('Checking is rendering', () => {
    const wrapper = mount(MapCustomAndSCIMFields, {
      localVue,
      vuetify
    })
    //checking is rendered
    expect(wrapper.exists()).toBe(true)
    //checking main div
    expect(wrapper.find('.map-custom-and-scim-fields').exists()).toBe(true)
  })
  it('Checking empty state', () => {
    const wrapper = mount(MapCustomAndSCIMFields, {
      localVue,
      vuetify
    })
    //checking vm empty state
    expect(wrapper.vm.isEmptyMessageRendered).toBe(true)
    //checking empty state if there is no data
    expect(wrapper.text().includes('You do not have any custom field')).toBe(true)
  })
  it('Checking with default state', () => {
    const wrapper = mount(MapCustomAndSCIMFields, {
      localVue,
      vuetify,
      propsData: {
        customFields: [{ text: 'Married', value: 'Married' }],
        scimFields: [{ text: 'Username', value: 'Username' }],
        initialValue: [{ customFieldResourceId: 'Married', scimFieldResourceId: 'Username' }]
      }
    })
    //checking vm empty state
    expect(wrapper.vm.isEmptyMessageRendered).toBe(false)
    //checking empty state to be false
    expect(wrapper.text().includes('You do not have any custom field')).toBe(false)
    //checking is item rendered
    expect(wrapper.find('.map-custom-and-scim-fields-item').exists()).toBe(true)
  })
})
