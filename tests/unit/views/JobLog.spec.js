import { shallowMount } from '@vue/test-utils'
import JobLog from '@/views/JobLog.vue'

describe('JobLog.vue', () => {
  const mountComponent = () =>
    shallowMount(JobLog, {
      stubs: {
        KContainer: true,
        JobLogTable: true,
        JobLogDetailsTable: true
      }
    })

  it('renders and initializes with hidden details state', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$options.name).toBe('JobLog')
    expect(wrapper.vm.isShowDetails).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
    wrapper.destroy()
  })

  it('toggleShowDetailsTable toggles visibility and clears selected row when closing', () => {
    const ctx = {
      isShowDetails: false,
      selectedRow: { id: 1 }
    }

    JobLog.methods.toggleShowDetailsTable.call(ctx)
    expect(ctx.isShowDetails).toBe(true)
    expect(ctx.selectedRow).toEqual({ id: 1 })

    JobLog.methods.toggleShowDetailsTable.call(ctx)
    expect(ctx.isShowDetails).toBe(false)
    expect(ctx.selectedRow).toBe(null)
  })

  it('handleDetailsClick sets row and opens details table', () => {
    const toggleShowDetailsTable = jest.fn()
    const ctx = {
      selectedRow: null,
      toggleShowDetailsTable
    }
    const row = { resourceId: 'job-1' }

    JobLog.methods.handleDetailsClick.call(ctx, row)

    expect(ctx.selectedRow).toEqual(row)
    expect(toggleShowDetailsTable).toHaveBeenCalledTimes(1)
  })
})
