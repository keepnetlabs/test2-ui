import { shallowMount } from '@vue/test-utils'
import SmishingService from '@/api/smishing'
import CampaignManagerPreview from '@/components/SmishingCampaignManager/CampaignManagerPreview.vue'
import CommonCampaignManagerSmishingPreviewDialog from '@/components/Common/CampaignManager/CommonCampaignManagerSmishingPreviewDialog.vue'

jest.mock('@/api/smishing', () => ({
  previewSmishingCampaign: jest.fn().mockResolvedValue({
    data: {
      data: {
        smishingScenarioPreviewList: [
          {
            name: 'Scenario 1',
            methodTypeId: 1,
            textTemplate: { template: 'Hello', name: 'T1' },
            landingPageTemplate: {
              name: 'LP1',
              description: 'Desc',
              urlTemplate: 'http://x.com',
              landings: []
            }
          }
        ]
      }
    }
  })
}))

describe('CommonCampaignManagerSmishingPreviewDialog (Smishing campaign preview)', () => {
  beforeEach(() => {
    SmishingService.previewSmishingCampaign.mockClear()
  })

  const createWrapper = (propsData = {}) => {
    return shallowMount(CommonCampaignManagerSmishingPreviewDialog, {
      propsData: {
        status: true,
        selectedRow: { resourceId: 'r1', name: 'Campaign 1' },
        ...propsData
      },
      stubs: {
        CommonCampaignManagerPreviewFrame: {
          name: 'CommonCampaignManagerPreviewFrame',
          template: '<div><slot /></div>',
          methods: {
            handleClose() {
              this.$emit('on-close')
            }
          }
        },
        ElTabs: true,
        ElTabPane: true,
        TabsWithMfaSettings: true,
        SmishingPreviewSkeleton: true
      }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('CommonCampaignManagerSmishingPreviewDialog')
  })

  it('calls previewSmishingCampaign with selectedRow.resourceId', async () => {
    createWrapper({ selectedRow: { resourceId: 'campaign-res-42', name: 'C' } })
    await Promise.resolve()
    await Promise.resolve()
    expect(SmishingService.previewSmishingCampaign).toHaveBeenCalledTimes(1)
    expect(SmishingService.previewSmishingCampaign).toHaveBeenCalledWith('campaign-res-42')
  })

  describe('getTitle', () => {
    it('returns Smishing Campaign Preview', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getTitle).toBe('Smishing Campaign Preview')
    })
  })

  describe('getSubtitle', () => {
    it('returns selectedRow name', () => {
      const wrapper = createWrapper({
        selectedRow: { resourceId: 'r1', name: 'My Campaign' }
      })
      expect(wrapper.vm.getSubtitle).toBe('My Campaign')
    })

    it('returns empty when selectedRow has no name', () => {
      const wrapper = createWrapper({ selectedRow: {} })
      expect(wrapper.vm.getSubtitle).toBe('')
    })
  })

  describe('setActiveScenario', () => {
    it('sets isMethodMfa true when methodTypeId is 4', () => {
      const wrapper = createWrapper()
      wrapper.vm.setActiveScenario({ methodTypeId: 4 })
      expect(wrapper.vm.isMethodMfa).toBe(true)
    })

    it('sets isMethodMfa true when methodTypeId is string "4"', () => {
      const wrapper = createWrapper()
      wrapper.vm.setActiveScenario({ methodTypeId: '4' })
      expect(wrapper.vm.isMethodMfa).toBe(true)
    })

    it('sets isMethodMfa false when methodTypeId is not 4', () => {
      const wrapper = createWrapper()
      wrapper.vm.setActiveScenario({ methodTypeId: 1 })
      expect(wrapper.vm.isMethodMfa).toBe(false)
    })

    it('sets textTemplate from phishingScenarioPreviewDto', () => {
      const wrapper = createWrapper()
      wrapper.vm.setActiveScenario({
        textTemplate: { template: 'Test message' }
      })
      expect(wrapper.vm.textTemplate).toBe('Test message')
    })

    it('sets textMessageTemplateParams.name from textTemplate', () => {
      const wrapper = createWrapper()
      wrapper.vm.setActiveScenario({
        textTemplate: { template: 'Body', name: 'Template name' }
      })
      expect(wrapper.vm.textMessageTemplateParams.name).toBe('Template name')
    })

    it('maps landing page template into landingPageParams and landingPageTemplates', () => {
      const wrapper = createWrapper()
      wrapper.vm.setActiveScenario({
        methodTypeId: 1,
        landingPageTemplate: {
          name: 'LP',
          description: 'D',
          urlTemplate: 'https://lp.example',
          landingPages: [{ id: 1 }],
          isAssistedByAI: true
        }
      })
      expect(wrapper.vm.landingPageTemplates).toEqual([{ id: 1 }])
      expect(wrapper.vm.landingPageParams).toMatchObject({
        name: 'LP',
        description: 'D',
        urlTemplate: 'https://lp.example',
        isAssistedByAI: true
      })
    })

    it('treats isAssistedbyAI as alias for isAssistedByAI on landing template', () => {
      const wrapper = createWrapper()
      wrapper.vm.setActiveScenario({
        landingPageTemplate: {
          name: 'LP',
          description: '',
          urlTemplate: '',
          landingPages: [],
          isAssistedbyAI: true
        }
      })
      expect(wrapper.vm.landingPageParams.isAssistedByAI).toBe(true)
    })

    it('maps mfaTextTemplate and mfaSmsSenderNumber onto landingPageParams', () => {
      const wrapper = createWrapper()
      wrapper.vm.setActiveScenario({
        mfaTextTemplate: 'MFA body',
        mfaSmsSenderNumber: '+9000',
        landingPageTemplate: {
          name: 'LP',
          description: '',
          urlTemplate: '',
          landingPages: []
        }
      })
      expect(wrapper.vm.landingPageParams.mfaTextTemplate).toBe('MFA body')
      expect(wrapper.vm.landingPageParams.mfaSmsSenderNumber).toBe('+9000')
    })

    it('defaults landing page lists and names when landingPageTemplate is absent', () => {
      const wrapper = createWrapper()
      wrapper.vm.setActiveScenario({})
      expect(wrapper.vm.landingPageTemplates).toEqual([])
      expect(wrapper.vm.landingPageParams).toMatchObject({
        name: '',
        description: '',
        urlTemplate: ''
      })
    })
  })

  describe('setLoading', () => {
    it('toggles isLoading', () => {
      const wrapper = createWrapper()
      wrapper.vm.setLoading(true)
      expect(wrapper.vm.isLoading).toBe(true)
      wrapper.vm.setLoading(false)
      expect(wrapper.vm.isLoading).toBe(false)
    })
  })

  describe('handleClose', () => {
    it('emits on-close', () => {
      const wrapper = createWrapper()
      const frame = wrapper.findComponent({ name: 'CommonCampaignManagerPreviewFrame' })
      frame.vm.handleClose()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })

  describe('handleEditCampaign', () => {
    it('emits on-edit-campaign with selectedRow', () => {
      const selectedRow = { resourceId: 'r1', name: 'Campaign 1' }
      const wrapper = createWrapper({ selectedRow })
      wrapper.vm.handleEditCampaign()
      expect(wrapper.emitted('on-edit-campaign')).toEqual([[selectedRow]])
    })
  })

  describe('callForScenarioDetail', () => {
    it('updates active scenario from phishingScenarios by tab index', async () => {
      const wrapper = createWrapper()
      await Promise.resolve()
      await wrapper.vm.$nextTick()

      wrapper.vm.phishingScenarios = [
        { name: 'A', methodTypeId: 1, textTemplate: { template: 'a', name: 'na' } },
        { name: 'B', methodTypeId: 4, textTemplate: { template: 'b', name: 'nb' } }
      ]
      wrapper.vm.callForScenarioDetail({ index: 1 })
      expect(wrapper.vm.isMethodMfa).toBe(true)
      expect(wrapper.vm.textTemplate).toBe('b')
    })

    it('uses index 0 for the first scenario', async () => {
      const wrapper = createWrapper()
      await Promise.resolve()
      await wrapper.vm.$nextTick()
      wrapper.vm.phishingScenarios = [
        { name: 'First', methodTypeId: 1, textTemplate: { template: 'first-text', name: 'n' } }
      ]
      wrapper.vm.callForScenarioDetail({ index: 0 })
      expect(wrapper.vm.textTemplate).toBe('first-text')
      expect(wrapper.vm.isMethodMfa).toBe(false)
    })
  })

  describe('callForData loading lifecycle', () => {
    it('clears isLoading after the finally timer (500ms)', async () => {
      jest.useFakeTimers()
      try {
        const wrapper = createWrapper()
        await Promise.resolve()
        await Promise.resolve()
        expect(wrapper.vm.isLoading).toBe(true)
        jest.advanceTimersByTime(500)
        expect(wrapper.vm.isLoading).toBe(false)
      } finally {
        jest.useRealTimers()
      }
    })
  })
})

describe('CampaignManagerPreview.vue (wrapper)', () => {
  it('passes props to CommonCampaignManagerSmishingPreviewDialog and forwards events', () => {
    const selectedRow = { resourceId: 'rid', name: 'N' }
    const wrapper = shallowMount(CampaignManagerPreview, {
      propsData: { status: true, selectedRow },
      stubs: { CommonCampaignManagerSmishingPreviewDialog: true }
    })
    expect(wrapper.vm.$options.name).toBe('CampaignManagerPreview')
    const child = wrapper.findComponent({ name: 'CommonCampaignManagerSmishingPreviewDialog' })
    expect(child.props('status')).toBe(true)
    expect(child.props('selectedRow')).toEqual(selectedRow)

    child.vm.$emit('on-close')
    expect(wrapper.emitted('on-close')).toBeTruthy()

    child.vm.$emit('on-edit-campaign', selectedRow)
    expect(wrapper.emitted('on-edit-campaign')).toEqual([[selectedRow]])
  })

  it('passes status false to child without coercing', () => {
    const wrapper = shallowMount(CampaignManagerPreview, {
      propsData: { status: false, selectedRow: { resourceId: 'r' } },
      stubs: { CommonCampaignManagerSmishingPreviewDialog: true }
    })
    expect(wrapper.findComponent({ name: 'CommonCampaignManagerSmishingPreviewDialog' }).props('status')).toBe(
      false
    )
  })
})
