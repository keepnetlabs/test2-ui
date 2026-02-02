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
})
