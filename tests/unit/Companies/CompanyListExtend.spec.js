import { shallowMount } from '@vue/test-utils'
import CompanyListExtend from '@/components/Companies/CompanyListExtend.vue'

describe('CompanyListExtend.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CompanyListExtend, {
      propsData: {
        selectedRow: {
          companyName: 'Acme',
          numberOfUsers: 10,
          industryName: 'IT',
          licenseTypeName: 'Gold',
          licenseEndDate: '2026-12-31'
        },
        selectedExtend: {
          statusId: 1,
          statusName: 'Active',
          companyGroups: [{ name: 'Group 1', resourceId: 'g-1' }]
        },
        top: 10,
        tableHeight: 300,
        ...propsData
      },
      stubs: {
        CompanyListExtendLoading: {
          name: 'CompanyListExtendLoading',
          template: '<div><slot name="skeleton-content" /></div>'
        },
        VBtn: true,
        VIcon: true
      },
      mocks: {
        $router: {
          push: jest.fn()
        }
      }
    })

  beforeEach(() => {
    localStorage.clear()
  })

  it('renders status badge only for status id 0 or 1', async () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getStatusId).toBe('1')
    expect(wrapper.vm.shouldRenderStatusBadge).toBe(true)

    await wrapper.setProps({ selectedExtend: { statusId: 0, companyGroups: [] } })
    expect(wrapper.vm.getStatusId).toBe('0')
    expect(wrapper.vm.shouldRenderStatusBadge).toBe(true)

    await wrapper.setProps({ selectedExtend: { statusId: 3, companyGroups: [] } })
    expect(wrapper.vm.getStatusId).toBe('3')
    expect(wrapper.vm.shouldRenderStatusBadge).toBe(false)
  })

  it('returns undefined status id and hides badge when status is missing', async () => {
    const wrapper = createWrapper({ selectedExtend: {} })
    expect(wrapper.vm.getStatusId).toBeUndefined()
    expect(wrapper.vm.shouldRenderStatusBadge).toBe(false)
  })

  it('updates group count and loading state from selectedExtend watcher', async () => {
    const wrapper = createWrapper({ selectedExtend: { statusId: 1, companyGroups: [] } })
    expect(wrapper.vm.isLoading).toBe(true)

    await wrapper.setProps({
      selectedExtend: {
        statusId: 1,
        companyGroups: [{ name: 'A' }, { name: 'B' }, { name: 'C' }]
      }
    })

    expect(wrapper.vm.groupCount).toBe(3)
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('calculates position based on table and extend heights', () => {
    const wrapper = createWrapper({ top: 50, tableHeight: 200 })
    Object.defineProperty(wrapper.vm, '$el', {
      value: { clientHeight: 120 },
      writable: true
    })

    expect(wrapper.vm.setPosition()).toBe(50)

    Object.defineProperty(wrapper.vm, '$el', {
      value: { clientHeight: 250 },
      writable: true
    })
    expect(wrapper.vm.setPosition()).toBe(0)
  })

  it('returns adjusted top when table is taller but current top overflows', () => {
    const wrapper = createWrapper({ top: 120, tableHeight: 200 })
    Object.defineProperty(wrapper.vm, '$el', {
      value: { clientHeight: 100 },
      writable: true
    })

    expect(wrapper.vm.setPosition()).toBe(100)
  })

  it('returns top value when element is not available', () => {
    const wrapper = createWrapper({ top: 42, tableHeight: 300 })
    Object.defineProperty(wrapper.vm, '$el', {
      value: undefined,
      writable: true
    })

    expect(wrapper.vm.setPosition()).toBe(42)
  })

  it('close action resets loading and emits close event', () => {
    const wrapper = createWrapper()
    wrapper.setData({ isLoading: false })

    wrapper.vm.clickClose()

    expect(wrapper.vm.isLoading).toBe(true)
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('toggles group limiter with limitOn and limitOff', () => {
    const wrapper = createWrapper()
    wrapper.setData({ groupCount: 8, limiter: 3 })

    wrapper.vm.limitOn()
    expect(wrapper.vm.limiter).toBe(8)

    wrapper.vm.limitOff()
    expect(wrapper.vm.limiter).toBe(3)
  })

  it('navigates to group details and writes localStorage', () => {
    const wrapper = createWrapper()

    wrapper.vm.goToDetails('Group A', 'g-99')

    expect(localStorage.getItem('companyGroupName')).toBe('Group A')
    expect(localStorage.getItem('companyGroupResourceId')).toBe('g-99')
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Company Group Details',
      params: { groupId: 'g-99' }
    })
  })

  it('keeps loading state when selectedExtend has no companyGroups', async () => {
    const wrapper = createWrapper({ selectedExtend: { statusId: 1 } })
    await wrapper.setData({ isLoading: true, groupCount: 0 })

    await wrapper.setProps({ selectedExtend: { statusId: 1 } })

    expect(wrapper.vm.isLoading).toBe(true)
    expect(wrapper.vm.groupCount).toBe(0)
  })

  it('calls setPosition in updated lifecycle hook', () => {
    const wrapper = createWrapper()
    const spy = jest.spyOn(wrapper.vm, 'setPosition').mockReturnValue(0)

    wrapper.vm.$options.updated[0].call(wrapper.vm)
    expect(spy).toHaveBeenCalled()
  })
})
