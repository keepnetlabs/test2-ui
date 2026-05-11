/**
 * Vishing raporu Dialed Number tablo `mounted`
 * → `getVishingReportDialedNumber(axiosPayload, id)` + `customFieldValues` satır birleşimi.
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
      orderBy: 'CreateTime',
      ascending: false,
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
              firstName: 'Cid',
              phoneNumber: '+3000',
              customFieldValues: []
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via getVishingReportDialedNumber', async () => {
    const wrapper = mount(VishingReportDialedNumber, {
      localVue,
      vuetify,
      propsData: {
        id: 'vish-camp-dial-1',
        formDetails: {},
        customFields: []
      },
      stubs: {
        DataTable: {
          name: 'DataTable',
          template: '<div />',
          methods: { reRenderFilters: jest.fn(), resetSelectableParams: jest.fn() }
        },
        CampaignManagerReportHeader: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(getVishingReportDialedNumber).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'vish-camp-dial-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        firstName: 'Cid',
        phoneNumber: '+3000'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
