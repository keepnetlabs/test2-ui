import { shallowMount } from '@vue/test-utils'
import MainListItemLoading from '@/components/SkeletonLoading/MainListItemLoading'
import IRCardLoading from '@/components/SkeletonLoading/IRCardLoading'
import InvestigationDetailsTopBarLoading from '@/components/SkeletonLoading/InvestigationDetailsTopBarLoading'
import CompanyListExtend from '@/components/SkeletonLoading/CompanyListExtend'
import CommunitiesCardLoading from '@/components/SkeletonLoading/CommunitiesCardLoading'
import InvestigationDetailsLeftBarLoading from '@/components/SkeletonLoading/InvestigationDetailsLeftBarLoading'
import ThreeListItemLoading from '@/components/SkeletonLoading/ThreeListItemLoading'

const assertSkeletonCommon = (component) => {
  const wrapper = shallowMount(component, {
    propsData: {
      loading: true
    }
  })

  expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
  expect(wrapper.props('loading')).toBe(true)
  expect(wrapper.vm.attrs).toEqual({ boilerplate: false })
}

describe('Additional skeleton loading components', () => {
  it('MainListItemLoading works', () => {
    assertSkeletonCommon(MainListItemLoading)
  })

  it('IRCardLoading works', () => {
    assertSkeletonCommon(IRCardLoading)
  })

  it('InvestigationDetailsTopBarLoading works', () => {
    assertSkeletonCommon(InvestigationDetailsTopBarLoading)
  })

  it('CompanyListExtend works', () => {
    assertSkeletonCommon(CompanyListExtend)
  })

  it('CommunitiesCardLoading works', () => {
    assertSkeletonCommon(CommunitiesCardLoading)
  })

  it('InvestigationDetailsLeftBarLoading works', () => {
    assertSkeletonCommon(InvestigationDetailsLeftBarLoading)
  })

  it('ThreeListItemLoading works', () => {
    assertSkeletonCommon(ThreeListItemLoading)
  })
})

