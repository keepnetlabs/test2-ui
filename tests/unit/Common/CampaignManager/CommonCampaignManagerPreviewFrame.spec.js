import { shallowMount } from '@vue/test-utils'
import CommonCampaignManagerPreviewFrame from '@/components/Common/CampaignManager/CommonCampaignManagerPreviewFrame.vue'

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    createRandomCryptStringNumber: jest.fn(() => 'frame-rnd')
  }
})

const stubVuetify = {
  VNavigationDrawer: true,
  VListItem: true,
  VListItemContent: true,
  VListItemTitle: true,
  VIcon: true,
  VTooltip: true,
  VBtn: true
}

describe('CommonCampaignManagerPreviewFrame.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CommonCampaignManagerPreviewFrame, {
      propsData: {
        title: 'Test Title',
        status: false,
        ...propsData
      },
      stubs: stubVuetify
    })

  it('has correct component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('CommonCampaignManagerPreviewFrame')
  })

  it('exposes title and campaignName props on the instance', () => {
    const wrapper = createWrapper({
      title: 'Preview title',
      campaignName: 'Acme campaign'
    })
    expect(wrapper.vm.title).toBe('Preview title')
    expect(wrapper.vm.campaignName).toBe('Acme campaign')
  })

  it('uses stable drawerId from mocked random id', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.drawerId).toBe('drawer-frame-rnd')
  })

  it('exposes navigationDrawerClass with campaign-manager preview keys', () => {
    const wrapper = createWrapper({ isNested: false })
    expect(wrapper.vm.navigationDrawerClass).toEqual({
      'k-navigation-drawer k-navigation-drawer--campaign-manager-preview': true,
      'nested-drawer': false
    })
  })

  it('sets nested-drawer when isNested is true', () => {
    const wrapper = createWrapper({ isNested: true })
    expect(wrapper.vm.navigationDrawerClass['nested-drawer']).toBe(true)
  })

  it('emits on-close after handleClose (drawer close delay)', () => {
    jest.useFakeTimers()
    const wrapper = createWrapper({ status: true })
    wrapper.vm.handleClose()
    jest.advanceTimersByTime(250)
    expect(wrapper.emitted('on-close')).toBeTruthy()
    jest.useRealTimers()
  })

  it('emits on-close after handleOverlayClick (same close path)', () => {
    jest.useFakeTimers()
    const wrapper = createWrapper({ status: true })
    wrapper.vm.handleOverlayClick()
    jest.advanceTimersByTime(250)
    expect(wrapper.emitted('on-close')).toBeTruthy()
    jest.useRealTimers()
  })
})
