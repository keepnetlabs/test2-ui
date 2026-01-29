import { shallowMount } from '@vue/test-utils'
import InputEntityName from '@/components/Common/Inputs/InputEntityName.vue'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'

jest.mock('@/utils/validations')
jest.mock('@/model/constants/labels', () => ({
  CannotStartWithSpace: 'Field cannot start with space',
  getMaxLengthMessage: jest.fn((entity, length) => `${entity} cannot exceed ${length} characters`)
}))

describe('InputEntityName.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputEntityName)
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
