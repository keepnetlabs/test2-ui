import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryTraining from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryTraining'

describe('CampaignManagerReportSummaryTraining.vue', () => {
  const createWrapper = (propsData = {}, getterStatus = true) => {
    const commit = jest.fn()
    const wrapper = shallowMount(CampaignManagerReportSummaryTraining, {
      propsData: {
        trainingParams: { name: 'Security 101', languageList: [{ languageId: 'en' }] },
        selectedRow: { resourceId: 'tr-1' },
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

  it('computes training title and category name', () => {
    const { wrapper } = createWrapper({
      trainingParams: { name: 'Awareness Pack', categoryName: 'Security' }
    })

    expect(wrapper.vm.trainingTitle).toBe('Training: Awareness Pack')
    expect(wrapper.vm.getCategoryName).toBe('Security')
  })

  it('opens preview dialog and commits payload with languages from languageList', () => {
    const { wrapper, commit } = createWrapper({
      trainingParams: { name: 'Awareness Pack', languageList: [{ languageId: 'tr' }] },
      selectedRow: { resourceId: 'row-1' }
    })

    wrapper.vm.toggleShowTrainingDialog()

    expect(commit).toHaveBeenCalledWith(
      'trainingLibrary/SET_TRAINING_PREVIEW_DIALOG',
      expect.objectContaining({
        status: true,
        onlyPreview: true,
        selectedRow: expect.objectContaining({
          trainingId: 'row-1',
          name: 'Awareness Pack',
          languages: ['tr']
        })
      })
    )
    expect(wrapper.vm.isShowTrainingDialog).toBe(true)
  })

  it('closes preview dialog and commits reset payload', () => {
    const { wrapper, commit } = createWrapper()
    wrapper.setData({ isShowTrainingDialog: true })

    wrapper.vm.toggleShowTrainingDialog()

    expect(commit).toHaveBeenCalledWith(
      'trainingLibrary/SET_TRAINING_PREVIEW_DIALOG',
      expect.objectContaining({
        status: false,
        selectedRow: null,
        onlyPreview: false
      })
    )
    expect(wrapper.vm.isShowTrainingDialog).toBe(false)
  })

  it('watcher closes local dialog when global preview status becomes false', () => {
    const { wrapper } = createWrapper()
    wrapper.setData({ isShowTrainingDialog: true })

    wrapper.vm.$options.watch['getTrainingPreviewDialog.status'].handler.call(wrapper.vm, false)

    expect(wrapper.vm.isShowTrainingDialog).toBe(false)
  })
})
