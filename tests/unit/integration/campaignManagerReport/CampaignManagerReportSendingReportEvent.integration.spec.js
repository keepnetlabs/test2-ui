/**
 * `CampaignManagerReportSendingReportEvent`: rozet metni / tarih satırı / `deferred` denemesi,
 * sebep varsa detay aç-kapa (gerçek `getBtnStatusColor`).
 */
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSendingReportEvent from '@/components/CampaignManagerReport/SendingReport/CampaignManagerReportSendingReportEvent.vue'

const localVue = createLocalVue()

describe('CampaignManagerReportSendingReportEvent (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('renders deferred attempt line and toggles reason detail', async () => {
    const wrapper = mount(CampaignManagerReportSendingReportEvent, {
      localVue,
      vuetify,
      propsData: {
        item: {
          title: 'Received By mx.test',
          status: 'deferred',
          date: '2025-01-10',
          attemptNum: 2,
          reason: 'Temporary failure'
        }
      },
      stubs: {
        badge: { template: '<span class="badge-stub">{{ text }}</span>', props: ['text'] },
        VBtn: { template: '<span />' },
        VIcon: {
          template: '<span class="chev" @click="$listeners.click" />'
        }
      }
    })

    expect(wrapper.text()).toContain('Received By mx.test')
    expect(wrapper.text()).toMatch(/2025-01-10.*Attempt #2/)
    expect(wrapper.find('.badge-stub').text()).toBe('deferred')
    expect(wrapper.text()).toContain('Temporary failure')

    await wrapper.find('.chev').trigger('click')
    expect(wrapper.vm.showDetail).toBe(false)

    await wrapper.find('.chev').trigger('click')
    expect(wrapper.vm.showDetail).toBe(true)
  })

  it('shows plain date when status is not deferred', () => {
    const wrapper = mount(CampaignManagerReportSendingReportEvent, {
      localVue,
      vuetify,
      propsData: {
        item: {
          title: 'Delivered',
          status: 'Sent',
          date: '2025-02-01',
          localTime: '09:00 TR'
        }
      },
      stubs: {
        badge: { template: '<span />' },
        VBtn: { template: '<span />' },
        VIcon: true
      }
    })

    expect(wrapper.text()).toContain('2025-02-01')
    expect(wrapper.text()).toContain("User's Time: 09:00 TR")
  })
})
