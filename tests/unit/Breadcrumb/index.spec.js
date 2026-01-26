import { createLocalVue, mount } from '@vue/test-utils'
import Breadcrumb from '@/components/Breadcrumb.vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'

describe('Breadcrumb.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let vuetify
  let store
  let setupRouter
  
  // Mock router resolve mapping
  const routesHelpers = {
    'CurrentPage': {
      meta: { parentName: 'Parent' }
    },
    'Parent': {
      meta: { parentName: 'GrandParent' }
    },
    'GrandParent': {
      meta: { parentName: null }
    },
    'Training Report': {
      meta: { parentName: 'Reports' }
    },
    'Reports': {
      meta: { parentName: 'Company' }
    },
    'Company': {
      meta: { parentName: null }
    }
  }

  beforeEach(() => {
    vuetify = new Vuetify()
    store = new Vuex.Store({
      state: {
        common: {
          activeTrainingType: ''
        }
      }
    })

    setupRouter = (routeName) => ({
      name: routeName,
      meta: routesHelpers[routeName]?.meta || { parentName: null },
      resolve: (options) => {
        const name = options.name
        return {
          route: {
            meta: routesHelpers[name]?.meta || { parentName: null }
          }
        }
      }
    })
  })

  const mountBreadcrumb = (routeName, options = {}) => {
    const routerMock = setupRouter(routeName)
    return mount(Breadcrumb, {
      localVue,
      vuetify,
      store,
      stubs: ['router-link'],
      mocks: {
        $route: routerMock,
        $router: {
          resolve: routerMock.resolve
        },
        ...options.mocks
      },
      ...options
    })
  }

  it('generates breadcrumb with 3 levels', async () => {
    const wrapper = mountBreadcrumb('CurrentPage')
    await wrapper.vm.$nextTick()
    // Expected: GrandParent > Parent > CurrentPage
    expect(wrapper.vm.breadcrumb).toEqual(['GrandParent', 'Parent', 'CurrentPage'])
    
    const links = wrapper.findAll('router-link-stub')
    expect(links.length).toBe(3)
    
    // Check text rendering
    // Logic: {{ index === 0 ? baseName : item }}
    // GrandParent is index 0. baseName default is "Company".
    expect(links.at(0).text()).toBe('Company')
    expect(links.at(1).text()).toBe('Parent')
    expect(links.at(2).text()).toBe('CurrentPage')
  })

  it('uses custom baseName', async () => {
    const wrapper = mountBreadcrumb('CurrentPage', {
      propsData: { baseName: 'Home' }
    })
    await wrapper.vm.$nextTick()
    const links = wrapper.findAll('router-link-stub')
    expect(links.at(0).text()).toBe('Home')
  })

  it('modifies Training Report name based on store activeTrainingType', async () => {
    store.state.common.activeTrainingType = 'Video'
    const wrapper = mountBreadcrumb('Training Report')
    await wrapper.vm.$nextTick()
    // Training Report -> Video Report.
    // Parent depends on routeHelpers. Training Report -> Reports
    // Breadcrumb: Reports > Video Report
    
    expect(wrapper.vm.breadcrumb).toEqual(['Company', 'Reports', 'Video Report'])
    
    const links = wrapper.findAll('router-link-stub')
    expect(links.length).toBe(3)
    expect(links.at(2).text()).toBe('Video Report')
  })

  it('keeps Training Report name if activeTrainingType starts with SCORM', async () => {
    store.state.common.activeTrainingType = 'SCORM 1.2'
    const wrapper = mountBreadcrumb('Training Report')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.breadcrumb[2]).toBe('Training Report')
  })

  it('applies style to disabled items', async () => {
    // 'Company' is in the list of disabled items in component logic.
    // index 0 is 'Company'.
    const wrapper = mountBreadcrumb('Reports') 
    await wrapper.vm.$nextTick()
    // Breadcrumb: Company, Reports
    
    const links = wrapper.findAll('router-link-stub')
    // Check first link (Company)
    // We need to check style binding.
    // router-link-stub might bind style to root.
    
    const link0 = links.at(0)
    // Style binding is an array in template.
    // [ ..., { pointerEvents: 'none', opacity: 0.7 } ]
    
    // In Vue Test Utils 1, style can be checked via element.style
    expect(link0.element.style.pointerEvents).toBe('none')
    expect(link0.element.style.opacity).toBe('0.7')
  })
})
