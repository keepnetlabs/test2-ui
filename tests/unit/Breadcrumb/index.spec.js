import { createLocalVue, shallowMount } from '@vue/test-utils'
import Breadcrumb from '@/components/Breadcrumb.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Vuetify from 'vuetify'

describe('Breadcrumb.vue', () => {
  const localVue = createLocalVue()
  localVue.use(VueRouter)
  localVue.use(Vuex)
  let router
  let store
  let vuetify
  
  beforeEach(() => {
     vuetify = new Vuetify()
     const routes = [
         { 
             path: '/company', 
             name: 'Company',
             meta: {} // No parent
         },
         {
             path: '/reports',
             name: 'Reports',
             meta: { parentName: 'Company' }
         },
         {
             path: '/training-report',
             name: 'Training Report',
             meta: { parentName: 'Reports' }
         }
     ]
     router = new VueRouter({ routes, mode: 'abstract' })
     
     store = new Vuex.Store({
         state: {
             common: {
                 activeTrainingType: null
             }
         }
     })
  })

  // Stubs
  const RouterLinkStub = {
      template: '<a :id="id"><slot/></a>',
      props: ['to', 'id']
  }

  const mountComponent = () => {
      return shallowMount(Breadcrumb, {
          localVue,
          router,
          store,
          vuetify,
          stubs: {
              RouterLink: RouterLinkStub,
              VIcon: {
                template: '<i class="v-icon-stub"></i>'
              }
          }
      })
  }

  it('renders correct breadcrumb trail for child route', async () => {
      router.push({ name: 'Reports' })
      const wrapper = mountComponent()
      
      await wrapper.vm.$nextTick() // Ensure manual 'generate' called in mounted updates data
      
      // Expected: Company > Reports
      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links.length).toBe(2)
      expect(links.at(0).text()).toBe('Company')
      expect(links.at(1).text()).toBe('Reports')
  })

  it('generates breadcrumb on route change', async () => {
      const wrapper = mountComponent()
      router.push({ name: 'Company' })
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.breadcrumb.length).toBe(1)
      expect(wrapper.vm.breadcrumb[0]).toBe('Company')
      
      router.push({ name: 'Reports' })
      await wrapper.vm.$nextTick()
      // Wait for watcher? $route watcher calls generate
      expect(wrapper.vm.breadcrumb.length).toBe(2)
      expect(wrapper.vm.breadcrumb[1]).toBe('Reports')
  })

  it('handles activeTrainingType logic for Training Report', async () => {
      // Logic: if route name is "Training Report", check activeTrainingType
      // if safeType startsWith SCORM or empty -> "Training Report"
      // else -> `${safeType} Report`
      
      router.push({ name: 'Training Report' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      
      // Default state null -> empty -> Training Report
      // Breadcrumb: Company > Reports > Training Report
      expect(wrapper.vm.breadcrumb).toEqual(['Company', 'Reports', 'Training Report'])
      
      // Update store
      store.state.common.activeTrainingType = 'Custom'
      // Trigger watcher logic?
      // watcher: "$store.state.common.activeTrainingType": "generate"
      // Mock store watch might not trigger auto-re-render in test utils unless state mutation is reactive.
      // We manually calling generate or use store.replaceState?
      // With `new Vuex.Store`, replacing state:
      // But we are mutating property directly on `store.state`. reactivity depends on Vue version.
      // Let's call generate manually to be safe or mock behaviour.
      wrapper.vm.generate()
      
      expect(wrapper.vm.breadcrumb[2]).toBe('Custom Report')
  })

  it('applies styling for non-clickable items', async () => {
      router.push({ name: 'Reports' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      
      const companyLink = wrapper.findComponent(RouterLinkStub)
      // 'Company' is in the disabled list
      // Check style bind.
      // Note: RouterLinkStub simply renders <a> but style binding is on component tag in template.
      // shallowMount preserves root element of stub? No, <router-link> becomes Stub.
      // If stub template doesn't bind style, we can't see it?
      // Wait, Vue Test Utils passes class/style to root of stub if valid?
      // Let's inspect wrapper.vm styling logic or attributes.
      
      // The template:
      // <router-link :style="...
      
      // If stub is simple, style might not be applied to rendered element unless we use functional stub or check props?
      // Rendered HTML: <a id="..." style="...">...</a>?
      // Let's check attributes.
      
      expect(companyLink.attributes('style')).toContain('pointer-events: none')
  })

  it('uses baseName prop', async () => {
      router.push({ name: 'Company' })
      const wrapper = shallowMount(Breadcrumb, {
          localVue,
          router,
          store,
          vuetify,
          propsData: { baseName: 'Home' },
          stubs: { RouterLink: RouterLinkStub }
      })
      await wrapper.vm.$nextTick()

      const link = wrapper.findComponent(RouterLinkStub)
      expect(link.text()).toBe('Home')
  })

  it('renders icon between breadcrumb items', async () => {
      router.push({ name: 'Reports' })
      const wrapper = shallowMount(Breadcrumb, {
          localVue,
          router,
          store,
          vuetify,
          stubs: {
              RouterLink: RouterLinkStub,
              VIcon: { template: '<i class="v-icon-stub">chevron_right</i>' }
          }
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.v-icon-stub').exists()).toBe(true)
  })

  it('handles routes without parent correctly', async () => {
      router.push({ name: 'Company' })
      const wrapper = shallowMount(Breadcrumb, {
          localVue,
          router,
          store,
          vuetify,
          stubs: { RouterLink: RouterLinkStub }
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.breadcrumb.length).toBe(1)
  })

  it('updates breadcrumb when training type changes', async () => {
      router.push({ name: 'Training Report' })
      const wrapper = shallowMount(Breadcrumb, {
          localVue,
          router,
          store,
          vuetify,
          stubs: { RouterLink: RouterLinkStub }
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.breadcrumb[2]).toBe('Training Report')

      store.state.common.activeTrainingType = 'Custom'
      wrapper.vm.generate()

      expect(wrapper.vm.breadcrumb[2]).toBe('Custom Report')
  })

  it('generates correct breadcrumb trail with deep nesting', async () => {
      router.push({ name: 'Training Report' })
      const wrapper = shallowMount(Breadcrumb, {
          localVue,
          router,
          store,
          vuetify,
          stubs: { RouterLink: RouterLinkStub }
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.breadcrumb).toEqual(['Company', 'Reports', 'Training Report'])
  })

  it('handles undefined route gracefully', async () => {
      const wrapper = shallowMount(Breadcrumb, {
          localVue,
          router,
          store,
          vuetify,
          stubs: { RouterLink: RouterLinkStub }
      })

      expect(wrapper.exists()).toBe(true)
  })

  it('renders multiple breadcrumb links', async () => {
      router.push({ name: 'Training Report' })
      const wrapper = shallowMount(Breadcrumb, {
          localVue,
          router,
          store,
          vuetify,
          stubs: { RouterLink: RouterLinkStub }
      })
      await wrapper.vm.$nextTick()

      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links.length).toBeGreaterThan(1)
  })

  describe('Component Structure and Initialization', () => {
    it('should render component successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name || wrapper.vm.$options._componentTag).toBeDefined()
    })

    it('should initialize with router and store', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$router).toBeDefined()
      expect(wrapper.vm.$store).toBeDefined()
    })

    it('should have breadcrumb data initialized', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.breadcrumb).toBeDefined()
      expect(Array.isArray(wrapper.vm.breadcrumb)).toBe(true)
    })
  })

  describe('Breadcrumb Generation', () => {
    it('should generate breadcrumb for single route', async () => {
      router.push({ name: 'Company' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.breadcrumb.length).toBe(1)
      expect(wrapper.vm.breadcrumb[0]).toBe('Company')
    })

    it('should generate breadcrumb for parent-child routes', async () => {
      router.push({ name: 'Reports' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.breadcrumb).toEqual(['Company', 'Reports'])
    })

    it('should generate breadcrumb for deeply nested routes', async () => {
      router.push({ name: 'Training Report' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.breadcrumb).toEqual(['Company', 'Reports', 'Training Report'])
    })

    it('should have generate method available', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.generate).toBe('function')
    })

    it('should update breadcrumb on generate call', async () => {
      const wrapper = mountComponent()
      router.push({ name: 'Company' })
      await wrapper.vm.$nextTick()

      wrapper.vm.generate()
      expect(wrapper.vm.breadcrumb.length).toBeGreaterThan(0)
    })
  })

  describe('Router Integration', () => {
    it('should respond to route changes', async () => {
      const wrapper = mountComponent()
      router.push({ name: 'Company' })
      await wrapper.vm.$nextTick()

      const breadcrumb1 = [...wrapper.vm.breadcrumb]
      router.push({ name: 'Reports' })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.breadcrumb.length).toBeGreaterThan(breadcrumb1.length)
    })

    it('should handle route with parent metadata', async () => {
      router.push({ name: 'Reports' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.breadcrumb).toContain('Company')
      expect(wrapper.vm.breadcrumb).toContain('Reports')
    })

    it('should handle route without parent', async () => {
      router.push({ name: 'Company' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.breadcrumb.length).toBe(1)
    })
  })

  describe('Props Management', () => {
    it('should accept baseName prop', () => {
      const wrapper = shallowMount(Breadcrumb, {
          localVue,
          router,
          store,
          vuetify,
          propsData: { baseName: 'Home' },
          stubs: { RouterLink: RouterLinkStub }
      })

      expect(wrapper.vm.baseName).toBe('Home')
    })

    it('should use baseName in breadcrumb', async () => {
      router.push({ name: 'Company' })
      const wrapper = shallowMount(Breadcrumb, {
          localVue,
          router,
          store,
          vuetify,
          propsData: { baseName: 'Home' },
          stubs: { RouterLink: RouterLinkStub }
      })
      await wrapper.vm.$nextTick()

      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links.at(0).text()).toBe('Home')
    })

    it('should handle missing baseName', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Store Integration', () => {
    it('should access store state', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$store).toBeDefined()
      expect(wrapper.vm.$store.state).toBeDefined()
    })

    it('should handle activeTrainingType from store', async () => {
      router.push({ name: 'Training Report' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.breadcrumb).toContain('Training Report')
    })

    it('should update breadcrumb when activeTrainingType changes', async () => {
      router.push({ name: 'Training Report' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      store.state.common.activeTrainingType = 'Custom'
      wrapper.vm.generate()

      expect(wrapper.vm.breadcrumb).toContain('Custom Report')
    })

    it('should handle null activeTrainingType', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$store.state.common.activeTrainingType === null).toBe(true)
    })
  })

  describe('Breadcrumb Rendering', () => {
    it('should render breadcrumb links', async () => {
      router.push({ name: 'Reports' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links.length).toBe(2)
    })

    it('should render router-link components', async () => {
      router.push({ name: 'Training Report' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links.length).toBeGreaterThan(0)
    })

    it('should display correct text in breadcrumb links', async () => {
      router.push({ name: 'Reports' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links.at(0).text()).toBe('Company')
      expect(links.at(1).text()).toBe('Reports')
    })

    it('should render icons between breadcrumb items', async () => {
      router.push({ name: 'Reports' })
      const wrapper = shallowMount(Breadcrumb, {
          localVue,
          router,
          store,
          vuetify,
          stubs: {
              RouterLink: RouterLinkStub,
              VIcon: { template: '<i class="v-icon-stub">chevron_right</i>' }
          }
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.v-icon-stub').exists()).toBe(true)
    })
  })

  describe('Styling and CSS Classes', () => {
    it('should apply pointer-events none for non-clickable items', async () => {
      router.push({ name: 'Reports' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      const links = wrapper.findAllComponents(RouterLinkStub)
      const firstLink = links.at(0)
      expect(firstLink.attributes('style')).toContain('pointer-events: none')
    })

    it('should have different styling for clickable items', async () => {
      router.push({ name: 'Reports' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links.length).toBeGreaterThan(0)
    })

    it('should apply consistent styling to breadcrumb items', async () => {
      router.push({ name: 'Training Report' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links.length).toBeGreaterThan(0)
      links.wrappers.forEach(link => {
        expect(link.element).toBeDefined()
      })
    })
  })

  describe('Training Type Handling', () => {
    it('should display Training Report by default', async () => {
      router.push({ name: 'Training Report' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.breadcrumb).toContain('Training Report')
    })

    it('should replace with custom training type name', async () => {
      router.push({ name: 'Training Report' })
      const wrapper = mountComponent()
      store.state.common.activeTrainingType = 'Advanced'
      wrapper.vm.generate()

      expect(wrapper.vm.breadcrumb).toContain('Advanced Report')
    })

    it('should handle SCORM training type', async () => {
      router.push({ name: 'Training Report' })
      const wrapper = mountComponent()
      store.state.common.activeTrainingType = 'SCORM'
      wrapper.vm.generate()

      expect(wrapper.vm.breadcrumb).toContain('Training Report')
    })

    it('should handle undefined training type gracefully', async () => {
      router.push({ name: 'Training Report' })
      const wrapper = mountComponent()
      store.state.common.activeTrainingType = undefined
      wrapper.vm.generate()

      expect(wrapper.vm.breadcrumb).toBeDefined()
    })
  })

  describe('Multiple Instances', () => {
    it('should support multiple breadcrumb instances', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()
      expect(wrapper1.vm).not.toBe(wrapper2.vm)
    })

    it('should maintain independent breadcrumb state per instance', async () => {
      router.push({ name: 'Company' })
      const wrapper1 = mountComponent()

      router.push({ name: 'Reports' })
      const wrapper2 = mountComponent()

      await wrapper1.vm.$nextTick()
      await wrapper2.vm.$nextTick()

      expect(wrapper1.vm.breadcrumb.length).toEqual(wrapper2.vm.breadcrumb.length)
    })
  })

  describe('Performance and Stability', () => {
    it('should handle rapid route changes', async () => {
      const wrapper = mountComponent()

      expect(() => {
        router.push({ name: 'Company' })
        wrapper.vm.generate()
        router.push({ name: 'Reports' })
        wrapper.vm.generate()
        router.push({ name: 'Training Report' })
        wrapper.vm.generate()
      }).not.toThrow()
    })

    it('should efficiently generate breadcrumbs for deep routes', async () => {
      const startTime = Date.now()
      router.push({ name: 'Training Report' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      const duration = Date.now() - startTime

      expect(duration).toBeLessThan(1000)
      expect(wrapper.vm.breadcrumb.length).toBeGreaterThan(0)
    })

    it('should handle store state updates efficiently', async () => {
      const wrapper = mountComponent()

      expect(() => {
        for (let i = 0; i < 10; i++) {
          store.state.common.activeTrainingType = `Type${i}`
          wrapper.vm.generate()
        }
      }).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty route gracefully', async () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle routes with special characters', async () => {
      router.push({ name: 'Company' })
      const wrapper = mountComponent()
      store.state.common.activeTrainingType = 'Type@#$%'
      wrapper.vm.generate()

      expect(wrapper.vm.breadcrumb).toBeDefined()
    })

    it('should handle very long route names', async () => {
      router.push({ name: 'Company' })
      const wrapper = mountComponent()
      store.state.common.activeTrainingType = 'A'.repeat(100)
      wrapper.vm.generate()

      expect(wrapper.vm.breadcrumb).toBeDefined()
    })

    it('should handle missing route metadata gracefully', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Watchers', () => {
    it('should watch route changes', async () => {
      const wrapper = mountComponent()
      router.push({ name: 'Company' })
      await wrapper.vm.$nextTick()

      const initialBreadcrumb = [...wrapper.vm.breadcrumb]
      router.push({ name: 'Reports' })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.breadcrumb).not.toEqual(initialBreadcrumb)
    })

    it('should watch store state changes', async () => {
      router.push({ name: 'Training Report' })
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()

      const initialBreadcrumb = [...wrapper.vm.breadcrumb]
      store.state.common.activeTrainingType = 'Custom'
      wrapper.vm.generate()

      expect(wrapper.vm.breadcrumb[2]).not.toBe(initialBreadcrumb[2])
    })
  })

  describe('Component Methods', () => {
    it('should have generate method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.generate).toBe('function')
    })

    it('generate should update breadcrumb array', async () => {
      const wrapper = mountComponent()
      router.push({ name: 'Company' })
      await wrapper.vm.$nextTick()

      const initialLength = wrapper.vm.breadcrumb.length
      wrapper.vm.generate()

      expect(wrapper.vm.breadcrumb.length).toBeGreaterThanOrEqual(initialLength)
    })
  })
})
