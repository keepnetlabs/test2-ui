import { shallowMount } from '@vue/test-utils'
import SovereigntyMigrateModal from '@/components/Companies/SovereigntyMigrateModal.vue'
import { getRegions } from '@/api/regions'
import { migrateCompanySovereignty, getCompanyByID } from '@/api/company'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'

jest.mock('@/api/regions', () => ({
  getRegions: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          {
            resourceId: 'r-1',
            code: 'canadacentral',
            displayName: 'Canada Central (Toronto)',
            sortOrder: 10
          }
        ]
      }
    })
  )
}))

jest.mock('@/api/company', () => ({
  migrateCompanySovereignty: jest.fn(() => Promise.resolve({ data: { data: { id: 'job-1' } } })),
  getCompanyByID: jest.fn(() => Promise.resolve({ data: { data: { regionCode: '' } } }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SovereigntyMigrateModal.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(SovereigntyMigrateModal, {
      propsData: {
        isShow: false,
        companyResourceId: 'company-1',
        companyName: 'Acme',
        currentRegionCode: '',
        currentRegionLabel: '',
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true,
        FormGroup: true,
        AlertBox: true,
        VForm: true,
        VSelect: true,
        VBtn: true,
        VSkeletonLoader: true
      },
      mocks: {
        $store: { dispatch: jest.fn() }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('regionItems computed', () => {
    it('returns empty list when regions are not loaded', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.regionItems).toEqual([])
    })

    it('maps API regions to { displayName, value } pairs', async () => {
      const wrapper = createWrapper()
      wrapper.vm.sovereigntyRegionsList = [
        { code: 'eu-west', displayName: 'EU West', complianceTags: ['GDPR'] },
        { code: 'us-east', displayName: 'US East' }
      ]
      expect(wrapper.vm.regionItems).toEqual([
        { displayName: 'EU West', value: 'eu-west' },
        { displayName: 'US East', value: 'us-east' }
      ])
    })

    it('falls back to code when displayName is missing', () => {
      const wrapper = createWrapper()
      wrapper.vm.sovereigntyRegionsList = [{ code: 'westus' }]
      expect(wrapper.vm.regionItems).toEqual([{ displayName: 'westus', value: 'westus' }])
    })
  })

  describe('currentLocationLabel computed', () => {
    it('returns "Central (no region)" when no code and no preset', () => {
      const wrapper = createWrapper({ currentRegionCode: '', currentRegionLabel: '' })
      expect(wrapper.vm.currentLocationLabel).toBe('Central (no region)')
    })

    it('uses preset label when provided (trims whitespace)', () => {
      const wrapper = createWrapper({ currentRegionLabel: '  EU West  ' })
      expect(wrapper.vm.currentLocationLabel).toBe('EU West')
    })

    it('looks up region by code in cached list and returns displayName', async () => {
      const wrapper = createWrapper({ currentRegionCode: 'canadacentral' })
      wrapper.vm.sovereigntyRegionsList = [
        { code: 'canadacentral', displayName: 'Canada Central (Toronto)' }
      ]
      expect(wrapper.vm.currentLocationLabel).toBe('Canada Central (Toronto)')
    })

    it('falls back to raw code when code is set but not found in cache', () => {
      const wrapper = createWrapper({ currentRegionCode: 'unknown-region' })
      expect(wrapper.vm.currentLocationLabel).toBe('unknown-region')
    })

    it('preset takes precedence over code lookup', () => {
      const wrapper = createWrapper({
        currentRegionCode: 'canadacentral',
        currentRegionLabel: 'Preset Display'
      })
      wrapper.vm.sovereigntyRegionsList = [
        { code: 'canadacentral', displayName: 'Canada Central (Toronto)' }
      ]
      expect(wrapper.vm.currentLocationLabel).toBe('Preset Display')
    })
  })

  describe('canSubmit computed', () => {
    it('is false when companyResourceId is empty', () => {
      const wrapper = createWrapper({ companyResourceId: '' })
      wrapper.vm.targetRegionCode = 'canadacentral'
      expect(wrapper.vm.canSubmit).toBe(false)
    })

    it('is false when targetRegionCode is empty', () => {
      const wrapper = createWrapper()
      wrapper.vm.targetRegionCode = ''
      expect(wrapper.vm.canSubmit).toBe(false)
    })

    it('is false while submitting', async () => {
      const wrapper = createWrapper()
      wrapper.vm.targetRegionCode = 'canadacentral'
      wrapper.vm.submitting = true
      expect(wrapper.vm.canSubmit).toBe(false)
    })

    it('is false when company already has an assigned region', async () => {
      const wrapper = createWrapper()
      wrapper.vm.targetRegionCode = 'canadacentral'
      wrapper.vm.fetchedRegionCode = 'eu-west'
      expect(wrapper.vm.canSubmit).toBe(false)
    })

    it('is false during initialization', async () => {
      const wrapper = createWrapper()
      wrapper.vm.targetRegionCode = 'canadacentral'
      wrapper.vm.isInitializing = true
      expect(wrapper.vm.canSubmit).toBe(false)
    })

    it('is true with valid id, region selected, and not submitting', () => {
      const wrapper = createWrapper()
      wrapper.vm.targetRegionCode = 'canadacentral'
      expect(wrapper.vm.canSubmit).toBe(true)
    })
  })

  describe('effectiveRegionCode and isAlreadyAssigned', () => {
    it('effectiveRegionCode is empty when neither fetched nor prop is set', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.effectiveRegionCode).toBe('')
      expect(wrapper.vm.isAlreadyAssigned).toBe(false)
    })

    it('effectiveRegionCode prefers fetchedRegionCode over the prop', () => {
      const wrapper = createWrapper({ currentRegionCode: 'prop-code' })
      wrapper.vm.fetchedRegionCode = 'fetched-code'
      expect(wrapper.vm.effectiveRegionCode).toBe('fetched-code')
      expect(wrapper.vm.isAlreadyAssigned).toBe(true)
    })

    it('effectiveRegionCode falls back to prop when fetched is empty', () => {
      const wrapper = createWrapper({ currentRegionCode: 'prop-code' })
      expect(wrapper.vm.effectiveRegionCode).toBe('prop-code')
      expect(wrapper.vm.isAlreadyAssigned).toBe(true)
    })

    it('effectiveRegionCode trims whitespace from both sources', () => {
      const wrapper = createWrapper({ currentRegionCode: '  prop  ' })
      expect(wrapper.vm.effectiveRegionCode).toBe('prop')
    })
  })

  describe('fetchCompanyState', () => {
    it('skips when companyResourceId is empty', async () => {
      const wrapper = createWrapper({ companyResourceId: '' })
      wrapper.vm.fetchCompanyState()
      await flushPromises()
      expect(getCompanyByID).not.toHaveBeenCalled()
    })

    it('reads regionCode from response and stores it', async () => {
      getCompanyByID.mockResolvedValueOnce({
        data: { data: { regionCode: 'canadacentral' } }
      })
      const wrapper = createWrapper()
      wrapper.vm.fetchCompanyState()
      await flushPromises()
      expect(getCompanyByID).toHaveBeenCalledWith('company-1', false)
      expect(wrapper.vm.fetchedRegionCode).toBe('canadacentral')
    })

    it('also accepts PascalCase RegionCode field', async () => {
      getCompanyByID.mockResolvedValueOnce({
        data: { data: { RegionCode: 'eu-west' } }
      })
      const wrapper = createWrapper()
      wrapper.vm.fetchCompanyState()
      await flushPromises()
      expect(wrapper.vm.fetchedRegionCode).toBe('eu-west')
    })

    it('ends up with empty string when company has no region', async () => {
      const wrapper = createWrapper()
      wrapper.vm.fetchCompanyState()
      await flushPromises()
      expect(wrapper.vm.fetchedRegionCode).toBe('')
      expect(wrapper.vm.isAlreadyAssigned).toBe(false)
    })

    it('swallows fetch errors without breaking the modal', async () => {
      getCompanyByID.mockRejectedValueOnce(new Error('boom'))
      const wrapper = createWrapper()
      wrapper.vm.fetchCompanyState()
      await flushPromises()
      expect(wrapper.vm.fetchedRegionCode).toBe('')
    })
  })

  describe('isShow watcher', () => {
    it('fetches regions and resets state when modal opens', async () => {
      const wrapper = createWrapper({ isShow: false })
      await wrapper.setProps({ isShow: true })
      await flushPromises()
      expect(getRegions).toHaveBeenCalledWith({ loading: false })
      expect(wrapper.vm.sovereigntyRegionsList).toEqual([
        expect.objectContaining({ code: 'canadacentral' })
      ])
    })

    it('fetches company state on open to detect existing region assignments', async () => {
      const wrapper = createWrapper({ isShow: false, companyResourceId: 'company-42' })
      await wrapper.setProps({ isShow: true })
      await flushPromises()
      expect(getCompanyByID).toHaveBeenCalledWith('company-42', false)
    })

    it('flips isInitializing true while fetching and back to false when both calls complete', async () => {
      let resolveRegions
      let resolveCompany
      getRegions.mockImplementationOnce(
        () => new Promise((resolve) => (resolveRegions = resolve))
      )
      getCompanyByID.mockImplementationOnce(
        () => new Promise((resolve) => (resolveCompany = resolve))
      )

      const wrapper = createWrapper()
      await wrapper.setProps({ isShow: true })
      expect(wrapper.vm.isInitializing).toBe(true)

      resolveRegions({ data: { data: [] } })
      await flushPromises()
      expect(wrapper.vm.isInitializing).toBe(true)

      resolveCompany({ data: { data: { regionCode: '' } } })
      await flushPromises()
      expect(wrapper.vm.isInitializing).toBe(false)
    })

    it('clears isInitializing even when one of the fetches fails', async () => {
      getRegions.mockRejectedValueOnce(new Error('500'))
      const wrapper = createWrapper()
      await wrapper.setProps({ isShow: true })
      await flushPromises()
      expect(wrapper.vm.isInitializing).toBe(false)
    })

    it('auto-selects first region (sorted by sortOrder) on fetch success', async () => {
      getRegions.mockResolvedValueOnce({
        data: {
          data: [
            { code: 'second', displayName: 'Second', sortOrder: 20 },
            { code: 'first', displayName: 'First', sortOrder: 10 }
          ]
        }
      })
      const wrapper = createWrapper()
      await wrapper.setProps({ isShow: true })
      await flushPromises()
      expect(wrapper.vm.targetRegionCode).toBe('first')
    })

    it('does not overwrite an already-selected target region', async () => {
      const wrapper = createWrapper()
      await wrapper.setProps({ isShow: true })
      await flushPromises()
      wrapper.vm.targetRegionCode = 'eu-west'

      getRegions.mockResolvedValueOnce({
        data: { data: [{ code: 'us-east', displayName: 'US East', sortOrder: 1 }] }
      })
      await wrapper.setProps({ isShow: false })
      await wrapper.setProps({ isShow: true })
      await flushPromises()
      expect(wrapper.vm.targetRegionCode).toBe('us-east')
    })

    it('skips auto-selection when the first sorted region has no code', async () => {
      getRegions.mockResolvedValueOnce({
        data: { data: [{ displayName: 'Broken', sortOrder: 1 }] }
      })
      const wrapper = createWrapper()
      await wrapper.setProps({ isShow: true })
      await flushPromises()
      expect(wrapper.vm.targetRegionCode).toBe('')
    })

    it('treats fetch failure as empty list', async () => {
      getRegions.mockRejectedValueOnce(new Error('500'))
      const wrapper = createWrapper()
      await wrapper.setProps({ isShow: true })
      await flushPromises()
      expect(wrapper.vm.sovereigntyRegionsList).toEqual([])
    })

    it('handles non-array data shape defensively', async () => {
      getRegions.mockResolvedValueOnce({ data: { data: null } })
      const wrapper = createWrapper()
      await wrapper.setProps({ isShow: true })
      await flushPromises()
      expect(wrapper.vm.sovereigntyRegionsList).toEqual([])
    })
  })

  describe('submit', () => {
    it('does nothing when form validation fails', async () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs.refMigrateForm = { validate: jest.fn(() => false) }
      wrapper.vm.targetRegionCode = 'canadacentral'

      wrapper.vm.submit()
      await flushPromises()

      expect(migrateCompanySovereignty).not.toHaveBeenCalled()
    })

    it('does nothing when canSubmit is false even if validation passes', async () => {
      const wrapper = createWrapper({ companyResourceId: '' })
      wrapper.vm.$refs.refMigrateForm = { validate: jest.fn(() => true) }
      wrapper.vm.targetRegionCode = 'canadacentral'

      wrapper.vm.submit()
      await flushPromises()

      expect(migrateCompanySovereignty).not.toHaveBeenCalled()
    })

    it('calls API with companyResourceId, selected region and default batch size of 500', async () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs.refMigrateForm = { validate: jest.fn(() => true) }
      wrapper.vm.targetRegionCode = 'canadacentral'

      wrapper.vm.submit()
      await flushPromises()

      expect(migrateCompanySovereignty).toHaveBeenCalledWith('company-1', {
        targetRegionCode: 'canadacentral',
        batchSize: 500
      })
    })

    it('dispatches a success snackbar with the queued message on resolve', async () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs.refMigrateForm = { validate: jest.fn(() => true) }
      wrapper.vm.targetRegionCode = 'canadacentral'

      wrapper.vm.submit()
      await flushPromises()

      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
        'common/createSnackBar',
        {
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
          message: 'Migration queued. This may take a few minutes to complete.',
          icon: 'mdi-check-circle'
        },
        { root: true }
      )
    })

    it('emits success and close on API success', async () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs.refMigrateForm = { validate: jest.fn(() => true) }
      wrapper.vm.targetRegionCode = 'canadacentral'

      wrapper.vm.submit()
      await flushPromises()

      expect(wrapper.emitted('success')).toBeTruthy()
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('clears submitting flag after success', async () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs.refMigrateForm = { validate: jest.fn(() => true) }
      wrapper.vm.targetRegionCode = 'canadacentral'

      wrapper.vm.submit()
      await flushPromises()

      expect(wrapper.vm.submitting).toBe(false)
    })

    it('clears submitting flag and does not emit success on API failure', async () => {
      migrateCompanySovereignty.mockRejectedValueOnce(new Error('409 conflict'))
      const wrapper = createWrapper()
      wrapper.vm.$refs.refMigrateForm = { validate: jest.fn(() => true) }
      wrapper.vm.targetRegionCode = 'canadacentral'

      wrapper.vm.submit()
      await flushPromises()

      expect(wrapper.vm.submitting).toBe(false)
      expect(wrapper.emitted('success')).toBeFalsy()
      expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled()
    })
  })

  describe('lifecycle helpers', () => {
    it('close emits close event', () => {
      const wrapper = createWrapper()
      wrapper.vm.close()
      expect(wrapper.emitted('close')).toEqual([[]])
    })

    it('onDialogChange(false) emits close', () => {
      const wrapper = createWrapper()
      wrapper.vm.onDialogChange(false)
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('onDialogChange(true) does not emit close', () => {
      const wrapper = createWrapper()
      wrapper.vm.onDialogChange(true)
      expect(wrapper.emitted('close')).toBeFalsy()
    })

    it('resetForm clears state and resets validation', async () => {
      const wrapper = createWrapper()
      wrapper.vm.targetRegionCode = 'something'
      wrapper.vm.submitting = true
      const resetValidation = jest.fn()
      wrapper.vm.$refs.refMigrateForm = { resetValidation }

      wrapper.vm.resetForm()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.targetRegionCode).toBe('')
      expect(wrapper.vm.submitting).toBe(false)
      expect(resetValidation).toHaveBeenCalled()
    })

    it('resetForm tolerates missing form ref', async () => {
      const wrapper = createWrapper()
      wrapper.vm.$refs.refMigrateForm = undefined

      expect(() => wrapper.vm.resetForm()).not.toThrow()
      await wrapper.vm.$nextTick()
    })
  })
})
