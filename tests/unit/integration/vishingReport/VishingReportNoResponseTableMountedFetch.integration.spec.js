/**
 * Vishing raporu No Response tablo `mounted`
 * → `getVishingReportNoResponse(axiosPayload, id)` + `customFieldValues` satır birleşimi.
 */
jest.mock('@/api/vishing', () => ({
  getVishingReportNoResponse: jest.fn(),
  exportVishingReportNoResponse: jest.fn()
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
import VishingReportNoResponse from '@/components/VishingReport/VishingReportNoResponse.vue'
import { getVishingReportNoResponse } from '@/api/vishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Vishing Report No Response table mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    getVishingReportNoResponse.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              firstName: 'Bob',
              phoneNumber: '+2000',
              customFieldValues: [{ name: 'Lane', value: '2' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via getVishingReportNoResponse and maps custom fields', async () => {
    const wrapper = mount(VishingReportNoResponse, {
      localVue,
      vuetify,
      propsData: {
        id: 'vish-camp-nr-1',
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

    expect(getVishingReportNoResponse).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'vish-camp-nr-1'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        firstName: 'Bob',
        Lane: '2'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
