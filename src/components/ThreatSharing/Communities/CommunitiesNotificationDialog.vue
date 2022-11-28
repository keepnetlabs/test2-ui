<template>
  <AppDialog
    v-if="status"
    :status="status"
    icon="mdi-bell"
    title="Community Notification Settings"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div v-if="notificationLoading">
        <v-skeleton-loader :loading="notificationLoading" type="article, list-item"
          ><slot name="skeleton-content"></slot
        ></v-skeleton-loader>
      </div>
      <div v-else>
        <v-list-item class="pa-0">
          <div class="communities-wrapper__community-notification-row">
            <div class="community-notification__text">
              Email notifications
            </div>
            <div>
              <v-switch
                id="email-notif-switch"
                v-model="notifications.isEmailEnabled"
                color="#2196f3"
                hide-details
                class="community-notification-switch mt-0"
              />
            </div>
          </div>
        </v-list-item>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="threat-sharing-communities-notification-setting-modal-cancel-button"
        confirm-button-id="threat-sharing-communities-notification-setting-modal-confirm-button"
        :confirm-button-disabled="isNotificationSettingButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="saveNotificationSetting"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { updateNotifications } from '@/api/threatSharing'
import { getNotifications } from '@/api/dashboard'
export default {
  name: 'CommunitiesNotificationDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    communityResourceId: {
      type: String
    }
  },
  data() {
    return {
      notifications: {
        isNotifications: false,
        isSMSEnabled: false,
        isEmailEnabled: false,
        isDashboardEnabled: false
      },
      notificationLoading: false,
      isNotificationSettingButtonDisabled: false
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.notificationLoading = true
      getNotifications({
        EntityResourceId: this.communityResourceId,
        TypeId: 1
      })
        .then((response) => {
          const { isSMSEnabled = false, isEmailEnabled = false, isDashboardEnabled = false } =
            response?.data?.data || {}
          this.notifications = {
            isSMSEnabled,
            isEmailEnabled,
            isDashboardEnabled
          }
        })
        .finally(() => {
          this.notificationLoading = false
        })
    },
    handleClose() {
      this.$emit('on-close')
    },
    saveNotificationSetting() {
      let payload = {
        EntityResourceId: this.communityResourceId,
        TypeId: 1,
        IsSMSEnabled: this.notifications.isSMSEnabled,
        IsEmailEnabled: this.notifications.isEmailEnabled,
        IsDashboardEnabled: this.notifications.isDashboardEnabled
      }
      this.isNotificationSettingButtonDisabled = true
      updateNotifications(payload)
        .then(() => {
          this.handleClose()
        })
        .finally(() => (this.isNotificationSettingButtonDisabled = false))
    }
  }
}
</script>
