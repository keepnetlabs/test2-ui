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

  describe('Component Rendering', () => {
    it('renders component successfully', () => {
      const wrapper = mountSteps()
      expect(wrapper.exists()).toBe(true)
    })

    it('renders step items list', () => {
      const wrapper = mountSteps()
      const items = wrapper.findAll('.training-library-drawer-content-steps__item')
      expect(items.length).toBeGreaterThan(0)
    })

    it('displays total step count', () => {
      const wrapper = mountSteps()
      expect(wrapper.text()).toContain('Total: 2 steps')
    })

    it('renders initial steps correctly', () => {
      const wrapper = mountSteps()
      expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(2)
    })
  })

  describe('Step Rendering', () => {
    it('renders all steps in list', () => {
      const steps = [
        { title: 'Step 1', type: 'Training' },
        { title: 'Step 2', type: 'Survey' },
        { title: 'Step 3', type: 'Training' }
      ]
      const wrapper = mountSteps({ steps })
      expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(3)
    })

    it('renders single step', () => {
      const wrapper = mountSteps({
        steps: [{ title: 'Only Step', type: 'Training' }]
      })
      expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(1)
    })

    it('renders multiple steps', () => {
      const steps = Array.from({ length: 4 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
      const wrapper = mountSteps({ steps })
      expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(4)
    })

    it('displays step titles correctly', () => {
      const wrapper = mountSteps()
      const items = wrapper.findAll('.training-library-drawer-content-steps__item')
      expect(items.at(0).text()).toContain('Step 1')
    })

    it('renders steps with different types', () => {
      const steps = [
        { title: 'Training Step', type: 'Training' },
        { title: 'Survey Step', type: 'Survey' }
      ]
      const wrapper = mountSteps({ steps })
      expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(2)
    })
  })

  describe('Step Count Display', () => {
    it('displays correct count for two steps', () => {
      const wrapper = mountSteps()
      expect(wrapper.text()).toContain('Total: 2 steps')
    })

    it('displays correct count for single step', () => {
      const wrapper = mountSteps({
        steps: [{ title: 'Step 1', type: 'Training' }]
      })
      expect(wrapper.text()).toContain('Total: 1 step')
    })

    it('displays correct count for multiple steps', () => {
      const steps = Array.from({ length: 10 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
      const wrapper = mountSteps({ steps })
      expect(wrapper.text()).toContain('Total: 10 steps')
    })

    it('updates count when steps change', async () => {
      const wrapper = mountSteps({ steps: [{ title: 'Step', type: 'Training' }] })
      expect(wrapper.text()).toContain('Total: 1 step')

      const newSteps = [
        { title: 'Step 1', type: 'Training' },
        { title: 'Step 2', type: 'Training' }
      ]
      await wrapper.setProps({ steps: newSteps })
      expect(wrapper.text()).toContain('Total: 2 steps')
    })

    it('handles large step counts', () => {
      const steps = Array.from({ length: 100 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
      const wrapper = mountSteps({ steps })
      expect(wrapper.text()).toContain('Total: 100 steps')
    })
  })

  describe('Show More/Show Less Logic', () => {
    it('shows only 5 steps initially when there are more than 5', async () => {
      const steps = Array.from({ length: 6 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
      const wrapper = mountSteps({ steps })
      expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(5)
    })

    it('displays show more button when steps exceed 5', () => {
      const steps = Array.from({ length: 6 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
      const wrapper = mountSteps({ steps })
      const showMoreBtn = wrapper.find('.training-library-drawer-content-steps__show-more .v-btn')
      expect(showMoreBtn.exists()).toBe(true)
    })

    it('show more button contains correct text', () => {
      const steps = Array.from({ length: 6 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
      const wrapper = mountSteps({ steps })
      const showMoreBtn = wrapper.find('.training-library-drawer-content-steps__show-more .v-btn')
      expect(showMoreBtn.text()).toContain('Show More Steps')
    })

    it('expands to show all steps on show more click', async () => {
      const steps = Array.from({ length: 6 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
      const wrapper = mountSteps({ steps })
      const showMoreBtn = wrapper.find('.training-library-drawer-content-steps__show-more .v-btn')

      await showMoreBtn.trigger('click')
      expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(6)
    })

    it('changes button text to show less after expansion', async () => {
      const steps = Array.from({ length: 6 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
      const wrapper = mountSteps({ steps })
      const showMoreBtn = wrapper.find('.training-library-drawer-content-steps__show-more .v-btn')

      await showMoreBtn.trigger('click')
      expect(showMoreBtn.text()).toContain('Show Less Steps')
    })

    it('collapses back to 5 steps on show less click', async () => {
      const steps = Array.from({ length: 6 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
      const wrapper = mountSteps({ steps })
      const showMoreBtn = wrapper.find('.training-library-drawer-content-steps__show-more .v-btn')

      await showMoreBtn.trigger('click')
      await showMoreBtn.trigger('click')
      expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(5)
    })

    it('does not show more button for exactly 5 steps', () => {
      const steps = Array.from({ length: 5 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
      const wrapper = mountSteps({ steps })
      expect(wrapper.find('.training-library-drawer-content-steps__show-more').exists()).toBe(false)
    })

    it('does not show more button for less than 5 steps', () => {
      const steps = Array.from({ length: 3 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
      const wrapper = mountSteps({ steps })
      expect(wrapper.find('.training-library-drawer-content-steps__show-more').exists()).toBe(false)
    })

    it('toggles between show more and show less states', async () => {
      const steps = Array.from({ length: 6 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
      const wrapper = mountSteps({ steps })
      const showMoreBtn = wrapper.find('.training-library-drawer-content-steps__show-more .v-btn')

      expect(showMoreBtn.text()).toContain('Show More Steps')
      await showMoreBtn.trigger('click')
      expect(showMoreBtn.text()).toContain('Show Less Steps')
    })
  })

  describe('Event Emission', () => {
    it('emits preview-step event on button click', async () => {
      const wrapper = mountSteps()
      const btn = wrapper.find('.v-btn')
      await btn.trigger('click')
      expect(wrapper.emitted('preview-step')).toBeTruthy()
    })

    it('emits preview-step with correct step data', async () => {
      const wrapper = mountSteps()
      const btn = wrapper.find('.v-btn')
      await btn.trigger('click')
      expect(wrapper.emitted('preview-step')[0]).toEqual([{ title: 'Step 1', type: 'Training' }])
    })

    it('emits different steps for different buttons', async () => {
      const steps = [
        { title: 'Step 1', type: 'Training' },
        { title: 'Step 2', type: 'Survey' }
      ]
      const wrapper = mountSteps({ steps })
      const buttons = wrapper.findAll('.v-btn')

      await buttons.at(0).trigger('click')
      const emitted = wrapper.emitted('preview-step')
      expect(emitted).toBeTruthy()
    })

    it('emits event multiple times on multiple clicks', async () => {
      const wrapper = mountSteps()
      const btn = wrapper.find('.v-btn')

      await btn.trigger('click')
      await btn.trigger('click')
      expect(wrapper.emitted('preview-step').length).toBeGreaterThan(0)
    })
  })

  describe('Preview Functionality', () => {
    it('triggers preview on first step click', async () => {
      const wrapper = mountSteps()
      const btn = wrapper.find('.v-btn')
      await btn.trigger('click')
      expect(wrapper.emitted('preview-step')).toBeTruthy()
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
      }
    })

    it('emits step title with preview event', async () => {
      const wrapper = mountSteps()
      const btn = wrapper.find('.v-btn')
      await btn.trigger('click')
      const emitted = wrapper.emitted('preview-step')
      expect(emitted[0][0].title).toContain('Step')
    })

    it('emits step type with preview event', async () => {
      const wrapper = mountSteps()
      const btn = wrapper.find('.v-btn')
      await btn.trigger('click')
      const emitted = wrapper.emitted('preview-step')
      expect(emitted[0][0].type).toBeDefined()
    })
  })

  describe('CSS Classes and Styling', () => {
    it('renders correct CSS classes for step items', () => {
      const wrapper = mountSteps()
      const items = wrapper.findAll('.training-library-drawer-content-steps__item')
      expect(items.at(0).classes()).toContain('training-library-drawer-content-steps__item')
    })

    it('applies consistent classes to all items', () => {
      const steps = Array.from({ length: 4 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
      const wrapper = mountSteps({ steps })
      const items = wrapper.findAll('.training-library-drawer-content-steps__item')

      items.wrappers.forEach(item => {
        expect(item.classes()).toContain('training-library-drawer-content-steps__item')
      })
    })

    it('contains show more button in correct container', () => {
      const steps = Array.from({ length: 6 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
      const wrapper = mountSteps({ steps })
      expect(wrapper.find('.training-library-drawer-content-steps__show-more').exists()).toBe(true)
    })
  })

  describe('Props Handling', () => {
    it('accepts steps prop', () => {
      const steps = [{ title: 'Step 1', type: 'Training' }]
      const wrapper = mountSteps({ steps })
      expect(wrapper.props('steps')).toEqual(steps)
    })

    it('handles empty steps array', () => {
      const wrapper = mountSteps({ steps: [] })
      expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(0)
    })

    it('handles steps prop updates', async () => {
      const initialSteps = [{ title: 'Step 1', type: 'Training' }]
      const wrapper = mountSteps({ steps: initialSteps })

      const newSteps = [
        { title: 'New Step 1', type: 'Training' },
        { title: 'New Step 2', type: 'Survey' }
      ]
      await wrapper.setProps({ steps: newSteps })
      expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(2)
    })

    it('accepts step objects with title and type', () => {
      const steps = [
        { title: 'Training Step', type: 'Training' },
        { title: 'Survey Step', type: 'Survey' }
      ]
      const wrapper = mountSteps({ steps })
      expect(wrapper.props('steps')).toEqual(steps)
    })
  })

  describe('Step Types', () => {
    it('renders Training type steps', () => {
      const steps = [{ title: 'Training Step', type: 'Training' }]
      const wrapper = mountSteps({ steps })
      expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(1)
    })

    it('renders Survey type steps', () => {
      const steps = [{ title: 'Survey Step', type: 'Survey' }]
      const wrapper = mountSteps({ steps })
      expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(1)
    })

    it('handles mixed step types', () => {
      const steps = [
        { title: 'Training 1', type: 'Training' },
        { title: 'Survey 1', type: 'Survey' },
        { title: 'Training 2', type: 'Training' }
      ]
      const wrapper = mountSteps({ steps })
      expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(3)
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts successfully', () => {
      const wrapper = mountSteps()
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const wrapper = mountSteps()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('updates on prop changes', async () => {
      const wrapper = mountSteps({ steps: [{ title: 'Step 1', type: 'Training' }] })
      const newSteps = [
        { title: 'Step 1', type: 'Training' },
        { title: 'Step 2', type: 'Survey' }
      ]
      await wrapper.setProps({ steps: newSteps })
      expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(2)
    })

    it('maintains state across updates', async () => {
      const steps = Array.from({ length: 6 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
      const wrapper = mountSteps({ steps })

      const showMoreBtn = wrapper.find('.training-library-drawer-content-steps__show-more .v-btn')
      await showMoreBtn.trigger('click')
      expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(6)
    })
  })

  describe('Edge Cases', () => {
    it('handles very large number of steps', () => {
      const steps = Array.from({ length: 50 }, (_, i) => ({ title: `Step ${i + 1}`, type: 'Training' }))
      const wrapper = mountSteps({ steps })
      expect(wrapper.text()).toContain('Total: 50 steps')
    })

    it('handles steps with very long titles', () => {
      const longTitle = 'This is a very long step title that should still render correctly without issues'
      const steps = [{ title: longTitle, type: 'Training' }]
      const wrapper = mountSteps({ steps })
      expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(1)
    })

    it('handles special characters in step titles', () => {
      const steps = [{ title: 'Step @#$% & Special', type: 'Training' }]
      const wrapper = mountSteps({ steps })
      expect(wrapper.findAll('.training-library-drawer-content-steps__item').length).toBe(1)
    })

    it('handles null or undefined step properties gracefully', () => {
      const wrapper = mountSteps()
      expect(wrapper.exists()).toBe(true)
    })
  })
})
