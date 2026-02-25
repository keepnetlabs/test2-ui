import { shallowMount } from '@vue/test-utils'
import PhishingSettingsFooter from '@/components/PhishingReporter/PhishingSettingsFooter.vue'

describe('PhishingSettingsFooter.vue', () => {
  it('submit emits submit event', () => {
    const wrapper = shallowMount(PhishingSettingsFooter, {
      mocks: { $store: { getters: { 'permissions/getPhishingReporterSavePermissions': true } } },
      stubs: { VersionHistoryModal: true, ReporterVersionModal: true }
    })
    wrapper.vm.submit({ target: {} })
    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('submitWithDownload emits submitWithDownload event', () => {
    const wrapper = shallowMount(PhishingSettingsFooter, {
      mocks: { $store: { getters: { 'permissions/getPhishingReporterSavePermissions': true } } },
      stubs: { VersionHistoryModal: true, ReporterVersionModal: true }
    })
    wrapper.vm.submitWithDownload({ target: {} })
    expect(wrapper.emitted('submitWithDownload')).toBeTruthy()
  })

  it('handleHistoryRow sets selectedVersionRow and reporterVersionModalStatus', () => {
    const wrapper = shallowMount(PhishingSettingsFooter, {
      mocks: { $store: { getters: { 'permissions/getPhishingReporterSavePermissions': true } } },
      stubs: { VersionHistoryModal: true, ReporterVersionModal: true }
    })
    const row = { version: '1.0' }
    wrapper.vm.handleHistoryRow(row)
    expect(wrapper.vm.selectedVersionRow).toBe(row)
    expect(wrapper.vm.reporterVersionModalStatus).toBe(true)
  })
})
