import { createLocalVue, mount } from '@vue/test-utils'
import InputTag from '@/components/Common/Inputs/InputTag.vue'
import { setupPromisePool } from '../promise-pool-helpers'

describe('Input tag component', () => {
  setupPromisePool()
  const localVue = createLocalVue()

  it('Check is rendering', () => {
    const wrapper = mount(InputTag, {
      localVue
    })
    //expecting component is rendering
    expect(wrapper.exists()).toBeTruthy()
  })
  it('With default value', async () => {
    const wrapper = mount(InputTag, {
      localVue
    })
    //giving default value
    await wrapper.setProps({ value: ['tag1', 'tag2'] })
    //expecting component value
    expect(wrapper.vm.tags).toStrictEqual(['tag1', 'tag2'])
  })
  it('With default value', async () => {
    const wrapper = mount(InputTag, {
      localVue
    })
    //giving default value
    await wrapper.setProps({ value: ['tag1', 'tag2'] })
    //expecting component value
    expect(wrapper.vm.tags).toStrictEqual(['tag1', 'tag2'])
  })
  it('isValidItem', () => {
    const wrapper = mount(InputTag, {
      localVue
    })
    //expecting isValidItem to be falsy
    expect(wrapper.vm.isValidItem('')).toBeFalsy()
    //expecting isValidItem to be truthy
    expect(wrapper.vm.isValidItem('tag1')).toBeTruthy()
  })
  it('handleRemoveTag', async () => {
    const wrapper = mount(InputTag, {
      localVue
    })
    //giving default value
    await wrapper.setProps({ value: ['tag1', 'tag2'] })
    //removing first item
    await wrapper.vm.handleRemoveTag(0)
    //expecting first item is deleted
    expect(wrapper.vm.tags).toStrictEqual(['tag2'])
  })
  it('handleTagItemChange', async () => {
    const wrapper = mount(InputTag, {
      localVue
    })
    //giving default value
    await wrapper.setProps({ value: ['tag1', 'tag2'] })
    //adding new item
    await wrapper.vm.handleTagItemChange(['tag1'])
    //expecting items must be equal
    expect(wrapper.vm.tags).toStrictEqual(['tag1'])
  })
})
