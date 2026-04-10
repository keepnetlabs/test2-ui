import AgenticAISettings from '@/components/Company Settings/AgenticAISettings.vue'
import {
  getAgenticAISettings,
  updateAgenticAISettings,
  getAgenticAIMetadata,
  toggleAgenticAIStatus,
  getAgenticAIStatus
} from '@/api/company'
import { isTestEnvironment } from '@/utils/isTestEnvironment'

jest.mock('@/api/company', () => ({
  getAgenticAISettings: jest.fn(),
  updateAgenticAISettings: jest.fn(),
  getAgenticAIMetadata: jest.fn(),
  toggleAgenticAIStatus: jest.fn(),
  getAgenticAIStatus: jest.fn()
}))

jest.mock('@/utils/isTestEnvironment', () => ({
  isTestEnvironment: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AgenticAISettings.vue methods', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    isTestEnvironment.mockReturnValue(false)
  })

  const createSwitchHandlerCtx = (
    enabledField,
    childFields,
    groupName,
    collectionName
  ) => ({
    behavioralPolicySettings: childFields.reduce(
      (acc, field) => ({
        ...acc,
        [field]: false
      }),
      {
        [enabledField]: false
      }
    ),
    [collectionName]: childFields,
    getApiKeyForLocalKey: (key) => `${groupName}.${key}`,
    updateSettings: jest.fn()
  })

  it('showSettingsForm depends only on Agentic AI enabled state', () => {
    expect(
      AgenticAISettings.computed.showSettingsForm.call({
        agenticAISettings: { isAgenticAIEnabled: true }
      })
    ).toBe(true)

    expect(
      AgenticAISettings.computed.showSettingsForm.call({
        agenticAISettings: { isAgenticAIEnabled: false }
      })
    ).toBe(false)
  })

  it('showBehavioralPoliciesForm keeps the test-environment gate only for behavioral policies', () => {
    isTestEnvironment.mockReturnValue(true)
    expect(
      AgenticAISettings.computed.showBehavioralPoliciesForm.call({
        showSettingsForm: true
      })
    ).toBe(true)

    isTestEnvironment.mockReturnValue(false)
    expect(
      AgenticAISettings.computed.showBehavioralPoliciesForm.call({
        showSettingsForm: true
      })
    ).toBe(false)

    expect(
      AgenticAISettings.computed.showBehavioralPoliciesForm.call({
        showSettingsForm: false
      })
    ).toBe(false)
  })

  it('safeguardItems and operationalDetails expose the safeguard accordion data', () => {
    const safeguardItems = AgenticAISettings.computed.safeguardItems.call({
      hasAgenticAILicense: false
    })
    expect(safeguardItems[0].title).toBe('Operational Safeguards')
    expect(safeguardItems[0].disabled).toBe(true)
    expect(safeguardItems[0].children.length).toBeGreaterThan(0)

    expect(
      AgenticAISettings.computed.operationalDetails.call({
        safeguardItems
      })
    ).toEqual(safeguardItems[0].children)
  })

  it('behavioralPolicyItems builds all policy groups and respects license state', () => {
    const ctx = {
      hasAgenticAILicense: false,
      behavioralPolicySettings: {},
      handleSimulationCadenceSwitchChange: jest.fn(),
      handleBehavioralPolicyCheckboxChange: jest.fn(),
      handleComplianceTrainingSwitchChange: jest.fn(),
      handleComplianceTrainingCheckboxChange: jest.fn(),
      handleRiskEscalationSwitchChange: jest.fn(),
      handleRiskEscalationCheckboxChange: jest.fn(),
      handlePositiveReinforcementSwitchChange: jest.fn(),
      handlePositiveReinforcementCheckboxChange: jest.fn(),
      handleDifficultyProgressionSwitchChange: jest.fn(),
      handleDifficultyProgressionCheckboxChange: jest.fn(),
      handleNudgesSwitchChange: jest.fn(),
      handleNudgesCheckboxChange: jest.fn(),
      handleTrainingEnablementSwitchChange: jest.fn(),
      handleTrainingEnablementCheckboxChange: jest.fn()
    }

    const items = AgenticAISettings.computed.behavioralPolicyItems.call(ctx)
    expect(items).toHaveLength(7)
    expect(items.map((item) => item.title)).toEqual(
      expect.arrayContaining([
        'Simulation Cadence',
        'Compliance Training Policies',
        'Risk Escalation',
        'Positive Reinforcement',
        'Difficulty & Progression',
        'Nudges',
        'Training & Enablement'
      ])
    )
    expect(items.every((item) => item.switchDisabled === true)).toBe(true)
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

  it('buildLocalToApiKeyMap leaves map empty when metadata is missing', () => {
    const ctx = { localToApiKeyMap: { stale: 'value' } }
    AgenticAISettings.methods.buildLocalToApiKeyMap.call(ctx, null)
    expect(ctx.localToApiKeyMap).toEqual({})
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

  it('updateSettings success uses active/inactive snackbar copy for behavioral policies', async () => {
    updateAgenticAISettings.mockResolvedValueOnce({})
    const dispatch = jest.fn()
    const ctx = {
      isFetching: false,
      isSaving: false,
      $store: { dispatch, commit: jest.fn() }
    }

    await AgenticAISettings.methods.updateSettings.call(ctx, {
      behavioralPolicies: { 'simulationCadence.a': true }
    })

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({
        message: 'This policy is now active and applied immediately.'
      })
    )

    updateAgenticAISettings.mockResolvedValueOnce({})
    await AgenticAISettings.methods.updateSettings.call(ctx, {
      behavioralPolicies: { 'simulationCadence.a': false }
    })

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({
        message: 'This policy is now inactive and no longer applied.'
      })
    )
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

  it('updatePolicy returns early while settings are fetching', async () => {
    const updateSettings = jest.fn(() => Promise.resolve())
    const ctx = {
      isFetching: true,
      getApiKeyForLocalKey: () => 'simulationCadence.newHireRampUpProgram',
      updateSettings
    }

    await AgenticAISettings.methods.updatePolicy.call(ctx, 'newHireRampUpProgram', true)
    expect(updateSettings).not.toHaveBeenCalled()
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

  ;[
    {
      methodName: 'handleComplianceTrainingSwitchChange',
      enabledField: 'complianceTrainingEnabled',
      collectionName: 'complianceTrainingCheckboxFields',
      childFields: [
        'roleBasedComplianceTraining',
        'annualComplianceRefresh'
      ],
      groupName: 'complianceTrainingPolicies'
    },
    {
      methodName: 'handleRiskEscalationSwitchChange',
      enabledField: 'riskEscalationEnabled',
      collectionName: 'riskEscalationCheckboxFields',
      childFields: [
        'repeatOffenderIdentification',
        'managerVisibilityOnHighRisk'
      ],
      groupName: 'riskEscalation'
    },
    {
      methodName: 'handlePositiveReinforcementSwitchChange',
      enabledField: 'positiveReinforcementEnabled',
      collectionName: 'positiveReinforcementCheckboxFields',
      childFields: [
        'securityChampionRecognition',
        'milestoneAchievementCelebration'
      ],
      groupName: 'positiveReinforcement'
    },
    {
      methodName: 'handleDifficultyProgressionSwitchChange',
      enabledField: 'difficultyProgressionEnabled',
      collectionName: 'difficultyProgressionCheckboxFields',
      childFields: [
        'progressiveDifficultyModel',
        'difficultyStabilizationWindow'
      ],
      groupName: 'difficultyAndProgression'
    },
    {
      methodName: 'handleNudgesSwitchChange',
      enabledField: 'nudgesEnabled',
      collectionName: 'nudgesCheckboxFields',
      childFields: [
        'incompleteTrainingReminder',
        'behaviorImprovementPrompt'
      ],
      groupName: 'nudges'
    },
    {
      methodName: 'handleTrainingEnablementSwitchChange',
      enabledField: 'trainingEnablementEnabled',
      collectionName: 'trainingEnablementCheckboxFields',
      childFields: [
        'failureBasedTrainingEnrollment',
        'postIncidentTrainingAssignment'
      ],
      groupName: 'trainingAndEnablement'
    }
  ].forEach(({ methodName, enabledField, collectionName, childFields, groupName }) => {
    it(`${methodName} updates all child fields and skips save when requested`, () => {
      const ctx = createSwitchHandlerCtx(
        enabledField,
        childFields,
        groupName,
        collectionName
      )

      AgenticAISettings.methods[methodName].call(ctx, true)

      childFields.forEach((field) => {
        expect(ctx.behavioralPolicySettings[field]).toBe(true)
      })
      expect(ctx.updateSettings).toHaveBeenCalledWith({
        behavioralPolicies: Object.fromEntries(
          childFields.map((field) => [`${groupName}.${field}`, true])
        )
      })

      ctx.updateSettings.mockClear()
      AgenticAISettings.methods[methodName].call(ctx, { skipSave: true })
      expect(ctx.updateSettings).not.toHaveBeenCalled()
    })
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

  it('handleAgenticAIToggle returns early without a license', () => {
    const dispatch = jest.fn()
    const ctx = {
      hasAgenticAILicense: false,
      isSaving: false,
      agenticAISettings: { isAgenticAIEnabled: false },
      $store: { dispatch }
    }

    AgenticAISettings.methods.handleAgenticAIToggle.call(ctx, true)
    expect(toggleAgenticAIStatus).not.toHaveBeenCalled()
    expect(dispatch).not.toHaveBeenCalled()
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

  it('executionMode watcher skips updates when disabled or while fetching', () => {
    const updateSettings = jest.fn()
    const disabledCtx = {
      agenticAISettings: { isAgenticAIEnabled: false },
      isFetching: false,
      updateSettings
    }
    AgenticAISettings.watch['agenticAISettings.executionMode'].call(
      disabledCtx,
      'autonomous',
      'approval'
    )
    expect(updateSettings).not.toHaveBeenCalled()

    const fetchingCtx = {
      agenticAISettings: { isAgenticAIEnabled: true },
      isFetching: true,
      updateSettings
    }
    AgenticAISettings.watch['agenticAISettings.executionMode'].call(
      fetchingCtx,
      'autonomous',
      'approval'
    )
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

  it('fetchAgenticAISettings logs and recovers when api calls fail', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    getAgenticAIMetadata.mockRejectedValueOnce(new Error('metadata failed'))

    const ctx = {
      hasAgenticAILicense: true,
      isFetching: false,
      $nextTick: (cb) => cb()
    }

    await AgenticAISettings.methods.fetchAgenticAISettings.call(ctx)

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to fetch Agentic AI settings',
      expect.any(Error)
    )
    expect(ctx.isFetching).toBe(false)
    consoleErrorSpy.mockRestore()
  })
})
