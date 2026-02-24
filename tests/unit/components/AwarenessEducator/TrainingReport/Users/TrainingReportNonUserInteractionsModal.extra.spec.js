jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getTrainingReportNonTargetUserInteractions: jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [],
            totalNumberOfRecords: 0,
            totalNumberOfPages: 1,
            pageNumber: 1
          }
        }
      })
    )
  }
}))

import { shallowMount } from '@vue/test-utils'
import TrainingReportNonUserInteractionsModal from '@/components/AwarenessEducator/TrainingReport/Users/TrainingReportNonUserInteractionsModal.vue'

const baseItem = {
  targetUserResourceId: 'u1',
  status: 'Completed',
  enrollmentId: 'e1',
  targetUserResultId: 'r1'
}

describe('TrainingReportNonUserInteractionsModal.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(TrainingReportNonUserInteractionsModal, {
      propsData: {
        status: true,
        item: { ...baseItem },
        interactionType: 'click',
        ...propsData
      },
      stubs: { AppDialog: true, DataTable: true, Badge: true }
    })

  it('getSubtitle returns targetUserResourceId', () => {
    const wrapper = createWrapper({
      item: { targetUserResourceId: 'user-123' }
    })
    expect(wrapper.vm.getSubtitle).toBe('user-123')
  })

  it('getMessage returns In Queue message for In Queue status', () => {
    const wrapper = createWrapper({ item: { ...baseItem, status: 'In Queue' } })
    expect(wrapper.vm.getMessage).toContain('queue to send')
  })

  it('getMessage returns Not Delivered message for NotDelivered status', () => {
    const wrapper = createWrapper({ item: { ...baseItem, status: 'NotDelivered' } })
    expect(wrapper.vm.getMessage).toContain('could not be delivered')
  })

  it('getMessage returns Sending Error message for Error status', () => {
    const wrapper = createWrapper({ item: { ...baseItem, status: 'Error' } })
    expect(wrapper.vm.getMessage).toContain('could not be delivered')
  })

  it('getMessage returns Cancelled message for Cancelled status', () => {
    const wrapper = createWrapper({ item: { ...baseItem, status: 'Cancelled' } })
    expect(wrapper.vm.getMessage).toContain('cancelled')
  })

  it('getMessage returns Processing message for Processing status', () => {
    const wrapper = createWrapper({ item: { ...baseItem, status: 'Processing' } })
    expect(wrapper.vm.getMessage).toContain('interacted')
  })

  it('getMessage returns empty for unknown status', () => {
    const wrapper = createWrapper({ item: { ...baseItem, status: 'Completed' } })
    expect(wrapper.vm.getMessage).toBe('')
  })

  it('isShowMessage is true for In Queue, NotDelivered, Error, Processing, Cancelled', () => {
    const statuses = ['In Queue', 'InQueue', 'NotDelivered', 'Error', 'SendingError', 'Processing', 'Cancelled']
    statuses.forEach((status) => {
      const wrapper = createWrapper({ item: { ...baseItem, status } })
      expect(wrapper.vm.isShowMessage).toBe(true)
    })
  })

  it('isShowMessage is false for Completed', () => {
    const wrapper = createWrapper({ item: { ...baseItem, status: 'Completed' } })
    expect(wrapper.vm.isShowMessage).toBe(false)
  })

  it('handleClose emits on-close', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })
})
