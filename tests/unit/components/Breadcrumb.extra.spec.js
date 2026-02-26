import { shallowMount } from '@vue/test-utils'
import Breadcrumb from '@/components/Breadcrumb.vue'

describe('Breadcrumb.vue (extra)', () => {
  const mountComponent = (resolveMap = {}) =>
    shallowMount(Breadcrumb, {
      mocks: {
        $route: { name: 'Dashboard', meta: { parentName: 'Company' } },
        $router: {
          resolve: ({ name }) => resolveMap[name] || { route: { meta: { parentName: null } } }
        },
        $store: { state: { common: { activeTrainingType: '' } } }
      },
      stubs: {
        'router-link': true,
        'v-icon': true
      }
    })

  it('generate maps Training Report to specific report type for non-SCORM values', () => {
    const wrapper = mountComponent({
      Company: { route: { meta: { parentName: null } } },
      'Awareness Educator': { route: { meta: { parentName: 'Company' } } }
    })
    wrapper.vm.$route.name = 'Training Report'
    wrapper.vm.$route.meta.parentName = 'Awareness Educator'
    wrapper.vm.$store.state.common.activeTrainingType = 'Poster'

    wrapper.vm.generate()

    expect(wrapper.vm.breadcrumb).toEqual(['Company', 'Awareness Educator', 'Poster Report'])
  })

  it('getItemId converts falsy and non-string values safely', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getItemId(false)).toBe('breadcrumb-link--')
    expect(wrapper.vm.getItemId(0)).toBe('breadcrumb-link--')
    expect(wrapper.vm.getItemId(7)).toBe('breadcrumb-link--7')
  })

  it('generate keeps Training Report when active type starts with SCORM', () => {
    const wrapper = mountComponent({
      Company: { route: { meta: { parentName: null } } },
      'Awareness Educator': { route: { meta: { parentName: 'Company' } } }
    })
    wrapper.vm.$route.name = 'Training Report'
    wrapper.vm.$route.meta.parentName = 'Awareness Educator'
    wrapper.vm.$store.state.common.activeTrainingType = 'SCORM Content'

    wrapper.vm.generate()

    expect(wrapper.vm.breadcrumb).toEqual(['Company', 'Awareness Educator', 'Training Report'])
  })

  it('generate builds deep parent chain until null parent', () => {
    const wrapper = mountComponent({
      Root: { route: { meta: { parentName: null } } },
      Company: { route: { meta: { parentName: 'Root' } } },
      Section: { route: { meta: { parentName: 'Company' } } }
    })
    wrapper.vm.$route.name = 'Dashboard'
    wrapper.vm.$route.meta.parentName = 'Section'

    wrapper.vm.generate()

    expect(wrapper.vm.breadcrumb).toEqual(['Root', 'Company', 'Section', 'Dashboard'])
  })
})
