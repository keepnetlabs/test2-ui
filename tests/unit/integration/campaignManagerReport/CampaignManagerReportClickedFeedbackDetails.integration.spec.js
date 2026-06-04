/**
 * Clicked Campaign Manager raporu: geri bildirim satırı → `CampaignManagerReportFeedbackDetailsDialog`
 * gerçek `AppDialog` + `AppDialogFooterWithClose` ile; backend alan adı varyantları (`feedbackSource` / `sourceName`,
 * `phishingScenarioName` / `scenarioName`) ve kapatma sinyali (`changeStatus(false)` → `on-close`) prod zinciriyle uyumlu.
 */
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportFeedbackDetailsDialog from '@/components/CampaignManagerReport/Clicked/CampaignManagerReportFeedbackDetailsDialog.vue'
import AppDialog from '@/components/AppDialog.vue'

const localVue = createLocalVue()

describe('Campaign Manager Report Clicked — feedback details dialog (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  function mountDialog(props = {}) {
    return mount(CampaignManagerReportFeedbackDetailsDialog, {
      localVue,
      vuetify,
      propsData: {
        status: true,
        selectedRow: {},
        ...props
      },
      stubs: {
        VDialog: {
          name: 'VDialog',
          props: ['value'],
          template: '<div class="v-dialog-stub" v-show="value"><slot /></div>'
        },
        VCard: { template: '<div class="v-card-stub"><slot /></div>' },
        VForm: { template: '<form @submit.prevent><slot /></form>' },
        VListItem: { template: '<div class="v-list-item-stub"><slot /></div>' },
        VListItemTitle: { template: '<div><slot /></div>' },
        VListItemSubtitle: { template: '<div><slot /></div>' },
        VCardActions: { template: '<div class="v-card-actions-stub"><slot /></div>' },
        VIcon: { template: '<span class="v-icon-stub"><slot>{{ $attrs.icon }}</slot></span>' }
      }
    })
  }

  it('maps alternate row fields to subtitle, source, scenario and feedback body (real computeds)', () => {
    const wrapper = mountDialog({
      selectedRow: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        feedbackText: 'Suspicious link in the message.',
        sourceName: 'Email Reporter',
        scenarioName: 'CEO fraud'
      }
    })

    const text = wrapper.text()
    expect(text).toContain('Feedback Details')
    expect(text).toContain('Ada Lovelace')
    expect(text).toContain('Email Reporter')
    expect(text).toContain('CEO fraud')
    expect(text).toContain('Suspicious link in the message.')
  })

  it('uses JIT default when no feedback source fields are present', () => {
    const wrapper = mountDialog({
      selectedRow: {
        firstName: 'Alan',
        lastName: 'Turing',
        feedbackText: 'Not sure',
        phishingScenarioName: 'Payroll scam'
      }
    })

    expect(wrapper.text()).toContain('Just-in-Time Landing Page')
    expect(wrapper.text()).toContain('Payroll scam')
  })

  it('forwards AppDialog changeStatus(false) to on-close (real AppDialog → parent)', () => {
    const wrapper = mountDialog({
      selectedRow: { firstName: 'Grace', lastName: 'Hopper', feedbackText: 'OK' }
    })

    const appDialog = wrapper.findComponent(AppDialog)
    expect(appDialog.exists()).toBe(true)
    appDialog.vm.changeStatus(false)

    expect(wrapper.emitted('on-close')).toEqual([[]])
  })

  it('emits on-close when footer close is triggered (real AppDialogFooterWithClose)', async () => {
    const wrapper = mountDialog({
      selectedRow: { firstName: 'Tim', lastName: 'Berners-Lee', feedbackText: 'Fine' }
    })

    const closeBtn = wrapper.find('#btn-close--campaign-manager-report-feedback-details')
    expect(closeBtn.exists()).toBe(true)
    await closeBtn.trigger('click')

    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('prefers feedbackSource over feedbackSourceName, source and sourceName (resolver order)', () => {
    const wrapper = mountDialog({
      selectedRow: {
        firstName: 'X',
        lastName: 'Y',
        feedbackText: 'ok',
        feedbackSource: 'Portal',
        feedbackSourceName: 'IgnoredName',
        source: 'IgnoredSource',
        sourceName: 'IgnoredSourceName',
        phishingScenarioName: 'S1'
      }
    })

    expect(wrapper.text()).toContain('Portal')
    expect(wrapper.text()).not.toContain('IgnoredName')
  })

  it('renders dash for empty feedback text and hyphen for missing scenario', () => {
    const wrapper = mountDialog({
      selectedRow: {
        firstName: 'Only',
        lastName: 'First',
        feedbackText: '',
        feedbackSourceName: 'SRC'
      }
    })

    const bodyBlock = wrapper.find('.campaign-manager-report-feedback-details-dialog')
    expect(bodyBlock.text()).toContain('-')
    expect(bodyBlock.text()).toContain('Scenario Name:')
    expect(wrapper.text()).toMatch(/Scenario Name:\s*-/)
  })

  it('subtitle trims to single name when only firstName is set', () => {
    const wrapper = mountDialog({
      selectedRow: {
        firstName: 'Mono',
        lastName: '',
        feedbackText: 'x',
        phishingScenarioName: 'Phish'
      }
    })

    expect(wrapper.text()).toContain('Mono')
    expect(wrapper.text()).not.toMatch(/Mono\s+Mono/)
  })

  it('updates body and scenario when selectedRow prop changes while open', async () => {
    const wrapper = mountDialog({
      selectedRow: {
        firstName: 'Pat',
        lastName: 'Smith',
        feedbackText: 'first opinion',
        phishingScenarioName: 'Scenario A'
      }
    })

    expect(wrapper.text()).toContain('first opinion')

    await wrapper.setProps({
      selectedRow: {
        firstName: 'Pat',
        lastName: 'Smith',
        feedbackText: 'second opinion',
        phishingScenarioName: 'Scenario B'
      }
    })

    expect(wrapper.text()).toContain('second opinion')
    expect(wrapper.text()).toContain('Scenario B')
    expect(wrapper.text()).not.toContain('first opinion')
  })
})
