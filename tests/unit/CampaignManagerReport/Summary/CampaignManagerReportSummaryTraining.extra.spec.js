import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryTraining from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryTraining'

describe('CampaignManagerReportSummaryTraining.vue (extra branch coverage)', () => {
  const createWrapper = (propsData = {}, getterStatus = true) => {
    const commit = jest.fn()
    const wrapper = shallowMount(CampaignManagerReportSummaryTraining, {
      propsData: {
        trainingParams: { name: 'Security 101' },
        selectedRow: { trainingId: 'tr-1', resourceId: 'res-1' },
        selectedTrainingLanguages: [],
        ...propsData
      },
      mocks: {
        $store: {
          commit,
          getters: {
            'trainingLibrary/getTrainingPreviewDialog': { status: getterStatus }
          }
        }
      },
      stubs: {
        CampaignManagerSummaryCard: true,
        TrainingLibraryCommonComponents: true,
        VBtn: true,
        VIcon: true
      }
    })
    return { wrapper, commit }
  }

  it('trainingTitle falls back to plain Training when name is missing', () => {
    const { wrapper } = createWrapper({ trainingParams: {} })
    expect(wrapper.vm.trainingTitle).toBe('Training')
  })

  it('getCategoryName prefers category then categoryName', () => {
    const withCategory = createWrapper({ trainingParams: { category: 'CatA', categoryName: 'CatB' } })
    expect(withCategory.wrapper.vm.getCategoryName).toBe('CatA')

    const withCategoryName = createWrapper({ trainingParams: { categoryName: 'CatB' } })
    expect(withCategoryName.wrapper.vm.getCategoryName).toBe('CatB')
  })

  it('opens preview and maps selectedTrainingLanguages objects by languageId/code', () => {
    const { wrapper, commit } = createWrapper({
      trainingParams: { name: 'Pack A' },
      selectedTrainingLanguages: [{ languageId: 'tr' }, { code: 'en' }, 'de']
    })

    wrapper.vm.toggleShowTrainingDialog()

    expect(commit).toHaveBeenCalledWith(
      'trainingLibrary/SET_TRAINING_PREVIEW_DIALOG',
      expect.objectContaining({
        status: true,
        selectedRow: expect.objectContaining({
          name: 'Pack A',
          languages: ['tr', 'en', 'de']
        }),
        onlyPreview: true
      })
    )
  })

  it('opens preview and maps languages from pipe-separated trainingParams.languages', () => {
    const { wrapper, commit } = createWrapper({
      trainingParams: { name: 'Pack B', languages: 'EN | TR | DE' },
      selectedTrainingLanguages: []
    })

    wrapper.vm.toggleShowTrainingDialog()

    expect(commit).toHaveBeenCalledWith(
      'trainingLibrary/SET_TRAINING_PREVIEW_DIALOG',
      expect.objectContaining({
        selectedRow: expect.objectContaining({
          languages: ['EN', 'TR', 'DE']
        })
      })
    )
  })

  it('opens preview and maps languages from array trainingParams.languages', () => {
    const { wrapper, commit } = createWrapper({
      trainingParams: { name: 'Pack C', languages: ['EN', 'TR'] },
      selectedTrainingLanguages: []
    })

    wrapper.vm.toggleShowTrainingDialog()

    expect(commit).toHaveBeenCalledWith(
      'trainingLibrary/SET_TRAINING_PREVIEW_DIALOG',
      expect.objectContaining({
        selectedRow: expect.objectContaining({
          languages: ['EN', 'TR']
        })
      })
    )
  })

  it('watcher does not force-close dialog when global status is true', () => {
    const { wrapper } = createWrapper()
    wrapper.setData({ isShowTrainingDialog: true })
    wrapper.vm.$options.watch['getTrainingPreviewDialog.status'].handler.call(wrapper.vm, true)
    expect(wrapper.vm.isShowTrainingDialog).toBe(true)
  })

  it('handlePreviewClick delegates to toggleShowTrainingDialog', () => {
    const { wrapper } = createWrapper()
    wrapper.vm.toggleShowTrainingDialog = jest.fn()
    wrapper.vm.handlePreviewClick()
    expect(wrapper.vm.toggleShowTrainingDialog).toHaveBeenCalled()
  })
})
