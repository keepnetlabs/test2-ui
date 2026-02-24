import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportSubmittedMfaCode from '@/components/CampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCode.vue'

describe('CampaignManagerReportSubmittedMfaCode.vue (extra branch coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) => {
    return shallowMount(CampaignManagerReportSubmittedMfaCode, {
      localVue,
      propsData: {
        id: 'test-id',
        instanceGroup: '123',
        customFields: [],
        ...propsData
      },
      stubs: {
        CampaignManagerReportHeader: true,
        CampaignManagerReportSubmittedMfaCodeTable: true,
        CampaignManagerReportResendDialog: true,
        CampaignManagerReportSubmittedMfaCodeDetailDialog: true
      }
    })
  }

  describe('toggleShowDetailDialog', () => {
    it('clears selectedRow when closing dialog (isShowDetailDialog was true)', async () => {
      const wrapper = mountComponent()
      wrapper.vm.selectedRow = { resourceId: 'r1' }
      wrapper.vm.isShowDetailDialog = true

      wrapper.vm.toggleShowDetailDialog()

      expect(wrapper.vm.isShowDetailDialog).toBe(false)
      expect(wrapper.vm.selectedRow).toBeNull()
    })

    it('keeps selectedRow when opening dialog (isShowDetailDialog was false)', async () => {
      const wrapper = mountComponent()
      const row = { resourceId: 'r1' }
      wrapper.vm.selectedRow = row
      wrapper.vm.isShowDetailDialog = false

      wrapper.vm.toggleShowDetailDialog()

      expect(wrapper.vm.isShowDetailDialog).toBe(true)
      expect(wrapper.vm.selectedRow).toEqual(row)
    })
  })

  describe('handleOnDetail', () => {
    it('sets selectedRow and opens detail dialog', async () => {
      const wrapper = mountComponent()
      const row = { resourceId: 'r1', firstName: 'John' }

      wrapper.vm.handleOnDetail(row)

      expect(wrapper.vm.selectedRow).toEqual(row)
      expect(wrapper.vm.isShowDetailDialog).toBe(true)
    })

    it('handles empty row default', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleOnDetail()
      expect(wrapper.vm.selectedRow).toEqual({})
    })
  })
})
