/**
 * Opened Attachment tablo: gruplar sütunu → `CommonReportViewTargetGroupsModal`.
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserAttachmentOpened: jest.fn(() =>
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
  exportCampaignJobUserAttachmentOpened: jest.fn()
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
import CampaignManagerReportOpenedAttachmentTable from '@/components/CampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachmentTable.vue'
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
    '<div class="dt-att-groups"><slot name="datatable-custom-column" :scope="{ row: table[0] }" :col="groupsColumn" /></div>'
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

describe('Campaign Manager Report Opened Attachment table ↔ groups modal (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('opens groups modal and clears on close', async () => {
    const wrapper = mount(CampaignManagerReportOpenedAttachmentTable, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      mocks: {
        $store: { getters: { 'permissions/getCampaignReportsOpenedAttachmentDetailsPermissions': true } }
      },
      propsData: { id: 'att1', instanceGroup: 'ig-att', isShowSandboxFromParent: false },
      data() {
        return {
          tableData: [{ firstName: 'A', lastName: 'TT', targetGroups: ['G1'], activityType: 'Human Activity' }]
        }
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

    await wrapper.find('span').trigger('click')
    expect(wrapper.vm.selectedGroups).toEqual([{ name: 'G1' }])

    wrapper.findComponent(CommonReportViewTargetGroupsModal).findComponent(AppDialog).vm.changeStatus(false)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isGroupsDialogOpen).toBe(false)
    expect(wrapper.vm.selectedGroups).toEqual([])
  })
})
