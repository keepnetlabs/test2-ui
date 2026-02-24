jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    progressNonTargetUsersTrainingReportEmailsDetails: jest.fn(() =>
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
import TrainingReportNonTargetUsersProgressDetailDialog from '@/components/ScormProxyReport/Progress/TrainingReportNonTargetUsersProgressDetailDialog.vue'

const baseItem = {
  targetUserResourceId: 'u1',
  status: 'Completed',
  enrollmentId: 'e1',
  targetUserResultId: 'r1'
}

describe('TrainingReportNonTargetUsersProgressDetailDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(TrainingReportNonTargetUsersProgressDetailDialog, {
      propsData: {
        status: true,
        item: { ...baseItem },
        interactionType: 'progress',
        ...propsData
      },
      stubs: { AppDialog: true, DataTable: true, Badge: true, AppDialogFooterWithClose: true }
    })

  it('getSubtitle returns targetUserResourceId', () => {
    const wrapper = createWrapper({ item: { ...baseItem, targetUserResourceId: 'user-456' } })
    expect(wrapper.vm.getSubtitle).toBe('user-456')
  })

  it('getMessage returns In Queue message', () => {
    const wrapper = createWrapper({ item: { ...baseItem, status: 'In Queue' } })
    expect(wrapper.vm.getMessage).toContain('queue')
  })

  it('getMessage returns empty for Completed', () => {
    const wrapper = createWrapper({ item: { ...baseItem, status: 'Completed' } })
    expect(wrapper.vm.getMessage).toBe('')
  })

  it('isShowMessage is true for Processing', () => {
    const wrapper = createWrapper({ item: { ...baseItem, status: 'Processing' } })
    expect(wrapper.vm.isShowMessage).toBe(true)
  })

  it('handleClose emits on-close', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })
})
