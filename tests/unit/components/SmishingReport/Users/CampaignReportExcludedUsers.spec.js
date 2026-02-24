import { shallowMount } from '@vue/test-utils'
import CampaignReportExcludedUsers from '@/components/SmishingReport/Users/CampaignReportExcludedUsers.vue'

describe('CampaignReportExcludedUsers.vue', () => {
  const mountComponent = () =>
    shallowMount(CampaignReportExcludedUsers, {
      stubs: {
        CampaignManagerReportHeader: true,
        DataTable: true,
        Badge: true
      }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('has correct component structure', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.CONSTANTS).toBeDefined()
    expect(wrapper.vm.tableOptions).toBeDefined()
    expect(wrapper.vm.tableOptions.iEmpty.message).toContain('excluded')
  })

  it('getStatusBadgeProps delegates to utils', () => {
    const wrapper = mountComponent()
    const result = wrapper.vm.getStatusBadgeProps('Inactive')
    expect(result).toBeDefined()
  })

  it('callForData is defined and does not throw', () => {
    const wrapper = mountComponent()
    expect(() => wrapper.vm.callForData()).not.toThrow()
  })

  it('exportTrainingReportUsersTable is defined and does not throw', () => {
    const wrapper = mountComponent()
    expect(() => wrapper.vm.exportTrainingReportUsersTable()).not.toThrow()
  })
})
