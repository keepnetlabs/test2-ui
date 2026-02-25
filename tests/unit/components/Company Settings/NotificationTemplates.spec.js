import NotificationTemplates from '@/components/Company Settings/NotificationTemplates.vue'

describe('NotificationTemplates.vue', () => {
  describe('methods', () => {
    it('closeNotificationTemplateWithUpdate calls callForData and toggleNewNotificationTemplate', () => {
      const callForData = jest.fn()
      const toggleNewNotificationTemplate = jest.fn()
      const ctx = {
        callForData,
        toggleNewNotificationTemplate
      }
      NotificationTemplates.methods.closeNotificationTemplateWithUpdate.call(ctx)
      expect(callForData).toHaveBeenCalled()
      expect(toggleNewNotificationTemplate).toHaveBeenCalled()
    })
  })
})
