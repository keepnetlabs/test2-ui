/**
 * Tıklanan kullanıcı detay modalı: gerçek `AppDialog` + `getTitle` / `getSubtitle` + footer kapatma;
 * `DataTable` ve mark-as alt diyalogları stub — API `searchCampaignJobUserEmailClickedDetails` mock.
 */
jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailClickedDetails: jest.fn(() =>
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
  )
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 5,
      orderBy: 'ClickedTime',
      ascending: false,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportClickedItemDetailDialog from '@/components/CampaignManagerReport/Clicked/CampaignManagerReportClickedItemDetailDialog.vue'
import AppDialog from '@/components/AppDialog.vue'

const localVue = createLocalVue()

const dialogShellStubs = {
  DataTable: { template: '<div class="dt-mock" />' },
  CampaignManagerReportHumanActivityDialog: true,
  CampaignManagerReportSandboxActivityDialog: true,
  SandboxDetailDialogAlerts: true,
  CampaignManagerReportUserAgentColumn: true,
  CampaignManagerReportIPColumn: true,
  CampaignManagerReportActivityColumn: true,
  CampaignManagerReportTimeZoneColumn: true,
  DefaultButtonRowAction: true,
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
  VBtn: { template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>' }
}

describe('Campaign Manager Report Clicked item detail dialog shell (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('shows title from clickedCount and subtitle from item name (real computeds + AppDialog)', () => {
    const wrapper = mount(CampaignManagerReportClickedItemDetailDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: {
          resourceId: 'user-99',
          clickedCount: 7,
          firstName: 'Leslie',
          lastName: 'Lamport'
        },
        isShowSandboxFromParent: false
      },
      stubs: dialogShellStubs
    })

    const text = wrapper.text()
    expect(text).toContain('Clicked Link 7 Time(s)')
    expect(text).toContain('Leslie Lamport')
  })

  it('emits on-close when AppDialog signals close (real AppDialog → wrapper)', () => {
    const wrapper = mount(CampaignManagerReportClickedItemDetailDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: { resourceId: 'u1', clickedCount: 1, firstName: 'A', lastName: 'B' },
        isShowSandboxFromParent: false
      },
      stubs: dialogShellStubs
    })

    const appDialog = wrapper.findComponent(AppDialog)
    appDialog.vm.changeStatus(false)

    expect(wrapper.emitted('on-close')).toEqual([[]])
  })

  it('footer close emits on-close (real AppDialogFooterWithClose)', async () => {
    const wrapper = mount(CampaignManagerReportClickedItemDetailDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        item: { resourceId: 'u2', clickedCount: 2, firstName: 'C', lastName: 'D' },
        isShowSandboxFromParent: false
      },
      stubs: dialogShellStubs
    })

    const buttons = wrapper.findAll('button')
    const closeBtn = buttons.wrappers.find((w) => w.text().includes('CLOSE'))
    expect(closeBtn).toBeTruthy()
    await closeBtn.trigger('click')

    expect(wrapper.emitted('on-close')).toBeTruthy()
  })
})
