import { createLocalVue, shallowMount } from '@vue/test-utils'
import FormGroup from '@/components/SmallComponents/FormGroup'

describe('FormGroup.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    label: 'Test Label'
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(FormGroup, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      ...options
    })
  }

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('FormGroup')
    })
  })

  describe('Props', () => {
    it('should render with props', () => {
      const wrapper = mountComponent({ label: 'Custom Label' })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      expect(wrapper1.vm).toBeDefined()
      expect(wrapper2.vm).toBeDefined()
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(200)
    })
  })
})
