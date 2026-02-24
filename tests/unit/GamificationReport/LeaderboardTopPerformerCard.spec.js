import { createLocalVue, shallowMount } from '@vue/test-utils'
import LeaderboardTopPerformerCard from '@/components/GamificationReport/LeaderboardTopPerformerCard'

jest.mock('@/assets/img/leaderboard-gold-medal.svg', () => 'gold-medal.svg')
jest.mock('@/assets/img/leaderboard-gold-ribbon.svg', () => 'gold-ribbon.svg')
jest.mock('@/assets/img/leaderboard-silver-medal.svg', () => 'silver-medal.svg')
jest.mock('@/assets/img/leaderboard-silver-ribbon.svg', () => 'silver-ribbon.svg')
jest.mock('@/assets/img/leaderboard-bronze-medal.svg', () => 'bronze-medal.svg')
jest.mock('@/assets/img/leaderboard-bronze-ribbon.svg', () => 'bronze-ribbon.svg')

describe('LeaderboardTopPerformerCard.vue', () => {
  const localVue = createLocalVue()

  const defaultPerformer = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    department: 'Sales',
    performance: 95,
    rank: 1
  }

  const mountComponent = (propsData = {}) => {
    return shallowMount(LeaderboardTopPerformerCard, {
      localVue,
      propsData: {
        performer: defaultPerformer,
        isAllDepartmentsEmpty: false,
        ...propsData
      }
    })
  }

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('LeaderboardTopPerformerCard')
    })

    it('should render main card container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report__top-performer-card').exists()).toBe(true)
    })

    it('should render ribbon figure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report__top-performer-card-ribbon').exists()).toBe(true)
    })

    it('should render medal figure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('figure').exists()).toBe(true)
    })

    it('should display performer name', () => {
      const performer = { ...defaultPerformer, firstName: 'Jane', lastName: 'Smith' }
      const wrapper = mountComponent({ performer })
      expect(wrapper.text()).toContain('Jane Smith')
    })

    it('should display performer email', () => {
      const performer = { ...defaultPerformer, email: 'jane@test.com' }
      const wrapper = mountComponent({ performer })
      expect(wrapper.text()).toContain('jane@test.com')
    })

    it('should display performer performance', () => {
      const performer = { ...defaultPerformer, performance: 87 }
      const wrapper = mountComponent({ performer })
      expect(wrapper.text()).toContain('87% PERFORMANCE')
    })
  })

  describe('Rank-Based Medal Selection', () => {
    it('should show gold medal for rank 1', () => {
      const performer = { ...defaultPerformer, rank: 1 }
      const wrapper = mountComponent({ performer })
      expect(wrapper.vm.getMedalImgSrc).toBe(wrapper.vm.goldMedalImg)
    })

    it('should show silver medal for rank 2', () => {
      const performer = { ...defaultPerformer, rank: 2 }
      const wrapper = mountComponent({ performer })
      expect(wrapper.vm.getMedalImgSrc).toBe(wrapper.vm.silverMedalImg)
    })

    it('should show bronze medal for rank 3', () => {
      const performer = { ...defaultPerformer, rank: 3 }
      const wrapper = mountComponent({ performer })
      expect(wrapper.vm.getMedalImgSrc).toBe(wrapper.vm.bronzeMedalImg)
    })

    it('should show bronze medal for any rank > 3', () => {
      const performer = { ...defaultPerformer, rank: 10 }
      const wrapper = mountComponent({ performer })
      expect(wrapper.vm.getMedalImgSrc).toBe(wrapper.vm.bronzeMedalImg)
    })

    it('should render medal image with correct src', () => {
      const performer = { ...defaultPerformer, rank: 1 }
      const wrapper = mountComponent({ performer })
      const medalImg = wrapper.findAll('img').at(1)
      expect(medalImg.attributes('src')).toBe(wrapper.vm.goldMedalImg)
    })

    it('should fallback to bronze medal when rank is undefined', () => {
      const performer = { ...defaultPerformer, rank: undefined }
      const wrapper = mountComponent({ performer })
      expect(wrapper.vm.getMedalImgSrc).toBe(wrapper.vm.bronzeMedalImg)
    })
  })

  describe('Rank-Based Ribbon Selection', () => {
    it('should show gold ribbon for rank 1', () => {
      const performer = { ...defaultPerformer, rank: 1 }
      const wrapper = mountComponent({ performer })
      expect(wrapper.vm.getRibbonImgSrc).toBe(wrapper.vm.goldRibbonImg)
    })

    it('should show silver ribbon for rank 2', () => {
      const performer = { ...defaultPerformer, rank: 2 }
      const wrapper = mountComponent({ performer })
      expect(wrapper.vm.getRibbonImgSrc).toBe(wrapper.vm.silverRibbonImg)
    })

    it('should show bronze ribbon for rank 3', () => {
      const performer = { ...defaultPerformer, rank: 3 }
      const wrapper = mountComponent({ performer })
      expect(wrapper.vm.getRibbonImgSrc).toBe(wrapper.vm.bronzeRibbonImg)
    })

    it('should show bronze ribbon for rank > 3', () => {
      const performer = { ...defaultPerformer, rank: 100 }
      const wrapper = mountComponent({ performer })
      expect(wrapper.vm.getRibbonImgSrc).toBe(wrapper.vm.bronzeRibbonImg)
    })

    it('should render ribbon image with correct src', () => {
      const performer = { ...defaultPerformer, rank: 2 }
      const wrapper = mountComponent({ performer })
      const ribbonImg = wrapper.find('.gamification-report__top-performer-card-ribbon img')
      expect(ribbonImg.attributes('src')).toBe(wrapper.vm.silverRibbonImg)
    })

    it('should fallback to bronze ribbon when rank is null', () => {
      const performer = { ...defaultPerformer, rank: null }
      const wrapper = mountComponent({ performer })
      expect(wrapper.vm.getRibbonImgSrc).toBe(wrapper.vm.bronzeRibbonImg)
    })
  })

  describe('Props', () => {
    it('should accept performer prop', () => {
      const performer = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        department: 'IT',
        performance: 100,
        rank: 1
      }
      const wrapper = mountComponent({ performer })
      expect(wrapper.vm.performer).toEqual(performer)
    })

    it('performer prop should be required', () => {
      expect(LeaderboardTopPerformerCard.props.performer.required).toBe(true)
    })

    it('should accept isAllDepartmentsEmpty prop', () => {
      const wrapper = mountComponent({ isAllDepartmentsEmpty: true })
      expect(wrapper.vm.isAllDepartmentsEmpty).toBe(true)
    })

    it('isAllDepartmentsEmpty should default to false', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isAllDepartmentsEmpty).toBe(false)
    })

    it('performer prop should be of type Object', () => {
      expect(LeaderboardTopPerformerCard.props.performer.type).toBe(Object)
    })

    it('isAllDepartmentsEmpty prop should be of type Boolean', () => {
      expect(LeaderboardTopPerformerCard.props.isAllDepartmentsEmpty.type).toBe(Boolean)
    })
  })

  describe('Department Handling', () => {
    it('should display department when isAllDepartmentsEmpty is false', () => {
      const performer = { ...defaultPerformer, department: 'Marketing' }
      const wrapper = mountComponent({ performer, isAllDepartmentsEmpty: false })
      expect(wrapper.text()).toContain('Marketing')
    })

    it('should display department when isAllDepartmentsEmpty is true', () => {
      const performer = { ...defaultPerformer, department: 'Finance' }
      const wrapper = mountComponent({ performer, isAllDepartmentsEmpty: true })
      expect(wrapper.text()).toContain('Finance')
    })

    it('should apply empty class when isAllDepartmentsEmpty is true', () => {
      const wrapper = mountComponent({ isAllDepartmentsEmpty: true })
      const deptElement = wrapper.find('.gamification-report__top-performer-card-department')
      expect(deptElement.classes()).toContain('gamification-report__top-performer-card-department--empty')
    })

    it('should not apply empty class when isAllDepartmentsEmpty is false', () => {
      const wrapper = mountComponent({ isAllDepartmentsEmpty: false })
      const deptElement = wrapper.find('.gamification-report__top-performer-card-department')
      expect(deptElement.classes()).not.toContain('gamification-report__top-performer-card-department--empty')
    })

    it('should handle empty department string', () => {
      const performer = { ...defaultPerformer, department: '' }
      const wrapper = mountComponent({ performer })
      expect(wrapper.vm.performer.department).toBe('')
    })
  })

  describe('Event Emission', () => {
    it('should emit click event when card is clicked', async () => {
      const wrapper = mountComponent()
      await wrapper.find('.gamification-report__top-performer-card').trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('should emit click event with one emission', async () => {
      const wrapper = mountComponent()
      await wrapper.find('.gamification-report__top-performer-card').trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('should handle multiple clicks', async () => {
      const wrapper = mountComponent()
      const card = wrapper.find('.gamification-report__top-performer-card')
      await card.trigger('click')
      await card.trigger('click')
      await card.trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(3)
    })

    it('should emit click on card element', () => {
      const wrapper = mountComponent()
      wrapper.vm.$emit('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('Performance Data', () => {
    it('should display performance percentage', () => {
      const performer = { ...defaultPerformer, performance: 78 }
      const wrapper = mountComponent({ performer })
      expect(wrapper.text()).toContain('78%')
    })

    it('should display PERFORMANCE text', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('PERFORMANCE')
    })

    it('should handle high performance values', () => {
      const performer = { ...defaultPerformer, performance: 100 }
      const wrapper = mountComponent({ performer })
      expect(wrapper.text()).toContain('100%')
    })

    it('should handle low performance values', () => {
      const performer = { ...defaultPerformer, performance: 0 }
      const wrapper = mountComponent({ performer })
      expect(wrapper.text()).toContain('0%')
    })

    it('should format performance correctly in template', () => {
      const performer = { ...defaultPerformer, performance: 85 }
      const wrapper = mountComponent({ performer })
      const scoreSpan = wrapper.find('.gamification-report__top-performer-card-score')
      expect(scoreSpan.text()).toBe('85% PERFORMANCE')
    })
  })

  describe('Images and Assets', () => {
    it('should load gold medal image', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.goldMedalImg).toBeDefined()
    })

    it('should load gold ribbon image', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.goldRibbonImg).toBeDefined()
    })

    it('should load silver medal image', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.silverMedalImg).toBeDefined()
    })

    it('should load silver ribbon image', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.silverRibbonImg).toBeDefined()
    })

    it('should load bronze medal image', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.bronzeMedalImg).toBeDefined()
    })

    it('should load bronze ribbon image', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.bronzeRibbonImg).toBeDefined()
    })
  })

  describe('CSS Classes', () => {
    it('should have correct class on main card', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report__top-performer-card').exists()).toBe(true)
    })

    it('should have name class for name element', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report__top-performer-card-name').exists()).toBe(true)
    })

    it('should have email class for email element', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report__top-performer-card-email').exists()).toBe(true)
    })

    it('should have department class for department element', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report__top-performer-card-department').exists()).toBe(true)
    })

    it('should have score class for performance element', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report__top-performer-card-score').exists()).toBe(true)
    })

    it('should have ribbon class for ribbon container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.gamification-report__top-performer-card-ribbon').exists()).toBe(true)
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

    it('computed properties should work after mount', () => {
      const performer = { ...defaultPerformer, rank: 1 }
      const wrapper = mountComponent({ performer })
      expect(wrapper.vm.getMedalImgSrc).toBe(wrapper.vm.goldMedalImg)
      expect(wrapper.vm.getRibbonImgSrc).toBe(wrapper.vm.goldRibbonImg)
    })

    it('should maintain data during lifecycle', () => {
      const performer = { ...defaultPerformer, firstName: 'Test' }
      const wrapper = mountComponent({ performer })
      expect(wrapper.vm.performer.firstName).toBe('Test')
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent card instances', () => {
      const performer1 = { ...defaultPerformer, rank: 1 }
      const performer2 = { ...defaultPerformer, rank: 2 }
      const wrapper1 = mountComponent({ performer: performer1 })
      const wrapper2 = mountComponent({ performer: performer2 })

      expect(wrapper1.vm.getMedalImgSrc).toBe(wrapper1.vm.goldMedalImg)
      expect(wrapper2.vm.getMedalImgSrc).toBe(wrapper2.vm.silverMedalImg)
    })

    it('multiple instances should emit independently', async () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      await wrapper1.find('.gamification-report__top-performer-card').trigger('click')
      await wrapper2.find('.gamification-report__top-performer-card').trigger('click')

      expect(wrapper1.emitted('click')).toHaveLength(1)
      expect(wrapper2.emitted('click')).toHaveLength(1)
    })
  })

  describe('Edge Cases', () => {
    it('should handle performer with special characters in name', () => {
      const performer = { ...defaultPerformer, firstName: "O'Connor", lastName: "Müller-García" }
      const wrapper = mountComponent({ performer })
      expect(wrapper.text()).toContain("O'Connor Müller-García")
    })

    it('should handle performer with very long name', () => {
      const longName = 'a'.repeat(100)
      const performer = { ...defaultPerformer, firstName: longName, lastName: 'Smith' }
      const wrapper = mountComponent({ performer })
      expect(wrapper.vm.performer.firstName).toBe(longName)
    })

    it('should handle performance as decimal', () => {
      const performer = { ...defaultPerformer, performance: 95.5 }
      const wrapper = mountComponent({ performer })
      expect(wrapper.text()).toContain('95.5%')
    })

    it('should handle very high performance', () => {
      const performer = { ...defaultPerformer, performance: 999 }
      const wrapper = mountComponent({ performer })
      expect(wrapper.text()).toContain('999%')
    })
  })

  describe('Integration Scenarios', () => {
    it('complete card display for rank 1 performer', () => {
      const performer = {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@company.com',
        department: 'Engineering',
        performance: 98,
        rank: 1
      }
      const wrapper = mountComponent({ performer, isAllDepartmentsEmpty: false })

      expect(wrapper.text()).toContain('Alice Johnson')
      expect(wrapper.text()).toContain('alice@company.com')
      expect(wrapper.text()).toContain('Engineering')
      expect(wrapper.text()).toContain('98% PERFORMANCE')
      expect(wrapper.vm.getMedalImgSrc).toBe(wrapper.vm.goldMedalImg)
      expect(wrapper.vm.getRibbonImgSrc).toBe(wrapper.vm.goldRibbonImg)
    })

    it('complete card display for rank 2 performer', () => {
      const performer = {
        firstName: 'Bob',
        lastName: 'Williams',
        email: 'bob@company.com',
        department: 'Sales',
        performance: 85,
        rank: 2
      }
      const wrapper = mountComponent({ performer })

      expect(wrapper.text()).toContain('Bob Williams')
      expect(wrapper.vm.getMedalImgSrc).toBe(wrapper.vm.silverMedalImg)
    })

    it('complete card display for rank 3+ performer', () => {
      const performer = {
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie@company.com',
        department: 'HR',
        performance: 75,
        rank: 5
      }
      const wrapper = mountComponent({ performer })

      expect(wrapper.text()).toContain('Charlie Brown')
      expect(wrapper.vm.getMedalImgSrc).toBe(wrapper.vm.bronzeMedalImg)
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
    })

    it('multiple instances should mount efficiently', () => {
      const start = Date.now()
      for (let i = 0; i < 20; i++) {
        mountComponent({ performer: { ...defaultPerformer, rank: i % 3 + 1 } })
      }
      const duration = Date.now() - start
      expect(duration).toBeLessThan(500)
    })
  })
})
