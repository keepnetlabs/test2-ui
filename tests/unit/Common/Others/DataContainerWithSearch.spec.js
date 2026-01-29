import { shallowMount } from '@vue/test-utils'
import DataContainerWithSearch from '@/components/Common/Others/DataContainerWithSearch.vue'
import * as validations from '@/utils/validations'
import labels from '@/model/constants/labels'

jest.mock('@/utils/validations')
jest.mock('@/model/constants/labels', () => ({
  Required: 'This field is required',
  Domain: 'Domain',
  InvalidDomainName: 'Invalid domain name',
  InvalidURLS: 'Some URLs are invalid',
  getMaxLengthMessage: jest.fn(() => 'Cannot exceed maximum length')
}))

describe('DataContainerWithSearch.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DataContainerWithSearch)
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
