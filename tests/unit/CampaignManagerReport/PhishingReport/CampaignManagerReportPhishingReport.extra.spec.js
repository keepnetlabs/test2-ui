import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportPhishingReport from '@/components/CampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReport'

describe('CampaignManagerReportPhishingReport.vue (extra branch coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = () =>
    shallowMount(CampaignManagerReportPhishingReport, {
      localVue,
      propsData: {
        id: 'id-1',
        instanceGroup: 'group-1',
        customFields: []
      },
      stubs: {
        CampaignManagerReportResendDialog: true,
        CampaignManagerReportHeader: true,
        CampaignManagerReportPhishingReportTable: true,
        CampaignManagerReportPhishingReporterItemDetailDialog: true
      }
    })

  it('shows and hides detail dialog, clearing selected row when closing', async () => {
    const wrapper = mountComponent()

    wrapper.vm.handleOnDetail({ id: 'detail-1' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isShowDetailDialog).toBe(true)
    expect(wrapper.vm.selectedRow).toEqual({ id: 'detail-1' })

    wrapper.vm.toggleShowDetailDialog()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isShowDetailDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
  })

  it('uses default empty row when detail payload is not provided', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleOnDetail()
    expect(wrapper.vm.selectedRow).toEqual({})
  })

  it('opens resend dialog and stores payload', async () => {
    const wrapper = mountComponent()
    const payload = [{ userId: 44 }]

    wrapper.vm.handleOnResend(payload)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.resendPayload).toEqual(payload)
    expect(wrapper.vm.isShowResendDialog).toBe(true)
  })

  it('handleSelectionChange sets resendItemCount', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleSelectionChange(3)
    expect(wrapper.vm.resendItemCount).toBe(3)
  })

  it('handleSelectionChange handles zero selection', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleSelectionChange(0)
    expect(wrapper.vm.resendItemCount).toBe(0)
  })

  it('toggleShowDetailDialog does not clear selectedRow when opening', () => {
    const wrapper = mountComponent()
    wrapper.vm.selectedRow = { id: 'detail-1' }
    wrapper.vm.isShowDetailDialog = false
    wrapper.vm.toggleShowDetailDialog()
    expect(wrapper.vm.selectedRow).toEqual({ id: 'detail-1' })
    expect(wrapper.vm.isShowDetailDialog).toBe(true)
  })

  it('toggleShowDetailDialog clears selectedRow when closing', () => {
    const wrapper = mountComponent()
    wrapper.vm.selectedRow = { id: 'detail-1' }
    wrapper.vm.isShowDetailDialog = true
    wrapper.vm.toggleShowDetailDialog()
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isShowDetailDialog).toBe(false)
  })
})
