jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    createRandomCryptStringNumber: jest.fn(() => '12345'),
    openHtmlInNewWindow: jest.fn()
  }
})

import CommonSimulatorEmailTemplatePreviewDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplatePreviewDialog.vue'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import labels from '@/model/constants/labels'
import { openHtmlInNewWindow } from '@/utils/functions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CommonSimulatorEmailTemplatePreviewDialog.vue', () => {
  it('computes navigation class, type flags and title', () => {
    expect(
      CommonSimulatorEmailTemplatePreviewDialog.computed.getNavigationDrawerClass.call({
        isNested: false
      })
    ).toEqual({
      'k-navigation-drawer k-navigation-drawer--email-template-preview': true,
      'nested-drawer': false
    })

    expect(
      CommonSimulatorEmailTemplatePreviewDialog.computed.getNavigationDrawerClass.call({
        isNested: true
      })
    ).toEqual({
      'k-navigation-drawer k-navigation-drawer--email-template-preview': true,
      'nested-drawer': true
    })

    expect(
      CommonSimulatorEmailTemplatePreviewDialog.computed.isPhishing.call({
        type: SCENARIO_TYPES.PHISHING
      })
    ).toBe(true)
    expect(
      CommonSimulatorEmailTemplatePreviewDialog.computed.isQuishing.call({
        type: SCENARIO_TYPES.QUISHING
      })
    ).toBe(true)

    expect(
      CommonSimulatorEmailTemplatePreviewDialog.computed.getTitle.call({
        isIndividualPrintoutTemplate: false,
        title: 'Custom Title'
      })
    ).toBe('Custom Title')
    expect(
      CommonSimulatorEmailTemplatePreviewDialog.computed.getTitle.call({
        isIndividualPrintoutTemplate: true,
        title: 'Custom Title'
      })
    ).toBe(labels.IndividualPrintoutTemplatePreview)
  })

  it('computes individual printout button style by disabled status', () => {
    expect(
      CommonSimulatorEmailTemplatePreviewDialog.computed.getIndividualPrintoutStyle.call({
        isIndividualPrintoutButtonDisabled: false
      })
    ).toEqual({
      textTransform: 'capitalize'
    })

    expect(
      CommonSimulatorEmailTemplatePreviewDialog.computed.getIndividualPrintoutStyle.call({
        isIndividualPrintoutButtonDisabled: true
      })
    ).toEqual({
      textTransform: 'capitalize',
      cursor: 'default',
      opacity: 0.5
    })
  })

  it('computes subtitle from selected row name', () => {
    expect(
      CommonSimulatorEmailTemplatePreviewDialog.computed.subtitle.call({
        selectedRow: { name: 'Template X' }
      })
    ).toBe('Template X')

    expect(
      CommonSimulatorEmailTemplatePreviewDialog.computed.subtitle.call({
        selectedRow: {}
      })
    ).toBe('')
  })

  it('calls closeDrawer for overlay and close actions', () => {
    const closeDrawer = jest.fn()
    const event = { stopPropagation: jest.fn(), preventDefault: jest.fn() }
    const ctx = { closeDrawer }

    CommonSimulatorEmailTemplatePreviewDialog.methods.handleOverlayClick.call(ctx, event)
    expect(event.stopPropagation).toHaveBeenCalled()
    expect(event.preventDefault).toHaveBeenCalled()
    expect(closeDrawer).toHaveBeenCalledTimes(1)

    CommonSimulatorEmailTemplatePreviewDialog.methods.handleClose.call(ctx)
    expect(closeDrawer).toHaveBeenCalledTimes(2)
  })

  it('opens template in new window on handleExternalLink', () => {
    const ctx = { templateHTML: '<p>Hello</p>' }
    CommonSimulatorEmailTemplatePreviewDialog.methods.handleExternalLink.call(ctx)
    expect(openHtmlInNewWindow).toHaveBeenCalledWith('<p>Hello</p>')
  })

  it('callForData maps api payload and sets template for phishing', async () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((fn) => {
      fn()
      return 1
    })

    const ctx = {
      type: SCENARIO_TYPES.PHISHING,
      selectedRow: { resourceId: 'et-1' },
      isPreviewLoading: false,
      templateHTML: null,
      emailTemplateParams: {},
      apiFunc: jest.fn(() =>
        Promise.resolve({
          data: {
            data: {
              fromName: 'HR',
              fromAddress: 'hr@company.com',
              ccAddresses: ['team@company.com'],
              name: 'Benefits',
              difficultyResourceId: 1,
              phishingFileName: 'policy.pdf',
              subject: 'Update',
              type: 'Email',
              template: '<p>Hello</p>',
              isAssistedByAI: true
            }
          }
        })
      )
    }

    CommonSimulatorEmailTemplatePreviewDialog.methods.callForData.call(ctx)
    await flushPromises()
    await flushPromises()

    expect(ctx.apiFunc).toHaveBeenCalledWith('et-1')
    expect(ctx.isPreviewLoading).toBe(false)
    expect(ctx.emailTemplateParams.fromName).toBe('HR')
    expect(ctx.emailTemplateParams.attachment).toEqual({ name: 'policy.pdf' })
    expect(ctx.templateHTML).toBe('<p>Hello</p>')

    setTimeoutSpy.mockRestore()
  })

  it('callForData replaces QR code marker for quishing templates', async () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((fn) => {
      fn()
      return 1
    })

    const ctx = {
      type: SCENARIO_TYPES.QUISHING,
      selectedRow: { resourceId: 'et-2', quishingType: 'Individual' },
      isPreviewLoading: false,
      templateHTML: null,
      emailTemplateParams: {},
      apiFunc: jest.fn(() =>
        Promise.resolve({
          data: {
            data: {
              fromName: 'Info',
              fromAddress: 'info@company.com',
              ccAddresses: [],
              name: 'Quishing Template',
              difficultyResourceId: 1,
              subject: 'QR',
              template: '<img src="{QRCODEURLIMAGE}" />'
            }
          }
        })
      )
    }

    CommonSimulatorEmailTemplatePreviewDialog.methods.callForData.call(ctx)
    await flushPromises()
    await flushPromises()

    expect(ctx.emailTemplateParams.type).toBe('Individual')
    expect(ctx.templateHTML).not.toContain('{QRCODEURLIMAGE}')

    setTimeoutSpy.mockRestore()
  })

  it('status watcher updates visibility and triggers callForData only when opened', () => {
    const callForData = jest.fn()
    const ctx = {
      isVisible: false,
      callForData
    }

    CommonSimulatorEmailTemplatePreviewDialog.watch.status.call(ctx, false)
    expect(ctx.isVisible).toBe(false)
    expect(callForData).not.toHaveBeenCalled()

    CommonSimulatorEmailTemplatePreviewDialog.watch.status.call(ctx, true)
    expect(ctx.isVisible).toBe(true)
    expect(callForData).toHaveBeenCalledTimes(1)
  })
})
