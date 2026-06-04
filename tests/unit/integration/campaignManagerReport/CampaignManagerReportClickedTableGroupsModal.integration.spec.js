/**
 * Clicked tablo: `CampaignManagerReportGroupsColumn` tıklaması → `handleGroupsClick` →
 * gerçek `CommonReportViewTargetGroupsModal` (AppDialog iskeleti stub); kapatınca seçim sıfırlanır.
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
    '<div class="dt-groups-stub"><slot name="datatable-custom-column" :scope="{ row: table[0] }" :col="groupsColumn" /></div>'
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

describe('Campaign Manager Report Clicked table ↔ groups modal (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  function mountTable(row) {
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
        return {
          tableData: [row]
        }
      },
      methods: {
        callForLanguages: jest.fn(),
        callForData: jest.fn()
      },
      stubs: {
        DataTable: groupsDataTableStub,
        CampaignManagerReportFeedbackDetailsDialog: true,
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

  it('opens groups modal with mapped { name } rows and clears state after AppDialog close', async () => {
    const wrapper = mountTable({
      firstName: 'U',
      lastName: 'One',
      targetGroups: 'Team A, Team B',
      feedbackText: ''
    })

    await wrapper.find('span').trigger('click')

    expect(wrapper.vm.isGroupsDialogOpen).toBe(true)
    expect(wrapper.vm.selectedGroups).toEqual([{ name: 'Team A' }, { name: 'Team B' }])

    const modal = wrapper.findComponent(CommonReportViewTargetGroupsModal)
    expect(modal.exists()).toBe(true)
    expect(modal.text()).toContain('Team A')
    expect(modal.text()).toContain('Team B')

    const appDialog = modal.findComponent(AppDialog)
    appDialog.vm.changeStatus(false)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isGroupsDialogOpen).toBe(false)
    expect(wrapper.vm.selectedGroups).toEqual([])
    expect(wrapper.findComponent(CommonReportViewTargetGroupsModal).exists()).toBe(false)
  })

  it('filters listed groups when search is typed in modal (real getTargetGroups)', async () => {
    const wrapper = mountTable({
      firstName: 'U',
      lastName: 'Two',
      targetGroups: ['Alpha', 'BetaGamma'],
      feedbackText: ''
    })

    await wrapper.find('span').trigger('click')

    const modal = wrapper.findComponent(CommonReportViewTargetGroupsModal)
    const search = modal.find('.tg-search')
    await search.setValue('beta')
    await wrapper.vm.$nextTick()

    expect(modal.text()).toContain('BetaGamma')
    expect(modal.text()).not.toContain('Alpha')
  })
})
