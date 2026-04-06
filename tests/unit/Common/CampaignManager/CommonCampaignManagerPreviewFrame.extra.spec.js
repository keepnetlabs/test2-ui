import { shallowMount } from '@vue/test-utils'
import CommonCampaignManagerPreviewFrame from '@/components/Common/CampaignManager/CommonCampaignManagerPreviewFrame.vue'

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    createRandomCryptStringNumber: jest.fn(() => 'frame-extra')
  }
})

const stubVuetify = {
  VNavigationDrawer: {
    name: 'VNavigationDrawer',
    template: '<div class="v-navigation-drawer-stub"><slot /></div>'
  },
  VListItem: true,
  VListItemContent: true,
  VListItemTitle: true,
  VIcon: true,
  VTooltip: true,
  VBtn: true
}

describe('CommonCampaignManagerPreviewFrame.vue (extra branching)', () => {
  it('applies nested-overlay class when isNested is true and drawer is open', async () => {
    const wrapper = shallowMount(CommonCampaignManagerPreviewFrame, {
      propsData: {
        title: 'T',
        status: true,
        isNested: true,
        campaignName: 'C'
      },
      stubs: stubVuetify
    })
    await wrapper.vm.$nextTick()
    const overlay = wrapper.find('.common-campaign-manager-preview-overlay')
    expect(overlay.classes()).toContain('nested-overlay')
  })

  it('does not render edit VBtn when showEdit is false (only header close uses VIcon)', async () => {
    const wrapper = shallowMount(CommonCampaignManagerPreviewFrame, {
      propsData: {
        title: 'T',
        status: true,
        showEdit: false,
        loading: false,
        campaignName: 'Campaign'
      },
      stubs: stubVuetify
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.showEdit).toBe(false)
    expect(wrapper.findAll('vbtn-stub').length).toBe(0)
  })

  it('renders loading slot when loading is true', async () => {
    const wrapper = shallowMount(CommonCampaignManagerPreviewFrame, {
      propsData: {
        title: 'T',
        status: true,
        loading: true,
        campaignName: 'C'
      },
      slots: {
        loading: '<div class="loading-slot-marker">busy</div>'
      },
      stubs: stubVuetify
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.loading-slot-marker').exists()).toBe(true)
  })
})
