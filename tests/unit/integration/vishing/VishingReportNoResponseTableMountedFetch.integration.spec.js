/**
 * Vishing No Response tablo `mounted` → `getVishingReportNoResponse(axiosPayload, id)`
 * + `customFieldValues` → satır alanları.
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
              resourceId: 'vish-nr-1',
              customFieldValues: [{ name: 'NrTag', value: 'z' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  })

  it('loads rows via getVishingReportNoResponse and merges custom fields', async () => {
    const wrapper = mount(VishingReportNoResponse, {
      localVue,
      vuetify,
      propsData: {
        id: 'vish-camp-nr',
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

    expect(getVishingReportNoResponse).toHaveBeenCalledWith(
      expect.objectContaining({ pageNumber: 1 }),
      'vish-camp-nr'
    )
    expect(wrapper.vm.tableData[0]).toEqual(
      expect.objectContaining({
        resourceId: 'vish-nr-1',
        NrTag: 'z'
      })
    )
    expect(wrapper.vm.isLoading).toBe(false)
  })
})
