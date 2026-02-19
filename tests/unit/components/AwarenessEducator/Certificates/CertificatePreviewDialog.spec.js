jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getCertificate: jest.fn()
  }
}))

import AwarenessEducatorService from '@/api/awarenessEducator'
import CertificatePreviewDialog from '@/components/AwarenessEducator/Certificates/CertificatePreviewDialog.vue'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CertificatePreviewDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed title and subtitle are stable', () => {
    expect(CertificatePreviewDialog.computed.getTitle.call({})).toBe('Certificate Template Preview')
    expect(
      CertificatePreviewDialog.computed.getSubtitle.call({ selectedRow: { name: 'Cert A' } })
    ).toBe('Cert A')
    expect(CertificatePreviewDialog.computed.getSubtitle.call({ selectedRow: null })).toBe('')
  })

  it('callForData fetches certificate and replaces company logo token', async () => {
    AwarenessEducatorService.getCertificate.mockResolvedValueOnce({
      data: { data: { template: '<img src="{COMPANYLOGO}" />' } }
    })
    const ctx = {
      selectedRow: { id: 'cert-1' },
      isPreviewLoading: false,
      template: '',
      $store: { state: { whitelabel: { mainLogoUrl: 'https://logo.example/logo.png' } } }
    }

    CertificatePreviewDialog.methods.callForData.call(ctx)
    expect(ctx.isPreviewLoading).toBe(true)
    await flushPromises()

    expect(AwarenessEducatorService.getCertificate).toHaveBeenCalledWith('cert-1')
    expect(ctx.template).toBe('<img src="https://logo.example/logo.png" />')
    expect(ctx.isPreviewLoading).toBe(false)
  })

  it('callForData falls back to empty template when response payload is missing', async () => {
    AwarenessEducatorService.getCertificate.mockResolvedValueOnce({
      data: { data: {} }
    })
    const ctx = {
      selectedRow: { id: 'cert-2' },
      isPreviewLoading: false,
      template: 'old',
      $store: { state: { whitelabel: {} } }
    }

    CertificatePreviewDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.template).toBe('')
    expect(ctx.isPreviewLoading).toBe(false)
  })

  it('created calls callForData and handleClose emits on-close', () => {
    const callForData = jest.fn()
    CertificatePreviewDialog.created.call({ callForData })
    expect(callForData).toHaveBeenCalledTimes(1)

    const emit = jest.fn()
    CertificatePreviewDialog.methods.handleClose.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-close')
  })
})
