import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummary from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummary'
import { SCENARIO_DISTRIBUTION_TEXTS } from '@/components/CampaignManager/utils'

jest.mock('@/api/phishingsimulator', () => ({
  getCampaignJobSummary: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getCampaignJobSummaryTargetGroups: jest.fn(() =>
    Promise.resolve({ data: { data: { groups: [] } } })
  )
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() =>
    Promise.resolve([
      {
        isoFriendlyName: 'English',
        name: 'English',
        description: 'en',
        resourceId: 'lang-1'
      },
      {
        isoFriendlyName: 'Turkish',
        name: 'Turkish',
        description: 'tr',
        resourceId: 'lang-2'
      }
    ])
  )
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    createRandomCryptStringNumber: jest.fn(() => 'abc')
  }
})

describe('CampaignManagerReportSummary.vue (extra branch coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CampaignManagerReportSummary, {
      propsData: {
        id: 'campaign-1',
        instanceGroup: 'ig-1',
        phishingScenarioName: 'Scenario X',
        multipleType: [],
        apiResponse: {},
        formDetails: {
          methodTypes: [{ value: '1', text: 'Click-Only' }, { value: '2', text: 'Data Submission' }],
          difficultyTypes: [{ value: '1', text: 'Easy' }, { value: '2', text: 'Medium' }]
        },
        ...propsData
      },
      mocks: {
        $store: {
          dispatch: jest.fn()
        }
      },
      stubs: {
        CampaignManagerReportSummaryHeader: true,
        CampaignManagerReportSummaryCards: true,
        CampaignManagerReportSummaryCampaignInfo: true,
        CampaignManagerReportEmailDelivery: true,
        CampaignManagerReportSummaryScenarioInfo: true,
        CampaignManagerReportSummaryCategory: true,
        CampaignManagerReportSummaryPhishingEmail: true,
        CampaignManagerReportSummaryLandingPage: true,
        CampaignManagerReportSummaryTraining: true,
        ElTabs: true,
        ElTabPane: true,
        VTooltip: true
      }
    })

  it('getEmailDeliveryData covers saved-later and scheduled-date branches', () => {
    const wrapper = createWrapper()
    wrapper.vm.campaignSummary = {
      campaignInfo: { scheduleTypeId: 2, emailDeliveryDuration: 3 }
    }
    expect(wrapper.vm.getEmailDeliveryData['Delivery Start - End']).toBe('Saved for later')

    wrapper.vm.campaignSummary = {
      campaignInfo: { scheduledDate: '2026-02-01', frequency: 1, emailDeliveryDuration: 2 }
    }
    expect(wrapper.vm.getEmailDeliveryData['Scheduled Date']).toBe('2026-02-01')
  })

  it('getEmailDeliveryData returns start-end when delivery dates exist', () => {
    const wrapper = createWrapper()
    wrapper.vm.campaignSummary = {
      campaignInfo: {
        emailDeliveryStartDate: '2026-02-01',
        emailDeliveryEndDate: '2026-02-03',
        emailDeliveryDuration: 2
      }
    }
    expect(wrapper.vm.getEmailDeliveryData['Delivery Start - End']).toBe(
      '2026-02-01 - 2026-02-03'
    )
  })

  it('getChartData returns empty array when all scenario stats are zero', () => {
    const wrapper = createWrapper()
    wrapper.vm.campaignSummary = {
      scenarioStats: {
        openedEmail: 0,
        clickedEmail: 0,
        submittedEmail: 0,
        noResponseEmail: 0,
        notDelivered: 0,
        attachmentOpenedEmail: 0,
        reportedEmail: 0,
        mfa: 0
      }
    }
    expect(wrapper.vm.getChartData).toEqual([])
    expect(wrapper.vm.getCardsData).toEqual({})
  })

  it('isCategoryBasedDistribution is false when missing and true when value exists', () => {
    const wrapper = createWrapper()
    wrapper.vm.campaignSummary = {
      campaignInfo: {}
    }
    expect(wrapper.vm.isCategoryBasedDistribution).toBe(false)

    wrapper.vm.campaignSummary = {
      campaignInfo: { categoryDistributionType: SCENARIO_DISTRIBUTION_TEXTS[0] }
    }
    expect(wrapper.vm.isCategoryBasedDistribution).toBe(true)
  })

  it('getScenarioInfoItems returns fallback values when scenariosGeneralInfo is empty', () => {
    const wrapper = createWrapper()
    wrapper.vm.campaignSummary = {}
    expect(wrapper.vm.getScenarioInfoItems).toEqual({
      NumberOfCategories: 15,
      Method: 'Click-Only, Data Submission, Attachment, MFA',
      Languages: ['EN', 'TR', 'DE', 'FR'],
      Difficulty: 'Easy, Medium, Hard'
    })
  })

  it('getScenarioInfoItems omits enrollment notification language when active scenario has no training', () => {
    const wrapper = createWrapper()
    wrapper.vm.campaignSummary = {
      scenariosGeneralInfo: {
        categories: ['General'],
        methodTypeId: 1,
        languageShortCodes: ['en'],
        difficultyTypeIds: [1]
      },
      scenarios: [
        {
          scenarioInfo: { name: 'S1', languageShortCode: 'en' },
          emailTemplateInfo: { languageShortCode: 'en' },
          sendTemplatesInPreferredLanguage: true
        }
      ]
    }

    expect(wrapper.vm.getScenarioInfoItems['Enrollment Notification Language']).toBeUndefined()
  })

  it('getScenarioInfoItems shows company language for single scenario root false value', () => {
    const wrapper = createWrapper()
    wrapper.vm.languageOptions = [{ languageShortCode: 'en', text: 'English' }]
    wrapper.vm.campaignSummary = {
      scenariosGeneralInfo: {
        categories: ['General'],
        methodTypeId: 1,
        languageShortCodes: ['en'],
        difficultyTypeIds: [1]
      },
      scenarios: [
        {
          scenarioInfo: { name: 'S1', languageShortCode: 'en' },
          emailTemplateInfo: { languageShortCode: 'en' },
          trainingInfo: { name: 'T1' },
          sendTemplatesInPreferredLanguage: false
        }
      ]
    }

    expect(wrapper.vm.getScenarioInfoItems['Enrollment Notification Language']).toBe(
      'Company Language'
    )
    expect(wrapper.vm.getScenarioInfoItems.Languages).toEqual(['English'])
  })

  it('getEmailTemplateData maps multi-language emailTemplateInfos branch', () => {
    const wrapper = createWrapper()
    wrapper.vm.languageOptions = [
      { languageShortCode: 'en', text: 'English' },
      { languageShortCode: 'tr', text: 'Turkish' }
    ]
    wrapper.vm.campaignSummary = {
      scenarios: [
        {
          scenarioInfo: { name: 'S1', languageShortCode: 'en' },
          emailTemplateInfo: { resourceId: 'e1', name: 'Email 1' },
          emailTemplateInfos: [
            {
              languageTypeResourceId: 'l1',
              languageShortCode: 'en',
              fromName: 'A',
              fromAddress: 'a@x.com',
              subject: 'Sub',
              ccAddresses: [],
              template: 'tpl'
            },
            {
              languageTypeResourceId: 'l2',
              languageShortCode: 'tr',
              fromName: 'B',
              fromAddress: 'b@x.com',
              subject: 'Konu',
              ccAddresses: [],
              template: 'tpl2'
            }
          ]
        }
      ]
    }
    wrapper.vm.customKeys = ['k1']
    wrapper.vm.selectedScenarioTab = 'k1'
    wrapper.vm.activeScenarioIndex = 0

    const payload = wrapper.vm.getEmailTemplateData
    expect(payload.languageShortCode).toEqual(['English', 'Turkish'])
    expect(payload.languages).toHaveLength(2)
  })

  it('getCampaignSummaryItems prefers multi-language emailTemplateInfos over scenario language', () => {
    const wrapper = createWrapper()
    wrapper.vm.languageOptions = [
      { languageShortCode: 'en', text: 'English' },
      { languageShortCode: 'tr', text: 'Turkish' },
      { languageShortCode: 'de', text: 'German' },
      { languageShortCode: 'fr', text: 'French' },
      { languageShortCode: 'es', text: 'Spanish' }
    ]
    wrapper.vm.campaignSummary = {
      campaignInfo: {
        totalTargetUserCount: 120
      },
      settings: {
        duration: 30
      },
      scenarios: [
        {
          scenarioInfo: { name: 'S1', languageShortCode: 'en' },
          emailTemplateInfos: [
            { languageShortCode: 'en' },
            { languageShortCode: 'tr' },
            { languageShortCode: 'de' }
          ]
        },
        {
          scenarioInfo: { name: 'S2', languageShortCode: 'fr' },
          emailTemplateInfos: [
            { languageShortCode: 'fr' },
            { languageShortCode: 'es' }
          ]
        }
      ]
    }

    expect(wrapper.vm.getCampaignSummaryItems.Languages).toEqual([
      'English',
      'Turkish',
      'German',
      'French',
      'Spanish'
    ])
  })

  it('setCampaignSummary creates custom keys once and preserves on subsequent calls', async () => {
    const wrapper = createWrapper()
    const response = {
      data: {
        data: {
          phishingCampaignName: 'Campaign A',
          scenarios: [
            {
              scenarioInfo: { name: 'S1' },
              emailTemplateInfo: { languageShortCode: 'en' },
              trainingInfo: { name: 'T1', languageList: [{ languageShortCode: 'en' }] },
              sendTemplatesInPreferredLanguage: true,
              enrollmentInfo: { enrollmentId: 'e1', sendTemplatesInPreferredLanguage: true }
            }
          ]
        }
      }
    }

    wrapper.vm.languageOptions = [{ languageShortCode: 'en', text: 'English' }]
    wrapper.vm.setCampaignSummary(response)
    await wrapper.vm.$nextTick()
    const firstKeys = [...wrapper.vm.customKeys]
    expect(firstKeys).toHaveLength(1)
    expect(wrapper.vm.selectedScenarioTab).toBe(firstKeys[0])
    expect(wrapper.vm.campaignSummary.scenarios[0].trainingInfo.sendTemplatesInPreferredLanguage).toBe(
      true
    )

    wrapper.vm.setCampaignSummary(response)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.customKeys).toEqual(firstKeys)
  })

  it('activeScenarioEnrollmentNotificationLanguage prioritizes root scenario flag over trainingInfo fallback', () => {
    const wrapper = createWrapper()
    wrapper.vm.campaignSummary = {
      scenarios: [
        {
          scenarioInfo: { name: 'S1' },
          emailTemplateInfo: { languageShortCode: 'en' },
          trainingInfo: { name: 'T1', sendTemplatesInPreferredLanguage: true },
          sendTemplatesInPreferredLanguage: false
        }
      ]
    }

    expect(wrapper.vm.activeScenarioEnrollmentNotificationLanguage).toBe('Company Language')
  })

  it('getScenarioInfoItems uses active scenario notification language when scenario tabs differ', () => {
    const wrapper = createWrapper()
    wrapper.vm.languageOptions = [
      { languageShortCode: 'en', text: 'English' },
      { languageShortCode: 'tr', text: 'Turkish' }
    ]
    wrapper.vm.campaignSummary = {
      scenarios: [
        {
          scenarioInfo: {
            name: 'S1',
            category: 'Finance',
            methodTypeId: 1,
            difficultyTypeId: 1,
            languageShortCode: 'en'
          },
          emailTemplateInfo: { languageShortCode: 'en' },
          trainingInfo: { name: 'T1' },
          sendTemplatesInPreferredLanguage: false
        },
        {
          scenarioInfo: {
            name: 'S2',
            category: 'HR',
            methodTypeId: 2,
            difficultyTypeId: 2,
            languageShortCode: 'tr'
          },
          emailTemplateInfo: { languageShortCode: 'tr' },
          trainingInfo: { name: 'T2' },
          sendTemplatesInPreferredLanguage: true
        }
      ]
    }

    wrapper.vm.activeScenarioIndex = 0
    expect(wrapper.vm.getScenarioInfoItems['Enrollment Notification Language']).toBe(
      'Company Language'
    )
    expect(wrapper.vm.getScenarioInfoItems.Category).toBe('Finance')

    wrapper.vm.activeScenarioIndex = 1
    expect(wrapper.vm.getScenarioInfoItems['Enrollment Notification Language']).toBe(
      'Preferred Language'
    )
    expect(wrapper.vm.getScenarioInfoItems.Category).toBe('HR')
    expect(wrapper.vm.getScenarioInfoItems.Languages).toEqual(['Turkish'])
  })

  it('setScenarioDetail updates active scenario index', () => {
    const wrapper = createWrapper()
    wrapper.vm.setScenarioDetail({ index: 4 })
    expect(wrapper.vm.activeScenarioIndex).toBe(4)
  })
})
