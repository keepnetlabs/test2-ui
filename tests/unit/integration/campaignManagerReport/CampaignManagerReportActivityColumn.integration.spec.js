/**
 * `CampaignManagerReportActivityColumn`: `ACTIVITY_TYPES` + satır bayraklarına göre ipucu
 * görünürlüğü ve `getActivityTooltipText` dalları (gerçek `Opened/utils` sabitleri).
 */
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportActivityColumn from '@/components/CampaignManagerReport/CampaignManagerReportActivityColumn.vue'
import { ACTIVITY_TYPES } from '@/components/CampaignManagerReport/Opened/utils'

const localVue = createLocalVue()

describe('CampaignManagerReportActivityColumn (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  function mountCol(row) {
    return mount(CampaignManagerReportActivityColumn, {
      localVue,
      vuetify,
      propsData: { scope: { row } },
      stubs: {
        'v-tooltip': {
          template: '<div class="tooltip-stub"><slot name="activator" :on="{}" /><slot /></div>'
        },
        VIcon: { template: '<span class="v-icon-stub" />' }
      }
    })
  }

  it('does not render info tooltip for human activity without manual change', () => {
    const wrapper = mountCol({
      activityType: ACTIVITY_TYPES.HUMAN,
      isChangedActivity: false
    })

    expect(wrapper.text()).toContain(ACTIVITY_TYPES.HUMAN)
    expect(wrapper.find('.tooltip-stub').exists()).toBe(false)
  })

  it('renders tooltip for bot rows and uses default details-list message when sandBoxType is absent', () => {
    const wrapper = mountCol({
      activityType: ACTIVITY_TYPES.BOT
    })

    expect(wrapper.find('.tooltip-stub').exists()).toBe(true)
    expect(wrapper.vm.getActivityTooltipText()).toBe('Bot activities are displayed in the details list')
  })

  it('uses human-changed message when activity was corrected from bot to human', () => {
    const wrapper = mountCol({
      activityType: ACTIVITY_TYPES.HUMAN,
      isChangedActivity: true
    })

    expect(wrapper.find('.tooltip-stub').exists()).toBe(true)
    expect(wrapper.vm.getActivityTooltipText()).toBe('Bot activity has been changed to human activity')
  })

  it('maps sandBoxType 1 or 2 to Bot Activity Rules A1', () => {
    expect(mountCol({ activityType: ACTIVITY_TYPES.BOT, sandBoxType: 1 }).vm.getActivityTooltipText()).toBe(
      'Bot Activity Rules: A1'
    )
    expect(mountCol({ activityType: ACTIVITY_TYPES.BOT, sandBoxType: 2 }).vm.getActivityTooltipText()).toBe(
      'Bot Activity Rules: A1'
    )
  })

  it('maps sandBoxType bit bands A2, A3, A4.1, A4.2', () => {
    expect(mountCol({ activityType: ACTIVITY_TYPES.BOT, sandBoxType: 8 }).vm.getActivityTooltipText()).toBe(
      'Bot Activity Rules: A3'
    )
    expect(mountCol({ activityType: ACTIVITY_TYPES.BOT, sandBoxType: 16 }).vm.getActivityTooltipText()).toBe(
      'Bot Activity Rules: A4.1'
    )
    expect(mountCol({ activityType: ACTIVITY_TYPES.BOT, sandBoxType: 32 }).vm.getActivityTooltipText()).toBe(
      'Bot Activity Rules: A4.2'
    )
    expect(mountCol({ activityType: ACTIVITY_TYPES.BOT, sandBoxType: 7 }).vm.getActivityTooltipText()).toBe(
      'Bot Activity Rules: A2'
    )
  })
})
