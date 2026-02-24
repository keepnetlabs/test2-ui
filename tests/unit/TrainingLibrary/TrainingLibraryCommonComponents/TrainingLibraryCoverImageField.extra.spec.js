import { shallowMount } from '@vue/test-utils'
import TrainingLibraryCoverImageField from '@/components/TrainingLibrary/TrainingLibraryCommonComponents/TrainingLibraryCoverImageField.vue'

describe('TrainingLibraryCoverImageField.vue (extra branch coverage)', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(TrainingLibraryCoverImageField, {
      propsData: { ...propsData },
      stubs: { FormGroup: true, KFileUpload: true }
    })

  it('displayHint returns errorText when hasError is true', () => {
    const wrapper = mountComponent()
    wrapper.vm.hasError = true
    wrapper.vm.errorText = 'Invalid image size'
    expect(wrapper.vm.displayHint).toBe('Invalid image size')
  })

  it('displayHint returns hint when hasError is false', () => {
    const wrapper = mountComponent({ hint: 'Custom hint' })
    wrapper.vm.hasError = false
    expect(wrapper.vm.displayHint).toBe('Custom hint')
  })

  it('filePreviews returns empty array when coverImageUrl is empty', () => {
    const wrapper = mountComponent({ coverImageUrl: '' })
    expect(wrapper.vm.filePreviews).toEqual([])
  })

  it('filePreviews returns preview object when coverImageUrl is provided', () => {
    const wrapper = mountComponent({
      coverImageUrl: '/img.png',
      coverImageName: 'Cover'
    })
    expect(wrapper.vm.filePreviews).toEqual([
      { url: '/img.png', name: 'Cover' }
    ])
  })

  it('handleClear clears error when keepErrorOnNextClear is false', () => {
    const wrapper = mountComponent()
    const clearErrorSpy = jest.spyOn(wrapper.vm, 'clearError')
    wrapper.vm.keepErrorOnNextClear = false
    wrapper.vm.handleClear()
    expect(clearErrorSpy).toHaveBeenCalled()
    expect(wrapper.emitted('input')[0][0]).toBe('')
  })

  it('handleClear does not clear error when keepErrorOnNextClear is true', () => {
    const wrapper = mountComponent()
    const clearErrorSpy = jest.spyOn(wrapper.vm, 'clearError')
    wrapper.vm.keepErrorOnNextClear = true
    wrapper.vm.handleClear()
    expect(clearErrorSpy).not.toHaveBeenCalled()
    expect(wrapper.vm.keepErrorOnNextClear).toBe(false)
  })

  it('setError sets hasError and emits validation-state-change false', () => {
    const wrapper = mountComponent()
    wrapper.vm.setError('Test error')
    expect(wrapper.vm.hasError).toBe(true)
    expect(wrapper.vm.errorText).toBe('Test error')
    expect(wrapper.emitted('validation-state-change')[0][0]).toBe(false)
  })

  it('clearError resets hasError and emits validation-state-change true', () => {
    const wrapper = mountComponent()
    wrapper.vm.hasError = true
    wrapper.vm.errorText = 'err'
    wrapper.vm.clearError()
    expect(wrapper.vm.hasError).toBe(false)
    expect(wrapper.vm.errorText).toBe('')
    expect(wrapper.emitted('validation-state-change')[0][0]).toBe(true)
  })
})
