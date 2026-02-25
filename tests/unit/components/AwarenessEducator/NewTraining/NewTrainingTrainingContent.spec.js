jest.mock('@/api/awarenessEducator', () => ({
  deleteTrainingFile: jest.fn(() => Promise.resolve())
}))

import NewTrainingTrainingContent from '@/components/AwarenessEducator/NewTraining/NewTrainingTrainingContent.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('NewTrainingTrainingContent.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed isRenderAddLanguage returns true when there are remaining languages', () => {
    const ctx = {
      languages: [{ value: 'en' }, { value: 'tr' }],
      formData: { contentByLanguage: [{ languageId: 'en' }] }
    }
    expect(NewTrainingTrainingContent.computed.isRenderAddLanguage.call(ctx)).toBe(true)
  })

  it('handleAddLanguage adds first non-disabled language', () => {
    const ctx = {
      formData: { contentByLanguage: [{ languageId: 'en' }] },
      languages: [
        { value: 'en', isDisabled: true },
        { value: 'tr', isDisabled: false }
      ]
    }
    NewTrainingTrainingContent.methods.handleAddLanguage.call(ctx)
    expect(ctx.formData.contentByLanguage[1]).toEqual({
      file: null,
      languageId: 'tr'
    })
  })

  it('setTrainingContents maps backend content to local model', () => {
    const ctx = { formData: { contentByLanguage: [] } }
    NewTrainingTrainingContent.methods.setTrainingContents.call(ctx, [
      { languageId: 'en', name: 'x.zip', size: 7, typeWithDisplayName: 'SCORM' }
    ])

    expect(ctx.formData.contentByLanguage[0]).toEqual({
      languageId: 'en',
      file: null,
      filePreviews: [{ name: 'x.zip', size: 7 }],
      typeWithDisplayName: 'SCORM'
    })
  })

  it('handleRemove calls delete API when file exists', async () => {
    const ctx = {
      resourceId: 'training-1',
      formData: {
        contentByLanguage: [{ languageId: 'en', filePreviews: [{ name: 'x.zip' }] }]
      }
    }

    NewTrainingTrainingContent.methods.handleRemove.call(ctx, 0)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.deleteTrainingFile).toHaveBeenCalledWith('training-1', 'en')
    expect(ctx.formData.contentByLanguage).toHaveLength(0)
  })
})
