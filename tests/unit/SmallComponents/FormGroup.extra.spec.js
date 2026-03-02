import { shallowMount } from '@vue/test-utils'
import FormGroup from '@/components/SmallComponents/FormGroup.vue'

describe('FormGroup.vue (extra branch coverage)', () => {
  it('renders title when provided', () => {
    const wrapper = shallowMount(FormGroup, {
      propsData: { title: 'Form Title' },
      stubs: { 'v-list-item': true, 'v-list-item-content': true, 'v-list-item-subtitle': true }
    })
    expect(wrapper.vm.title).toBe('Form Title')
  })

  it('renders subTitle when provided', () => {
    const wrapper = shallowMount(FormGroup, {
      propsData: { subTitle: 'Helper text' },
      stubs: { 'v-list-item': true, 'v-list-item-content': true, 'v-list-item-subtitle': true }
    })
    expect(wrapper.vm.subTitle).toBe('Helper text')
  })

  it('applies hasHint when true', () => {
    const wrapper = shallowMount(FormGroup, {
      propsData: { hasHint: true },
      stubs: { 'v-list-item': true, 'v-list-item-content': true, 'v-list-item-subtitle': true }
    })
    expect(wrapper.vm.hasHint).toBe(true)
  })

  it('hasHint defaults to false', () => {
    const wrapper = shallowMount(FormGroup, {
      stubs: { 'v-list-item': true, 'v-list-item-content': true, 'v-list-item-subtitle': true }
    })
    expect(wrapper.vm.hasHint).toBe(false)
  })

  it('applies className when provided', () => {
    const wrapper = shallowMount(FormGroup, {
      propsData: { className: 'custom-class' },
      stubs: { 'v-list-item': true, 'v-list-item-content': true, 'v-list-item-subtitle': true }
    })
    expect(wrapper.vm.className).toBe('custom-class')
  })

  it('applies labelClassName when provided', () => {
    const wrapper = shallowMount(FormGroup, {
      propsData: { labelClassName: 'label-custom' },
      stubs: { 'v-list-item': true, 'v-list-item-content': true, 'v-list-item-subtitle': true }
    })
    expect(wrapper.vm.labelClassName).toBe('label-custom')
  })

  it('title and subTitle default to empty string', () => {
    const wrapper = shallowMount(FormGroup, {
      stubs: { 'v-list-item': true, 'v-list-item-content': true, 'v-list-item-subtitle': true }
    })
    expect(wrapper.vm.title).toBe('')
    expect(wrapper.vm.subTitle).toBe('')
  })
})
