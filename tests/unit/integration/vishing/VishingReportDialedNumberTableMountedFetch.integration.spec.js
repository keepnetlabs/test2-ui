/**
 * Vishing Dialed Number tablo `mounted` → `getVishingReportDialedNumber(axiosPayload, id)`
 * + `customFieldValues` → satır alanları.
 */
jest.mock('@/api/vishing', () => ({
  getVishingReportDialedNumber: jest.fn(),
  exportVishingReportDialedNumbers: jest.fn()
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'FirstName',
      ascending: true,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

jest.mock('@/utils/helperFunctions', () => {
  const actual = jest.requireActual('@/utils/helperFunctions')
  return {
    ...actual,
    createCustomFieldColumns: jest.fn(() => [])
  }
})

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VishingReportDialedNumber from '@/components/VishingReport/VishingReportDialedNumber.vue'
import { getVishingReportDialedNumber } from '@/api/vishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Vishing Report Dialed Number table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    getVishingReportDialedNumber.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              resourceId: 'vish-dial-1',
              customFieldValues: [{ name: 'DialMeta', value: '9' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via getVishingReportDialedNumber and merges custom fields', async () => {
    const wrapper = mount(VishingReportDialedNumber, {
      localVue,
      vuetify,
      propsData: {
        id: 'vish-camp-dial',
        formDetails: {}
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn() }
        },
        CampaignManagerReportHeader: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(getVishingReportDialedNumber).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'vish-camp-dial'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'vish-dial-1',
        DialMeta: '9'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
