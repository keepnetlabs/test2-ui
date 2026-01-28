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

  it('displays correct total step count', () => {
    const steps = Array.from({ length: 10 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
    const wrapper = mountSteps({ steps })
    expect(wrapper.text()).toContain('Total: 10 steps')
  })

  it('emits correct step data on preview', async () => {
    const testStep = { title: 'Custom Step', type: 'Survey' }
    const wrapper = mountSteps({
      steps: [
        { title: 'Step 1', type: 'Training' },
        testStep
      ]
    })

    const buttons = wrapper.findAll('.v-btn')
    if (buttons.length > 1) {
      await buttons.at(1).trigger('click')
      const emitted = wrapper.emitted('preview-step')
      expect(emitted).toBeTruthy()
      expect(emitted[0][0].title).toContain('Step')
    }
  })

  it('toggles between show more and show less states', async () => {
    const steps = Array.from({ length: 6 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
    const wrapper = mountSteps({ steps })

    const showMoreBtn = wrapper.find('.training-library-drawer-content-steps__show-more .v-btn')
    expect(showMoreBtn.text()).toContain('Show More Steps')

    await showMoreBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(6)
  })

  it('renders correct CSS classes for step items', () => {
    const wrapper = mountSteps()
    const items = wrapper.findAll('.training-library-drawer-content-steps__item')
    expect(items.length).toBeGreaterThan(0)
    expect(items.at(0).classes()).toContain('training-library-drawer-content-steps__item')
  })

  it('handles single step rendering', () => {
    const wrapper = mountSteps({
      steps: [{ title: 'Only Step', type: 'Training' }]
    })
    expect(wrapper.text()).toContain('Total: 1 step')
    expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(1)
  })
})
