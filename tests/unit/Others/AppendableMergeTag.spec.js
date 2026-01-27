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
        VList: '<div><slot /></div>',
        VListItem: {
            template: '<div class="v-list-item-mock" @click="$emit(\'click\')"><slot /></div>'
        },
        VListItemTitle: '<div><slot /></div>',
        VIcon: true
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
})
