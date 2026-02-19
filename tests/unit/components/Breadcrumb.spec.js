import { shallowMount } from '@vue/test-utils'
import Breadcrumb from '@/components/Breadcrumb.vue'

describe('Breadcrumb.vue', () => {
  const mountComponent = ({
    routeName = 'Dashboard',
    routeParent = null,
    activeTrainingType = ''
  } = {}) => {
    const routeMap = {
      Dashboard: { meta: { parentName: 'Company' } },
      Company: { meta: { parentName: null } },
      'Training Report': { meta: { parentName: 'Awareness Educator' } },
      'Awareness Educator': { meta: { parentName: 'Company' } }
    }

    const $route = {
      name: routeName,
      meta: { parentName: routeParent ?? (routeMap[routeName]?.meta?.parentName || null) }
    }
    const $router = {
      resolve: ({ name }) => ({
        route: routeMap[name] || { meta: { parentName: null } }
      })
    }
    const $store = {
      state: {
        common: {
          activeTrainingType
        }
      }
    }

    return shallowMount(Breadcrumb, {
      mocks: { $route, $router, $store },
      stubs: {
        'router-link': true,
        'v-icon': true
      }
    })
  }

  it('generates breadcrumb with parent chain on mount', () => {
    const wrapper = mountComponent({ routeName: 'Dashboard' })
    expect(wrapper.vm.breadcrumb).toEqual(['Company', 'Dashboard'])
  })

  it('maps Training Report name by active training type', () => {
    const wrapper = mountComponent({
      routeName: 'Training Report',
      activeTrainingType: 'Survey'
    })
    expect(wrapper.vm.breadcrumb).toEqual(['Company', 'Awareness Educator', 'Survey Report'])
  })

  it('keeps Training Report when active type is empty or SCORM', () => {
    const wrapper1 = mountComponent({
      routeName: 'Training Report',
      activeTrainingType: ''
    })
    expect(wrapper1.vm.breadcrumb).toContain('Training Report')

    const wrapper2 = mountComponent({
      routeName: 'Training Report',
      activeTrainingType: 'SCORM - Intro'
    })
    expect(wrapper2.vm.breadcrumb).toContain('Training Report')
  })

  it('getItemId removes spaces and prefixes with breadcrumb-link', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getItemId('Awareness Educator')).toBe('breadcrumb-link--AwarenessEducator')
    expect(wrapper.vm.getItemId(123)).toBe('breadcrumb-link--123')
  })

  it('generate safely handles non-string route name and training type', () => {
    const wrapper = mountComponent({ routeName: 'Dashboard' })
    wrapper.vm.$route.name = null
    wrapper.vm.$store.state.common.activeTrainingType = { type: 'invalid' }

    wrapper.vm.generate()

    expect(wrapper.vm.breadcrumb).toEqual(['Company', ''])
  })

  it('getItemId handles undefined input gracefully', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getItemId()).toBe('breadcrumb-link--')
  })
})
