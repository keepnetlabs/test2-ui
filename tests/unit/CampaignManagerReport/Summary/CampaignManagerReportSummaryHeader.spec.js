import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryHeader from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryHeader'

jest.mock('@/api/phishingsimulator', () => ({
  exportPhishingCampaignJob: jest.fn(() => Promise.resolve({ status: 200, data: 'xlsx-data' })),
  resendPhishingCampaignToUsers: jest.fn(() => Promise.resolve())
}))

const { exportPhishingCampaignJob, resendPhishingCampaignToUsers } = require('@/api/phishingsimulator')

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSummaryHeader.vue', () => {
  const createWrapper = (propsData = {}, options = {}) =>
    shallowMount(CampaignManagerReportSummaryHeader, {
      propsData: {
        id: 'campaign-1',
        instanceGroup: 'ig-1',
        trainingReportDialogItems: [{ enrollmentId: 'enr-1' }],
        ...propsData
      },
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: { dispatch: jest.fn() }
      },
      stubs: {
        CampaignManagerReportSummaryResendDialog: true,
        CampaignManagerReportTrainingReportsDialog: true,
        VBtn: true,
        VIcon: true,
        VTooltip: true
      },
      ...options
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('toggles resend dialog and sends resend request', async () => {
    const wrapper = createWrapper()

    wrapper.vm.toggleShowResendDialog()
    expect(wrapper.vm.isShowResendDialog).toBe(true)

    wrapper.vm.handleOnConfirmResend(['Clicked'])
    await flushPromises()

    expect(resendPhishingCampaignToUsers).toHaveBeenCalledWith(
      { Types: ['Clicked'] },
      'campaign-1',
      'ig-1'
    )
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
    expect(wrapper.vm.isShowResendDialog).toBe(false)
  })

  it('downloads report when export status is 200', async () => {
    const wrapper = createWrapper()
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = originalCreateElement(tagName)
      if (tagName === 'a') {
        element.click = click
      }
      return element
    })
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = jest.fn()
    }
    jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:test')

    wrapper.vm.handleDownloadReport()
    await flushPromises()

    expect(exportPhishingCampaignJob).toHaveBeenCalledWith('campaign-1', 'ig-1')
    expect(click).toHaveBeenCalled()
    expect(wrapper.vm.isDownloadReportDisabled).toBe(false)
  })

  it('creates snackbar for 201 and 202 export responses', async () => {
    const dispatch = jest.fn()
    exportPhishingCampaignJob.mockResolvedValueOnce({ status: 201, data: null })
    exportPhishingCampaignJob.mockResolvedValueOnce({ status: 202, data: null })

    const wrapper = createWrapper({}, { mocks: { $store: { dispatch } } })

    wrapper.vm.handleDownloadReport()
    await flushPromises()
    wrapper.vm.handleDownloadReport()
    await flushPromises()

    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch.mock.calls[0][0]).toBe('common/createSnackBar')
    expect(dispatch.mock.calls[1][0]).toBe('common/createSnackBar')
  })

  it('handles training report actions for single and multiple modes', () => {
    const singleWrapper = createWrapper({
      isMultipleTrainingReport: false,
      trainingReportDialogItems: [{ enrollmentId: 'enr-123' }]
    })
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)
    singleWrapper.vm.handleTrainingReport()
    expect(openSpy).toHaveBeenCalledWith('/awareness-educator/enrollments/training-report/enr-123')

    const multipleWrapper = createWrapper({ isMultipleTrainingReport: true })
    multipleWrapper.vm.handleTrainingReport()
    expect(multipleWrapper.vm.isShowTrainingReportsDialog).toBe(true)
  })
})
