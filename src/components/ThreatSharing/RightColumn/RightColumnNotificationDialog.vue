<template>
  <AppDialog
    v-if="status"
    :status="status"
    title-id="text--threat-sharing-right-column-notification-popup-title"
    subtitle-id="text--threat-sharing-right-column-notification-popup-subtitle"
    icon="mdi-bell"
    title="Community Notification Settings"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <v-list-item class="pa-0">
        <div class="communities-wrapper__community-notification-row">
          <div class="community-notification__text">
            Email notifications
          </div>
          <div>
            <v-switch
              v-model="notifications.isEmailEnabled"
              id="email-notification-switch"
              color="#2196f3"
              hide-details
              class="community-notification-switch mt-0"
            />
          </div>
        </div>
      </v-list-item>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--threat-sharing-right-column-notification"
        confirm-button-id="btn-confirm--threat-sharing-right-column-notification"
        :confirm-button-disabled="isEmailNotificationsDisabled"
        @handleClose="handleClose"
        @handleConfirm="saveNotificationSetting"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { getNotifications } from '@/api/dashboard'
import { updateNotifications } from '@/api/threatSharing'
export default {
  name: 'RightColumnNotificationDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      notifications: {
        isSMSEnabled: false,
        isEmailEnabled: false,
        isDashboardEnabled: false
      },
      isEmailNotificationsDisabled: false
    }
  },
  created() {
    if (this.$route.name === 'Community') {
      this.callForData()
    }
  },
  methods: {
    callForData() {
      getNotifications({
        EntityResourceId: this.$route.params.id,
        TypeId: 1
      }).then((response) => {
        const { isSMSEnabled = false, isEmailEnabled = false, isDashboardEnabled = false } =
          response?.data?.data || {}
        this.notifications = {
          isSMSEnabled,
          isEmailEnabled,
          isDashboardEnabled
        }
      })
    },
    saveNotificationSetting() {
      this.isEmailNotificationsDisabled = true
      updateNotifications({
        EntityResourceId: this.$route.params.id,
        TypeId: 1,
        IsSMSEnabled: this.notifications.isSMSEnabled,
        IsEmailEnabled: this.notifications.isEmailEnabled,
        IsDashboardEnabled: this.notifications.isDashboardEnabled
      })
        .then(() => {
          this.handleClose()
        })
        .finally(() => {
          this.isEmailNotificationsDisabled = false
        })
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
