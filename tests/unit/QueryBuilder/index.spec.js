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
    console.log('wrapper', wrapper.find('#test-query-builder').attributes())
    //expect(wrapper.find('#test-query-builder').attributes().maxDepth).toEqual('5')
  })
})
