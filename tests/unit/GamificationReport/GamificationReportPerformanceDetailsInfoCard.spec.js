import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportPerformanceDetailsInfoCard from '@/components/GamificationReport/GamificationReportPerformanceDetails/GamificationReportPerformanceDetailsInfoCard'

describe('GamificationReportPerformanceDetailsInfoCard.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    icon: 'mdi-star',
    title: 'Why Earning Full Points Matters',
    description: 'Achieving the maximum score of 500 points demonstrates mastery of critical skills, builds recognition, and opens opportunities for competitive rankings or certifications. Reaching this milestone is a benchmark of success and personal growth.'
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(GamificationReportPerformanceDetailsInfoCard, {
      localVue,
      propsData: {
        ...defaultProps,
        ...propsData
      },
      ...options
    })
  }

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('GamificationReportPerformanceDetailsInfoCard')
    })

    it('should render main container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report-performance-details-info-card').exists()).toBe(true)
    })

    it('should render icon component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'VIcon' }).exists()).toBe(true)
    })

    it('should render title section', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report-performance-details-info-card__title').exists()).toBe(true)
    })

    it('should render description section', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report-performance-details-info-card__description').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept icon prop', () => {
      const wrapper = mountComponent({ icon: 'mdi-check' })
      expect(wrapper.vm.icon).toBe('mdi-check')
    })

    it('icon prop should have default value', () => {
      expect(GamificationReportPerformanceDetailsInfoCard.props.icon.default).toBe('mdi-star')
    })

    it('icon prop should be of type String', () => {
      expect(GamificationReportPerformanceDetailsInfoCard.props.icon.type).toBe(String)
    })

    it('should accept title prop', () => {
      const wrapper = mountComponent({ title: 'Custom Title' })
      expect(wrapper.vm.title).toBe('Custom Title')
    })

    it('title prop should have default value', () => {
      expect(GamificationReportPerformanceDetailsInfoCard.props.title.default).toBe('Why Earning Full Points Matters')
    })

    it('title prop should be of type String', () => {
      expect(GamificationReportPerformanceDetailsInfoCard.props.title.type).toBe(String)
    })

    it('should accept description prop', () => {
      const wrapper = mountComponent({ description: 'Custom description' })
      expect(wrapper.vm.description).toBe('Custom description')
    })

    it('description prop should have a long default value', () => {
      const defaultDesc = GamificationReportPerformanceDetailsInfoCard.props.description.default
      expect(defaultDesc.length).toBeGreaterThan(50)
    })

    it('description prop should be of type String', () => {
      expect(GamificationReportPerformanceDetailsInfoCard.props.description.type).toBe(String)
    })
  })

  describe('Content Display', () => {
    it('should display icon correctly', () => {
      const wrapper = mountComponent({ icon: 'mdi-trophy' })
      const icon = wrapper.findComponent({ name: 'VIcon' })
      expect(icon.text()).toContain('mdi-trophy')
    })

    it('should display title correctly', () => {
      const wrapper = mountComponent({ title: 'Test Title' })
      const title = wrapper.find('.gamification-report-performance-details-info-card__title')
      expect(title.text()).toBe('Test Title')
    })

    it('should display description correctly', () => {
      const wrapper = mountComponent({ description: 'Test description' })
      const desc = wrapper.find('.gamification-report-performance-details-info-card__description')
      expect(desc.text()).toBe('Test description')
    })

    it('should display all content together', () => {
      const wrapper = mountComponent({
        icon: 'mdi-flag',
        title: 'Milestone Reached',
        description: 'You have reached a significant milestone'
      })

      expect(wrapper.findComponent({ name: 'VIcon' }).text()).toContain('mdi-flag')
      expect(wrapper.find('.gamification-report-performance-details-info-card__title').text()).toBe('Milestone Reached')
      expect(wrapper.find('.gamification-report-performance-details-info-card__description').text()).toBe('You have reached a significant milestone')
    })
  })

  describe('CSS Classes', () => {
    it('should have main container class', () => {
      const wrapper = mountComponent()
      const container = wrapper.find('.gamification-report-performance-details-info-card')
      expect(container.classes()).toContain('d-flex')
      expect(container.classes()).toContain('gap-4')
    })

    it('should have title class structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report-performance-details-info-card__title').exists()).toBe(true)
    })

    it('should have description class structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report-performance-details-info-card__description').exists()).toBe(true)
    })
  })

  describe('Icon Styling', () => {
    it('VIcon component should be rendered', () => {
      const wrapper = mountComponent()
      const icon = wrapper.findComponent({ name: 'VIcon' })
      expect(icon.exists()).toBe(true)
    })

    it('should render with different icon types', () => {
      const icons = ['mdi-star', 'mdi-check', 'mdi-trophy', 'mdi-heart', 'mdi-fire']
      icons.forEach(icon => {
        const wrapper = mountComponent({ icon })
        expect(wrapper.findComponent({ name: 'VIcon' }).text()).toContain(icon)
      })
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = mountComponent({
        icon: 'mdi-star',
        title: 'Card 1',
        description: 'Description 1'
      })
      const wrapper2 = mountComponent({
        icon: 'mdi-check',
        title: 'Card 2',
        description: 'Description 2'
      })

      expect(wrapper1.vm.icon).toBe('mdi-star')
      expect(wrapper2.vm.icon).toBe('mdi-check')
      expect(wrapper1.vm.title).toBe('Card 1')
      expect(wrapper2.vm.title).toBe('Card 2')
    })

    it('should handle multiple cards with different content', () => {
      const cards = [
        { icon: 'mdi-star', title: 'Excellence', description: 'Achieve excellence' },
        { icon: 'mdi-trophy', title: 'Victory', description: 'Win the competition' },
        { icon: 'mdi-flag', title: 'Goals', description: 'Reach your goals' }
      ]

      cards.forEach(card => {
        const wrapper = mountComponent(card)
        expect(wrapper.vm.icon).toBe(card.icon)
        expect(wrapper.vm.title).toBe(card.title)
      })
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: display achievement info card', () => {
      const wrapper = mountComponent({
        icon: 'mdi-medal',
        title: 'Achievement Unlocked',
        description: 'You have completed all challenges'
      })

      expect(wrapper.findComponent({ name: 'VIcon' }).text()).toContain('mdi-medal')
      expect(wrapper.find('.gamification-report-performance-details-info-card__title').text()).toBe('Achievement Unlocked')
      expect(wrapper.find('.gamification-report-performance-details-info-card__description').text()).toBe('You have completed all challenges')
    })

    it('complete workflow: display multiple info cards', () => {
      const infos = [
        { icon: 'mdi-star', title: 'Top Performer', description: 'You are among the best' },
        { icon: 'mdi-fire', title: 'On Fire', description: 'Amazing streak' }
      ]

      infos.forEach(info => {
        const wrapper = mountComponent(info)
        expect(wrapper.vm).toBeDefined()
        expect(wrapper.find('.gamification-report-performance-details-info-card').exists()).toBe(true)
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long title', () => {
      const longTitle = 'A'.repeat(200)
      const wrapper = mountComponent({ title: longTitle })
      expect(wrapper.vm.title).toBe(longTitle)
    })

    it('should handle very long description', () => {
      const longDesc = 'Lorem ipsum dolor sit amet '.repeat(50)
      const wrapper = mountComponent({ description: longDesc })
      expect(wrapper.vm.description).toBe(longDesc)
    })

    it('should handle special characters in title', () => {
      const wrapper = mountComponent({ title: 'Title @#$%^&*()' })
      expect(wrapper.vm.title).toBe('Title @#$%^&*()')
    })

    it('should handle special characters in description', () => {
      const wrapper = mountComponent({ description: 'Description with <html> tags' })
      expect(wrapper.vm.description).toContain('<html>')
    })

    it('should handle empty strings', () => {
      const wrapper = mountComponent({ title: '', description: '' })
      expect(wrapper.vm.title).toBe('')
      expect(wrapper.vm.description).toBe('')
    })

    it('should handle unicode characters', () => {
      const wrapper = mountComponent({ title: '🏆 Trophy 🏆', description: '🌟 Star ⭐' })
      expect(wrapper.vm.title).toContain('🏆')
      expect(wrapper.vm.description).toContain('🌟')
    })
  })

  describe('Lifecycle', () => {
    it('component should mount successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('component should unmount without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('should maintain props after mount', () => {
      const props = {
        icon: 'mdi-shield',
        title: 'Protection',
        description: 'Your data is protected'
      }
      const wrapper = mountComponent(props)
      expect(wrapper.vm.icon).toBe(props.icon)
      expect(wrapper.vm.title).toBe(props.title)
      expect(wrapper.vm.description).toBe(props.description)
    })

    it('should update when props change', async () => {
      const wrapper = mountComponent({ title: 'Original' })
      await wrapper.setProps({ title: 'Updated' })
      expect(wrapper.vm.title).toBe('Updated')
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(100)
    })

    it('should render many instances efficiently', () => {
      const start = Date.now()
      const wrappers = []
      for (let i = 0; i < 100; i++) {
        wrappers.push(mountComponent({ title: `Card ${i}` }))
      }
      const duration = Date.now() - start
      expect(duration).toBeLessThan(2500)
      wrappers.forEach((wrapper) => wrapper.destroy())
    })
  })

  describe('Default Values', () => {
    it('should use default icon when not provided', () => {
      const wrapper = mountComponent({ icon: undefined })
      expect(wrapper.vm.icon).toBe('mdi-star')
    })

    it('should use default title when not provided', () => {
      const wrapper = mountComponent({ title: undefined })
      expect(wrapper.vm.title).toBe('Why Earning Full Points Matters')
    })

    it('should use default description when not provided', () => {
      const wrapper = mountComponent({ description: undefined })
      expect(wrapper.vm.description).toContain('Achieving the maximum score')
    })

    it('should use all defaults when no props provided', () => {
      const wrapper = mountComponent({ icon: undefined, title: undefined, description: undefined })
      expect(wrapper.vm.icon).toBe('mdi-star')
      expect(wrapper.vm.title).toBe('Why Earning Full Points Matters')
      expect(wrapper.vm.description).toContain('Achieving')
    })
  })
})
