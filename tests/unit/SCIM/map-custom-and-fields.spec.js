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

  it('renders main container with correct class', () => {
    const wrapper = mount(MapCustomAndSCIMFields, {
      localVue,
      vuetify
    })
    const container = wrapper.find('.map-custom-and-scim-fields')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('map-custom-and-scim-fields')
  })

  it('displays empty message with correct text', () => {
    const wrapper = mount(MapCustomAndSCIMFields, {
      localVue,
      vuetify
    })
    expect(wrapper.vm.isEmptyMessageRendered).toBe(true)
    expect(wrapper.text()).toContain('You do not have any custom field')
  })


  it('renders map items with correct structure', () => {
    const wrapper = mount(MapCustomAndSCIMFields, {
      localVue,
      vuetify,
      propsData: {
        customFields: [{ text: 'Field1', value: 'field1' }],
        scimFields: [{ text: 'Value1', value: 'value1' }],
        initialValue: [{ customFieldResourceId: 'field1', scimFieldResourceId: 'value1' }]
      }
    })
    const items = wrapper.findAll('.map-custom-and-scim-fields-item')
    expect(items.length).toBeGreaterThan(0)
  })

  it('handles multiple custom and SCIM fields', () => {
    const wrapper = mount(MapCustomAndSCIMFields, {
      localVue,
      vuetify,
      propsData: {
        customFields: [
          { text: 'Field1', value: 'field1' },
          { text: 'Field2', value: 'field2' },
          { text: 'Field3', value: 'field3' }
        ],
        scimFields: [
          { text: 'Value1', value: 'value1' },
          { text: 'Value2', value: 'value2' }
        ],
        initialValue: []
      }
    })
    expect(wrapper.vm.customFields.length).toBeGreaterThanOrEqual(3)
  })
})
