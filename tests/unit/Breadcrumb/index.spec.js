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
})
