jest.mock('@/api/awarenessEducator', () => ({
  deleteTrainingFile: jest.fn(() => Promise.resolve())
}))

import NewPosterPosterContent from '@/components/AwarenessEducator/NewPoster/NewPosterPosterContent.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('NewPosterPosterContent.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('languages computed marks used languages as disabled', () => {
    const ctx = {
      formData: {
        contentByLanguage: [{ languageId: 'en' }]
      },
      getLanguages: () => [
        { id: 'en', name: 'English' },
        { id: 'tr', name: 'Turkish' }
      ]
    }

    const items = NewPosterPosterContent.computed.languages.call(ctx)
    expect(items).toEqual([
      { text: 'English', value: 'en', isDisabled: true },
      { text: 'Turkish', value: 'tr', isDisabled: false }
    ])
  })

  it('handleAddLanguage adds first available language', () => {
    const ctx = {
      formData: { contentByLanguage: [{ languageId: 'en' }] },
      languages: [
        { value: 'en', isDisabled: true },
        { value: 'tr', isDisabled: false }
      ]
    }
    NewPosterPosterContent.methods.handleAddLanguage.call(ctx)
    expect(ctx.formData.contentByLanguage[1]).toEqual({
      file: null,
      languageId: 'tr'
    })
  })

  it('setTrainingContents maps backend payload to previews', () => {
    const ctx = { formData: { contentByLanguage: [] } }
    NewPosterPosterContent.methods.setTrainingContents.call(ctx, [
      { languageId: 'en', name: 'file.zip', size: 12, typeWithDisplayName: 'SCORM' }
    ])

    expect(ctx.formData.contentByLanguage[0]).toEqual({
      languageId: 'en',
      file: null,
      filePreviews: [{ name: 'file.zip', size: 12 }],
      typeWithDisplayName: 'SCORM'
    })
  })

  it('handleRemove calls delete API for existing files', async () => {
    const ctx = {
      resourceId: 'training-1',
      formData: {
        contentByLanguage: [{ languageId: 'en', filePreviews: [{ name: 'x' }] }]
      }
    }

    NewPosterPosterContent.methods.handleRemove.call(ctx, 0)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.deleteTrainingFile).toHaveBeenCalledWith('training-1', 'en')
    expect(ctx.formData.contentByLanguage).toHaveLength(0)
  })
})
