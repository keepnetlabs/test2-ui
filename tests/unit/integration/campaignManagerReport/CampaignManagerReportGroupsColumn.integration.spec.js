/**
 * `CampaignManagerReportGroupsColumn`: virgüllü string / dizi ayrıştırma, etiket (1 group / N groups),
 * boş değerde tıklama yok; gerçek bileşen — harici API yok.
 */
import { mount } from '@vue/test-utils'
import CampaignManagerReportGroupsColumn from '@/components/CampaignManagerReport/CampaignManagerReportGroupsColumn.vue'

describe('CampaignManagerReportGroupsColumn (integration)', () => {
  it('shows dash and does not emit click when there are no groups', async () => {
    const wrapper = mount(CampaignManagerReportGroupsColumn, {
      propsData: { value: '' }
    })

    expect(wrapper.text()).toBe('-')
    await wrapper.find('span').trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('parses a comma-separated string, shows plural label, emits trimmed group names', async () => {
    const wrapper = mount(CampaignManagerReportGroupsColumn, {
      propsData: { value: ' Alpha ,  Beta ' }
    })

    expect(wrapper.text()).toBe('2 groups')
    expect(wrapper.find('span').element.style.cursor).toBe('pointer')

    await wrapper.find('span').trigger('click')
    expect(wrapper.emitted('click')[0][0]).toEqual(['Alpha', 'Beta'])
  })

  it('uses array value, filters falsy entries, singular label for one group', async () => {
    const wrapper = mount(CampaignManagerReportGroupsColumn, {
      propsData: { value: ['Sales', '', 'Engineering'] }
    })

    expect(wrapper.text()).toBe('2 groups')

    await wrapper.find('span').trigger('click')
    expect(wrapper.emitted('click')[0][0]).toEqual(['Sales', 'Engineering'])
  })

  it('shows singular label for a single-element array', () => {
    const wrapper = mount(CampaignManagerReportGroupsColumn, {
      propsData: { value: ['OnlyOne'] }
    })

    expect(wrapper.text()).toBe('1 group')
  })
})
