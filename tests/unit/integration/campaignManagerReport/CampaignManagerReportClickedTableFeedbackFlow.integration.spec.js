/**
 * Clicked tablo → `handleFeedbackClick` / `closeFeedbackDialog` durumu + gerçek
 * `CampaignManagerReportFeedbackDetailsDialog` (DataTable slot’u stub; üretim kolon eşlemesi `feedbackText`).
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailClicked: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1,
          totalSandBoxActivityCount: 0
        }
      }
    })
  ),
  exportCampaignJobUserEmailClicked: jest.fn()
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() =>
    Promise.resolve([{ isoFriendlyName: 'EN', name: 'English', resourceId: 'lang-en' }])
  )
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
import CampaignManagerReportClickedTable from '@/components/CampaignManagerReport/Clicked/CampaignManagerReportClickedTable.vue'
import CampaignManagerReportFeedbackDetailsDialog from '@/components/CampaignManagerReport/Clicked/CampaignManagerReportFeedbackDetailsDialog.vue'
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'

const localVue = createLocalVue()

const dataTableStub = {
  name: 'DataTable',
  props: ['columns', 'table'],
  computed: {
    feedbackColumn() {
      return this.columns.find((column) => column.property === COLUMNS.FEEDBACK_STATUS.property)
    }
  },
  template:
    '<div class="dt-stub"><slot name="datatable-custom-column" :scope="{ row: table[0] }" :col="feedbackColumn" /></div>'
}

describe('Campaign Manager Report Clicked table ↔ feedback dialog (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  function mountTable(tableData) {
    return mount(CampaignManagerReportClickedTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: { getters: { 'permissions/getCampaignReportsClickedDetailsPermissions': true } }
      },
      propsData: {
        id: 'c1',
        instanceGroup: 'ig1'
      },
      data() {
        return { tableData }
      },
      methods: {
        callForLanguages: jest.fn(),
        callForData: jest.fn()
      },
      stubs: {
        DataTable: dataTableStub,
        CampaignManagerReportActivityColumn: true,
        CampaignManagerReportTimeZoneColumn: true,
        CampaignManagerReportGroupsColumn: true,
        CommonReportViewTargetGroupsModal: true,
        CampaignManagerReportBotActivityAlertBox: true,
        DefaultButtonRowAction: true,
        VDialog: {
          props: ['value'],
          template: '<div v-show="value"><slot /></div>'
        },
        VCard: { template: '<div><slot /></div>' },
        VForm: { template: '<form><slot /></form>' },
        VListItem: { template: '<div><slot /></div>' },
        VListItemTitle: { template: '<div><slot /></div>' },
        VListItemSubtitle: { template: '<div><slot /></div>' },
        VCardActions: { template: '<div><slot /></div>' },
        VIcon: { template: '<span />' },
        VBtn: { template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>' }
      }
    })
  }

  it('opens real feedback dialog on View then closeFeedbackDialog clears row and flag', async () => {
    const row = {
      firstName: 'Neo',
      lastName: 'Anderson',
      feedbackText: 'Looks phishy',
      phishingScenarioName: 'Matrix'
    }
    const wrapper = mountTable([row])

    await wrapper.find('.campaign-manager-report-clicked-feedback-link').trigger('click')

    expect(wrapper.vm.isFeedbackDialogOpen).toBe(true)
    expect(wrapper.vm.selectedFeedbackRow).toEqual(row)

    const dialog = wrapper.findComponent(CampaignManagerReportFeedbackDetailsDialog)
    expect(dialog.exists()).toBe(true)
    expect(dialog.text()).toContain('Looks phishy')

    wrapper.vm.closeFeedbackDialog()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isFeedbackDialogOpen).toBe(false)
    expect(wrapper.vm.selectedFeedbackRow).toEqual({})
    expect(wrapper.findComponent(CampaignManagerReportFeedbackDetailsDialog).exists()).toBe(false)
  })

  it('replaces selected row when opening feedback for a second user', async () => {
    const rowA = {
      firstName: 'A',
      lastName: 'One',
      feedbackText: 'a',
      phishingScenarioName: 'S1'
    }
    const rowB = {
      firstName: 'B',
      lastName: 'Two',
      feedbackText: 'b',
      phishingScenarioName: 'S2'
    }
    const wrapper = mountTable([rowA, rowB])

    wrapper.vm.handleFeedbackClick(rowA)
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(CampaignManagerReportFeedbackDetailsDialog).text()).toContain('a')

    wrapper.vm.handleFeedbackClick(rowB)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selectedFeedbackRow).toEqual(rowB)
    expect(wrapper.findComponent(CampaignManagerReportFeedbackDetailsDialog).text()).toContain('b')
  })
})
