import { shallowMount } from '@vue/test-utils'
import TrainingReportUserInteractionsModal from '@/components/AwarenessEducator/TrainingReport/Users/TrainingReportUserInteractionsModal.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

jest.mock('@/api/awarenessEducator', () => ({
  getTrainingReportInteractions: jest.fn(() =>
    Promise.resolve({
      data: { data: [{ interaction: 'Opened', eventTime: '2024-01-01', trackingInfo: {} }] }
    })
  )
}))

const flushPromises = () => new Promise((r) => setTimeout(r, 0))

describe('TrainingReportUserInteractionsModal.vue (extra branch coverage)', () => {
  beforeEach(() => {
    AwarenessEducatorService.getTrainingReportInteractions.mockResolvedValue({
      data: { data: [{ interaction: 'Opened', eventTime: '2024-01-01', trackingInfo: {} }] }
    })
  })

  const mountComponent = (propsData = {}) =>
    shallowMount(TrainingReportUserInteractionsModal, {
      propsData: {
        status: true,
        item: { enrollmentId: 'e1', targetUserResourceId: 'u1' },
        ...propsData
      },
      stubs: { AppDialog: true, DataTable: true, Badge: true }
    })

  it('callForData uses type 2 for Infographic', async () => {
    const wrapper = mountComponent({
      isAddTrainingTypeKeyToPayload: true,
      trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
    })
    wrapper.vm.callForData()
    await flushPromises()
    expect(AwarenessEducatorService.getTrainingReportInteractions).toHaveBeenCalledWith(
      'e1',
      'u1',
      undefined,
      2
    )
  })

  it('callForData uses type 3 for Screensaver', async () => {
    const wrapper = mountComponent({
      isAddTrainingTypeKeyToPayload: true,
      trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER }
    })
    wrapper.vm.callForData()
    await flushPromises()
    expect(AwarenessEducatorService.getTrainingReportInteractions).toHaveBeenCalledWith(
      'e1',
      'u1',
      undefined,
      3
    )
  })

  it('callForData uses type 4 for Learning Path (TRAINING_LIBRARY_TYPES)', async () => {
    const wrapper = mountComponent({
      isAddTrainingTypeKeyToPayload: true,
      trainingSummary: { trainingTypeName: TRAINING_LIBRARY_TYPES.LEARNING_PATH }
    })
    wrapper.vm.callForData()
    await flushPromises()
    expect(AwarenessEducatorService.getTrainingReportInteractions).toHaveBeenCalledWith(
      'e1',
      'u1',
      undefined,
      4
    )
  })

  it('callForData handles empty response data array', async () => {
    AwarenessEducatorService.getTrainingReportInteractions.mockResolvedValue({ data: { data: [] } })
    const wrapper = mountComponent()
    await flushPromises()
    expect(wrapper.vm.tableData).toEqual([])
  })

})
