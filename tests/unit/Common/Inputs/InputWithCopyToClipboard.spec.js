import { shallowMount } from '@vue/test-utils'
import InputWithCopyToClipboard from '@/components/Common/Inputs/InputWithCopyToClipboard.vue'
import labels from '@/model/constants/labels'

jest.mock('@/model/constants/labels', () => ({
  CopyToClipboard: 'Copy to Clipboard'
}))

describe('InputWithCopyToClipboard.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(InputWithCopyToClipboard)
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
