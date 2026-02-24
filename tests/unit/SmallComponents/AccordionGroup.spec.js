import { createLocalVue, shallowMount } from '@vue/test-utils'
import AccordionGroup from '@/components/SmallComponents/AccordionGroup'

describe('AccordionGroup.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (options = {}) => {
    return shallowMount(AccordionGroup, { localVue, ...options })
  }

  it('should render', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('should have correct name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('AccordionGroup')
  })

  it('should mount quickly', () => {
    const start = Date.now()
    mountComponent()
    expect(Date.now() - start).toBeLessThan(200)
  })
})
