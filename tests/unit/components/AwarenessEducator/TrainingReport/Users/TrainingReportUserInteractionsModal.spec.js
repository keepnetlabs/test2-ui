import { shallowMount } from '@vue/test-utils'
import TrainingReportUserInteractionsModal from '@/components/AwarenessEducator/TrainingReport/Users/TrainingReportUserInteractionsModal.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

jest.mock('@/api/awarenessEducator', () => ({
  getTrainingReportInteractions: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          { interaction: 'Opened', eventTime: '2024-01-01', trackingInfo: {} }
        ]
      }
    })
  )
}))

const flushPromises = () => new Promise((r) => setTimeout(r, 0))

describe('TrainingReportUserInteractionsModal.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(TrainingReportUserInteractionsModal, {
      propsData: {
        status: true,
        item: { enrollmentId: 'e1', targetUserResourceId: 'u1', firstName: 'John', lastName: 'Doe' },
        ...propsData
      },
      stubs: { AppDialog: true, DataTable: true, Badge: true }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('getSubtitle returns full name from item', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getSubtitle).toBe('John Doe')
  })

  it('getSubtitle handles missing item fields', () => {
    const wrapper = mountComponent({ item: {} })
    expect(wrapper.vm.getSubtitle).toBe(' ')
  })

  describe('getMessage status branches', () => {
    it('returns In Queue message', () => {
      const wrapper = mountComponent({
        item: { enrollmentId: 'e1', targetUserResourceId: 'u1', firstName: 'John', lastName: 'Doe', status: 'In Queue' }
      })
      expect(wrapper.vm.getMessage).toContain('queue')
    })

    it('returns Not Delivered message', () => {
      const wrapper = mountComponent({ item: { enrollmentId: 'e1', targetUserResourceId: 'u1', status: 'Not Delivered' } })
      expect(wrapper.vm.getMessage).toContain('could not be delivered')
    })

    it('returns Sending Error message', () => {
      const wrapper = mountComponent({ item: { enrollmentId: 'e1', targetUserResourceId: 'u1', status: 'SendingError' } })
      expect(wrapper.vm.getMessage).toContain('could not be delivered')
    })

    it('returns Cancelled message', () => {
      const wrapper = mountComponent({ item: { enrollmentId: 'e1', targetUserResourceId: 'u1', status: 'Cancelled' } })
      expect(wrapper.vm.getMessage).toContain('cancelled')
    })

    it('returns Processing message', () => {
      const wrapper = mountComponent({ item: { enrollmentId: 'e1', targetUserResourceId: 'u1', status: 'Processing' } })
      expect(wrapper.vm.getMessage).toContain('interacted')
    })

    it('returns empty for unknown status', () => {
      const wrapper = mountComponent({ item: { enrollmentId: 'e1', targetUserResourceId: 'u1', status: 'Completed' } })
      expect(wrapper.vm.getMessage).toBe('')
    })
  })

  it('isShowMessage true for In Queue, Not Delivered, Error, Processing, Cancelled', () => {
    const statuses = ['In Queue', 'InQueue', 'Not Delivered', 'NotDelivered', 'Error', 'SendingError', 'Sending Error', 'Processing', 'Cancelled']
    statuses.forEach((status) => {
      const wrapper = mountComponent({ item: { enrollmentId: 'e1', targetUserResourceId: 'u1', status } })
      expect(wrapper.vm.isShowMessage).toBe(true)
    })
  })

  it('isShowMessage false for Completed', () => {
    const wrapper = mountComponent({ item: { enrollmentId: 'e1', targetUserResourceId: 'u1', status: 'Completed' } })
    expect(wrapper.vm.isShowMessage).toBe(false)
  })

  it('callForData fetches interactions and maps tableData', async () => {
    const wrapper = mountComponent()
    wrapper.vm.callForData()
    await flushPromises()
    expect(AwarenessEducatorService.getTrainingReportInteractions).toHaveBeenCalledWith(
      'e1',
      'u1',
      undefined,
      0
    )
    expect(wrapper.vm.tableData).toHaveLength(1)
    expect(wrapper.vm.tableData[0]).toHaveProperty('interaction', 'Opened')
  })

  it('callForData uses type 4 for Learning Path', async () => {
    const wrapper = mountComponent({
      item: { enrollmentId: 'e1', targetUserResourceId: 'u1' },
      isAddTrainingTypeKeyToPayload: true,
      trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH }
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

  it('callForData uses type 1 for Poster', async () => {
    const wrapper = mountComponent({
      item: { enrollmentId: 'e1', targetUserResourceId: 'u1' },
      isAddTrainingTypeKeyToPayload: true,
      trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
    })
    wrapper.vm.callForData()
    await flushPromises()
    expect(AwarenessEducatorService.getTrainingReportInteractions).toHaveBeenCalledWith(
      'e1',
      'u1',
      undefined,
      1
    )
  })

  it('handleClose emits on-close', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })
})
