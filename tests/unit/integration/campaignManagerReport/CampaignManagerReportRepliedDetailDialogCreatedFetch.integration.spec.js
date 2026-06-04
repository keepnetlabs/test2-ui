/**
 * Phishing kampanya raporu — Replied önizleme diyaloğu `created`
 * → `searchCampaignJobUserRepliedDetails(axiosPayload, resourceId)`; sonuçlar `repliedTemplates` içinde.
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserRepliedDetails: jest.fn()
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportRepliedDetailDialog from '@/components/CampaignManagerReport/Replied/CampaignManagerReportRepliedDetailDialog.vue'
import { searchCampaignJobUserRepliedDetails } from '@/api/phishingsimulator'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Campaign Manager Report Replied detail dialog created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    searchCampaignJobUserRepliedDetails.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              from: 'user@example.com',
              to: 'inbox@corp.test',
              subject: 'Re: Test',
              replySent: '2026-05-06',
              content: '<p>Reply body</p>'
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads reply templates into repliedTemplates', async () => {
    const wrapper = mount(CampaignManagerReportRepliedDetailDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          resourceId: 'ph-replied-1',
          firstName: 'Re',
          lastName: 'Ply',
          replyType: 'User'
        }
      },
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          template:
            '<div class="app-dialog-stub"><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        DatatableLoading: true,
        KEmailPreview: true,
        AppDialogFooterWithClose: true,
        VBtn: true,
        VIcon: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(searchCampaignJobUserRepliedDetails).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1, orderBy: 'replySent' }),
      'ph-replied-1'
    )
    expect(wrapper.vm.repliedTemplates).toHaveLength(1)
    expect(wrapper.vm.repliedTemplates[0]).toEqual(
      expect.objectContaining({
        from: 'user@example.com',
        subject: 'Re: Test',
        content: '<p>Reply body</p>'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
