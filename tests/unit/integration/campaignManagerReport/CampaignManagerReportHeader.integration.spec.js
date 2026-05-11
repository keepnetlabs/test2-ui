/**
 * `CampaignManagerReportHeader`: başlık + alt başlık props zinciri (saf sunum, API yok).
 */
import { mount } from '@vue/test-utils'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader.vue'

describe('CampaignManagerReportHeader (integration)', () => {
  it('renders title and subtitle from props', () => {
    const wrapper = mount(CampaignManagerReportHeader, {
      propsData: {
        title: 'Email opened',
        subtitle: 'Who opened the phishing email'
      }
    })

    expect(wrapper.text()).toContain('Email opened')
    expect(wrapper.text()).toContain('Who opened the phishing email')
  })
})
