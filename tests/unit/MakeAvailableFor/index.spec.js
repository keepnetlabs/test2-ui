import { createLocalVue } from '@vue/test-utils'
import MakeAvailableFor from '../Objects/MakeAvailableFor'

describe('Make available for test cases suite', () => {
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

  it('displays correct title text', () => {
    const { wrapper } = new MakeAvailableFor(localVue)
    const title = wrapper.find('.k-form-group__title')
    expect(title.text()).toContain('Make Available For')
  })

  it('toggles disabled state correctly', async () => {
    const { wrapper } = new MakeAvailableFor(localVue)

    // Initially not disabled
    expect(wrapper.find('.vue-treeselect--disabled').exists()).toBe(false)

    // Set to disabled
    await wrapper.setProps({ disabled: true })
    expect(wrapper.find('.vue-treeselect--disabled').exists()).toBe(true)
  })

  it('displays required indicator', () => {
    const { wrapper } = new MakeAvailableFor(localVue)
    expect(wrapper.text().includes('*Required')).toBe(true)
  })

  it('displays search placeholder in treeselect', () => {
    const { wrapper } = new MakeAvailableFor(localVue)
    const select = wrapper.find('.vue-treeselect')
    expect(select.text()).toContain('Search companies and groups')
  })

  it('renders treeselect component', () => {
    const { wrapper } = new MakeAvailableFor(localVue)
    const select = wrapper.find('.vue-treeselect')
    expect(select.exists()).toBe(true)
    expect(select.classes()).toContain('vue-treeselect')
  })

  it('handles menu opening on focus', async () => {
    const { wrapper } = new MakeAvailableFor(localVue)
    const treeselect = wrapper.find('.vue-treeselect')

    await treeselect.trigger('focus')
    expect(wrapper.find('.vue-treeselect--open-below').exists() || wrapper.find('.vue-treeselect--open-above').exists()).toBeTruthy()
  })
})
