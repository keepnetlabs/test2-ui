import { shallowMount } from '@vue/test-utils'
import DefaultErrorDialog from '@/components/Common/Others/DefaultErrorDialog.vue'

describe('DefaultErrorDialog.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DefaultErrorDialog)
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
