import { shallowMount } from '@vue/test-utils'
import NewTrainingContentByLanguage from '@/components/AwarenessEducator/NewTraining/NewTrainingContentByLanguage.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

jest.mock('@/api/awarenessEducator', () => ({
  uploadTrainingContent: jest.fn().mockResolvedValue({
    data: { data: { typeWithDisplayName: 'SCORM 1.2' } }
  })
}))

describe('NewTrainingContentByLanguage.vue', () => {
  const createWrapper = (props = {}) =>
    shallowMount(NewTrainingContentByLanguage, {
      propsData: {
        value: { languageId: 'lang-1', file: null },
        languageItems: [],
        trainingResourceId: 'training-1',
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

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getHint uses typeWithDisplayName when available', () => {
    const wrapper = createWrapper({ typeWithDisplayName: 'SCORM 2004' })
    expect(wrapper.vm.getHint).toContain('SCORM 2004')
  })

  it('handleFileChange clears file for empty array', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleFileChange([])
    expect(wrapper.vm.value.file).toBeNull()
  })

  it('handleFileChange uploads file and emits final state', async () => {
    const wrapper = createWrapper({ vendorId: 'v-1', canSaveVendor: true })
    const file = new Blob(['zip'], { type: 'application/zip' })
    wrapper.vm.handleFileChange(file)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.uploadTrainingContent).toHaveBeenCalled()
    expect(wrapper.emitted().input).toBeTruthy()
    expect(wrapper.vm.isReadonly).toBe(false)
    expect(wrapper.vm.isBackendParsed).toBe(true)
  })

  it('handleRemove aborts active upload and emits remove', () => {
    const wrapper = createWrapper()
    const abort = jest.fn()
    wrapper.vm.abortController = { abort }
    wrapper.vm.handleRemove()
    expect(abort).toHaveBeenCalled()
    expect(wrapper.emitted('on-remove')).toHaveLength(1)
  })
})
