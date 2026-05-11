/**
 * `SandboxDetailDialogAlerts`: kampanya detay uyarı metni ve `isShowV4Rule` ile A4 bloğunun
 * gösterilmesi / gizlenmesi (statik şablon + gerçek bileşen).
 */
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import SandboxDetailDialogAlerts from '@/components/CampaignManagerReport/SandboxDetailDialogAlerts.vue'

const localVue = createLocalVue()

describe('SandboxDetailDialogAlerts (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('shows tracking disclaimer and full rule list including A4 when isShowV4Rule is true', () => {
    const wrapper = mount(SandboxDetailDialogAlerts, {
      localVue,
      vuetify,
      propsData: { isShowV4Rule: true },
      stubs: {
        VIcon: { template: '<span />' }
      }
    })

    const text = wrapper.text()
    expect(text).toContain('During the tracking duration of the campaign')
    expect(text).toContain('Bot Activity Rules:')
    expect(text).toContain('A4: Stop Bot Activity Challenge')
    expect(text).toContain('A4.2')
  })

  it('hides A4 challenge subsection when isShowV4Rule is false', () => {
    const wrapper = mount(SandboxDetailDialogAlerts, {
      localVue,
      vuetify,
      propsData: { isShowV4Rule: false },
      stubs: {
        VIcon: { template: '<span />' }
      }
    })

    expect(wrapper.text()).not.toContain('A4: Stop Bot Activity Challenge')
  })
})
