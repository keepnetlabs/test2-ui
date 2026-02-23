import { shallowMount } from '@vue/test-utils'
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

  it('formats singular user text and keeps only visible item keys', () => {
    const items = {
      'Target Users': { show: true, value: 1 },
      'Target Groups': { show: true, value: [{ id: 1 }] },
      HiddenA: { show: false, value: 'x' },
      HiddenB: { show: false, value: 'y' }
    }

    expect(computed.getBodyValue.call({ items })).toBe('1 user')
    expect(Object.keys(computed.getItems.call({ items }))).toEqual([
      'Target Users',
      'Target Groups'
    ])
  })

  it('returns default values for missing group list and unknown type', () => {
    const items = { 'Target Users': { value: 0 } }
    expect(computed.getTargetGroups.call({ items })).toEqual([])
    expect(
      computed.getAudienceText.call({
        isFromUserGroups: false,
        isFromPhishingCampaign: false,
        items
      })
    ).toBe('')
  })

  it('getCardTitle prioritizes survey label over training type', () => {
    const result = computed.getCardTitle.call({
      isSurvey: true,
      trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER
    })
    expect(result).toContain('Survey')
  })

  it('getItems returns only visible keys without mutating source object', () => {
    const items = {
      Alpha: { show: true, value: 'A' },
      Beta: { show: false, value: 'B' }
    }

    const result = computed.getItems.call({ items })

    expect(result).toEqual({ Alpha: 'A' })
    expect(items).toEqual({
      Alpha: { show: true, value: 'A' },
      Beta: { show: false, value: 'B' }
    })
  })

  it('getTargetGroups and getBodyValue handle nullish values safely', () => {
    const items = {
      'Target Users': { value: null },
      'Target Groups': { value: null }
    }

    expect(computed.getBodyValue.call({ items })).toBe('0 user')
    expect(computed.getTargetGroups.call({ items })).toEqual([])
  })

  it('toggles target groups modal from template click', async () => {
    const wrapper = shallowMount(TrainingReportSummaryTrainingInfo, {
      propsData: {
        isLoading: false,
        isTestTraining: false,
        items: {
          'Target Users': { show: true, value: 2 },
          'Target Groups': { show: true, value: [{ id: 1 }, { id: 2 }] },
          targetGroupCount: { show: true, value: 2 }
        }
      },
      stubs: {
        Fragment: { template: '<div><slot /></div>' },
        Badge: true,
        CommonReportViewTargetGroupsModal: true,
        CampaignManagerSummaryCard: {
          template:
            '<div><slot name="TargetGroups" /><slot name="header-right" /><slot name="TargetUsers" :props="{ key: \'target users\' }" /></div>'
        },
        'v-btn': { template: '<button><slot /></button>' },
        'v-icon': true
      }
    })

    expect(wrapper.vm.isTargetGroupsModalVisible).toBe(false)
    expect(wrapper.findComponent({ name: 'CommonReportViewTargetGroupsModal' }).exists()).toBe(false)

    await wrapper.find('.cursor-pointer').trigger('click')
    expect(wrapper.vm.isTargetGroupsModalVisible).toBe(true)

    wrapper.vm.handleCloseTargetGroupsModal()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isTargetGroupsModalVisible).toBe(false)
  })

  it('renders test badge slot only when isTestTraining is true', () => {
    const mountWithFlag = (isTestTraining) =>
      shallowMount(TrainingReportSummaryTrainingInfo, {
        propsData: {
          isTestTraining,
          items: {
            'Target Users': { show: true, value: 1 },
            'Target Groups': { show: true, value: [] }
          }
        },
        stubs: {
          Fragment: { template: '<div><slot /></div>' },
          CommonReportViewTargetGroupsModal: true,
          Badge: { template: '<span class="badge-stub">badge</span>' },
          CampaignManagerSummaryCard: {
            template: '<div><slot name="header-right" /></div>'
          },
          'v-btn': true
        }
      })

    const trueWrapper = mountWithFlag(true)
    expect(trueWrapper.find('.badge-stub').exists()).toBe(true)

    const falseWrapper = mountWithFlag(false)
    expect(falseWrapper.find('.badge-stub').exists()).toBe(false)
  })
})
