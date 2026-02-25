import { shallowMount } from '@vue/test-utils'
import TrainingReportUserInteractionsModal from '@/components/ScormProxyReport/Users/TrainingReportUserInteractionsModal.vue'

jest.mock('@/api/awarenessEducator', () => ({
  getTrainingReportInteractions: jest.fn().mockResolvedValue({ data: { data: [] } })
}))

describe('ScormProxyReport Users TrainingReportUserInteractionsModal.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(TrainingReportUserInteractionsModal, {
      propsData: {
        status: true,
        item: { enrollmentId: 'e1', targetUserResourceId: 't1', firstName: 'John', lastName: 'Doe' },
        interactionType: 'clicked',
        firstColumnLabel: 'Date Clicked',
        ...propsData
      },
      stubs: { AppDialog: true, DataTable: true, Badge: true }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('getSubtitle', () => {
    it('returns firstName and lastName from item', () => {
      const wrapper = createWrapper({
        item: { firstName: 'Jane', lastName: 'Smith', enrollmentId: 'e1', targetUserResourceId: 't1' }
      })
      expect(wrapper.vm.getSubtitle).toBe('Jane Smith')
    })
  })

  describe('getMessage', () => {
    it('returns queue message for In Queue status', () => {
      const wrapper = createWrapper({ item: { status: 'In Queue' } })
      expect(wrapper.vm.getMessage).toContain('queue')
    })

    it('returns queue message for InQueue status (no space)', () => {
      const wrapper = createWrapper({ item: { status: 'InQueue' } })
      expect(wrapper.vm.getMessage).toContain('queue')
    })

    it('returns not delivered message for Not Delivered status', () => {
      const wrapper = createWrapper({ item: { status: 'Not Delivered' } })
      expect(wrapper.vm.getMessage).toContain('could not be delivered')
    })

    it('returns not delivered message for NotDelivered status', () => {
      const wrapper = createWrapper({ item: { status: 'NotDelivered' } })
      expect(wrapper.vm.getMessage).toContain('could not be delivered')
    })

    it('returns error message for Sending Error status', () => {
      const wrapper = createWrapper({ item: { status: 'Sending Error' } })
      expect(wrapper.vm.getMessage).toContain('could not be delivered')
    })

    it('returns error message for Error status', () => {
      const wrapper = createWrapper({ item: { status: 'Error' } })
      expect(wrapper.vm.getMessage).toContain('could not be delivered')
    })

    it('returns cancelled message for Cancelled status', () => {
      const wrapper = createWrapper({ item: { status: 'Cancelled' } })
      expect(wrapper.vm.getMessage).toContain('cancelled')
    })

    it('returns processing message for Processing status', () => {
      const wrapper = createWrapper({ item: { status: 'Processing' } })
      expect(wrapper.vm.getMessage).toContain('interacted')
    })

    it('returns empty for unknown status', () => {
      const wrapper = createWrapper({ item: { status: 'Completed' } })
      expect(wrapper.vm.getMessage).toBe('')
    })
  })

  describe('isShowMessage', () => {
    it('returns true for In Queue status', () => {
      const wrapper = createWrapper({ item: { status: 'In Queue' } })
      expect(wrapper.vm.isShowMessage).toBe(true)
    })

    it('returns true for Not Delivered status', () => {
      const wrapper = createWrapper({ item: { status: 'Not Delivered' } })
      expect(wrapper.vm.isShowMessage).toBe(true)
    })

    it('returns true for Processing status', () => {
      const wrapper = createWrapper({ item: { status: 'Processing' } })
      expect(wrapper.vm.isShowMessage).toBe(true)
    })

    it('returns false for Completed status', () => {
      const wrapper = createWrapper({ item: { status: 'Completed' } })
      expect(wrapper.vm.isShowMessage).toBe(false)
    })
  })

  describe('handleClose', () => {
    it('emits on-close', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleClose()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })
})
