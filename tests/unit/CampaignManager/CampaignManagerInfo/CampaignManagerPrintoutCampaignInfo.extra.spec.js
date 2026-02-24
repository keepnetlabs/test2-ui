import { shallowMount } from '@vue/test-utils'
import CampaignManagerPrintoutCampaignInfo from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerPrintoutCampaignInfo.vue'

describe('CampaignManagerPrintoutCampaignInfo.vue (extra branch coverage)', () => {
  describe('computed', () => {
    it('getTargetGroupErrorText returns Required when isShowTargetGroupUsersError false', () => {
      const wrapper = shallowMount(CampaignManagerPrintoutCampaignInfo, {
        propsData: { isEdit: false, defaultValues: {} }
      })
      wrapper.setData({ isShowTargetGroupUsersError: false })
      expect(wrapper.vm.getTargetGroupErrorText).toBe('Required')
    })

    it('getTargetGroupErrorText returns TargetGroupUserRequiredError when isShowTargetGroupUsersError true', () => {
      const result = CampaignManagerPrintoutCampaignInfo.computed.getTargetGroupErrorText.call({
        isShowTargetGroupUsersError: true
      })
      expect(result).toContain('at least 1 user')
    })
  })

  describe('defaultValues watcher', () => {
    it('merges scheduledDate and scheduledDateTimeZoneId from val', () => {
      const wrapper = shallowMount(CampaignManagerPrintoutCampaignInfo, {
        propsData: {
          isEdit: false,
          defaultValues: {
            scheduledDate: '2025-01-01',
            scheduledDateTimeZoneId: 'UTC',
            name: 'Test'
          }
        }
      })
      expect(wrapper.vm.inputScheduleFormData.scheduledDate).toBe('2025-01-01')
      expect(wrapper.vm.inputScheduleFormData.scheduledDateTimeZoneId).toBe('UTC')
      expect(wrapper.vm.formData.name).toBe('Test')
    })
  })
})
