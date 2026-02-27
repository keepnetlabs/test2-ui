import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import CampaignManagerAddOrEditModal from '@/components/CampaignManager/CampaignManagerAddOrEditModal.vue'
import { SCENARIO_DISTRIBUTION, SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
import labels from '@/model/constants/labels'
import { getCampaignManager } from '@/api/phishingsimulator'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

jest.mock('@/api/phishingsimulator', () => ({
  getCampaignManager: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          name: 'Test Campaign',
          categoryDistributionType: 2,
          targetGroups: [{ text: 'Group 1', value: '123' }],
          sendUserPreferredLanguage: 1,
          clickedUserGroupResourceId: 'abc'
        }
      }
    })
  )
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() =>
    Promise.resolve([
      { name: 'English', isoFriendlyName: 'en', description: 'desc', resourceId: '1' }
    ])
  )
}))

const localVue = createLocalVue()
localVue.use(Vuex)

describe('CampaignManagerAddOrEditModal.vue - Extra Lifecycle and Computed Props', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        common: {
          namespaced: true,
          actions: {
            createSnackBar: jest.fn()
          }
        }
      }
    })
    jest.clearAllMocks()
  })

  const mountComponent = (propsData = {}, data = {}, computed = {}) => {
    const wrapper = shallowMount(CampaignManagerAddOrEditModal, {
      localVue,
      store,
      propsData,
      data() {
        return {
          ...data
        }
      },
      computed: {
        ...computed
      },
      mocks: {
        $store: store,
        $moment: () => ({ format: () => '2025-01-01' })
      },
      methods: {
        getFormValues: () => ({})
      },
      stubs: {
        CampaignManagerCampaignInfo: {
          template: '<div />',
          data() { return { formData: {} } }
        },
        CampaignManagerDeliverySettings: {
          template: '<div />',
          data() { return { inputScheduleFormData: { useTargetUserTimeZone: false } } }
        },
        CampaignManagerPhishingScenarios: true,
        CampaignManagerTargetAudience: true
      }
    })
    
    // Default ref mocks
    wrapper.vm.$refs = {
      refCampaignManagerDeliverySettings: {
        inputScheduleFormData: { useTargetUserTimeZone: false }
      },
      refCampaignManagerTargetAudience: {
        $refs: {
          refCampaignManagerTargetGroup: {
            $refs: {
              refGroupTable: {
                callForData: jest.fn(),
                $refs: {
                  refTable: {
                    getSelectedObjectAndSelectRowsByRowKey: jest.fn()
                  }
                }
              }
            }
          }
        }
      }
    }
    
    return wrapper
  }

  describe('Lifecycle Hooks', () => {
    it('created calls for languages and data if selectedRow is provided', async () => {
      const wrapper = mountComponent({ selectedRow: { resourceId: '123' } })
      expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
      expect(getCampaignManager).toHaveBeenCalledWith('123')
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.languageOptions.length).toBe(1)
      // Checks api mapping
      expect(wrapper.vm.selectedRowFormData.name).toBe('Test Campaign')
      expect(wrapper.vm.defaultTargetGroupResourceIds).toEqual(['123'])
    })

    it('mounted fetches initialFormValues', () => {
      // requires ref
      const wrapper = shallowMount(CampaignManagerAddOrEditModal, {
        localVue,
        store,
        stubs: {
          CampaignManagerCampaignInfo: {
            template: '<div></div>',
            data: () => ({ formData: { name: 'Initial Name' } })
          },
          AppModal: true,
          VStepper: true
        }
      })
      
      // Need to mock $refs for mounted
      wrapper.vm.$refs.refCampaignManagerCampaignInfo = { formData: { name: 'Initial Name' } }
      wrapper.vm.getFormValues = () => ({ name: 'Initial Name' })
      wrapper.vm.$options.mounted[0].call(wrapper.vm)
      expect(wrapper.vm.initialFormValues).toEqual({ name: 'Initial Name' })
    })
  })

  describe('Watchers', () => {
    it('watch step=4 calls callForEmailDeliveries', async () => {
      const callForEmailDeliveriesMock = jest.fn()
      const wrapper = mountComponent()
      wrapper.vm.$refs.refCampaignManagerDeliverySettings = {
        callForEmailDeliveries: callForEmailDeliveriesMock,
        inputScheduleFormData: { scheduledDate: null }
      }
      
      wrapper.vm.step = 4
      await wrapper.vm.$nextTick()
      
      expect(callForEmailDeliveriesMock).toHaveBeenCalled()
      expect(wrapper.vm.$refs.refCampaignManagerDeliverySettings.inputScheduleFormData.scheduledDate).toBeDefined()
      expect(typeof wrapper.vm.$refs.refCampaignManagerDeliverySettings.inputScheduleFormData.scheduledDate).toBe('string')
    })

    it('watch selectedPhishingScenarios updates isPhishingScenariosValid', async () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isPhishingScenariosValid).toBe(true)
      
      wrapper.vm.selectedPhishingScenarios = [{}]
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isPhishingScenariosValid).toBe(true)
      
      wrapper.vm.selectedPhishingScenarios = []
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isPhishingScenariosValid).toBe(false)
    })
  })

  describe('Computed Properties', () => {
    it('getTitle handles new and edit states', () => {
      const editWrapper = mountComponent({ isEdit: true })
      expect(editWrapper.vm.getTitle).toBe(`${labels.Edit} Phishing Campaign`)
      
      const newWrapper = mountComponent({ isEdit: false })
      expect(newWrapper.vm.getTitle).toBe(`${labels.New} Phishing Campaign`)
    })

    it('hasEmailTemplateMultipleLanguage evaluates languages properly', () => {
      const wrapper = mountComponent({}, {
        selectedPhishingScenarios: [{ languageTypeCode: ['en', 'tr'] }]
      })
      expect(wrapper.vm.hasEmailTemplateMultipleLanguage).toBe(true)
    })

    it('isSendUserPreferredLanguage evaluates string match', () => {
      const wrapper = mountComponent({}, { sendUserPreferredLanguage: '1' })
      expect(wrapper.vm.isSendUserPreferredLanguage).toBe(true)
    })

    it('isFrequencyDisabled is true if preferred language or multi language templates are set', () => {
      const wrapper = mountComponent({}, { sendUserPreferredLanguage: '1', selectedPhishingScenarios: [] })
      expect(wrapper.vm.isFrequencyDisabled).toBe(true)
    })

    it('frequencyDisabledText provides correct strings', () => {
      const w1 = mountComponent({}, { sendUserPreferredLanguage: '1', selectedPhishingScenarios: [{ languageTypeCode: ['en', 'tr'] }] })
      expect(w1.vm.frequencyDisabledText).toBe('Both')
      
      const w2 = mountComponent({}, { sendUserPreferredLanguage: '1', selectedPhishingScenarios: [] })
      expect(w2.vm.frequencyDisabledText).toBe("When sending in the target users' preferred language, only the 'One Time' frequency is available.")
      
      const w3 = mountComponent({}, { sendUserPreferredLanguage: '0', selectedPhishingScenarios: [{ languageTypeCode: ['en', 'tr'] }] })
      expect(w3.vm.frequencyDisabledText).toBe("When sending multilingual campaigns to target users, only the 'One Time' frequency is available.")
    })

    it('getIsPhishingScenariosValid evaluates validation flags during step 2', () => {
      const wrapper = mountComponent({}, { 
        isSecondNextClicked: true, 
        scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY,
        selectedPhishingScenarios: []
      })
      expect(wrapper.vm.getIsPhishingScenariosValid).toBe(false)

      const wrapper2 = mountComponent({}, { 
        isSecondNextClicked: true, 
        scenarioDistribution: 2,
        totalPhishingScenariosCount: 5
      })
      expect(wrapper2.vm.getIsPhishingScenariosValid).toBe(true)
    })

    it('isMFAScenarioSelected checks scenarios or items depending on distribution', () => {
      const wrapper = mountComponent({}, {
        scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY,
        selectedPhishingScenarios: [{ method: 'MFA' }]
      })
      expect(wrapper.vm.isMFAScenarioSelected).toBe(true)

      const wrapper2 = mountComponent({}, {
        scenarioDistribution: 2, // dynamic
        phishingScenarioItems: [{ method: 'MFA' }]
      })
      expect(wrapper2.vm.isMFAScenarioSelected).toBe(true)
    })

    it('getTotalTargetUserCountForTargetAudience pulls mapped when userCount is empty', () => {
      const wrapper = mountComponent({}, {
        userCountDetailResponse: {},
        selectedTargetGroupsMapped: [{ extraDatas: { userCount: 15 } }, { extraDatas: { userCount: 10 } }]
      })
      expect(wrapper.vm.getTotalTargetUserCountForTargetAudience).toBe(25)
    })

    it('getSaveButtonText resolves schedule states accurately', () => {
      const wrapper = mountComponent({}, { step: 5, scheduleInfoResponse: { isStarting: true } })
      wrapper.vm.$refs.refCampaignManagerDeliverySettings = {
        inputScheduleFormData: { scheduleTypeId: 1 } // Not Save for Later
      }
      expect(CampaignManagerAddOrEditModal.computed.getSaveText.call(wrapper.vm)).toBe(labels.Launch)

      wrapper.vm.$refs.refCampaignManagerDeliverySettings.inputScheduleFormData.scheduleTypeId = SCHEDULE_TYPES.SAVE_FOR_LATER
      expect(CampaignManagerAddOrEditModal.computed.getSaveText.call(wrapper.vm)).toBe(labels.Save)
    })
  })
})
