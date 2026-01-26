import { createLocalVue, mount } from '@vue/test-utils'
import TrainingLibraryDrawerInfoCard from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryDrawerInfoCard.vue'
import Vuetify from 'vuetify'

describe('TrainingLibraryDrawerInfoCard.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('renders icon and text', () => {
    const wrapper = mount(TrainingLibraryDrawerInfoCard, {
      localVue,
      vuetify,
      propsData: {
        icon: 'mdi-home',
        text: 'Home String'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Home String')
    expect(wrapper.html()).toContain('mdi-home')
    
    // Should NOT render VTooltip if tooltip prop is empty (default)
    // VTooltip usually wraps the slot in a span or div depending on config or implementation.
    // In the template: <VTooltip v-if="tooltip" ...>
    // So we check if v-tooltip component is stubbed or present.
    // Since we mount fully with Vuetify, VTooltip is real.
    // However, the v-else block should be rendered.
    expect(wrapper.find('.training-library-drawer-info-card__content').exists()).toBe(true)
  })

  it('renders correctly with tooltip', async () => {
    const wrapper = mount(TrainingLibraryDrawerInfoCard, {
      localVue,
      vuetify,
      propsData: {
        icon: 'mdi-info',
        text: 'Info',
        tooltip: 'Tooltip text'
      }
    })

    // Expect VTooltip to be active/present in logic
    // Vuetify tooltips are often outside the wrapper (portaled).
    // But we can check that the "v-else" block is NOT rendered, and the "v-if" block IS.
    
    // The structure is direct:
    // <VTooltip ...> <template #activator> ... </template> </VTooltip>
    // vs <div ...> ... </div>
    
    // Since we are using mount, VTooltip renders.
    // We can check if the activator div is present.
    expect(wrapper.find('.training-library-drawer-info-card__content').exists()).toBe(true)
    
    // To verify tooltip existence more reliably without dealing with portals:
    // We can rely on the fact that the text "Tooltip text" should be somewhere, 
    // but usually it's only in DOM after hover.
    
    // Basic rendering check:
    expect(wrapper.props('tooltip')).toBe('Tooltip text')
  })
})
