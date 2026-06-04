/**
 * Callback Summary e-posta kartı `created` / `formData.resourceId` izleme
 * → `CallbackService.getEmailTemplate(resourceId)` ile şablon ve meta alanları.
 */
jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getEmailTemplate: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSummaryEmail from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryEmail.vue'
import CallbackService from '@/api/callback'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Callback Report Summary email template created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    CallbackService.getEmailTemplate.mockResolvedValue({
      data: {
        data: {
          template: '<p>Callback body</p>',
          fromName: 'Support',
          fromAddress: 'support@example.com',
          subject: 'Callback subject',
          name: 'Callback template'
        }
      }
    })
  })

  it('loads email template via getEmailTemplate when formData has resourceId', async () => {
    const wrapper = mount(CampaignManagerReportSummaryEmail, {
      localVue,
      vuetify,
      propsData: {
        isFetchingSummary: false,
        formData: {
          resourceId: 'cb-email-tpl-1',
          attachment: null
        }
      },
      stubs: {
        EmailTemplatePreview: true,
        CampaignManagerSummaryCard: {
          name: 'CampaignManagerSummaryCard',
          template: '<div class="summary-card"><slot name="header-right" /><slot name="body" /></div>'
        },
        VBtn: true,
        VIcon: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(CallbackService.getEmailTemplate).toHaveBeenCalledWith('cb-email-tpl-1')
    expect(wrapper.vm.emailTemplate).toBe('<p>Callback body</p>')
    expect(wrapper.vm.fromName).toBe('Support')
    expect(wrapper.vm.fromAddress).toBe('support@example.com')
    expect(wrapper.vm.subject).toBe('Callback subject')
    expect(wrapper.vm.name).toBe('Callback template')
  })
})
