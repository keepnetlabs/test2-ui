import { createLocalVue } from '@vue/test-utils'
import DataContainerWithSearch from '../Objects/DataContainerWithSearch'
describe('Data container with search items test cases suite', () => {
  const localVue = createLocalVue()
  it('Check render on empty value', () => {
    const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
    //checking is rendering
    expect(wrapper.find('.data-container-with-search').exists()).toBe(false)
    expect(wrapper.find('.data-container-with-search__content').exists()).toBe(false)
  })
  it('Adding value and control', async () => {
    const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
    //adding value
    await wrapper.setProps({ value: ['Try'] })
    //checking is rendering
    expect(wrapper.find('.v-virtual-scroll__container').exists()).toBe(true)
  })
  it('Adding search text', async () => {
    const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
    await wrapper.setProps({ value: ['Try'] })
    const inputWrapper = wrapper.find('.data-container-with-search__input input')
    wrapper.vm.search = 'custom data'
    await inputWrapper.trigger('keyup')
    //checking is data writed to the dom
    expect(inputWrapper.element.value).toBe('custom data')
  })

  it('Renders virtual scroll when items added', async () => {
    const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
    expect(wrapper.find('.v-virtual-scroll__container').exists()).toBe(false)

    await wrapper.setProps({ value: ['Item1', 'Item2'] })
    expect(wrapper.find('.v-virtual-scroll__container').exists()).toBe(true)
  })

  it('Handles multiple items correctly', async () => {
    const { wrapper } = new DataContainerWithSearch(localVue, {
      value: ['Item1', 'Item2', 'Item3']
    })
    expect(wrapper.vm.$props.value.length).toBe(3)
  })

  it('Hides container on empty value', async () => {
    const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
    expect(wrapper.find('.data-container-with-search').exists()).toBe(false)
    expect(wrapper.find('.data-container-with-search__content').exists()).toBe(false)
  })

  it('Updates search dynamically', async () => {
    const { wrapper } = new DataContainerWithSearch(localVue, { value: ['Test'] })
    wrapper.vm.search = 'first'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.search).toBe('first')

    wrapper.vm.search = 'second'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.search).toBe('second')
  })
})
