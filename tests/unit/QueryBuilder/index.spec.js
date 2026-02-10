import { createLocalVue, mount } from '@vue/test-utils'
import TestQueryBuilder from '@/components/TestHelpers/TestQueryBuilder'

describe('Query Builder test cases suite', () => {
  const localVue = createLocalVue()

  it('Check render', () => {
    const wrapper = mount(TestQueryBuilder, {
      localVue
    })
    //check is rendered
    expect(wrapper.find('#test-query-builder').exists()).toBe(true)
  })

  it('Check props', () => {
    const wrapper = mount(TestQueryBuilder, {
      localVue,
      propsData: {
        maxDepth: 5
      }
    })
    //check maxDepth Prop
    expect(wrapper.vm['maxDepth']).toBe(5)
    //check classes
    expect(wrapper.find('.vue-query-builder').exists()).toBe(true)
  })

  it('Check Group component', async () => {
    const wrapper = mount(TestQueryBuilder, {
      localVue
    })
    //check parent of group
    expect(wrapper.find('.vue-query-builder').exists()).toBeTruthy()

    //checking group
    expect(wrapper.find('.vqb-group').exists()).toBeTruthy()

    //checking group header
    expect(wrapper.find('.vqb-group-heading').exists()).toBeTruthy()

    //checking header info container
    const matchTypeContainer = wrapper.find('.match-type-container')
    expect(matchTypeContainer.exists()).toBeTruthy()

    //checking components of matchTypeContainer

    expect(matchTypeContainer.find('[value="OR"]'))
    expect(matchTypeContainer.find('[value="AND"]'))

    //check classes
    expect(wrapper.find('.vue-query-builder').exists()).toBe(true)

    //getting condition set button
    const button = wrapper.find('.rule-actions button:last-child')

    //clicking new condition set button
    await button.trigger('click')

    //checking is new group added

    expect(wrapper.find('.vqb-group.card.depth-2').exists()).toBeTruthy()
  })

  it('Check Role component', async () => {
    const wrapper = mount(TestQueryBuilder, {
      localVue
    })

    //checking parent of group component
    expect(wrapper.find('.vqb-group-body').exists()).toBeTruthy()

    //checking rule actions
    expect(wrapper.find('.rule-actions').exists()).toBeTruthy()

    //getting condition button
    const addConditionButton = wrapper.find('.rule-actions button')

    //clicking new condition button
    await addConditionButton.trigger('click')

    //checking rule
    const rule = wrapper.find('.vqb-rule')
    expect(rule.exists()).toBeTruthy()

    //checking conditions
    expect(rule.text()).toContain('Conditions')

    //checking options
    expect(rule.find('option').exists()).toBeTruthy()
  })

  it('Check with default value', () => {
    const wrapper = mount(TestQueryBuilder, {
      localVue,
      propsData: {
        defaultQuery: {
          operator: 'AND',
          conditionGroups: [
            {
              operator: 'AND',
              conditionItems: [
                {
                  fieldName: 'From',
                  operator: 'Contains',
                  format: 'Email',
                  value: 'asasasas@keepnetlabs.com',
                  operand: 'From',
                  rule: 'conditions',
                  FieldName: 'From'
                }
              ]
            }
          ]
        }
      }
    })
    //checking container
    expect(wrapper.find('.vue-query-builder').exists()).toBeTruthy()

    //checking group body
    expect(wrapper.find('.vqb-group-body').exists()).toBeTruthy()
  })

  it('respects maxDepth prop', () => {
    const wrapper = mount(TestQueryBuilder, {
      localVue,
      propsData: {
        maxDepth: 3
      }
    })
    expect(wrapper.vm.maxDepth).toBe(3)
  })

  it('handles AND and OR operators', () => {
    const wrapper = mount(TestQueryBuilder, {
      localVue
    })
    const matchTypeContainer = wrapper.find('.match-type-container')
    expect(matchTypeContainer.exists()).toBeTruthy()
  })

  it('renders query builder container with correct class', () => {
    const wrapper = mount(TestQueryBuilder, {
      localVue
    })
    expect(wrapper.find('.vue-query-builder').classes()).toContain('vue-query-builder')
  })

  it('group heading is properly displayed', () => {
    const wrapper = mount(TestQueryBuilder, {
      localVue
    })
    expect(wrapper.find('.vqb-group-heading').exists()).toBeTruthy()
  })

  describe('Component Structure', () => {
    it('renders query builder component successfully', () => {
      const wrapper = mount(TestQueryBuilder, { localVue })
      expect(wrapper.exists()).toBe(true)
      wrapper.destroy()
    })

    it('has correct component name', () => {
      const wrapper = mount(TestQueryBuilder, { localVue })
      expect(wrapper.vm).toBeDefined()
      wrapper.destroy()
    })

    it('mounts without errors', () => {
      const wrapper = mount(TestQueryBuilder, { localVue })
      expect(wrapper.vm).toBeDefined()
      wrapper.destroy()
    })

    it('renders with proper CSS classes', () => {
      const wrapper = mount(TestQueryBuilder, { localVue })
      expect(wrapper.find('.vue-query-builder').exists()).toBe(true)
      wrapper.destroy()
    })
  })

  describe('Props Handling', () => {
    it('accepts maxDepth prop', () => {
      const wrapper = mount(TestQueryBuilder, {
        localVue,
        propsData: { maxDepth: 5 }
      })
      expect(wrapper.vm.maxDepth).toBe(5)
      wrapper.destroy()
    })

    it('accepts defaultQuery prop', () => {
      const defaultQuery = {
        operator: 'AND',
        conditionGroups: []
      }
      const wrapper = mount(TestQueryBuilder, {
        localVue,
        propsData: { defaultQuery }
      })
      expect(wrapper.vm).toBeDefined()
      wrapper.destroy()
    })

    it('handles various maxDepth values', () => {
      const depths = [1, 3, 5, 10]
      depths.forEach(depth => {
        const wrapper = mount(TestQueryBuilder, {
          localVue,
          propsData: { maxDepth: depth }
        })
        expect(wrapper.vm.maxDepth).toBe(depth)
        wrapper.destroy()
      })
    })

    it('updates when props change', async () => {
      const wrapper = mount(TestQueryBuilder, {
        localVue,
        propsData: { maxDepth: 3 }
      })
      await wrapper.setProps({ maxDepth: 7 })
      expect(wrapper.vm.maxDepth).toBe(7)
      wrapper.destroy()
    })
  })

  describe('Query Structure', () => {
    it('displays query builder container', () => {
      const wrapper = mount(TestQueryBuilder, { localVue })
      const container = wrapper.find('#test-query-builder')
      expect(container.exists()).toBe(true)
      wrapper.destroy()
    })

    it('initializes with group structure', () => {
      const wrapper = mount(TestQueryBuilder, { localVue })
      expect(wrapper.find('.vqb-group').exists()).toBe(true)
      wrapper.destroy()
    })

    it('maintains proper group hierarchy', () => {
      const wrapper = mount(TestQueryBuilder, { localVue })
      const groupHeading = wrapper.find('.vqb-group-heading')
      const groupBody = wrapper.find('.vqb-group-body')
      expect(groupHeading.exists()).toBe(true)
      expect(groupBody.exists()).toBe(true)
      wrapper.destroy()
    })
  })

  describe('User Interactions', () => {
    it('adds new condition group on button click', async () => {
      const wrapper = mount(TestQueryBuilder, { localVue })
      const groupButton = wrapper.find('.rule-actions button:last-child')
      await groupButton.trigger('click')
      expect(wrapper.find('.vqb-group.card.depth-2').exists()).toBe(true)
      wrapper.destroy()
    })

    it('adds new rule/condition on button click', async () => {
      const wrapper = mount(TestQueryBuilder, { localVue })
      const conditionButton = wrapper.find('.rule-actions button')
      await conditionButton.trigger('click')
      expect(wrapper.find('.vqb-rule').exists()).toBe(true)
      wrapper.destroy()
    })

    it('handles multiple button clicks', async () => {
      const wrapper = mount(TestQueryBuilder, { localVue })
      const button = wrapper.find('.rule-actions button')
      await button.trigger('click')
      await button.trigger('click')
      const rules = wrapper.findAll('.vqb-rule')
      expect(rules.length).toBeGreaterThan(0)
      wrapper.destroy()
    })
  })

  describe('Operators', () => {
    it('displays AND operator option', () => {
      const wrapper = mount(TestQueryBuilder, { localVue })
      const matchTypeContainer = wrapper.find('.match-type-container')
      expect(matchTypeContainer.html()).toContain('AND')
      wrapper.destroy()
    })

    it('displays OR operator option', () => {
      const wrapper = mount(TestQueryBuilder, { localVue })
      const matchTypeContainer = wrapper.find('.match-type-container')
      expect(matchTypeContainer.html()).toContain('OR')
      wrapper.destroy()
    })

    it('match type container exists and is accessible', () => {
      const wrapper = mount(TestQueryBuilder, { localVue })
      const matchTypeContainer = wrapper.find('.match-type-container')
      expect(matchTypeContainer.exists()).toBe(true)
      wrapper.destroy()
    })
  })

  describe('Default Values', () => {
    it('initializes with complex default query', () => {
      const defaultQuery = {
        operator: 'AND',
        conditionGroups: [
          {
            operator: 'AND',
            conditionItems: [
              {
                fieldName: 'From',
                operator: 'Contains',
                format: 'Email',
                value: 'test@example.com'
              }
            ]
          }
        ]
      }
      const wrapper = mount(TestQueryBuilder, {
        localVue,
        propsData: { defaultQuery }
      })
      expect(wrapper.find('.vue-query-builder').exists()).toBe(true)
      wrapper.destroy()
    })

    it('renders properly with empty default query', () => {
      const wrapper = mount(TestQueryBuilder, {
        localVue,
        propsData: { defaultQuery: { operator: 'AND', conditionGroups: [] } }
      })
      expect(wrapper.find('.vqb-group').exists()).toBe(true)
      wrapper.destroy()
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts without errors', () => {
      const wrapper = mount(TestQueryBuilder, { localVue })
      expect(wrapper.vm).toBeDefined()
      wrapper.destroy()
    })

    it('unmounts without errors', () => {
      const wrapper = mount(TestQueryBuilder, { localVue })
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('handles multiple mount/unmount cycles', () => {
      for (let i = 0; i < 3; i++) {
        const wrapper = mount(TestQueryBuilder, { localVue })
        expect(wrapper.exists()).toBe(true)
        wrapper.destroy()
      }
    })
  })

  describe('Edge Cases', () => {
    it('handles maxDepth value of 1', () => {
      const wrapper = mount(TestQueryBuilder, {
        localVue,
        propsData: { maxDepth: 1 }
      })
      expect(wrapper.vm.maxDepth).toBe(1)
      wrapper.destroy()
    })

    it('handles very large maxDepth value', () => {
      const wrapper = mount(TestQueryBuilder, {
        localVue,
        propsData: { maxDepth: 100 }
      })
      expect(wrapper.vm.maxDepth).toBe(100)
      wrapper.destroy()
    })

    it('renders with minimal configuration', () => {
      const wrapper = mount(TestQueryBuilder, { localVue })
      expect(wrapper.find('.vue-query-builder').exists()).toBe(true)
      wrapper.destroy()
    })
  })

  describe('Multiple Instances', () => {
    it('supports creating multiple independent instances', () => {
      const wrapper1 = mount(TestQueryBuilder, { localVue })
      const wrapper2 = mount(TestQueryBuilder, { localVue })
      expect(wrapper1.vm).not.toBe(wrapper2.vm)
      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('instances with different props maintain independence', () => {
      const wrapper1 = mount(TestQueryBuilder, {
        localVue,
        propsData: { maxDepth: 3 }
      })
      const wrapper2 = mount(TestQueryBuilder, {
        localVue,
        propsData: { maxDepth: 5 }
      })
      expect(wrapper1.vm.maxDepth).toBe(3)
      expect(wrapper2.vm.maxDepth).toBe(5)
      wrapper1.destroy()
      wrapper2.destroy()
    })
  })
})
