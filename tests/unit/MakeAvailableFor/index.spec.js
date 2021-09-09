import { createLocalVue } from '@vue/test-utils'
import MakeAvailableFor from '../Objects/MakeAvailableFor'

describe('Data container with search items test cases suite', () => {
  const localVue = createLocalVue()
  it('Check render', () => {
    const { wrapper } = new MakeAvailableFor(localVue)
    //checking title is rendered
    const title = wrapper.find('.k-form-group__title')
    expect(title.exists()).toBeTruthy()
    //checking title text
    expect(title.text().includes('Make Available For')).toBeTruthy()
    //checking select is rendered
    const select = wrapper.find('.vue-treeselect')
    expect(select.exists()).toBe(true)
    //checking placeholder
    expect(select.text().includes('Search companies and groups')).toBe(true)
    //checking required
    expect(wrapper.text().includes('*Required')).toBe(true)
  })

  it('Check props', async () => {
    const { wrapper } = new MakeAvailableFor(localVue)
    await wrapper.setProps({ disabled: true })
    //checking disabled=true
    expect(wrapper.find('.vue-treeselect--disabled').exists()).toBe(true)
    await wrapper.setProps({ disabled: false })
    //checking disabled=false
    expect(wrapper.find('.vue-treeselect--disabled').exists()).toBe(false)
  })

  it('Checking functionalities', async () => {
    const { wrapper } = new MakeAvailableFor(localVue)
    //focusing input
    await wrapper.find('.vue-treeselect').trigger('focus')
    //expecting menu is open
    expect(wrapper.find('.vue-treeselect--open-below').exists()).toBe(true)
  })
})
