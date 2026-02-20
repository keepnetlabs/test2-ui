import AgenticAISettings from '@/components/Company Settings/AgenticAISettings.vue'
import {
  getAgenticAISettings,
  updateAgenticAISettings,
  getAgenticAIMetadata,
  toggleAgenticAIStatus,
  getAgenticAIStatus
} from '@/api/company'

jest.mock('@/api/company', () => ({
  getAgenticAISettings: jest.fn(),
  updateAgenticAISettings: jest.fn(),
  getAgenticAIMetadata: jest.fn(),
  toggleAgenticAIStatus: jest.fn(),
  getAgenticAIStatus: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AgenticAISettings.vue methods', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('buildLocalToApiKeyMap maps child keys with parent path', () => {
    const ctx = { localToApiKeyMap: {} }
    AgenticAISettings.methods.buildLocalToApiKeyMap.call(ctx, {
      behavioralPolicies: [
        {
          key: 'simulationCadence',
          items: [{ key: 'newHireRampUpProgram' }]
        }
      ]
    })

    expect(ctx.localToApiKeyMap).toEqual({
      newHireRampUpProgram: 'simulationCadence.newHireRampUpProgram'
    })
  })

  it('getApiKeyForLocalKey uses local map first, then fallback groups', () => {
    const ctx = {
      localToApiKeyMap: { k1: 'group.k1' },
      behavioralPolicyCheckboxFields: ['a'],
      complianceTrainingCheckboxFields: ['b'],
      riskEscalationCheckboxFields: [],
      positiveReinforcementCheckboxFields: [],
      difficultyProgressionCheckboxFields: [],
      nudgesCheckboxFields: [],
      trainingEnablementCheckboxFields: []
    }

    expect(AgenticAISettings.methods.getApiKeyForLocalKey.call(ctx, 'k1')).toBe('group.k1')
    expect(AgenticAISettings.methods.getApiKeyForLocalKey.call(ctx, 'a')).toBe('simulationCadence.a')
    expect(AgenticAISettings.methods.getApiKeyForLocalKey.call(ctx, 'b')).toBe(
      'complianceTrainingPolicies.b'
    )
  })

  it('updateSettings success dispatches snackbar and commits execution mode', async () => {
    updateAgenticAISettings.mockResolvedValueOnce({})
    const dispatch = jest.fn()
    const commit = jest.fn()
    const ctx = {
      isFetching: false,
      isSaving: false,
      $store: { dispatch, commit }
    }

    await AgenticAISettings.methods.updateSettings.call(ctx, { executionMode: 'Autonomous' })

    expect(updateAgenticAISettings).toHaveBeenCalledWith({ executionMode: 'Autonomous' })
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'AI actions will now execute automatically.' })
    )
    expect(commit).toHaveBeenCalledWith('login/SET_AGENTIC_AI_EXECUTION_MODE', 'Autonomous')
    expect(ctx.isSaving).toBe(false)
  })

  it('updateSettings failure dispatches error snackbar', async () => {
    updateAgenticAISettings.mockRejectedValueOnce(new Error('failed'))
    const dispatch = jest.fn()
    const ctx = {
      isFetching: false,
      isSaving: false,
      $store: { dispatch, commit: jest.fn() }
    }

    await AgenticAISettings.methods.updateSettings.call(ctx, {
      behavioralPolicies: { 'simulationCadence.x': false }
    })

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'Failed to saving settings' })
    )
    expect(ctx.isSaving).toBe(false)
  })

  it('updatePolicy maps local key and forwards payload to updateSettings', async () => {
    const updateSettings = jest.fn(() => Promise.resolve())
    const ctx = {
      isFetching: false,
      getApiKeyForLocalKey: () => 'simulationCadence.newHireRampUpProgram',
      updateSettings
    }

    await AgenticAISettings.methods.updatePolicy.call(ctx, 'newHireRampUpProgram', true)
    expect(updateSettings).toHaveBeenCalledWith({
      behavioralPolicies: { 'simulationCadence.newHireRampUpProgram': true }
    })
  })

  it('handleSimulationCadenceSwitchChange updates all child fields and saves', () => {
    const updateSettings = jest.fn()
    const ctx = {
      behavioralPolicyCheckboxFields: ['f1', 'f2'],
      behavioralPolicySettings: {
        simulationCadenceEnabled: false,
        f1: false,
        f2: false
      },
      getApiKeyForLocalKey: (k) => `simulationCadence.${k}`,
      updateSettings
    }

    AgenticAISettings.methods.handleSimulationCadenceSwitchChange.call(ctx, true)

    expect(ctx.behavioralPolicySettings.f1).toBe(true)
    expect(ctx.behavioralPolicySettings.f2).toBe(true)
    expect(updateSettings).toHaveBeenCalledWith({
      behavioralPolicies: {
        'simulationCadence.f1': true,
        'simulationCadence.f2': true
      }
    })
  })

  it('handleBehavioralPolicyCheckboxChange syncs parent switch from children', () => {
    const updateSettings = jest.fn()
    const ctx = {
      behavioralPolicyCheckboxFields: ['x1', 'x2'],
      behavioralPolicySettings: {
        simulationCadenceEnabled: false,
        x1: false,
        x2: true
      },
      getApiKeyForLocalKey: (k) => `simulationCadence.${k}`,
      updateSettings
    }

    AgenticAISettings.methods.handleBehavioralPolicyCheckboxChange.call(ctx)
    expect(ctx.behavioralPolicySettings.simulationCadenceEnabled).toBe(true)
    expect(updateSettings).toHaveBeenCalled()
  })

  it('handleAgenticAIToggle success updates state and dispatches store actions', async () => {
    toggleAgenticAIStatus.mockResolvedValueOnce({})
    const dispatch = jest.fn()
    const ctx = {
      hasAgenticAILicense: true,
      isSaving: false,
      agenticAISettings: { isAgenticAIEnabled: false },
      $store: { dispatch }
    }

    AgenticAISettings.methods.handleAgenticAIToggle.call(ctx, true)
    await flushPromises()

    expect(toggleAgenticAIStatus).toHaveBeenCalledWith({ agenticAIEnabled: true })
    expect(ctx.agenticAISettings.isAgenticAIEnabled).toBe(true)
    expect(dispatch).toHaveBeenCalledWith('login/getAgenticAIEnabled')
    expect(ctx.isSaving).toBe(false)
  })

  it('handleAgenticAIToggle failure reverts value and shows error snackbar', async () => {
    toggleAgenticAIStatus.mockRejectedValueOnce(new Error('fail'))
    const dispatch = jest.fn()
    const ctx = {
      hasAgenticAILicense: true,
      isSaving: false,
      agenticAISettings: { isAgenticAIEnabled: true },
      $store: { dispatch }
    }

    AgenticAISettings.methods.handleAgenticAIToggle.call(ctx, false)
    await flushPromises()

    expect(ctx.agenticAISettings.isAgenticAIEnabled).toBe(true)
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'Failed to disable Agentic AI.' })
    )
  })

  it('executionMode watcher updates settings only when enabled and not fetching', () => {
    const updateSettings = jest.fn()
    const ctx = {
      agenticAISettings: { isAgenticAIEnabled: true },
      isFetching: false,
      updateSettings
    }

    AgenticAISettings.watch['agenticAISettings.executionMode'].call(ctx, 'autonomous', 'approval')
    expect(updateSettings).toHaveBeenCalledWith({ executionMode: 'Autonomous' })

    updateSettings.mockClear()
    AgenticAISettings.watch['agenticAISettings.executionMode'].call(ctx, 'approval', 'approval')
    expect(updateSettings).not.toHaveBeenCalled()
  })

  it('fetchAgenticAISettings exits early when no license', async () => {
    const ctx = {
      hasAgenticAILicense: false,
      isFetching: true
    }

    await AgenticAISettings.methods.fetchAgenticAISettings.call(ctx)
    expect(ctx.isFetching).toBe(false)
    expect(getAgenticAIMetadata).not.toHaveBeenCalled()
  })

  it('fetchAgenticAISettings maps api data and updates local states', async () => {
    getAgenticAIMetadata.mockResolvedValueOnce({
      data: { data: { behavioralPolicies: [{ key: 'simulationCadence', items: [{ key: 'newHireRampUpProgram' }] }] } }
    })
    getAgenticAISettings.mockResolvedValueOnce({
      data: { data: { executionMode: 'Autonomous', behavioralPolicies: { 'simulationCadence.newHireRampUpProgram': true } } }
    })
    getAgenticAIStatus.mockResolvedValueOnce({ data: { data: { agenticAIEnabled: true } } })

    const ctx = {
      hasAgenticAILicense: true,
      isFetching: false,
      metadata: null,
      localToApiKeyMap: {},
      behavioralPolicyCheckboxFields: ['newHireRampUpProgram'],
      complianceTrainingCheckboxFields: [],
      riskEscalationCheckboxFields: [],
      positiveReinforcementCheckboxFields: [],
      difficultyProgressionCheckboxFields: [],
      nudgesCheckboxFields: [],
      trainingEnablementCheckboxFields: [],
      behavioralPolicySettings: {
        newHireRampUpProgram: false,
        simulationCadenceEnabled: false
      },
      agenticAISettings: {
        executionMode: 'approval',
        isAgenticAIEnabled: false
      },
      buildLocalToApiKeyMap: AgenticAISettings.methods.buildLocalToApiKeyMap,
      handleBehavioralPolicyCheckboxChange: jest.fn(),
      handleComplianceTrainingCheckboxChange: jest.fn(),
      handleRiskEscalationCheckboxChange: jest.fn(),
      handlePositiveReinforcementCheckboxChange: jest.fn(),
      handleDifficultyProgressionCheckboxChange: jest.fn(),
      handleNudgesCheckboxChange: jest.fn(),
      handleTrainingEnablementCheckboxChange: jest.fn(),
      $nextTick: (cb) => cb()
    }

    await AgenticAISettings.methods.fetchAgenticAISettings.call(ctx)

    expect(ctx.agenticAISettings.executionMode).toBe('autonomous')
    expect(ctx.agenticAISettings.isAgenticAIEnabled).toBe(true)
    expect(ctx.behavioralPolicySettings.newHireRampUpProgram).toBe(true)
    expect(ctx.isFetching).toBe(false)
  })
})
