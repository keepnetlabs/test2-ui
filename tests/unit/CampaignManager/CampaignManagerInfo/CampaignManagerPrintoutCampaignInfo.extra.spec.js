import { shallowMount } from '@vue/test-utils'
import CampaignManagerPrintoutCampaignInfo from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerPrintoutCampaignInfo.vue'
import { scrollToComponent } from '@/utils/functions'

jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  scrollToComponent: jest.fn()
}))

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

    it('getTargetGroupErrorMessage returns target-group selection required when no groups selected', () => {
      const result = CampaignManagerPrintoutCampaignInfo.computed.getTargetGroupErrorMessage.call({
        formData: { targetGroupResourceIds: [] },
        getTargetGroupErrorText: 'Required'
      })

      expect(result.toLowerCase()).toContain('target group')
    })

    it('getTargetGroupErrorMessage returns computed text when groups are selected', () => {
      const result = CampaignManagerPrintoutCampaignInfo.computed.getTargetGroupErrorMessage.call({
        formData: { targetGroupResourceIds: ['tg-1'] },
        getTargetGroupErrorText: 'Custom Error'
      })

      expect(result).toBe('Custom Error')
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

  describe('lifecycle and methods', () => {
    it('created emits initialFormValues payload', () => {
      const wrapper = shallowMount(CampaignManagerPrintoutCampaignInfo, {
        propsData: { isEdit: false, defaultValues: {} }
      })

      expect(wrapper.emitted('initialFormValues')).toBeTruthy()
      expect(wrapper.emitted('initialFormValues')[0][0]).toEqual(
        expect.objectContaining({
          name: '',
          duration: 30,
          excludeFromReports: false
        })
      )
    })

    it('setInitialName updates formData.name and emits updated initial values', () => {
      const emit = jest.fn()
      const ctx = {
        formData: { name: '', duration: 30, excludeFromReports: false },
        $emit: emit
      }

      CampaignManagerPrintoutCampaignInfo.methods.setInitialName.call(ctx, 'Campaign A')

      expect(ctx.formData.name).toBe('Campaign A')
      expect(emit).toHaveBeenCalledWith(
        'initialFormValues',
        expect.objectContaining({ name: 'Campaign A' })
      )
    })

    it('validateForm returns true when form is valid', () => {
      const ctx = {
        $refs: {
          refForm: {
            validate: jest.fn(() => true)
          }
        },
        $nextTick: jest.fn()
      }

      const result = CampaignManagerPrintoutCampaignInfo.methods.validateForm.call(ctx)

      expect(result).toBe(true)
      expect(ctx.$nextTick).not.toHaveBeenCalled()
    })

    it('validateForm returns false and calls scrollToComponent when form is invalid', () => {
      const errorElement = { id: 'error-el' }
      const ctx = {
        $refs: {
          refForm: {
            validate: jest.fn(() => false),
            $el: {
              querySelector: jest.fn(() => errorElement)
            }
          }
        },
        $nextTick: jest.fn((cb) => cb())
      }

      const result = CampaignManagerPrintoutCampaignInfo.methods.validateForm.call(ctx)

      expect(result).toBe(false)
      expect(scrollToComponent).toHaveBeenCalledWith(errorElement)
    })
  })
})
