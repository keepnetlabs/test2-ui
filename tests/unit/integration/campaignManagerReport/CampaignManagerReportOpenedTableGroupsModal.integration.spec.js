/**
 * Opened tablo: gruplar sütunu → `CommonReportViewTargetGroupsModal` (Clicked ile aynı kablolama standardı).
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailOpened: jest.fn(() =>
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
  exportCampaignJobUserEmailOpened: jest.fn()
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
import CampaignManagerReportOpenedTable from '@/components/CampaignManagerReport/Opened/CampaignManagerReportOpenedTable.vue'
import CommonReportViewTargetGroupsModal from '@/components/Common/Report/CommonReportViewTargetGroupsModal.vue'
import AppDialog from '@/components/AppDialog.vue'
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'

const localVue = createLocalVue()

const groupsDataTableStub = {
  name: 'DataTable',
  props: ['columns', 'table'],
  computed: {
    groupsColumn() {
      return this.columns.find((column) => column.property === COLUMNS.GROUPS.property)
    }
  },
  template:
    '<div class="dt-opened-groups"><slot name="datatable-custom-column" :scope="{ row: table[0] }" :col="groupsColumn" /></div>'
}

const appDialogShellStubs = {
  VDialog: {
    props: ['value'],
    template: '<div class="v-dialog-stub" v-show="value"><slot /></div>'
  },
  VCard: { template: '<div><slot /></div>' },
  VForm: { template: '<form><slot /></form>' },
  VListItem: { template: '<div><slot /></div>' },
  VListItemTitle: { template: '<div><slot /></div>' },
  VListItemSubtitle: { template: '<div><slot /></div>' },
  VCardActions: { template: '<div><slot /></div>' },
  VIcon: { template: '<span />' },
  VBtn: { template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>' },
  'v-text-field': {
    props: ['value'],
    template: '<input class="tg-search" :value="value" @input="$emit(\'input\', $event.target.value)" />'
  }
}

describe('Campaign Manager Report Opened table ↔ groups modal (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  function mountTable(row) {
    return mount(CampaignManagerReportOpenedTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: { getters: { 'permissions/getCampaignReportsOpenedDetailsPermissions': true } }
      },
      propsData: {
        id: 'o1',
        instanceGroup: 'ig-o'
      },
      data() {
        return { tableData: [row] }
      },
      methods: {
        callForLanguages: jest.fn(),
        callForData: jest.fn()
      },
      stubs: {
        DataTable: groupsDataTableStub,
        CampaignManagerReportActivityColumn: true,
        CampaignManagerReportTimeZoneColumn: true,
        CampaignManagerReportGroupsColumn: false,
        CommonReportViewTargetGroupsModal: false,
        CampaignManagerReportBotActivityAlertBox: true,
        DefaultButtonRowAction: true,
        ...appDialogShellStubs
      }
    })
  }

  it('opens modal with group names and clears after AppDialog close', async () => {
    const wrapper = mountTable({
      firstName: 'O',
      lastName: 'Pen',
      targetGroups: 'G1, G2',
      activityType: 'Human Activity'
    })

    await wrapper.find('span').trigger('click')

    expect(wrapper.vm.selectedGroups).toEqual([{ name: 'G1' }, { name: 'G2' }])
    const modal = wrapper.findComponent(CommonReportViewTargetGroupsModal)
    expect(modal.text()).toContain('G1')

    modal.findComponent(AppDialog).vm.changeStatus(false)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isGroupsDialogOpen).toBe(false)
    expect(wrapper.vm.selectedGroups).toEqual([])
  })
})
