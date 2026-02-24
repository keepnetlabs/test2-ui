import { shallowMount } from '@vue/test-utils'
import LeaderboardTopPerformerCard from '@/components/GamificationReport/LeaderboardTopPerformerCard.vue'

describe('LeaderboardTopPerformerCard.vue (extra)', () => {
  const defaultPerformer = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    department: 'Engineering',
    performance: 95,
    rank: 1
  }

  const createWrapper = (propsData = {}) =>
    shallowMount(LeaderboardTopPerformerCard, {
      propsData: {
        performer: { ...defaultPerformer },
        isAllDepartmentsEmpty: false,
        ...propsData
      }
    })

  it('getMedalImgSrc returns gold for rank 1', () => {
    const wrapper = createWrapper({ performer: { ...defaultPerformer, rank: 1 } })
    expect(wrapper.vm.getMedalImgSrc).toBe(wrapper.vm.goldMedalImg)
  })

  it('getMedalImgSrc returns silver for rank 2', () => {
    const wrapper = createWrapper({ performer: { ...defaultPerformer, rank: 2 } })
    expect(wrapper.vm.getMedalImgSrc).toBe(wrapper.vm.silverMedalImg)
  })

  it('getMedalImgSrc returns bronze for rank 3 or other', () => {
    const wrapper = createWrapper({ performer: { ...defaultPerformer, rank: 3 } })
    expect(wrapper.vm.getMedalImgSrc).toBe(wrapper.vm.bronzeMedalImg)
  })

  it('getRibbonImgSrc returns gold for rank 1', () => {
    const wrapper = createWrapper({ performer: { ...defaultPerformer, rank: 1 } })
    expect(wrapper.vm.getRibbonImgSrc).toBe(wrapper.vm.goldRibbonImg)
  })

  it('getRibbonImgSrc returns silver for rank 2', () => {
    const wrapper = createWrapper({ performer: { ...defaultPerformer, rank: 2 } })
    expect(wrapper.vm.getRibbonImgSrc).toBe(wrapper.vm.silverRibbonImg)
  })

  it('getRibbonImgSrc returns bronze for rank 3', () => {
    const wrapper = createWrapper({ performer: { ...defaultPerformer, rank: 3 } })
    expect(wrapper.vm.getRibbonImgSrc).toBe(wrapper.vm.bronzeRibbonImg)
  })

  it('emits click when card clicked', () => {
    const wrapper = createWrapper()
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
