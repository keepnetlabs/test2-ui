import { shallowMount } from '@vue/test-utils'
import KListPreviewItem from '@/components/IncidentResponder/KListPreviewItem.vue'

describe('KListPreviewItem.vue (extra branch coverage)', () => {
  const item = {
    name: 'Template A',
    typeName: 'Phishing',
    companyName: 'Keepnet',
    subject: 'Security notice',
    tags: ['urgent', 'email']
  }

  const createWrapper = (propsData = {}) =>
    shallowMount(KListPreviewItem, {
      propsData: {
        item,
        isDefault: false,
        isSelected: false,
        ...propsData
      },
      stubs: {
        Badge: {
          props: ['id', 'text'],
          template: '<div class="badge-stub" :id="id">{{ text || "tag" }}</div>'
        }
      }
    })

  it('renders active class and default badge when the item is selected/default', () => {
    const wrapper = createWrapper({
      isSelected: true,
      isDefault: true
    })

    expect(wrapper.classes()).toContain('k-list-preview-item--active')
    expect(wrapper.find('#badge--k-list-preview-item').exists()).toBe(true)
    expect(wrapper.findAll('.badge-stub')).toHaveLength(3)
  })

  it('renders item details without default badge when not selected/default', () => {
    const wrapper = createWrapper()

    expect(wrapper.classes()).not.toContain('k-list-preview-item--active')
    expect(wrapper.find('#badge--k-list-preview-item').exists()).toBe(false)
    expect(wrapper.text()).toContain('Template A')
    expect(wrapper.text()).toContain('Phishing')
    expect(wrapper.text()).toContain('by Keepnet')
    expect(wrapper.text()).toContain('Security notice')
    expect(wrapper.findAll('.badge-stub')).toHaveLength(2)
  })
})
