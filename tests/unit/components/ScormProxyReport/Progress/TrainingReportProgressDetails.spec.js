import { shallowMount } from '@vue/test-utils'
import TrainingReportProgressDetails from '@/components/ScormProxyReport/Progress/TrainingReportProgressDetails.vue'

jest.mock('@/api/awarenessEducator', () => ({
  getProgressDetailsTable: jest.fn().mockResolvedValue({ data: { data: [] } })
}))

describe('ScormProxyReport Progress TrainingReportProgressDetails.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(TrainingReportProgressDetails, {
      propsData: {
        status: true,
        item: { enrollmentId: 'e1', targetUserResourceId: 't1', firstName: 'John', lastName: 'Doe' },
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
        item: { firstName: 'Jane', lastName: 'Smith' }
      })
      expect(wrapper.vm.getSubtitle).toBe('Jane Smith')
    })

    it('handles empty item', () => {
      const wrapper = createWrapper({ item: {} })
      expect(wrapper.vm.getSubtitle).toBe(' ')
    })
  })

  describe('handleClose', () => {
    it('emits on-close', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleClose()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })

  describe('getStatusBadgeProps', () => {
    it('returns badge props for progress', () => {
      const wrapper = createWrapper()
      const result = wrapper.vm.getStatusBadgeProps('completed')
      expect(result).toBeDefined()
    })
  })
})
