/**
 * Callback Summary SMS / metin şablonu kartı `formData.resourceId` (immediate watch)
 * → `SmishingService.getTextMessageTemplate(resourceId)` + zorluk / kategori etiketleri.
 */
jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    getTextMessageTemplate: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSummaryTextTemplate from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryTextTemplate.vue'
import SmishingService from '@/api/smishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Callback Report Summary text template fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    SmishingService.getTextMessageTemplate.mockResolvedValue({
      data: {
        data: {
          template: 'Callback SMS body',
          difficultyResourceId: 'diff-1',
          categoryResourceId: 'cat-1'
        }
      }
    })
  })

  it('loads template via getTextMessageTemplate and maps difficulty + method labels', async () => {
    const wrapper = mount(CampaignManagerReportSummaryTextTemplate, {
      localVue,
      vuetify,
      propsData: {
        isFetchingSummary: false,
        formData: {
          resourceId: 'cb-text-tpl-1',
          name: 'Callback flow',
          languageShortCode: 'en'
        },
        difficulties: [{ value: 'diff-1', text: 'Easy' }],
        methods: [{ value: 'cat-1', text: 'SMS' }]
      },
      stubs: {
        CampaignManagerSummaryCard: {
          name: 'CampaignManagerSummaryCard',
          template: '<div class="summary-card"><slot name="body" /></div>'
        },
        Badge: true,
        VBtn: true,
        VIcon: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(SmishingService.getTextMessageTemplate).toHaveBeenCalledWith('cb-text-tpl-1')
    expect(wrapper.vm.textTemplate).toBe('Callback SMS body')
    expect(wrapper.vm.difficulty).toBe('Easy')
    expect(wrapper.vm.method).toBe('SMS')
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
