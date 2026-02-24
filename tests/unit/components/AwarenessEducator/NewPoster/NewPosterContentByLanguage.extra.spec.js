import { shallowMount } from '@vue/test-utils'
import NewPosterContentByLanguage from '@/components/AwarenessEducator/NewPoster/NewPosterContentByLanguage.vue'

jest.mock('@/api/awarenessEducator', () => ({
  uploadPosterContent: jest.fn().mockResolvedValue({ data: { data: {} } })
}))

describe('NewPosterContentByLanguage.vue (extra branch coverage)', () => {
  const createWrapper = (props = {}) =>
    shallowMount(NewPosterContentByLanguage, {
      propsData: {
        value: { languageId: 'lang-1', file: null },
        languageItems: [],
        ...props
      },
      stubs: {
        FormGroupHorizontalContent: true,
        InputSelectLanguage: true,
        KFileUpload: true,
        VTooltip: true,
        VBtn: true
      }
    })

  describe('computed', () => {
    it('getRemovableButtonStyle adds opacity when isUploading', () => {
      const wrapper = createWrapper({ isUploading: true })
      expect(wrapper.vm.getRemovableButtonStyle.opacity).toBe(0.5)
    })
    it('getRemovableButtonStyle adds opacity when value.isDeleteable', () => {
      const wrapper = createWrapper({
        value: { languageId: 'x', file: null, isDeleteable: true }
      })
      expect(wrapper.vm.getRemovableButtonStyle.opacity).toBe(0.5)
    })
    it('isRenderTooltip returns true when value.isDeleteable', () => {
      const wrapper = createWrapper({
        value: { languageId: 'x', isDeleteable: true }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(true)
    })
    it('isCheckDisableVendor returns true when canSaveVendor and no vendorId', () => {
      const wrapper = createWrapper({ canSaveVendor: true, vendorId: '' })
      expect(wrapper.vm.isCheckDisableVendor).toBe(true)
    })
    it('isCheckDisableVendor returns false when !canSaveVendor', () => {
      const wrapper = createWrapper({ canSaveVendor: false })
      expect(wrapper.vm.isCheckDisableVendor).toBe(false)
    })
  })

  describe('handleFileChange', () => {
    it('clears file when empty array', () => {
      const wrapper = createWrapper()
      const value = { languageId: 'x', file: 'old' }
      wrapper.setProps({ value })
      wrapper.vm.handleFileChange([])
      expect(wrapper.vm.value.file).toBeNull()
    })
  })

  describe('handleRemove', () => {
    it('aborts controller when exists', () => {
      const wrapper = createWrapper()
      const abort = jest.fn()
      wrapper.vm.abortController = { abort }
      wrapper.vm.handleRemove()
      expect(abort).toHaveBeenCalled()
      expect(wrapper.vm.abortController).toBeNull()
    })
    it('emits on-remove', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleRemove()
      expect(wrapper.emitted('on-remove')).toHaveLength(1)
    })
  })
})
