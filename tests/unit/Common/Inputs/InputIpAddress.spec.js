import { shallowMount } from '@vue/test-utils'
import InputIpAddress from '@/components/Common/Inputs/InputIpAddress.vue'
import * as Validations from '@/utils/validations'

jest.mock('@/utils/validations')

describe('InputIpAddress.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputIpAddress)
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
