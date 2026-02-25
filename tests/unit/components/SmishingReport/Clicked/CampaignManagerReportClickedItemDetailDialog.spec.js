import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportClickedItemDetailDialog from '@/components/SmishingReport/Clicked/CampaignManagerReportClickedItemDetailDialog.vue'

jest.mock('@/api/smishing', () => ({
  searchCampaignJobTypeDetails: jest.fn().mockResolvedValue({
    data: {
      data: {
        results: [],
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 1
      }
    }
  })
}))

const ACTIVITY_TYPES = {
  HUMAN: 'Human Activity',
  SYSTEM: 'Bot Activity'
}

describe('SmishingReport Clicked CampaignManagerReportClickedItemDetailDialog.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerReportClickedItemDetailDialog, {
      propsData: {
        status: true,
        item: { resourceId: 'r1', firstName: 'John', lastName: 'Doe', clickedCount: 2 },
        isShowSandboxFromParent: false,
        ...propsData
      },
      stubs: {
        AppDialog: true,
        DataTable: true,
        CampaignManagerReportUserAgentColumn: true,
        CampaignManagerReportIPColumn: true,
        CampaignManagerReportActivityColumn: true,
        CampaignManagerReportTimeZoneColumn: true,
        DefaultButtonRowAction: true,
        SandboxDetailDialogAlerts: true,
        CampaignManagerReportHumanActivityDialog: true,
        CampaignManagerReportSandboxActivityDialog: true,
        AppDialogFooterWithClose: true
      }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('getTitle', () => {
    it('returns title with clickedCount from item', () => {
      const wrapper = createWrapper({
        item: { resourceId: 'r1', clickedCount: 3 }
      })
      expect(wrapper.vm.getTitle).toContain('3')
    })

    it('returns 0 when clickedCount is missing', () => {
      const wrapper = createWrapper({
        item: { resourceId: 'r1' }
      })
      expect(wrapper.vm.getTitle).toContain('0')
    })
  })

  describe('getSubtitle', () => {
    it('returns firstName and lastName from item', () => {
      const wrapper = createWrapper({
        item: { firstName: 'Jane', lastName: 'Smith', resourceId: 'r1' }
      })
      expect(wrapper.vm.getSubtitle).toBe('Jane Smith')
    })
  })

  describe('getRowActionDisabledStatus', () => {
    it('returns true when human activity and not changed', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getRowActionDisabledStatus({
          activityType: ACTIVITY_TYPES.HUMAN,
          isChangedActivity: false
        })
      ).toBe(true)
    })

    it('returns false when human activity but changed', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getRowActionDisabledStatus({
          activityType: ACTIVITY_TYPES.HUMAN,
          isChangedActivity: true
        })
      ).toBe(false)
    })

    it('returns false when bot activity', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getRowActionDisabledStatus({
          activityType: ACTIVITY_TYPES.SYSTEM,
          isChangedActivity: false
        })
      ).toBe(false)
    })
  })

  describe('getRowActionIcon', () => {
    it('returns cancel icon when changed and human', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getRowActionIcon({
          activityType: ACTIVITY_TYPES.HUMAN,
          isChangedActivity: true
        })
      ).toBe('mdi-account-cancel')
    })

    it('returns default icon otherwise', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getRowActionIcon({
          activityType: ACTIVITY_TYPES.SYSTEM,
          isChangedActivity: false
        })
      ).toBe('mdi-account-check')
    })
  })

  describe('getRowActionText', () => {
    it('returns Mark as bot activity when human and changed', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getRowActionText({
          activityType: ACTIVITY_TYPES.HUMAN,
          isChangedActivity: true
        })
      ).toBe('Mark as bot activity')
    })

    it('returns Mark as human activity otherwise', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getRowActionText({
          activityType: ACTIVITY_TYPES.SYSTEM,
          isChangedActivity: false
        })
      ).toBe('Mark as human activity')
    })
  })

  describe('toggleShowMarkAsDialog', () => {
    it('toggles sandbox dialog when isChangedActivity and human', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.isShowMarkAsSandboxActivityDialog).toBe(false)
      wrapper.vm.toggleShowMarkAsDialog({
        activityType: ACTIVITY_TYPES.HUMAN,
        isChangedActivity: true
      })
      expect(wrapper.vm.isShowMarkAsSandboxActivityDialog).toBe(true)
    })

    it('toggles human activity dialog otherwise', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.isShowMarkAsHumanActivityDialog).toBe(false)
      wrapper.vm.toggleShowMarkAsDialog({
        activityType: ACTIVITY_TYPES.SYSTEM,
        isChangedActivity: false
      })
      expect(wrapper.vm.isShowMarkAsHumanActivityDialog).toBe(true)
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
