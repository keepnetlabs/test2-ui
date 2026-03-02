import { shallowMount } from '@vue/test-utils'
import PhishingSettingsFooter from '@/components/PhishingReporter/PhishingSettingsFooter.vue'

describe('PhishingSettingsFooter.vue (extra coverage)', () => {
  const createWrapper = (getters = {}) =>
    shallowMount(PhishingSettingsFooter, {
      mocks: {
        $store: {
          getters: {
            'permissions/getPhishingReporterSavePermissions': true,
            ...getters
          }
        }
      },
      stubs: { VersionHistoryModal: true, ReporterVersionModal: true }
    })

  describe('isSaveButtonDisabled', () => {
    it('returns true when getPhishingReporterSavePermissions is false', () => {
      const wrapper = createWrapper({
        'permissions/getPhishingReporterSavePermissions': false
      })
      expect(wrapper.vm.isSaveButtonDisabled).toBe(true)
    })

    it('returns true when saveButtonDisabled prop is true', () => {
      const wrapperWithDisabled = shallowMount(PhishingSettingsFooter, {
        propsData: { saveButtonDisabled: true },
        mocks: {
          $store: {
            getters: { 'permissions/getPhishingReporterSavePermissions': true }
          }
        },
        stubs: { VersionHistoryModal: true, ReporterVersionModal: true }
      })
      expect(wrapperWithDisabled.vm.isSaveButtonDisabled).toBe(true)
    })

    it('returns false when permissions and saveButtonDisabled allow', () => {
      const wrapper = createWrapper()
      wrapper.setProps({ saveButtonDisabled: false })
      expect(wrapper.vm.isSaveButtonDisabled).toBe(false)
    })
  })

  describe('getSaveButtonStyle', () => {
    it('returns disabled style when isSaveButtonDisabled is true', () => {
      const wrapper = createWrapper({
        'permissions/getPhishingReporterSavePermissions': false
      })
      const style = wrapper.vm.getSaveButtonStyle
      expect(style.opacity).toBe(0.5)
      expect(style.cursor).toBe('default')
      expect(style.pointerEvents).toBe('none')
    })

    it('returns enabled style when isSaveButtonDisabled is false', () => {
      const wrapper = createWrapper()
      const style = wrapper.vm.getSaveButtonStyle
      expect(style.opacity).toBe(1)
      expect(style.cursor).toBe('pointer')
      expect(style.pointerEvents).toBe('auto')
    })
  })

  describe('getManageAndDownloadButtonStyle', () => {
    it('returns disabled style when saveDisable is true', () => {
      const wrapper = shallowMount(PhishingSettingsFooter, {
        propsData: { saveDisable: true },
        mocks: {
          $store: {
            getters: { 'permissions/getPhishingReporterSavePermissions': true }
          }
        },
        stubs: { VersionHistoryModal: true, ReporterVersionModal: true }
      })
      const style = wrapper.vm.getManageAndDownloadButtonStyle
      expect(style.opacity).toBe(0.5)
      expect(style.pointerEvents).toBe('none')
    })

    it('returns disabled style when getPhishingReporterSavePermissions is false', () => {
      const wrapper = createWrapper({
        'permissions/getPhishingReporterSavePermissions': false
      })
      const style = wrapper.vm.getManageAndDownloadButtonStyle
      expect(style.opacity).toBe(0.5)
    })

    it('returns enabled style when both conditions allow', () => {
      const wrapper = createWrapper()
      wrapper.setProps({ saveDisable: false })
      const style = wrapper.vm.getManageAndDownloadButtonStyle
      expect(style.opacity).toBe(1)
      expect(style.pointerEvents).toBe('auto')
    })
  })
})
