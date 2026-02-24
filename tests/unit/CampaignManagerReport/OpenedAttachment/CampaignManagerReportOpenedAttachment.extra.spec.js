import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportOpenedAttachment from '@/components/CampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachment'

describe('CampaignManagerReportOpenedAttachment.vue (extra branch coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = () =>
    shallowMount(CampaignManagerReportOpenedAttachment, {
      localVue,
      propsData: {
        id: 'id-1',
        instanceGroup: 'group-1',
        customFields: []
      },
      stubs: {
        CampaignManagerReportHeader: true,
        CampaignManagerReportResendDialog: true,
        CampaignManagerReportOpenedAttachmentTable: true,
        CampaignManagerReportOpenedAttachmentItemDetailDialog: true
      }
    })

  it('renders detail dialog only when enabled and clears selectedRow on close', async () => {
    const wrapper = mountComponent()

    wrapper.vm.handleOnDetail({ id: 'row-1' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selectedRow).toEqual({ id: 'row-1' })
    expect(wrapper.vm.isShowDetailDialog).toBe(true)

    wrapper.vm.toggleShowDetailDialog()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isShowDetailDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
  })

  it('uses default empty row when detail event payload is missing', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleOnDetail()
    expect(wrapper.vm.selectedRow).toEqual({})
  })

  it('renders resend dialog when handleOnResend is called', async () => {
    const wrapper = mountComponent()
    const payload = [{ userId: 1 }]

    wrapper.vm.handleOnResend(payload)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.resendPayload).toEqual(payload)
    expect(wrapper.vm.isShowResendDialog).toBe(true)
  })

  it('handleSelectionChange updates resend item count', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleSelectionChange(12)
    expect(wrapper.vm.resendItemCount).toBe(12)
  })

  it('handleSelectionChange accepts zero count', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleSelectionChange(0)
    expect(wrapper.vm.resendItemCount).toBe(0)
  })

  it('toggleShowDetailDialog does not clear selectedRow when opening (isShowDetailDialog was false)', () => {
    const wrapper = mountComponent()
    wrapper.vm.selectedRow = { id: 'row-1' }
    wrapper.vm.isShowDetailDialog = false
    wrapper.vm.toggleShowDetailDialog()
    expect(wrapper.vm.selectedRow).toEqual({ id: 'row-1' })
    expect(wrapper.vm.isShowDetailDialog).toBe(true)
  })

  it('toggleShowDetailDialog clears selectedRow when closing (isShowDetailDialog was true)', () => {
    const wrapper = mountComponent()
    wrapper.vm.selectedRow = { id: 'row-1' }
    wrapper.vm.isShowDetailDialog = true
    wrapper.vm.toggleShowDetailDialog()
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isShowDetailDialog).toBe(false)
  })
})
