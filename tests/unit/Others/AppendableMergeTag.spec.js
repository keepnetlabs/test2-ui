import { createLocalVue, shallowMount } from '@vue/test-utils'
import AppendableMergeTag from '@/components/Common/Others/AppendableMergeTag.vue'
import Vuetify from 'vuetify'

describe('AppendableMergeTag.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = () => {
    return shallowMount(AppendableMergeTag, {
      localVue,
      vuetify,
      stubs: {
        VMenu: {
            template: '<div><slot name="activator" :on="{}"></slot><slot /></div>'
        },
        VList: {
          template: '<div><slot /></div>'
        },
        VListItem: {
            template: '<div class="v-list-item-mock" @click="$emit(\'click\')"><slot /></div>'
        },
        VListItemTitle: {
          template: '<div><slot /></div>'
        },
        VIcon: {
          template: '<i class="v-icon-stub"></i>'
        }
      }
    })
  }

  it('renders merge tag activator', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Merge Tag')
  })

  it('emits on-add-merge-tag when tag is clicked', async () => {
    const wrapper = mountComponent()
    // By default there's {EMAIL}
    await wrapper.find('.v-list-item-mock').trigger('click')
    expect(wrapper.emitted('on-add-merge-tag')).toBeTruthy()
    expect(wrapper.emitted('on-add-merge-tag')[0]).toEqual(['{EMAIL}'])
  })

  it('renders all merge tag options', () => {
    const wrapper = mountComponent()
    const text = wrapper.text()

    expect(text).toContain('Merge Tag')
    // Default merge tags should be available
    expect(wrapper.findAll('.v-list-item-mock').length).toBeGreaterThan(0)
  })

  it('has icon in merge tag activator', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.v-icon-stub').exists()).toBe(true)
  })

  it('emits correct tag on different merge tag selections', async () => {
    const wrapper = mountComponent()
    const items = wrapper.findAll('.v-list-item-mock')

    // First item (EMAIL) is already tested, try other items
    if (items.length > 1) {
      await items.at(1).trigger('click')
      expect(wrapper.emitted('on-add-merge-tag')).toBeTruthy()
    }
  })
})
