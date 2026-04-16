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

    it('groups template types for grouped filter UI', () => {
      const ctx = {
        getTemplateTypeFilterGroupLabel:
          NotificationTemplates.methods.getTemplateTypeFilterGroupLabel
      }

      const config = NotificationTemplates.methods.getTemplateTypeFilterConfig.call(ctx, [
        { name: 'Training Enrollment', resourceId: 'email-1' },
        { name: 'Survey Enrollment', resourceId: 'email-2' },
        { name: 'Teams Survey Enrollment Notification', resourceId: 'teams-1' }
      ])

      expect(config).toEqual({
        groups: [
          {
            key: 'email',
            label: 'Email',
            items: [
              { text: 'Training Enrollment', value: 'email-1' },
              { text: 'Survey Enrollment', value: 'email-2' }
            ]
          },
          {
            key: 'microsoft-teams',
            label: 'Microsoft Teams',
            items: [{ text: 'Teams Survey Enrollment Notification', value: 'teams-1' }]
          }
        ]
      })
    })
  })
})
