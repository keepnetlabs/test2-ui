import TrainingReportSummaryTrainingInfo from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryTrainingInfo.vue'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

describe('TrainingReportSummaryTrainingInfo.vue (extra)', () => {
  const { computed, methods } = TrainingReportSummaryTrainingInfo

  it('covers getCardTitle branches and item mapping', () => {
    expect(
      computed.getCardTitle.call({ isSurvey: true, trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING })
    ).toContain('Survey')
    expect(
      computed.getCardTitle.call({ isSurvey: false, trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER })
    ).toContain('Poster')
    expect(
      computed.getCardTitle.call({ isSurvey: false, trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC })
    ).toContain('Infographic')
    expect(
      computed.getCardTitle.call({ isSurvey: false, trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH })
    ).toContain('Learning Path')
    expect(
      computed.getCardTitle.call({ isSurvey: false, trainingType: TRAINING_LIBRARY_TYPES.LEARNING_PATH })
    ).toContain('Learning Path')
    expect(computed.getCardTitle.call({ isSurvey: false, trainingType: 'other' })).toContain('Training')

    const items = {
      'Target Users': { show: true, value: 2 },
      'Target Groups': { show: true, value: [{ id: 1 }] },
      Hidden: { show: false, value: 'x' },
      targetGroupCount: { show: false, value: 5 }
    }
    expect(computed.getItems.call({ items })).toEqual({
      'Target Users': 2,
      'Target Groups': [{ id: 1 }]
    })
  })

  it('covers audience/body/group computations and modal toggles', () => {
    const items = {
      'Target Users': { value: 2 },
      'Target Groups': { value: [{ id: 1 }, { id: 2 }] },
      targetGroupCount: { value: 4 }
    }

    expect(computed.isFromUserGroups.call({ type: 'userGroups' })).toBe(true)
    expect(computed.isFromPhishingCampaign.call({ type: 'phishingCampaign' })).toBe(true)
    expect(
      computed.getAudienceText.call({ isFromUserGroups: true, isFromPhishingCampaign: false, items })
    ).toBe('4 user groups')
    expect(
      computed.getAudienceText.call({ isFromUserGroups: false, isFromPhishingCampaign: true, items })
    ).toBe('a phishing campaign results')
    expect(computed.getAudienceText.call({ isFromUserGroups: false, isFromPhishingCampaign: false, items })).toBe('')

    expect(computed.getBodyValue.call({ items })).toBe('2 users')
    expect(computed.getBodyValue.call({ items: {} })).toBe('0 user')
    expect(computed.getTargetGroups.call({ items })).toEqual([{ id: 1 }, { id: 2 }])
    expect(computed.getTargetGroups.call({ items: {} })).toEqual([])

    const ctx = { isTargetGroupsModalVisible: false, $emit: jest.fn() }
    methods.handleViewTargetGroupsClick.call(ctx)
    expect(ctx.isTargetGroupsModalVisible).toBe(true)
    methods.handleCloseTargetGroupsModal.call(ctx)
    expect(ctx.isTargetGroupsModalVisible).toBe(false)
    methods.handleAudienceClick.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('audienceClick')
  })
})
