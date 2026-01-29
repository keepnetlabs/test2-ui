import { shallowMount } from '@vue/test-utils'
import InputAddress from '@/components/Common/Inputs/InputAddress.vue'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'

jest.mock('@/utils/validations')
jest.mock('@/model/constants/labels', () => ({
  Address: 'Address',
  CannotStartWithSpace: 'Cannot start with space',
  RequiredStar: '*Required',
  EnterAddress: 'Enter address',
  getMaxLengthMessage: jest.fn((entity, length) => `${entity} cannot exceed ${length} characters`)
}))

describe('InputAddress.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputAddress)
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
