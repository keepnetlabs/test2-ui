import { shallowMount } from '@vue/test-utils'
import NewCommunity from '@/components/ThreatSharing/NewCommunity/NewCommunity.vue'
import * as threatSharingApi from '@/api/threatSharing'
import * as functions from '@/utils/functions'

jest.mock('@/api/threatSharing', () => ({
  createCommunity: jest.fn(() => Promise.resolve({ data: { data: { resourceId: 'r1' } } })),
  updateCommunity: jest.fn(() => Promise.resolve()),
  listBusinessCategories: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          { resourceId: 'cat1', name: 'Technology' },
          { resourceId: 'cat2', name: 'Finance' }
        ]
      }
    })
  )
}))

jest.mock('@/utils/functions', () => ({
  scrollToComponent: jest.fn(),
  isDifferent: jest.fn(),
  createRandomCryptNumber: jest.fn(() => 12345)
}))

const flushPromises = () => new Promise((r) => setTimeout(r, 0))

describe('NewCommunity.vue (branch coverage)', () => {
  const dispatch = jest.fn()
  const push = jest.fn(() => Promise.resolve())
  const replace = jest.fn(() => Promise.resolve())

  const createWrapper = (propsData = {}, mocks = {}) =>
    shallowMount(NewCommunity, {
      propsData: { status: true, ...propsData },
      mocks: {
        $store: { dispatch },
        $router: { push, replace },
        $route: { name: 'ThreatSharing' },
        ...mocks
      },
      stubs: {
        AppModal: true,
        PrivacySettingsDialog: true,
        FormGroup: true,
        KSelect: true,
        InputEntityName: true,
        InputDescription: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('onCreateClicked calls scrollToComponent when validation fails', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.$refs = { form: { validate: () => false, $el: document.createElement('div') } }
    wrapper.vm.onCreateClicked()

    expect(functions.scrollToComponent).toHaveBeenCalled()
    expect(wrapper.vm.saveDisable).toBe(false)
    expect(threatSharingApi.createCommunity).not.toHaveBeenCalled()
  })

  it('watch privacyStatusId shows PrivacySettingsDialog when changing from private to public (resourceId)', async () => {
    const communityItem = {
      communityName: 'My Community',
      communityDescription: 'Desc',
      privacyStatusId: 1,
      industryResourceId: 'cat1'
    }
    const wrapper = createWrapper({ resourceId: 'r1', communityItem })
    await flushPromises()

    wrapper.vm.privacyStatusId = '2'
    wrapper.vm.$options.watch.privacyStatusId.call(wrapper.vm, '1', '2')

    expect(wrapper.vm.isShowPrivacySettingsDialog).toBe(true)
  })

  it('watch privacyStatusId does not show dialog when resourceId is absent', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.$options.watch.privacyStatusId.call(wrapper.vm, '1', '2')

    expect(wrapper.vm.isShowPrivacySettingsDialog).toBe(false)
  })

  it('updateCommunity uses replace when $route.name is Community', async () => {
    const communityItem = {
      communityName: 'Edit Community',
      communityDescription: 'Edit desc',
      privacyStatusId: 1,
      industryResourceId: 'cat1'
    }
    const wrapper = createWrapper(
      { resourceId: 'r1', communityItem },
      { $route: { name: 'Community' } }
    )
    await flushPromises()

    wrapper.vm.name = 'Updated'
    wrapper.vm.description = 'Updated desc'
    wrapper.vm.selectedCategory = { resourceId: 'cat1', name: 'Technology' }
    wrapper.vm.acceptCheckbox = true
    wrapper.vm.$refs = { form: { validate: () => true } }

    wrapper.vm.onCreateClicked()
    await flushPromises()

    expect(replace).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Community',
        params: expect.objectContaining({ id: 'r1' })
      })
    )
  })

  it('onCancelClicked callback emits closeAdd when leaving dialog confirmed', async () => {
    functions.isDifferent.mockReturnValue(true)

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.onCancelClicked()

    const callback = dispatch.mock.calls[0][1].callback
    callback.call(wrapper.vm)
    expect(wrapper.emitted('closeAdd')).toBeTruthy()
  })
})
