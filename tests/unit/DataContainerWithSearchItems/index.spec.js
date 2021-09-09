import { createLocalVue } from '@vue/test-utils'
import DataContainerWithSearch from '../Objects/DataContainerWithSearch'
describe('Data container with search items test cases suite', () => {
  const localVue = createLocalVue()
  it('Check render', () => {
    const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
    //checking is rendering
    expect(wrapper.find('.data-container-with-search').exists()).toBe(true)
    expect(wrapper.find('.data-container-with-search__content').exists()).toBe(true)
  })
  it('Adding value and control', async () => {
    const { wrapper } = new DataContainerWithSearch(localVue, { value: ['asasas'] })
    //adding value
    await wrapper.setProps({ value: ['Gürkan'] })
    //checking is rendering
    expect(wrapper.find('.v-virtual-scroll__container').exists()).toBe(true)
  })
  it('Adding search text', async () => {
    const { wrapper } = new DataContainerWithSearch(localVue, { value: [] })
    const inputWrapper = wrapper.find('.data-container-with-search__input input')
    wrapper.vm.search = 'custom data'
    await inputWrapper.trigger('keyup')
    //checking is data writed to the dom
    expect(inputWrapper.element.value).toBe('custom data')
  })
})
