import { createLocalVue, shallowMount } from '@vue/test-utils'
import CallbackReportCalledBack from '@/components/CallbackReport/CalledBack/CallbackReportCalledBack.vue'

describe('CallbackReportCalledBack.vue (extra branch coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = () =>
    shallowMount(CallbackReportCalledBack, {
      localVue,
      propsData: {
        id: 'cb-1',
        instanceGroup: 'g1',
        customFields: []
      },
      stubs: {
        CampaignManagerReportResendDialog: true,
        CampaignManagerReportHeader: true,
        CallbackReportCalledBackTable: true
      }
    })

  it('handleOnDetail sets selectedRow and opens detail dialog', async () => {
    const wrapper = mountComponent()
    wrapper.vm.handleOnDetail({ id: 'row-1' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selectedRow).toEqual({ id: 'row-1' })
    expect(wrapper.vm.isShowDetailDialog).toBe(true)
  })

  it('handleOnDetail uses default empty object when row not provided', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleOnDetail()
    expect(wrapper.vm.selectedRow).toEqual({})
  })

  it('toggleShowDetailDialog does not clear selectedRow when opening', () => {
    const wrapper = mountComponent()
    wrapper.vm.selectedRow = { id: 'r1' }
    wrapper.vm.isShowDetailDialog = false
    wrapper.vm.toggleShowDetailDialog()
    expect(wrapper.vm.selectedRow).toEqual({ id: 'r1' })
    expect(wrapper.vm.isShowDetailDialog).toBe(true)
  })

  it('toggleShowDetailDialog clears selectedRow when closing', () => {
    const wrapper = mountComponent()
    wrapper.vm.selectedRow = { id: 'r1' }
    wrapper.vm.isShowDetailDialog = true
    wrapper.vm.toggleShowDetailDialog()
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isShowDetailDialog).toBe(false)
  })

  it('handleSelectionChange updates resendItemCount', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleSelectionChange(5)
    expect(wrapper.vm.resendItemCount).toBe(5)
  })
})
