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

  it('tableData falls back to empty actions when certificate actions are missing', () => {
    const wrapper = createWrapper({
      'usersDashboard/getMyCertificates': [
        {
          certificateName: 'Security Awareness',
          enrollmentStartDate: '2026-01-01',
          trainingStatus: 'Completed',
          trainingUrl: 'https://example.com',
          enrollmentId: 'enr-1'
        }
      ]
    })

    expect(wrapper.vm.tableData[0].actions).toEqual([])
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

  it('getPrimaryAction returns null when actions are missing', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getPrimaryAction({})).toBe(null)
    expect(wrapper.vm.getPrimaryAction({ actions: [] })).toBe(null)
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

  it('isActionEnabled returns false when primary action is null', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.isActionEnabled({ actions: [] })).toBe(false)
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

  it('getTrainingUrlForDialog returns empty string when TrainingUrl action has no url', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      selectedRowForDialog: {
        actions: [{ actionType: 'TrainingUrl', url: '' }]
      }
    })

    expect(wrapper.vm.getTrainingUrlForDialog).toBe('')
  })

  it('getTrainingUrlForDialog returns first valid TrainingUrl among mixed actions', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      selectedRowForDialog: {
        actions: [
          { actionType: 'TrainingUrl', url: '' },
          { actionType: 'CertificateDownload', url: 'https://example.com/cert' },
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

  it('getStatusColor/getStatusLabel return fallback values for unknown status', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getStatusColor('Unknown Status')).toBe('#757575')
    expect(wrapper.vm.getStatusLabel('Unknown Status')).toBe('Unknown Status')
  })

  it('getActionIcon falls back based on training status when no actions exist', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getActionIcon({ trainingStatus: 'Completed', actions: [] })).toBe('mdi-download')
    expect(wrapper.vm.getActionIcon({ trainingStatus: 'In Progress', actions: [] })).toBe(
      'mdi-play-circle'
    )
  })

  it('getActionIcon returns play icon for unknown action types', () => {
    const wrapper = createWrapper()
    expect(
      wrapper.vm.getActionIcon({
        actions: [{ actionType: 'UnknownAction', isEnabled: true }]
      })
    ).toBe('mdi-play-circle')
  })

  it('getActionIcon returns download/play icons for known action types', () => {
    const wrapper = createWrapper()
    expect(
      wrapper.vm.getActionIcon({
        actions: [{ actionType: 'CertificateDownload', isEnabled: true }]
      })
    ).toBe('mdi-download')
    expect(
      wrapper.vm.getActionIcon({
        actions: [{ actionType: 'TrainingUrl', isEnabled: true, url: 'https://example.com' }]
      })
    ).toBe('mdi-play-circle')
  })

  it('getActionTooltip uses fallback labels when no actions exist', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getActionTooltip({ trainingStatus: 'Completed', actions: [] })).toBe(
      labels.yourCertificatesDownloadCertificate
    )
    expect(wrapper.vm.getActionTooltip({ trainingStatus: 'In Progress', actions: [] })).toBe(
      labels.yourLearningStartTraining
    )
  })

  it('getActionTooltip returns empty string for unknown action types', () => {
    const wrapper = createWrapper()
    expect(
      wrapper.vm.getActionTooltip({
        actions: [{ actionType: 'UnknownAction', isEnabled: true }]
      })
    ).toBe('')
  })

  it('getActionTooltip returns retake warning for enabled TrainingUrl with warning', () => {
    const wrapper = createWrapper()
    expect(
      wrapper.vm.getActionTooltip({
        actions: [
          {
            actionType: 'TrainingUrl',
            isEnabled: true,
            warningMessage: 'can-retake',
            url: 'https://example.com'
          }
        ]
      })
    ).toBe(labels.yourCertificatesWarningCanRetakeNoCertificate)
  })

  it('getActionTooltip returns default labels for enabled known actions without warnings', () => {
    const wrapper = createWrapper()
    expect(
      wrapper.vm.getActionTooltip({
        actions: [{ actionType: 'CertificateDownload', isEnabled: true }]
      })
    ).toBe(labels.yourCertificatesDownloadCertificate)
    expect(
      wrapper.vm.getActionTooltip({
        actions: [{ actionType: 'TrainingUrl', isEnabled: true, url: 'https://example.com' }]
      })
    ).toBe(labels.yourLearningStartTraining)
  })

  it('getActionTooltip returns default download tooltip for disabled certificate action without warning', () => {
    const wrapper = createWrapper()
    expect(
      wrapper.vm.getActionTooltip({
        actions: [{ actionType: 'CertificateDownload', isEnabled: false, warningMessage: '' }]
      })
    ).toBe(labels.yourCertificatesDownloadCertificate)
  })

  it('getTrainingUrlForDialog returns empty string when selected row is invalid', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getTrainingUrlForDialog).toBe('')

    wrapper.setData({ selectedRowForDialog: {} })
    expect(wrapper.vm.getTrainingUrlForDialog).toBe('')
  })

  it('handleAction no-ops when primary action is disabled', () => {
    const wrapper = createWrapper()
    const handleDownloadSpy = jest.spyOn(wrapper.vm, 'handleDownload').mockResolvedValue(undefined)
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)

    wrapper.vm.handleAction({
      actions: [{ actionType: 'CertificateDownload', isEnabled: false }]
    })

    expect(handleDownloadSpy).not.toHaveBeenCalled()
    expect(openSpy).not.toHaveBeenCalled()
    handleDownloadSpy.mockRestore()
    openSpy.mockRestore()
  })

  it('handleAction fallback triggers download when no actions and status is completed', () => {
    const wrapper = createWrapper()
    const handleDownloadSpy = jest.spyOn(wrapper.vm, 'handleDownload').mockResolvedValue(undefined)
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)

    wrapper.vm.handleAction({
      trainingStatus: 'Completed',
      enrollmentId: 'enr-1',
      certificateName: 'Cert',
      actions: []
    })

    expect(handleDownloadSpy).toHaveBeenCalled()
    expect(openSpy).not.toHaveBeenCalled()
    handleDownloadSpy.mockRestore()
    openSpy.mockRestore()
  })

  it('handleAction fallback no-ops when no actions and no trainingUrl', () => {
    const wrapper = createWrapper()
    const handleDownloadSpy = jest.spyOn(wrapper.vm, 'handleDownload').mockResolvedValue(undefined)
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)

    wrapper.vm.handleAction({
      trainingStatus: 'In Progress',
      actions: []
    })

    expect(handleDownloadSpy).not.toHaveBeenCalled()
    expect(openSpy).not.toHaveBeenCalled()
    handleDownloadSpy.mockRestore()
    openSpy.mockRestore()
  })

  it('handleAction fallback opens training url when no actions and training exists', () => {
    const wrapper = createWrapper()
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)
    const handleDownloadSpy = jest.spyOn(wrapper.vm, 'handleDownload').mockResolvedValue(undefined)

    wrapper.vm.handleAction({
      trainingStatus: 'In Progress',
      trainingUrl: 'https://example.com/training',
      actions: []
    })

    expect(openSpy).toHaveBeenCalledWith('https://example.com/training', '_blank')
    expect(handleDownloadSpy).not.toHaveBeenCalled()
    openSpy.mockRestore()
    handleDownloadSpy.mockRestore()
  })

  it('handleTooltipMouseEnter hides tooltip when tooltip text is empty', () => {
    const wrapper = createWrapper()
    wrapper.setData({ showTooltip: true, tooltipContent: 'x' })

    wrapper.vm.handleTooltipMouseEnter(
      {
        currentTarget: {
          querySelector: () => null,
          getBoundingClientRect: () => ({ left: 0, bottom: 0, width: 10 })
        }
      },
      {
        actions: [{ actionType: 'UnknownAction', isEnabled: true }]
      }
    )

    expect(wrapper.vm.showTooltip).toBe(false)
  })

  it('handleTooltipMouseEnter uses event.target fallback when currentTarget is missing', () => {
    const wrapper = createWrapper()
    const row = {
      actions: [{ actionType: 'TrainingUrl', isEnabled: true, url: 'https://example.com' }]
    }
    const target = {
      querySelector: () => null,
      getBoundingClientRect: () => ({ left: 100, bottom: 250, width: 80 })
    }

    wrapper.vm.handleTooltipMouseEnter({ target }, row)

    expect(wrapper.vm.showTooltip).toBe(true)
    expect(wrapper.vm.tooltipContent).toBe(labels.yourLearningStartTraining)
    expect(wrapper.vm.tooltipStyle).toEqual(
      expect.objectContaining({
        top: '260px',
        left: '140px'
      })
    )
  })

  it('handleTooltipMouseEnter is safe when event target is missing', () => {
    const wrapper = createWrapper()
    wrapper.setData({ showTooltip: true, tooltipContent: 'x' })
    const row = {
      actions: [{ actionType: 'TrainingUrl', isEnabled: true, url: 'https://example.com' }]
    }

    expect(() => wrapper.vm.handleTooltipMouseEnter({}, row)).not.toThrow()
    expect(wrapper.vm.showTooltip).toBe(false)
  })

  it('handleAction does nothing when TrainingUrl action has no url', () => {
    const wrapper = createWrapper()
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)

    wrapper.vm.handleAction({
      actions: [{ actionType: 'TrainingUrl', isEnabled: true, warningMessage: '', url: '' }]
    })

    expect(openSpy).not.toHaveBeenCalled()
    expect(wrapper.vm.showCertificateNotAvailableDialog).toBe(false)
    openSpy.mockRestore()
  })

  it('handleAction does nothing when TrainingUrl has warning but url is missing', () => {
    const wrapper = createWrapper()
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)

    wrapper.vm.handleAction({
      actions: [{ actionType: 'TrainingUrl', isEnabled: true, warningMessage: 'retake', url: '' }]
    })

    expect(openSpy).not.toHaveBeenCalled()
    expect(wrapper.vm.showCertificateNotAvailableDialog).toBe(false)
    expect(wrapper.vm.selectedRowForDialog).toBe(null)
    openSpy.mockRestore()
  })

  it('handleTooltipMouseEnter hides tooltip when target has no getBoundingClientRect', () => {
    const wrapper = createWrapper()
    const row = {
      actions: [{ actionType: 'TrainingUrl', isEnabled: true, url: 'https://example.com' }]
    }

    wrapper.vm.handleTooltipMouseEnter(
      {
        currentTarget: {
          querySelector: () => ({})
        }
      },
      row
    )

    expect(wrapper.vm.showTooltip).toBe(false)
  })

  it('handleTooltipMouseEnter uses currentTarget rect when querySelector returns null', () => {
    const wrapper = createWrapper()
    const row = {
      actions: [{ actionType: 'TrainingUrl', isEnabled: true, url: 'https://example.com' }]
    }

    wrapper.vm.handleTooltipMouseEnter(
      {
        currentTarget: {
          querySelector: () => null,
          getBoundingClientRect: () => ({ left: 50, bottom: 90, width: 20 })
        }
      },
      row
    )

    expect(wrapper.vm.showTooltip).toBe(true)
    expect(wrapper.vm.tooltipStyle).toEqual(
      expect.objectContaining({
        top: '100px',
        left: '60px'
      })
    )
  })

  it('handleTooltipMouseEnter works when target has no querySelector function but has rect', () => {
    const wrapper = createWrapper()
    const row = {
      actions: [{ actionType: 'TrainingUrl', isEnabled: true, url: 'https://example.com' }]
    }

    wrapper.vm.handleTooltipMouseEnter(
      {
        currentTarget: {
          getBoundingClientRect: () => ({ left: 30, bottom: 70, width: 20 })
        }
      },
      row
    )

    expect(wrapper.vm.showTooltip).toBe(true)
    expect(wrapper.vm.tooltipStyle).toEqual(
      expect.objectContaining({
        top: '80px',
        left: '40px'
      })
    )
  })

  it('covers all known status color and label mappings', () => {
    const wrapper = createWrapper()
    const cases = [
      ['Not Started', '#757575', labels.yourLearningNotStarted],
      ['Not Completed', '#B83A3A', labels.yourLearningNotCompleted],
      ['In Progress', '#FF9800', labels.yourLearningInProgress],
      ['Completed', '#217124', labels.yourLearningCompleted],
      ['Exam Passed', '#43A047', labels.actionTypeExamPassed],
      ['In Queue', '#1173C1', labels.yourCertificatesInQueue],
      ['Exam Failed', '#F56C6C', labels.actionTypeExamFailed]
    ]

    cases.forEach(([status, color, label]) => {
      expect(wrapper.vm.getStatusColor(status)).toBe(color)
      expect(wrapper.vm.getStatusLabel(status)).toBe(label)
    })
  })

  it('getTrainingUrlForDialog returns empty when actions exist but no TrainingUrl action', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      selectedRowForDialog: {
        actions: [{ actionType: 'CertificateDownload', url: 'https://example.com/cert' }]
      }
    })

    expect(wrapper.vm.getTrainingUrlForDialog).toBe('')
  })

  it('handleAction no-ops for unknown enabled action types', () => {
    const wrapper = createWrapper()
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)
    const handleDownloadSpy = jest.spyOn(wrapper.vm, 'handleDownload').mockResolvedValue(undefined)

    wrapper.vm.handleAction({
      actions: [{ actionType: 'UnknownAction', isEnabled: true, url: 'https://example.com' }]
    })

    expect(openSpy).not.toHaveBeenCalled()
    expect(handleDownloadSpy).not.toHaveBeenCalled()
    expect(wrapper.vm.showCertificateNotAvailableDialog).toBe(false)
    openSpy.mockRestore()
    handleDownloadSpy.mockRestore()
  })

  it('getActionTooltip falls back to default training label when TrainingUrl is disabled with warning', () => {
    const wrapper = createWrapper()

    const result = wrapper.vm.getActionTooltip({
      actions: [
        {
          actionType: 'TrainingUrl',
          isEnabled: false,
          warningMessage: 'warning',
          url: 'https://example.com'
        }
      ]
    })

    expect(result).toBe(labels.yourLearningStartTraining)
  })

  it('handleTooltipMouseEnter hides tooltip when currentTarget has no querySelector and no rect', () => {
    const wrapper = createWrapper()
    const row = {
      actions: [{ actionType: 'TrainingUrl', isEnabled: true, url: 'https://example.com' }]
    }

    wrapper.vm.handleTooltipMouseEnter({ currentTarget: {} }, row)

    expect(wrapper.vm.showTooltip).toBe(false)
  })
})
