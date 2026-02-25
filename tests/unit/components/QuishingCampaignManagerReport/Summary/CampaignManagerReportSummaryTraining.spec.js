import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import CampaignManagerReportSummaryTraining from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportSummaryTraining.vue'

describe('QuishingCampaignManagerReport Summary CampaignManagerReportSummaryTraining.vue', () => {
  let store

  const createWrapper = (propsData = {}) => {
    store = new Vuex.Store({
      modules: {
        trainingLibrary: {
          namespaced: true,
          state: {},
          getters: {
            getTrainingPreviewDialog: () => ({ status: false })
          },
          mutations: {
            SET_TRAINING_PREVIEW_DIALOG: () => {}
          }
        }
      }
    })
    return shallowMount(CampaignManagerReportSummaryTraining, {
      store,
      propsData: {
        trainingParams: { name: 'Test Training' },
        selectedRow: { resourceId: 'r1' },
        ...propsData
      },
      stubs: {
        CampaignManagerSummaryCard: true,
        TrainingLibraryCommonComponents: true
      }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('getCategoryName', () => {
    it('returns category from trainingParams', () => {
      const wrapper = createWrapper({
        trainingParams: { name: 'T1', category: 'Security' }
      })
      expect(wrapper.vm.getCategoryName).toBe('Security')
    })

    it('returns categoryName when category is not set', () => {
      const wrapper = createWrapper({
        trainingParams: { name: 'T1', categoryName: 'Awareness' }
      })
      expect(wrapper.vm.getCategoryName).toBe('Awareness')
    })
  })

  describe('handlePreviewClick', () => {
    it('calls toggleShowTrainingDialog', () => {
      const wrapper = createWrapper()
      const spy = jest.spyOn(wrapper.vm, 'toggleShowTrainingDialog')
      wrapper.vm.handlePreviewClick()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('toggleShowTrainingDialog', () => {
    it('sets isShowTrainingDialog to true when opening', () => {
      const wrapper = createWrapper({
        trainingParams: { name: 'T1', languageList: [] },
        selectedRow: { resourceId: 'r1' }
      })
      wrapper.vm.toggleShowTrainingDialog()
      expect(wrapper.vm.isShowTrainingDialog).toBe(true)
    })

    it('sets isShowTrainingDialog to false when closing', () => {
      store = new Vuex.Store({
        modules: {
          trainingLibrary: {
            namespaced: true,
            state: {},
            getters: { getTrainingPreviewDialog: () => ({ status: false }) },
            mutations: {
              SET_TRAINING_PREVIEW_DIALOG: () => {}
            }
          }
        }
      })
      const wrapper = shallowMount(CampaignManagerReportSummaryTraining, {
        store,
        propsData: {
          trainingParams: { name: 'T1' },
          selectedRow: { resourceId: 'r1' }
        },
        stubs: { CampaignManagerSummaryCard: true, TrainingLibraryCommonComponents: true }
      })
      wrapper.vm.isShowTrainingDialog = true
      wrapper.vm.toggleShowTrainingDialog()
      expect(wrapper.vm.isShowTrainingDialog).toBe(false)
    })
  })
})
