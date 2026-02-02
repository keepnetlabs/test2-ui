import { shallowMount } from '@vue/test-utils'
import InputPhone from '@/components/Common/Inputs/InputPhone.vue'
import labels from '@/model/constants/labels'

describe('InputPhone.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputPhone)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })
  })
})
