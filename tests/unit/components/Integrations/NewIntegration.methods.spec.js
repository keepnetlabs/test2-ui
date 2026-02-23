jest.mock('@/api/integrations', () => ({
  createIntegration: jest.fn(() => Promise.resolve()),
  getIntegrationDetails: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  testAnalysis: jest.fn(() => Promise.resolve({ data: { status: 'SUCCESS' } })),
  updateIntegration: jest.fn(() => Promise.resolve()),
  getAnalysisEngineFormOptions: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    scrollToComponent: jest.fn(),
    isDifferent: jest.fn(() => false)
  }
})

import NewIntegration from '@/components/Integrations/NewIntegration.vue'
import { INTEGRATION_TYPES } from '@/model/constants/commonConstants'
import { isDifferent } from '@/utils/functions'
import { testAnalysis } from '@/api/integrations'

describe('NewIntegration.vue methods/computed', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed flags reflect selected integration type', () => {
    expect(
      NewIntegration.computed.isCustomIntegration.call({
        selectedIntegrationType: { name: INTEGRATION_TYPES.CUSTOMINTEGRATION }
      })
    ).toBe(true)
    expect(
      NewIntegration.computed.isRoksit.call({
        selectedIntegrationType: { name: INTEGRATION_TYPES.ROKSIT }
      })
    ).toBe(true)
    expect(
      NewIntegration.computed.isSpamHouse.call({
        selectedIntegrationType: { name: INTEGRATION_TYPES.SPAMHOUSE }
      })
    ).toBe(true)
    expect(
      NewIntegration.computed.isCustomIntegration.call({
        selectedIntegrationType: { name: INTEGRATION_TYPES.ANYRUN }
      })
    ).toBe(false)
  })

  it('handleIntegrationTypeChange updates defaults for Custom Integration and VirusTotal', () => {
    const resetApiKeysAndCredentials = jest.fn()
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const ctx = {
      integrationTypes: [
        {
          resourceId: 'custom-id',
          name: INTEGRATION_TYPES.CUSTOMINTEGRATION,
          isSendFile: false,
          isSendFileHash: false,
          isSendUrl: true,
          isSendIp: false,
          isHideUrlParameter: false
        },
        {
          resourceId: 'vt-id',
          name: INTEGRATION_TYPES.VIRUSTOTAL,
          isSendFile: true,
          isSendFileHash: true,
          isSendUrl: true,
          isSendIp: false,
          isHideUrlParameter: false
        }
      ],
      formValues: {
        apiUrl: '',
        apiKey: 'old',
        password: 'old',
        apiKeys: [{ value: 'x', status: null, resourceId: null }],
        isUploadExecutableFile: true,
        isUploadOtherFileType: true,
        uploadFileTypes: ['Archive']
      },
      resetApiKeysAndCredentials,
      $set: set
    }

    NewIntegration.methods.handleIntegrationTypeChange.call(ctx, 'custom-id')
    expect(ctx.selectedIntegrationType.name).toBe(INTEGRATION_TYPES.CUSTOMINTEGRATION)
    expect(ctx.formValues.apiUrl).toBe(window.location.origin)
    expect(ctx.formValues.apiKey).toBe('')
    expect(ctx.formValues.password).toBe('')
    expect(ctx.formValues.apiKeys).toEqual([{ value: '', status: null, resourceId: null }])
    expect(ctx.formValues.isUploadExecutableFile).toBe(false)
    expect(ctx.formValues.isUploadOtherFileType).toBe(false)
    expect(ctx.formValues.uploadFileTypes).toEqual([])

    NewIntegration.methods.handleIntegrationTypeChange.call(ctx, 'vt-id')
    expect(ctx.formValues.apiUrl).toBe('https://www.virustotal.com/api/v3')
    expect(resetApiKeysAndCredentials).toHaveBeenCalled()
  })

  it('handleIntegrationTypeChange sets provider specific urls for WebRisk and SpamHouse', () => {
    const resetApiKeysAndCredentials = jest.fn()
    const ctx = {
      integrationTypes: [
        {
          resourceId: 'webrisk-id',
          name: INTEGRATION_TYPES.GOOGLEWEBRISK,
          isSendFile: true,
          isSendFileHash: true,
          isSendUrl: true,
          isSendIp: false,
          isHideUrlParameter: false
        },
        {
          resourceId: 'spam-id',
          name: INTEGRATION_TYPES.SPAMHOUSE,
          isSendFile: false,
          isSendFileHash: false,
          isSendUrl: false,
          isSendIp: false,
          isHideUrlParameter: false
        }
      ],
      formValues: {
        apiUrl: '',
        apiKeys: [{ value: 'x', status: null, resourceId: null }],
        isUploadExecutableFile: true,
        isUploadOtherFileType: true,
        uploadFileTypes: ['Archive']
      },
      resetApiKeysAndCredentials,
      $set: jest.fn((obj, key, value) => {
        obj[key] = value
      })
    }

    NewIntegration.methods.handleIntegrationTypeChange.call(ctx, 'webrisk-id')
    expect(ctx.formValues.apiUrl).toBe('https://webrisk.googleapis.com/v1')
    expect(resetApiKeysAndCredentials).toHaveBeenCalledTimes(1)

    NewIntegration.methods.handleIntegrationTypeChange.call(ctx, 'spam-id')
    expect(ctx.formValues.apiUrl).toBe('zen.spamhaus.org')
  })

  it('getTestConnectionDisableStatus returns false when AnyRun has valid fields', () => {
    const ctx = {
      selectedIntegrationType: { name: INTEGRATION_TYPES.ANYRUN },
      formValues: {
        apiUrl: 'https://api.any.run/v1/analysis',
        apiKeys: [{ value: 'apikey' }]
      },
      apiUrlRules: {
        format: jest.fn(() => true)
      }
    }

    expect(NewIntegration.methods.getTestConnectionDisableStatus.call(ctx)).toBe(false)
  })

  it('getTestConnectionDisableStatus returns true for empty custom integration fields', () => {
    const ctx = {
      selectedIntegrationType: { name: INTEGRATION_TYPES.CUSTOMINTEGRATION },
      formValues: {
        apiUrl: '',
        apiKeys: [{ value: '' }]
      },
      apiUrlRules: {
        format: jest.fn(() => 'Invalid URL')
      }
    }

    expect(NewIntegration.methods.getTestConnectionDisableStatus.call(ctx)).toBe(true)
  })

  it('getTestConnectionDisableStatus handles roksit branch', () => {
    const ctx = {
      selectedIntegrationType: { name: INTEGRATION_TYPES.ROKSIT },
      formValues: {
        apiUrl: 'https://reputation.roksit.com/api/query/',
        apiKeys: [{ value: '' }]
      },
      apiUrlRules: {
        format: jest.fn(() => true)
      }
    }

    expect(NewIntegration.methods.getTestConnectionDisableStatus.call(ctx)).toBe(true)
    ctx.formValues.apiKeys[0].value = 'token'
    expect(NewIntegration.methods.getTestConnectionDisableStatus.call(ctx)).toBe(false)
  })

  it('closeOverlay emits directly when unchanged and dispatches leaving dialog when changed', () => {
    const emit = jest.fn()
    const dispatch = jest.fn()
    const ctx = {
      formValues: { name: 'A' },
      initialFormValues: { name: 'A' },
      $emit: emit,
      $store: { dispatch }
    }

    isDifferent.mockReturnValueOnce(false)
    NewIntegration.methods.closeOverlay.call(ctx)
    expect(emit).toHaveBeenCalledWith('closeOverlay', false, true)
    expect(dispatch).not.toHaveBeenCalled()

    isDifferent.mockReturnValueOnce(true)
    NewIntegration.methods.closeOverlay.call(ctx)
    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )
  })

  it('api key helper methods update arrays and modal flags', () => {
    const ctx = {
      isTestConnectionDisabled: true,
      showConfirmModal: true,
      showPasswords: [false, false],
      isIbmXForce: false,
      formValues: {
        apiUrl: 'https://x',
        isUploadOtherFileType: true,
        uploadFileTypes: ['Archive'],
        apiKeys: [
          { value: 'k1', status: null, resourceId: null },
          { value: 'k2', status: null, resourceId: null }
        ]
      }
    }

    NewIntegration.methods.handleApiKeyDelete.call(ctx, 1)
    expect(ctx.formValues.apiKeys).toHaveLength(1)

    NewIntegration.methods.addApiKey.call(ctx)
    expect(ctx.formValues.apiKeys).toHaveLength(2)
    expect(ctx.isTestConnectionDisabled).toBe(true)

    NewIntegration.methods.handleApiKeyChange.call(ctx)
    expect(ctx.isTestConnectionDisabled).toBe(true)
    ctx.formValues.apiKeys[1].value = 'k3'
    NewIntegration.methods.handleApiKeyChange.call(ctx)
    expect(ctx.isTestConnectionDisabled).toBe(false)

    NewIntegration.methods.cancelClickOnConfirmModal.call(ctx)
    expect(ctx.formValues.uploadFileTypes).toEqual([])
    expect(ctx.formValues.isUploadOtherFileType).toBe(false)
    expect(ctx.showConfirmModal).toBe(false)
  })

  it('resetApiKeysAndCredentials and handlePasswordToggle update state', () => {
    const ctx = {
      formValues: {
        userName: 'u',
        password: 'p'
      },
      showPasswords: [false],
      $set: jest.fn((obj, key, value) => {
        obj[key] = value
      })
    }

    NewIntegration.methods.resetApiKeysAndCredentials.call(ctx)
    expect(ctx.formValues.apiKeys).toEqual([{ value: '', status: null, resourceId: null }])
    expect(ctx.formValues.userName).toBe('')
    expect(ctx.formValues.password).toBe('')

    NewIntegration.methods.handlePasswordToggle.call(ctx, 0)
    expect(ctx.showPasswords[0]).toBe(true)
  })

  it('helper methods manage error text, visibility and simple toggles', () => {
    const longMessage = 'x'.repeat(80)
    const shortMessage = 'short error'
    const ctx = {
      isShowErrorMessage: false,
      errorMessageOfApiKey: '',
      showConfirmModal: true,
      formValues: {
        uploadFileTypes: ['Archive'],
        isHideUrlParameter: true
      }
    }

    expect(NewIntegration.methods.getErrorMessageOfApiKey.call(ctx, { errorMessage: longMessage })).toBe(
      `${'x'.repeat(75)}...`
    )
    expect(NewIntegration.methods.isShowSeeMore.call(ctx, { errorMessage: shortMessage })).toBe(false)
    expect(NewIntegration.methods.isShowSeeMore.call(ctx, { errorMessage: longMessage })).toBe(true)

    NewIntegration.methods.showErrorMessage.call(ctx, { errorMessage: shortMessage })
    expect(ctx.isShowErrorMessage).toBe(true)
    expect(ctx.errorMessageOfApiKey).toBe(shortMessage)

    NewIntegration.methods.handleUploadOtherFileChange.call(ctx, false)
    expect(ctx.formValues.uploadFileTypes).toEqual([])

    NewIntegration.methods.handleSendUrlChange.call(ctx, false)
    expect(ctx.formValues.isHideUrlParameter).toBe(false)

    NewIntegration.methods.saveButtonClickOnConfirmModal.call(ctx)
    expect(ctx.showConfirmModal).toBe(false)
  })

  it('handleTagItemChange truncates last tag and resetValues restores defaults', () => {
    const ctx = {
      formValues: {}
    }
    const tags = ['safe', 'a'.repeat(30)]

    NewIntegration.methods.handleTagItemChange.call(ctx, tags)
    expect(tags[1]).toHaveLength(20)

    NewIntegration.methods.resetValues.call(ctx)
    expect(ctx.formValues.analysisEngineTypeResourceId).toBe(null)
    expect(ctx.formValues.apiKeys).toEqual([{ value: '', status: null, resourceId: null }])
    expect(ctx.formValues.isUploadExecutableFile).toBe(true)
  })

  it('updateModels maps virus total credentials and applies default proxy when empty', () => {
    const ctx = {
      integrationTypes: [{ resourceId: 'vt-id', name: INTEGRATION_TYPES.VIRUSTOTAL }],
      selectedIntegrationType: {},
      formValues: {},
      integrationId: null,
      defaultProxyItems: [{ isDefault: 'Yes', resourceId: 'proxy-default' }]
    }
    const response = {
      data: {
        data: {
          analysisEngineTypeResourceId: 'vt-id',
          detectionThreshold: null,
          proxyResourceId: '',
          apiCredentials: [{ apiKey: 'k1', resourceId: 'r1', proxyResourceId: 'p1' }]
        }
      }
    }

    NewIntegration.methods.updateModels.call(ctx, response)

    expect(ctx.selectedIntegrationType.name).toBe(INTEGRATION_TYPES.VIRUSTOTAL)
    expect(ctx.formValues.apiKeys).toEqual([
      { value: 'k1', status: null, resourceId: 'r1', proxyResourceId: 'p1' }
    ])
    expect(ctx.formValues.detectionThreshold).toBe('1')
    expect(ctx.formValues.proxyResourceId).toBe('proxy-default')
    expect(ctx.formValues.apiCredentials).toBeUndefined()
  })

  it('updateModels maps custom integration credentials', () => {
    const ctx = {
      integrationTypes: [{ resourceId: 'custom-id', name: INTEGRATION_TYPES.CUSTOMINTEGRATION }],
      selectedIntegrationType: {},
      formValues: {},
      integrationId: 'integration-1',
      defaultProxyItems: []
    }
    const response = {
      data: {
        data: {
          analysisEngineTypeResourceId: 'custom-id',
          apiCredentials: [
            {
              apiKey: 'client-id',
              password: 'client-secret',
              resourceId: 'cred-id',
              proxyResourceId: 'proxy-id'
            }
          ]
        }
      }
    }

    NewIntegration.methods.updateModels.call(ctx, response)

    expect(ctx.formValues.apiKey).toBe('client-id')
    expect(ctx.formValues.password).toBe('client-secret')
    expect(ctx.formValues.apiCreditionalResourceId).toBe('cred-id')
    expect(ctx.formValues.proxyResourceId).toBe('proxy-id')
  })

  it('retryTestConnection sets success and failed status paths', async () => {
    const item = { value: 'api-key', status: null, password: 'pw' }
    const ctx = {
      formValues: {
        apiUrl: 'https://api.example.com',
        analysisEngineTypeResourceId: 'engine-id'
      },
      loadingState: [],
      isIbmXForce: true
    }

    testAnalysis.mockResolvedValueOnce({ data: { status: 'SUCCESS' } })
    NewIntegration.methods.retryTestConnection.call(ctx, item)
    await Promise.resolve()
    await Promise.resolve()
    expect(item.status).toBe('success')
    expect(ctx.loadingState).toEqual([])

    testAnalysis.mockRejectedValueOnce({
      response: { data: { Message: 'Internal server error' } }
    })
    NewIntegration.methods.retryTestConnection.call(ctx, item)
    await Promise.resolve()
    await Promise.resolve()
    expect(item.status).toBe('failed')
    expect(item.errorMessage).toBe('Error when testing connections!')
  })
})
