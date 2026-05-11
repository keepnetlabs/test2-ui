/**
 * Sending Report tablo: gruplar sütunu → `CommonReportViewTargetGroupsModal`
 * (delivery status sütunu stub; DataTable sadece gruplar slot’u).
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserSendingReport: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
  ),
  exportCampaignJobUserSendingReport: jest.fn(),
  getCampaignJobEmailActivity: jest.fn(() =>
    Promise.resolve({
      data: {
        data: []
      }
    })
  )
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
      orderBy: 'lastSendingTime',
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
import CampaignManagerReportSendingReportTable from '@/components/CampaignManagerReport/SendingReport/CampaignManagerReportSendingReportTable.vue'
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
    '<div class="dt-send-groups"><slot name="datatable-custom-column" :scope="{ row: table[0] }" :col="groupsColumn" /></div>'
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
  },
  'v-tooltip': {
    template: '<div><slot name="activator" :on="{}" /><slot /></div>'
  }
}

describe('Campaign Manager Report Sending Report table ↔ groups modal (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('opens groups modal and clears on close', async () => {
    const wrapper = mount(CampaignManagerReportSendingReportTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: { getters: { 'permissions/getCampaignReportsSendingReportDetailsPermissions': true } }
      },
      propsData: {
        id: 'sr1',
        instanceGroup: 'ig-sr',
        lastSendingStatusItems: [],
        customFields: []
      },
      data() {
        return {
          tableData: [{ firstName: 'S', lastName: 'R', targetGroups: 'One', status: 'Sent' }]
        }
      },
      methods: {
        callForLanguages: jest.fn(),
        callForData: jest.fn()
      },
      stubs: {
        DataTable: groupsDataTableStub,
        CampaignManagerReportTimeZoneColumn: true,
        CampaignManagerReportGroupsColumn: false,
        CommonReportViewTargetGroupsModal: false,
        DefaultButtonRowAction: true,
        Badge: { template: '<span />' },
        CampaignManagerReportSendingReportEvent: true,
        ...appDialogShellStubs
      }
    })

    await wrapper.find('span').trigger('click')
    expect(wrapper.vm.selectedGroups).toEqual([{ name: 'One' }])

    wrapper.findComponent(CommonReportViewTargetGroupsModal).findComponent(AppDialog).vm.changeStatus(false)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isGroupsDialogOpen).toBe(false)
    expect(wrapper.vm.selectedGroups).toEqual([])
  })
})
