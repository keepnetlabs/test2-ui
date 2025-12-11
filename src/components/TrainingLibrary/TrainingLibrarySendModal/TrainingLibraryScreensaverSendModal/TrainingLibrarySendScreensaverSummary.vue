<template>
  <div>
    <NotificationTemplatesPreviewDialog
      v-if="isShowEnrollmentEmail"
      :status="isShowEnrollmentEmail"
      :template-data="formData.enrollmentData"
      :is-nested="true"
      @on-close="isShowEnrollmentEmail = false"
    />
    <NotificationTemplatesPreviewDialog
      v-if="isShowReminderEmailDialog"
      :status="isShowReminderEmailDialog"
      :template-data="formData.reminderData"
      :is-nested="true"
      @on-close="isShowReminderEmailDialog = false"
    />
    <NotificationTemplatesPreviewDialog
      v-if="isShowCertificateDialog"
      :status="isShowCertificateDialog"
      :template-data="formData.certificateData"
      :is-nested="true"
      @on-close="isShowCertificateDialog = false"
    />
    <div class="campaign-manager-last-step">
      <div
        class="campaign-manager-last-step__header"
        :style="{
          gridTemplateColumns: '1fr'
        }"
      >
        <CampaignManagerSummaryCardOneLine
          :class="{
            'campaign-manager-summary-card__body-container-poster': true,
            'campaign-manager-summary-card__body-container-poster-reminder': isReminder,
            'campaign-manager-summary-card__body-container-poster-phone-number': isPhoneNumber
          }"
          icon="mdi-cog"
          :title="labels.Settings"
          :items="getSettingItems"
        />
      </div>
      <div v-if="!isProxy" class="campaign-manager-last-step__target-users mt-4">
        <CampaignManagerSummaryCard
          detailable
          icon="mdi-account-multiple"
          :show-body-detail.sync="isShowTargetUserDetail"
          :title="labels.TargetUsers"
        >
          <template #body>
            <div class="campaign-manager-last-step__target-users-body pb-4">
              <span> {{ getTotalTargetGroupsAndUsersCount }}</span>
              <div v-if="isShowTargetUserDetail" class="mt-4">
                <CampaignManagerTargetGroupsAndUserSummaryInfo :items="getTargetGroupItems" />
              </div>
              <AlertBox
                v-if="canRenderAlertbox"
                class="mt-4"
                :text="getUnverifiedDomainsText"
                :slots="{ primaryAction: false, secondaryAction: false }"
              />
            </div>
          </template>
        </CampaignManagerSummaryCard>
      </div>
      <div v-if="!isProxy" class="campaign-manager-last-step__email-template mt-4">
        <CampaignManagerSummaryCard
          is-training
          detailable
          title="Enrollment email that will be sent to users"
          icon="mdi-email"
          :show-body-detail.sync="isShowEnrollmentEmail"
        />
      </div>
      <div class="campaign-manager-last-step__email-template mt-4">
        <CampaignManagerSummaryCard
          detailable
          :title="getCardTitle"
          icon="mdi-post"
          is-training
          :show-body-detail.sync="isShowTrainingEmail"
        />
      </div>
      <div v-if="isCertificateData" class="campaign-manager-last-step__email-template mt-4">
        <CampaignManagerSummaryCard
          detailable
          title="Certificate that users will be received"
          icon="mdi-book-open"
          :show-body-detail.sync="isShowCertificateDialog"
        />
      </div>
      <div v-if="isReminderEmailData" class="campaign-manager-last-step__email-template mt-4">
        <CampaignManagerSummaryCard
          detailable
          is-training
          title="Reminder email that will be sent to users"
          icon="mdi-email"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard.vue'
import CampaignManagerSummaryCardOneLine from '@/components/CampaignManager/Summary/CampaignManagerSummaryCardOneLine.vue'
import labels from '@/model/constants/labels'
import CampaignManagerTargetGroupsAndUserSummaryInfo from '@/components/CampaignManager/Summary/CampaignManagerTargetGroupsAndUserSummaryInfo.vue'
import AlertBox from '@/components/AlertBox.vue'
import NotificationTemplatesPreviewDialog from '@/components/Company Settings/NotificationTemplatesPreviewDialog.vue'
import { mapActions } from 'vuex'

export default {
  name: 'TrainingLibrarySendScreensaverSummary',
  components: {
    CampaignManagerSummaryCard,
    CampaignManagerSummaryCardOneLine,
    CampaignManagerTargetGroupsAndUserSummaryInfo,
    AlertBox,
    NotificationTemplatesPreviewDialog
  },
  props: {
    formData: {
      type: Object
    },
    selectedRow: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      isShowEnrollmentEmail: false,
      isShowTrainingEmail: false,
      isShowCertificateDialog: false,
      isShowReminderEmailDialog: false,
      isShowTargetUserDetail: false
    }
  },
  computed: {
    getCardTitle() {
      return `Screensaver: ${this.formData?.trainingData?.name}`
    },
    getTargetGroupItems() {
      const activeItems =
        this.formData?.userCountDetailResponse?.data?.data?.filter?.(
          (row) => row.status === 'Active'
        ) || []
      return activeItems
    },
    getTotalTargetGroupsAndUsersCount() {
      let text = ''
      if (Object.keys(this.formData)?.length && this.formData.selectedTargetGroups) {
        const { selectedTargetGroups } = this.formData
        text = `${this.getTotalActiveUsers} active user(s) with verified domain(s) from ${selectedTargetGroups.length} group(s)`
      }
      return text
    },
    canRenderAlertbox() {
      return this.getUsersFromUnverifiedDomainsCount > 0 && !this.isVishing
    },
    getUnverifiedDomainsText() {
      return `There are ${this.getUsersFromUnverifiedDomainsCount} active users with unverified domains in the selected groups. Please verify the domains in order to send emails.`
    },
    getUsersFromUnverifiedDomainsCount() {
      return this.formData.userCountDetailResponse?.data?.data?.reduce((acc, row) => {
        if (row.status !== 'Active') return acc
        const unverifiedUserCount =
          row?.domainAllowList?.find((r) => r.status === 'Unverified')?.count || 0
        return acc + unverifiedUserCount
      }, 0)
    },
    getTotalActiveUsers() {
      const { userCountDetailResponse } = this.formData
      return userCountDetailResponse?.data?.data?.reduce((acc, row) => {
        if (row.status !== 'Active') return acc
        const verifiedUserCount =
          row?.domainAllowList?.find((r) => r.status === 'Verified')?.count || 0
        return acc + verifiedUserCount
      }, 0)
    },
    getEnrollmentTemplate() {
      return this.formData?.enrollmentData?.template || ''
    },
    getSettingItems() {
      return this?.formData?.settings
    },
    isProxy() {
      return this?.formData?.isProxy
    },
    isEnrollmentData() {
      return this?.formData?.enrollmentData
    },
    isTrainingData() {
      return this?.formData?.trainingData
    },
    isCertificateData() {
      return this?.formData?.certificateData
    },
    isReminderEmailData() {
      return this?.formData?.reminderData
    },
    isReminder() {
      return this.getSettingItems?.Reminder
    },
    isPhoneNumber() {
      return this.getSettingItems && this.getSettingItems['SMS Notification'].senderPhoneNumber
    }
  },
  watch: {
    isShowTrainingEmail(val) {
      if (val) {
        this.setScreenSaverPreviewDialog({
          status: true,
          selectedRow: this.selectedRow,
          type: 'screensaver',
          title: labels.ScreensaverPreview,
          subtitle: '',
          showDetails: true,
          showTabs: true,
          showSendButton: false,
          showScreensaverName: true,
          showFavoriteButton: true,
          icon: 'mdi-eye',
          onlyPreview: true
        })
        this.isShowTrainingEmail = false
      }
    }
  },
  methods: {
    ...mapActions({
      setScreenSaverPreviewDialog: 'trainingLibrary/setScreenSaverPreviewDialog'
    })
  }
}
</script>
