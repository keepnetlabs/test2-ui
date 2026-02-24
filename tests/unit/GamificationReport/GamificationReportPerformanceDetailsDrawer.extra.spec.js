import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportPerformanceDetailsDrawer from '@/components/GamificationReport/GamificationReportPerformanceDetails/GamificationReportPerformanceDetailsDrawer.vue'

describe('GamificationReportPerformanceDetailsDrawer.vue (extra coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) =>
    shallowMount(GamificationReportPerformanceDetailsDrawer, {
      localVue,
      propsData: {
        status: true,
        selectedRow: {
          firstName: 'John',
          lastName: 'Doe',
          points: 2800
        },
        ...propsData
      },
      stubs: {
        VNavigationDrawer: { template: '<div class="drawer"><slot /></div>' },
        VListItem: true,
        VListItemContent: true,
        VListItemTitle: true,
        VListItemSubtitle: true,
        VIcon: true,
        GamificationReportPerformanceDetailsTable: true,
        GamificationReportPerformanceDetailsInfoCard: true
      },
      directives: {
        'click-outside': {}
      }
    })

  it('contains expected static columns and action columns schema', () => {
    const wrapper = mountComponent()

    expect(wrapper.vm.columns.map((c) => c.key)).toEqual([
      'activityType',
      'performance',
      'points',
      'maxPoints'
    ])
    expect(wrapper.vm.actionColumns.some((c) => c.type === 'link')).toBe(true)
    expect(wrapper.vm.actionColumns.some((c) => c.type === 'badge')).toBe(true)
  })

  it('actionColumns keeps duplicated activityName key entries (current design)', () => {
    const wrapper = mountComponent()
    const activityNameCols = wrapper.vm.actionColumns.filter((c) => c.key === 'activityName')

    expect(activityNameCols).toHaveLength(2)
  })

  it('table data and action table data have expected default row counts', () => {
    const wrapper = mountComponent()

    expect(wrapper.vm.tableData.length).toBeGreaterThan(0)
    expect(wrapper.vm.actionTableData.length).toBeGreaterThan(0)
  })

  it('handleDrawerClickOutside emits on-close each time it is called', () => {
    const wrapper = mountComponent()

    wrapper.vm.handleDrawerClickOutside()
    wrapper.vm.handleDrawerClickOutside()

    expect(wrapper.emitted('on-close')).toHaveLength(2)
  })

  it('renders user name and points in template text', () => {
    const wrapper = mountComponent({
      selectedRow: { firstName: 'Alice', lastName: 'Smith', points: 1500 }
    })

    const html = wrapper.html()
    expect(html).toContain('Alice')
    expect(html).toContain('Smith')
    expect(html).toContain('1500')
  })
})
