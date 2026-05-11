/**
 * `CampaignManagerReportBotActivityAlertBox` + gerçek `AlertBox` gövde slot’u: tekil/çoğul metin,
 * kum modu etiketi ve `on-activity-change` emiti.
 */
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportBotActivityAlertBox from '@/components/CampaignManagerReport/CampaignManagerReportBotActivityAlertBox.vue'

const localVue = createLocalVue()

describe('CampaignManagerReportBotActivityAlertBox (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  function mountBox(props = {}) {
    return mount(CampaignManagerReportBotActivityAlertBox, {
      localVue,
      vuetify,
      propsData: {
        botActivityCount: 1,
        isShowSandbox: false,
        ...props
      },
      stubs: {
        VIcon: { template: '<span class="v-icon-stub" />' }
      }
    })
  }

  it('uses singular user copy when count is 1', () => {
    const wrapper = mountBox({ botActivityCount: 1 })
    expect(wrapper.text()).toMatch(/1 user\b/)
    expect(wrapper.text()).not.toMatch(/1 users\b/)
  })

  it('uses plural users copy when count is greater than 1', () => {
    const wrapper = mountBox({ botActivityCount: 3 })
    expect(wrapper.text()).toMatch(/3 users\b/)
  })

  it('shows HIDE BOT ACTIVITY when sandbox is on and emits on toggle click', async () => {
    const wrapper = mountBox({ botActivityCount: 2, isShowSandbox: true })

    expect(wrapper.text()).toContain('HIDE BOT ACTIVITY')

    const toggle = wrapper.find('.cursor-pointer')
    await toggle.trigger('click')

    expect(wrapper.emitted('on-activity-change')).toEqual([[]])
  })
})
