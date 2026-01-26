import { createLocalVue, mount } from '@vue/test-utils'
import TrainingLibraryDrawerContentSteps from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryDrawerContentSteps.vue'
import Vuetify from 'vuetify'

describe('TrainingLibraryDrawerContentSteps.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountSteps = (propsData = {}) => {
    return mount(TrainingLibraryDrawerContentSteps, {
      localVue,
      vuetify,
      propsData: {
        steps: [
          { title: 'Step 1', type: 'Training' },
          { title: 'Step 2', type: 'Survey' }
        ],
        ...propsData
      }
    })
  }

  it('renders correctly', () => {
    const wrapper = mountSteps()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Total: 2 steps')
    expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(2)
  })

  it('emits preview-step', async () => {
    const wrapper = mountSteps()
    const btn = wrapper.find('.v-btn')
    await btn.trigger('click')
    
    expect(wrapper.emitted('preview-step')).toBeTruthy()
    expect(wrapper.emitted('preview-step')[0]).toEqual([{ title: 'Step 1', type: 'Training' }])
  })

  it('handles show more logic', async () => {
    // Generate 6 steps
    const steps = Array.from({ length: 6 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
    const wrapper = mountSteps({ steps })
    
    // Initial state: 5 items shown
    expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(5)
    
    // Show more button exists
    const showMoreBtn = wrapper.find('.training-library-drawer-content-steps__show-more .v-btn')
    expect(showMoreBtn.exists()).toBe(true)
    expect(showMoreBtn.text()).toContain('Show More Steps')
    
    // Click show more
    await showMoreBtn.trigger('click')
    
    // Now all 6 items shown
    expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(6)
    expect(showMoreBtn.text()).toContain('Show Less Steps')
    
    // Click show less
    await showMoreBtn.trigger('click')
    expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(5)
  })

  it('does not show "Show More" if steps <= 5', () => {
    const steps = Array.from({ length: 5 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
    const wrapper = mountSteps({ steps })
    
    expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(5)
    expect(wrapper.find('.training-library-drawer-content-steps__show-more').exists()).toBe(false)
  })
})
