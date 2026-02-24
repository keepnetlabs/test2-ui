import { shallowMount } from '@vue/test-utils'
import NewCommunity from '@/components/ThreatSharing/NewCommunity/NewCommunity.vue'
import * as threatSharingApi from '@/api/threatSharing'

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

describe('NewCommunity.vue', () => {
  const dispatch = jest.fn()
  const push = jest.fn(() => Promise.resolve())
  const replace = jest.fn(() => Promise.resolve())

  const createWrapper = (propsData = {}) =>
    shallowMount(NewCommunity, {
      propsData: {
        status: true,
        ...propsData
      },
      mocks: {
        $store: { dispatch },
        $router: { push, replace },
        $route: { name: 'ThreatSharing' }
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

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('getBusinessCategories fetches categories on created', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(threatSharingApi.listBusinessCategories).toHaveBeenCalled()
    expect(wrapper.vm.categories).toHaveLength(2)
  })

  it('getBusinessCategories populates form when resourceId and communityItem', async () => {
    const communityItem = {
      communityName: 'My Community',
      communityDescription: 'Desc',
      privacyStatusId: 1,
      industryResourceId: 'cat1'
    }
    const wrapper = createWrapper({ resourceId: 'r1', communityItem })
    await flushPromises()

    expect(wrapper.vm.name).toBe('My Community')
    expect(wrapper.vm.description).toBe('Desc')
    expect(wrapper.vm.privacyStatusId).toBe('1')
    expect(wrapper.vm.acceptCheckbox).toBe(true)
  })

  it('onCancelClicked emits closeAdd when form unchanged', async () => {
    const { isDifferent } = require('@/utils/functions')
    isDifferent.mockReturnValue(false)

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.onCancelClicked()

    expect(wrapper.emitted('closeAdd')).toBeTruthy()
    expect(dispatch).not.toHaveBeenCalledWith('common/setIsShowLeavingDialog')
  })

  it('onCancelClicked shows leaving dialog when form changed', async () => {
    const { isDifferent } = require('@/utils/functions')
    isDifferent.mockReturnValue(true)

    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.onCancelClicked()

    expect(dispatch).toHaveBeenCalledWith('common/setIsShowLeavingDialog', expect.objectContaining({
      show: true,
      callback: expect.any(Function)
    }))
  })

  it('onCreateClicked calls createCommunity when no resourceId', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.name = 'Test Community'
    wrapper.vm.description = 'Test description here'
    wrapper.vm.selectedCategory = { resourceId: 'cat1', name: 'Technology' }
    wrapper.vm.acceptCheckbox = true
    wrapper.vm.$refs = { form: { validate: () => true } }

    wrapper.vm.onCreateClicked()
    await flushPromises()

    expect(threatSharingApi.createCommunity).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Community',
        description: 'Test description here',
        privacyStatusId: '1',
        industryResourceId: 'cat1',
        isTermsAndConditionsAccepted: true
      })
    )
    expect(push).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Community',
        params: expect.objectContaining({ id: 'r1' })
      })
    )
    expect(wrapper.vm.saveDisable).toBe(false)
  })

  it('onCreateClicked calls updateCommunity when resourceId', async () => {
    const communityItem = {
      communityName: 'Edit Community',
      communityDescription: 'Edit desc',
      privacyStatusId: 1,
      industryResourceId: 'cat1'
    }
    const wrapper = createWrapper({ resourceId: 'r1', communityItem })
    await flushPromises()

    wrapper.vm.name = 'Updated Community'
    wrapper.vm.description = 'Updated desc'
    wrapper.vm.selectedCategory = { resourceId: 'cat1', name: 'Technology' }
    wrapper.vm.acceptCheckbox = true
    wrapper.vm.$refs = { form: { validate: () => true } }

    wrapper.vm.onCreateClicked()
    await flushPromises()

    expect(threatSharingApi.updateCommunity).toHaveBeenCalledWith(
      'r1',
      expect.objectContaining({
        name: 'Updated Community',
        description: 'Updated desc'
      })
    )
  })

  it('toggleShowPrivacyDialog restores old value when cancelled', () => {
    const wrapper = createWrapper()
    wrapper.vm.oldPrivacyValue = '2'
    wrapper.vm.privacyStatusId = '1'
    wrapper.vm.isShowPrivacySettingsDialog = true

    wrapper.vm.toggleShowPrivacyDialog(true)

    expect(wrapper.vm.privacyStatusId).toBe('2')
    expect(wrapper.vm.isShowPrivacySettingsDialog).toBe(false)
  })

  it('toggleShowPrivacyDialog toggles isShowPrivacySettingsDialog', () => {
    const wrapper = createWrapper()
    wrapper.vm.isShowPrivacySettingsDialog = false

    wrapper.vm.toggleShowPrivacyDialog(false)

    expect(wrapper.vm.isShowPrivacySettingsDialog).toBe(true)
  })
})
