import { shallowMount } from '@vue/test-utils'
import TrainingReportNoResponse from '@/components/ScormProxyReport/NoResponse/TrainingReportNoResponse.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

jest.mock('@/api/awarenessEducator', () => ({
  noResponseTrainingReportEmails: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
  ),
  exportNoResponseReportResults: jest.fn(() => Promise.resolve({ data: new Blob() }))
}))

describe('TrainingReportNoResponse.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(TrainingReportNoResponse, {
      propsData: { id: 't1', isSurvey: false, customFields: [], ...propsData },
      stubs: {
        TrainingReportResendDialog: true,
        CampaignManagerReportHeader: true,
        DataTable: true
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
  })

  it('callForData fetches no response data', async () => {
    const wrapper = mountComponent()
    wrapper.vm.callForData()
    await new Promise((r) => setTimeout(r, 0))
    expect(AwarenessEducatorService.noResponseTrainingReportEmails).toHaveBeenCalled()
  })
})
