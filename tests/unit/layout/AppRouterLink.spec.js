import AppRouterLink from '@/layout/AppRouterLink.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'

describe('AppRouterLink.vue', () => {
  const localVue = createLocalVue()

  it('getClass returns active-link when comparator is truthy', () => {
    const ctx = { comparator: true }
    expect(AppRouterLink.computed.getClass.call(ctx)).toContain('active-link')
  })

  it('getClass omits active-link when comparator is falsy', () => {
    const ctx = { comparator: false }
    expect(AppRouterLink.computed.getClass.call(ctx)).not.toContain('active-link')
  })

  it('comparator uses activeClassComparator when provided', () => {
    const fn = jest.fn(() => true)
    const ctx = { activeClassComparator: fn }
    expect(AppRouterLink.computed.comparator.call(ctx)).toBe(true)
    expect(fn).toHaveBeenCalled()
  })

  it('comparator falls back to routerName === routeName when no comparator', () => {
    expect(AppRouterLink.computed.comparator.call({ routerName: 'A', routeName: 'A' })).toBe(true)
    expect(AppRouterLink.computed.comparator.call({ routerName: 'A', routeName: 'B' })).toBe(false)
  })

  it('has correct component name', () => {
    expect(AppRouterLink.name).toBe('AppRouterLink')
  })

  it('renders routeText when provided and falls back to routeName', () => {
    const wrapperWithText = shallowMount(AppRouterLink, {
      localVue,
      stubs: ['router-link'],
      propsData: {
        to: '/x',
        routeText: 'Custom Label',
        routeName: 'Route Name'
      }
    })
    expect(wrapperWithText.text()).toContain('Custom Label')

    const wrapperFallback = shallowMount(AppRouterLink, {
      localVue,
      stubs: ['router-link'],
      propsData: {
        to: '/x',
        routeText: '',
        routeName: 'Fallback Name'
      }
    })
    expect(wrapperFallback.text()).toContain('Fallback Name')
  })

  it('emits click on router-link native click', async () => {
    const wrapper = shallowMount(AppRouterLink, {
      localVue,
      stubs: {
        'router-link': {
          functional: true,
          render(h, ctx) {
            return h('a', { on: ctx.data.nativeOn }, ctx.children)
          }
        }
      },
      propsData: { to: '/x', routeName: 'X', routerName: 'X' }
    })

    await wrapper.find('a').trigger('click')

    expect(wrapper.emitted().click).toBeTruthy()
  })
})
