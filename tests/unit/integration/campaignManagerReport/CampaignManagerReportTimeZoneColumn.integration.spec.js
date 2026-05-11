/**
 * `CampaignManagerReportTimeZoneColumn`: sunucu + yerel satır (`timeKey` / `localTimeKey`) ve
 * `isToBeSent` iken “To be sent” ipucu (v-tooltip stub).
 */
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportTimeZoneColumn from '@/components/CampaignManagerReport/CampaignManagerReportTimeZoneColumn.vue'

const localVue = createLocalVue()

describe('CampaignManagerReportTimeZoneColumn (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  function mountCol(props) {
    return mount(CampaignManagerReportTimeZoneColumn, {
      localVue,
      vuetify,
      propsData: props,
      stubs: {
        'v-tooltip': {
          template: '<div class="tooltip-stub"><slot name="activator" :on="{}" /><slot /></div>'
        },
        VIcon: { template: '<span class="v-icon-stub" />' }
      }
    })
  }

  it('renders server time and local time on second line when local key is set', () => {
    const wrapper = mountCol({
      scope: { row: { sentAt: '2025-01-01 10:00 UTC', sentAtLocal: '2025-01-01 13:00 TR' } },
      timeKey: 'sentAt',
      localTimeKey: 'sentAtLocal',
      isToBeSent: false
    })

    const spans = wrapper.findAll('span')
    expect(spans.at(0).text()).toBe('2025-01-01 10:00 UTC')
    expect(spans.at(1).text()).toBe('2025-01-01 13:00 TR')
    expect(wrapper.find('.tooltip-stub').exists()).toBe(false)
  })

  it('falls back second line to server time when local key is missing', () => {
    const wrapper = mountCol({
      scope: { row: { openedAt: '2024-06-01 12:00' } },
      timeKey: 'openedAt',
      localTimeKey: 'missingLocalKey',
      isToBeSent: false
    })

    const spans = wrapper.findAll('span')
    expect(spans.at(1).text()).toBe('2024-06-01 12:00')
  })

  it('shows To be sent tooltip when isToBeSent is true', () => {
    const wrapper = mountCol({
      scope: { row: { t: 'pending' } },
      timeKey: 't',
      localTimeKey: 't',
      isToBeSent: true
    })

    expect(wrapper.find('.tooltip-stub').text()).toContain('To be sent')
  })
})
