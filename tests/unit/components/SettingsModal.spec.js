import SettingsModal from '@/components/SettingsModal.vue'
import labels from '@/model/constants/labels'

describe('SettingsModal.vue', () => {
  it('getTitle returns labels.Settings', () => {
    expect(SettingsModal.computed.getTitle.call({})).toBe(labels.Settings)
  })

  it('data returns formValues structure', () => {
    const data = SettingsModal.data()
    expect(data.formValues).toBeDefined()
    expect(data.formValues.timeZoneId).toBeNull()
    expect(data.formValues.dateFormat).toBeNull()
    expect(data.formValues.timeFormat).toBeNull()
  })
})
