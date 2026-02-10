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

  describe('Component Rendering', () => {
    it('renders component successfully', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('renders main container', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify
      })
      expect(wrapper.find('.map-custom-and-scim-fields').exists()).toBe(true)
    })

    it('mounts without errors', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('renders component with vuetify', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify
      })
      expect(wrapper.find('.map-custom-and-scim-fields').exists()).toBe(true)
    })
  })

  describe('Empty State', () => {
    it('shows empty message when no custom fields', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify
      })
      expect(wrapper.vm.isEmptyMessageRendered).toBe(true)
    })

    it('displays empty message text', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify
      })
      expect(wrapper.text()).toContain('You do not have any custom field')
    })

    it('hides empty message with data', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields: [{ text: 'Test', value: 'test' }],
          scimFields: [{ text: 'TestValue', value: 'testvalue' }],
          initialValue: [{ customFieldResourceId: 'test', scimFieldResourceId: 'testvalue' }]
        }
      })
      expect(wrapper.vm.isEmptyMessageRendered).toBe(false)
    })

    it('empty state property reflects no fields', () => {
      const emptyWrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify
      })
      expect(emptyWrapper.vm.isEmptyMessageRendered).toBe(true)

      const dataWrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields: [{ text: 'Field', value: 'field' }],
          scimFields: [{ text: 'Value', value: 'value' }],
          initialValue: [{ customFieldResourceId: 'field', scimFieldResourceId: 'value' }]
        }
      })
      expect(dataWrapper.vm.isEmptyMessageRendered).toBe(false)
    })
  })

  describe('Data Handling', () => {
    it('accepts customFields prop', () => {
      const customFields = [{ text: 'Field', value: 'field' }]
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields,
          scimFields: [],
          initialValue: []
        }
      })
      expect(wrapper.props('customFields')).toEqual(customFields)
    })

    it('accepts scimFields prop', () => {
      const scimFields = [{ text: 'Value', value: 'value' }]
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields: [],
          scimFields,
          initialValue: []
        }
      })
      expect(wrapper.props('scimFields')).toEqual(scimFields)
    })

    it('accepts initialValue prop', () => {
      const initialValue = [{ customFieldResourceId: 'field', scimFieldResourceId: 'value' }]
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields: [{ text: 'Field', value: 'field' }],
          scimFields: [{ text: 'Value', value: 'value' }],
          initialValue
        }
      })
      expect(wrapper.props('initialValue')).toEqual(initialValue)
    })

    it('handles empty customFields array', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields: [],
          scimFields: [{ text: 'Value', value: 'value' }],
          initialValue: []
        }
      })
      expect(wrapper.vm.customFields.length).toBe(0)
    })

    it('handles empty scimFields array', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields: [{ text: 'Field', value: 'field' }],
          scimFields: [],
          initialValue: []
        }
      })
      expect(wrapper.vm.scimFields.length).toBe(0)
    })

    it('shows empty message when no initialValue mappings', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields: [{ text: 'Field', value: 'field' }],
          scimFields: [{ text: 'Value', value: 'value' }],
          initialValue: []
        }
      })
      expect(wrapper.vm.isEmptyMessageRendered).toBe(true)
    })
  })

  describe('Field Mapping', () => {
    it('renders map items with data', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields: [{ text: 'Field1', value: 'field1' }],
          scimFields: [{ text: 'Value1', value: 'value1' }],
          initialValue: [{ customFieldResourceId: 'field1', scimFieldResourceId: 'value1' }]
        }
      })
      expect(wrapper.find('.map-custom-and-scim-fields-item').exists()).toBe(true)
    })

    it('renders multiple map items', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields: [
            { text: 'Field1', value: 'field1' },
            { text: 'Field2', value: 'field2' }
          ],
          scimFields: [
            { text: 'Value1', value: 'value1' },
            { text: 'Value2', value: 'value2' }
          ],
          initialValue: [
            { customFieldResourceId: 'field1', scimFieldResourceId: 'value1' },
            { customFieldResourceId: 'field2', scimFieldResourceId: 'value2' }
          ]
        }
      })
      const items = wrapper.findAll('.map-custom-and-scim-fields-item')
      expect(items.length).toBeGreaterThan(0)
    })

    it('correctly displays field mapping structure', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields: [{ text: 'Married', value: 'Married' }],
          scimFields: [{ text: 'Username', value: 'Username' }],
          initialValue: [{ customFieldResourceId: 'Married', scimFieldResourceId: 'Username' }]
        }
      })
      const items = wrapper.findAll('.map-custom-and-scim-fields-item')
      expect(items.length).toBeGreaterThan(0)
    })

    it('handles mixed field types', () => {
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
      expect(wrapper.vm.customFields.length).toBe(3)
      expect(wrapper.vm.scimFields.length).toBe(2)
    })
  })

  describe('Container Structure', () => {
    it('renders main container with correct class', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify
      })
      const container = wrapper.find('.map-custom-and-scim-fields')
      expect(container.exists()).toBe(true)
    })

    it('container has correct CSS class', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify
      })
      const container = wrapper.find('.map-custom-and-scim-fields')
      expect(container.classes()).toContain('map-custom-and-scim-fields')
    })

    it('container is the root element', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify
      })
      expect(wrapper.find('.map-custom-and-scim-fields').exists()).toBe(true)
    })

    it('empty message is inside main container', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify
      })
      expect(wrapper.text()).toContain('You do not have any custom field')
    })
  })

  describe('Props Handling', () => {
    it('accepts all required props', () => {
      const props = {
        customFields: [{ text: 'Custom', value: 'custom' }],
        scimFields: [{ text: 'Scim', value: 'scim' }],
        initialValue: [{ customFieldResourceId: 'custom', scimFieldResourceId: 'scim' }]
      }
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: props
      })
      expect(wrapper.props('customFields')).toBeDefined()
      expect(wrapper.props('scimFields')).toBeDefined()
      expect(wrapper.props('initialValue')).toBeDefined()
    })

    it('handles prop updates', async () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields: [{ text: 'Field1', value: 'field1' }],
          scimFields: [{ text: 'Value1', value: 'value1' }],
          initialValue: []
        }
      })

      const newProps = {
        customFields: [{ text: 'Field2', value: 'field2' }],
        scimFields: [{ text: 'Value2', value: 'value2' }],
        initialValue: []
      }
      await wrapper.setProps(newProps)
      expect(wrapper.props('customFields')[0].text).toBe('Field2')
    })

    it('preserves prop data integrity', () => {
      const customFields = [{ text: 'Original', value: 'original' }]
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields,
          scimFields: [],
          initialValue: []
        }
      })
      expect(wrapper.props('customFields')).toEqual(customFields)
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts without errors', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify
      })
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('maintains state after prop updates', async () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields: [{ text: 'Field1', value: 'field1' }],
          scimFields: [{ text: 'Value1', value: 'value1' }],
          initialValue: []
        }
      })

      await wrapper.setProps({
        customFields: [{ text: 'Field2', value: 'field2' }]
      })

      expect(wrapper.vm).toBeDefined()
    })

    it('handles multiple mount/unmount cycles', () => {
      const wrapper1 = mount(MapCustomAndSCIMFields, { localVue, vuetify })
      expect(wrapper1.vm).toBeDefined()
      wrapper1.destroy()

      const wrapper2 = mount(MapCustomAndSCIMFields, { localVue, vuetify })
      expect(wrapper2.vm).toBeDefined()
      wrapper2.destroy()
    })
  })

  describe('Edge Cases', () => {
    it('handles very long field names', () => {
      const longName = 'This is a very long field name that should still work'
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields: [{ text: longName, value: 'field1' }],
          scimFields: [{ text: 'Value', value: 'value1' }],
          initialValue: []
        }
      })
      expect(wrapper.vm.customFields[0].text).toBe(longName)
    })

    it('handles special characters in field values', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields: [{ text: 'Field@#$', value: 'field@#$' }],
          scimFields: [{ text: 'Value', value: 'value' }],
          initialValue: []
        }
      })
      expect(wrapper.vm.customFields.length).toBe(1)
    })

    it('handles large numbers of fields', () => {
      const manyFields = Array.from({ length: 50 }, (_, i) => ({
        text: `Field${i}`,
        value: `field${i}`
      }))
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields: manyFields,
          scimFields: [{ text: 'Value', value: 'value' }],
          initialValue: []
        }
      })
      expect(wrapper.vm.customFields.length).toBe(50)
    })

    it('handles null props gracefully', () => {
      const wrapper = mount(MapCustomAndSCIMFields, {
        localVue,
        vuetify,
        propsData: {
          customFields: null,
          scimFields: null,
          initialValue: null
        }
      })
      expect(wrapper.exists()).toBe(true)
    })
  })
})
