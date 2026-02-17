import { shallowMount } from '@vue/test-utils'
import UsersDashboardYourCertificates from '@/components/UsersDashboard/UsersDashboardYourCertificates.vue'
import { downloadCertificate } from '@/api/usersDashboard'

jest.mock('@/api/usersDashboard', () => ({
  downloadCertificate: jest.fn()
}))

describe('UsersDashboardYourCertificates.vue', () => {
  const labels = {
    yourCertificatesCertificateName: 'Certificate Name',
    yourCertificatesCertificateDate: 'Certificate Date',
    yourCertificatesTrainingStatus: 'Training Status',
    yourCertificatesNoCertificates: 'No certificates',
    yourLearningNotStarted: 'Not Started Label',
    yourLearningNotCompleted: 'Not Completed Label',
    yourLearningInProgress: 'In Progress Label',
    yourLearningCompleted: 'Completed Label',
    actionTypeExamPassed: 'Exam Passed Label',
    yourCertificatesInQueue: 'In Queue Label',
    actionTypeExamFailed: 'Exam Failed Label',
    yourCertificatesDownloadCertificate: 'Download certificate',
    yourLearningStartTraining: 'Start training',
    yourCertificatesWarningNotEligibleDownload: 'Not eligible',
    yourCertificatesWarningCanRetakeNoCertificate: 'Can retake'
  }

  const createWrapper = (getterOverrides = {}) =>
    shallowMount(UsersDashboardYourCertificates, {
      stubs: {
        DataTable: true,
        Badge: true,
        DataTableTooltip: true,
        UsersDashboardCertificateNotAvailableDialog: true,
        VCard: true,
        VBtn: true,
        VIcon: true
      },
      mocks: {
        $store: {
          getters: {
            'usersDashboard/getLabels': labels,
            'usersDashboard/getMyCertificates': [],
            'usersDashboard/getMyCertificatesLoading': false,
            ...getterOverrides
          }
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders and has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('UsersDashboardYourCertificates')
  })

  it('maps myCertificates to tableData', () => {
    const wrapper = createWrapper({
      'usersDashboard/getMyCertificates': [
        {
          certificateName: 'Security Awareness',
          enrollmentStartDate: '2026-01-01',
          trainingStatus: 'Completed',
          trainingUrl: 'https://example.com',
          enrollmentId: 'enr-1',
          actions: [{ actionType: 'CertificateDownload', isEnabled: true }]
        }
      ]
    })

    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        certificateName: 'Security Awareness',
        certificateDate: '2026-01-01',
        trainingStatus: 'Completed',
        enrollmentId: 'enr-1'
      })
    )
  })

  it('returns the first enabled action from getPrimaryAction', () => {
    const wrapper = createWrapper()
    const row = {
      actions: [
        { actionType: 'CertificateDownload', isEnabled: false },
        { actionType: 'TrainingUrl', isEnabled: true }
      ]
    }

    expect(wrapper.vm.getPrimaryAction(row)).toEqual(row.actions[1])
  })

  it('falls back to first action when none are enabled', () => {
    const wrapper = createWrapper()
    const row = {
      actions: [
        { actionType: 'CertificateDownload', isEnabled: false },
        { actionType: 'TrainingUrl', isEnabled: false }
      ]
    }

    expect(wrapper.vm.getPrimaryAction(row)).toEqual(row.actions[0])
    expect(wrapper.vm.isActionEnabled(row)).toBe(false)
  })

  it('returns warning tooltip when certificate download is disabled with warning', () => {
    const wrapper = createWrapper()
    const row = {
      actions: [
        {
          actionType: 'CertificateDownload',
          isEnabled: false,
          warningMessage: 'not eligible'
        }
      ]
    }

    expect(wrapper.vm.getActionTooltip(row)).toBe(labels.yourCertificatesWarningNotEligibleDownload)
  })

  it('shows dialog for training action with warning in handleAction', () => {
    const wrapper = createWrapper()
    const row = {
      actions: [
        {
          actionType: 'TrainingUrl',
          isEnabled: true,
          warningMessage: 'retake',
          url: 'https://example.com/training'
        }
      ]
    }

    wrapper.vm.handleAction(row)

    expect(wrapper.vm.showCertificateNotAvailableDialog).toBe(true)
    expect(wrapper.vm.selectedRowForDialog).toEqual(row)
  })

  it('opens new tab for enabled training action without warning', () => {
    const wrapper = createWrapper()
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)
    const row = {
      actions: [{ actionType: 'TrainingUrl', isEnabled: true, url: 'https://example.com/training' }]
    }

    wrapper.vm.handleAction(row)

    expect(openSpy).toHaveBeenCalledWith('https://example.com/training', '_blank')
    openSpy.mockRestore()
  })

  it('calls handleDownload for certificate download action', () => {
    const wrapper = createWrapper()
    const handleDownloadSpy = jest
      .spyOn(wrapper.vm, 'handleDownload')
      .mockResolvedValue(undefined)
    const row = {
      actions: [{ actionType: 'CertificateDownload', isEnabled: true }]
    }

    wrapper.vm.handleAction(row)

    expect(handleDownloadSpy).toHaveBeenCalledWith(row)
  })

  it('handleDownload calls API and logs error on failure', async () => {
    const wrapper = createWrapper()
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    downloadCertificate.mockRejectedValueOnce(new Error('download failed'))

    await wrapper.vm.handleDownload({
      enrollmentId: 'enr-404',
      certificateName: 'Not Found'
    })

    expect(downloadCertificate).toHaveBeenCalledWith('enr-404')
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('resets dialog state in handleDialogClose', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      showCertificateNotAvailableDialog: true,
      selectedRowForDialog: { id: 1 }
    })

    wrapper.vm.handleDialogClose()

    expect(wrapper.vm.showCertificateNotAvailableDialog).toBe(false)
    expect(wrapper.vm.selectedRowForDialog).toBe(null)
  })

  it('returns training url for dialog from selected row actions', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      selectedRowForDialog: {
        actions: [
          { actionType: 'CertificateDownload', url: '' },
          { actionType: 'TrainingUrl', url: 'https://example.com/start' }
        ]
      }
    })

    expect(wrapper.vm.getTrainingUrlForDialog).toBe('https://example.com/start')
  })

  it('computes tooltip style and visibility on mouse enter/leave', () => {
    const wrapper = createWrapper()
    const row = {
      actions: [{ actionType: 'TrainingUrl', isEnabled: true, url: 'https://example.com' }]
    }
    const querySelector = jest.fn(() => ({
      getBoundingClientRect: () => ({
        left: 10,
        bottom: 20,
        width: 40
      })
    }))

    wrapper.vm.handleTooltipMouseEnter(
      {
        currentTarget: { querySelector }
      },
      row
    )

    expect(wrapper.vm.showTooltip).toBe(true)
    expect(wrapper.vm.tooltipContent).toBe(labels.yourLearningStartTraining)
    expect(wrapper.vm.tooltipStyle).toEqual(
      expect.objectContaining({
        top: '30px',
        left: '30px'
      })
    )

    wrapper.vm.handleTooltipMouseLeave()
    expect(wrapper.vm.showTooltip).toBe(false)
  })

  it('handleDownload creates link and revokes object url on success', async () => {
    const wrapper = createWrapper()
    const blobUrl = 'blob:test'
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = jest.fn()
    }
    if (!window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL = jest.fn()
    }
    const appendChild = jest.spyOn(document.body, 'appendChild')
    const removeChild = jest.spyOn(document.body, 'removeChild')
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = originalCreateElement(tagName)
      if (tagName === 'a') {
        element.click = click
      }
      return element
    })
    const createObjectURLSpy = jest
      .spyOn(window.URL, 'createObjectURL')
      .mockReturnValue(blobUrl)
    const revokeObjectURLSpy = jest.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => {})
    downloadCertificate.mockResolvedValueOnce({ data: new Blob(['pdf']) })

    await wrapper.vm.handleDownload({
      enrollmentId: 'enr-100',
      certificateName: 'Training Cert'
    })

    expect(downloadCertificate).toHaveBeenCalledWith('enr-100')
    expect(createObjectURLSpy).toHaveBeenCalled()
    expect(click).toHaveBeenCalled()
    expect(appendChild).toHaveBeenCalled()
    expect(removeChild).toHaveBeenCalled()
    expect(revokeObjectURLSpy).toHaveBeenCalledWith(blobUrl)

    appendChild.mockRestore()
    removeChild.mockRestore()
    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
    revokeObjectURLSpy.mockRestore()
  })
})
